import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    api: {
        bodyParser: true, // Let Vercel handle body parsing
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS support
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const body = req.body || {};
        const { fullName, phone, comment } = body;

        // Basic Validation
        if (!fullName || fullName.length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters.", field: "fullName" });
        }
        if (!phone || phone.length < 5) {
            return res.status(400).json({ message: "Phone number is required.", field: "phone" });
        }

        // Telegram Notification Use raw fetch for speed and zero deps
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (token && chatId) {
            const message = `💬 *New Quote Request*\n\n` +
                `*Name:* ${fullName}\n` +
                `*Phone:* ${phone}\n` +
                `*Comment:* ${comment || "N/A"}\n`;

            try {
                // Timeout protection
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'Markdown'
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
            } catch (tgError) {
                console.error("Telegram send failed:", tgError);
                // Do not fail the request if Telegram fails, just log it
            }
        } else {
            console.warn("Telegram credentials missing in environment variables");
        }

        return res.status(200).json({ success: true, message: "Quote requested successfully" });
    } catch (error: any) {
        console.error("Critical error in quote handler:", error);
        return res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
}
