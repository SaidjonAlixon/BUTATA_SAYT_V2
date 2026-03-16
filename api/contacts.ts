/**
 * Vercel Serverless: POST /api/contacts
 * Contact form → Telegram notification
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
      allowed: ["POST"],
    });
  }

  try {
    const body = (req.body || {}) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length < 1) {
      return res.status(400).json({ message: "Name is required.", field: "name" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required.", field: "email" });
    }
    if (!message || message.length < 1) {
      return res.status(400).json({ message: "Message is required.", field: "message" });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const esc = (s: string) =>
        String(s || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      const text =
        `📩 <b>New Contact Message</b>\n\n` +
        `<b>Name:</b> ${esc(name)}\n` +
        `<b>Email:</b> ${esc(email)}\n` +
        `<b>Message:</b>\n${esc(message)}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!tgRes.ok) {
          const errBody = await tgRes.text();
          console.error("[api/contacts] Telegram error:", tgRes.status, errBody);
        } else {
          console.log("[api/contacts] Telegram sent OK");
        }
      } catch (tgErr) {
        console.error("[api/contacts] Telegram failed:", tgErr);
      }
    } else {
      console.warn("[api/contacts] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    }

    return res.status(201).json({
      id: Date.now(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/contacts] Error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      details: msg,
    });
  }
}
