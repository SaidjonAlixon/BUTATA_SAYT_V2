/**
 * Standalone POST /api/admin/login – always returns JSON.
 * Build: api/admin/login.js
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { storage } from "../server/storage";

const JWT_SECRET = process.env.SESSION_SECRET || "change-me";
const send = (res: VercelResponse, status: number, body: object) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

export const config = { api: { bodyParser: true } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { message: "Method Not Allowed", allowed: ["POST"] });

  try {
    const b = req.body && typeof req.body === "object" ? req.body : {};
    const username = typeof b.username === "string" ? b.username.trim() : "";
    const password = typeof b.password === "string" ? b.password : "";
    if (!username || !password) return send(res, 400, { message: "Username and password required" });

    const admin = await storage.getAdminByUsername(username);
    if (!admin) {
      await bcrypt.compare(password, "$2a$10$fake");
      return send(res, 401, { message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return send(res, 401, { message: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    res.setHeader("Set-Cookie", serialize("admin_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 86400 }));
    return send(res, 200, { success: true, message: "Login successful", admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    console.error("Login error:", err);
    return send(res, 500, { message: "Internal Server Error", error: err instanceof Error ? err.message : "Unknown" });
  }
}
