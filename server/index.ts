// Only load dotenv when not on Vercel (Vercel injects env vars in production)
import { createRequire } from "module";
if (!process.env.VERCEL) {
  createRequire(import.meta.url)("dotenv/config");
}

import { app, httpServer, initializeApp } from "./app";
import { serveStatic } from "./static";
import { Request, Response, NextFunction } from "express";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

(async () => {
  log(`NODE_ENV=${process.env.NODE_ENV || "undefined"}`, "express");

  // Initialize routes
  await initializeApp();

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("[express] Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // Setup static files or Vite dev server
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Only run listen() in development; on Vercel the api/index handler receives requests
  if (!process.env.VERCEL) {
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen({ port, host: "0.0.0.0" }, () => {
      log(`serving on port ${port}`);
    });
  } else {
    log("Vercel serverless mode - app ready (no listen)", "express");
  }
})();
