import type { VercelRequest, VercelResponse } from "@vercel/node";

const send = (res: VercelResponse, status: number, body: object) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "GET") return send(res, 405, { message: "Method Not Allowed", allowed: ["GET"] });

  const cookie = req.headers.cookie || "";
  const match = cookie.match(/admin_auth=([^;]+)/);
  const token = match ? match[1] : null;

  if (!token) {
    return send(res, 401, { authenticated: false, message: "Not authenticated" });
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username] = decoded.split(":");
    const adminUsername = process.env.ADMIN_USERNAME || "";

    if (username === adminUsername) {
      return send(res, 200, {
        authenticated: true,
        admin: { username: adminUsername },
      });
    }
  } catch (_) {
    /* invalid token */
  }

  return send(res, 401, { authenticated: false, message: "Invalid session" });
}
