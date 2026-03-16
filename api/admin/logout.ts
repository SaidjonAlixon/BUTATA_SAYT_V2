import type { VercelRequest, VercelResponse } from "@vercel/node";
import { serialize } from "cookie";

export const config = { api: { bodyParser: true } };

const send = (res: VercelResponse, status: number, body: object) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { message: "Method Not Allowed", allowed: ["POST"] });

  const cookie = serialize("admin_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: -1,
  });
  res.setHeader("Set-Cookie", cookie);

  return send(res, 200, { success: true, message: "Logged out successfully" });
}
