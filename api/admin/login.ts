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

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return send(res, 400, { message: "Username and password are required" });
    }

    const adminUsername = process.env.ADMIN_USERNAME || "";
    const adminPassword = process.env.ADMIN_PASSWORD || "";

    if (!adminUsername || !adminPassword) {
      return send(res, 500, { message: "Server configuration error" });
    }

    if (username !== adminUsername || password !== adminPassword) {
      return send(res, 401, { message: "Invalid credentials" });
    }

    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    const cookie = serialize("admin_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    res.setHeader("Set-Cookie", cookie);

    return send(res, 200, { success: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    return send(res, 500, { message: "Internal Server Error" });
  }
}
