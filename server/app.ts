// Only load dotenv when not on Vercel (Vercel injects env vars)
import { createRequire } from "module";
if (!process.env.VERCEL) {
  createRequire(import.meta.url)("dotenv/config");
}

import express from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import { parse } from "cookie";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const app = express();
const httpServer = createServer(app);

const PgSession = connectPgSimple(session);

app.use(session({
    store: new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "butata-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

// CORS & OPTIONS – respond to preflight so POST with JSON works
app.use("/api", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(200).end();
    next();
});

// Helper to parse cookies
app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    (req as any).cookies = cookieHeader ? parse(cookieHeader) : {};
    next();
});

// Extend Request type
declare module "http" {
    interface IncomingMessage {
        rawBody: unknown;
    }
}

// Body parser – parse JSON (all uploads are direct-to-blob, no file binary through Express)
app.use((req, res, next) => {
    express.json({
        limit: '25mb', // 25MB limit for JSON body (to handle base64 encoded files)
        verify: (req, _res, buf) => {
            (req as any).rawBody = buf;
        },
    })(req, res, (err: unknown) => {
        if (err) {
            console.error("Body parse error:", err);
            return res.status(400).json({ message: "Invalid JSON body" });
        }
        next();
    });
});

app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            console.log(logLine);
        }
    });

    next();
});

// Global Error Handler - LAST middleware
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Global Error Handler caught:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message, details: String(err) });
});

// Initialize routes
// We wrap this in a function or promise because registerRoutes might be async
export const initializeApp = async () => {
    await registerRoutes(httpServer, app);
    return app;
};

export { app, httpServer };
