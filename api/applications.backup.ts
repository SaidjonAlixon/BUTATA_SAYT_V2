/**
 * Backup: standalone Vercel handler for POST /api/applications.
 * Not used as a route; /api/applications is handled by Express via rewrite to api/index.
 * Kept for reference or if you want to switch back to serverless.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '15mb',
        },
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        const { fullName, phone, email, positionType, experienceYears, cdlNumber, hasCleanRecord, resume } = body;

        if (!fullName || fullName.length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters.", field: "fullName" });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: "Invalid email address.", field: "email" });
        }
        if (!phone || phone.length < 7) {
            return res.status(400).json({ message: "Valid phone number is required.", field: "phone" });
        }

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (token && chatId) {
            const message = `🚀 *New Driver Application (Serverless)*\n\n` +
                `*Position:* ${positionType || "N/A"}\n` +
                `*Name:* ${fullName}\n` +
                `*Phone:* ${phone}\n` +
                `*Email:* ${email}\n` +
                `*Experience:* ${experienceYears} years\n` +
                `*CDL:* ${cdlNumber || "N/A"}\n` +
                `*Clean Record:* ${hasCleanRecord ? "Yes" : "No"}\n` +
                `*Resume:* ${resume ? "📎 Attached" : "None"}\n`;

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                if (resume && resume.data && resume.name) {
                    const formData = new FormData();
                    formData.append('chat_id', chatId);
                    formData.append('caption', message);
                    formData.append('parse_mode', 'Markdown');
                    let base64Data = resume.data;
                    if (base64Data.includes(',')) base64Data = base64Data.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const fileBlob = new Blob([buffer], { type: resume.type || 'application/octet-stream' });
                    formData.append('document', fileBlob, resume.name);
                    await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
                        method: 'POST',
                        body: formData,
                        signal: controller.signal
                    });
                } else {
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
                        signal: controller.signal
                    });
                }
                clearTimeout(timeoutId);
            } catch (tgError) {
                console.error("[api/applications] Telegram failed:", tgError);
            }
        }

        return res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error: any) {
        console.error("[api/applications] Critical Error:", error);
        return res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
}
