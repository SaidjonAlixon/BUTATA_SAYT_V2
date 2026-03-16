import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");
    try {
        const envStatus = {
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "✅ Set" : "❌ Missing",
            TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? "✅ Set" : "❌ Missing",
            DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
            NODE_ENV: process.env.NODE_ENV || "unknown",
            VERCEL_REGION: process.env.VERCEL_REGION || "unknown",
        };

        res.statusCode = 200;
        res.end(JSON.stringify({
            status: "debug_online",
            message: "This is a standalone Vercel function. If you see this, Vercel is working.",
            env: envStatus
        }, null, 2));
    } catch (error: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "error",
            message: "Debug function crashed",
            error: error.message
        }));
    }
}
