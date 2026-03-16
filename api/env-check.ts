import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        status: 'online',
        env: {
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "✅ Set" : "❌ Missing",
            TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? "✅ Set" : "❌ Missing",
            DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
            NODE_ENV: process.env.NODE_ENV || "unknown",
            VERCEL_REGION: process.env.VERCEL_REGION || "unknown"
        }
    });
}
