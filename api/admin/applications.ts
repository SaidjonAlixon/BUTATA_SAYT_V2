import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const send = (res: VercelResponse, status: number, body: object) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

function parseCookie(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  const cookie = typeof header === "string" ? header : "";
  if (!cookie) return out;
  cookie.split(";").forEach((p) => {
    const [k, v] = p.trim().split("=");
    if (k && v) out[k] = v;
  });
  return out;
}

function verifyAuth(cookieHeader: string | undefined): boolean {
  const cookies = parseCookie(cookieHeader);
  const token = cookies.admin_auth;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username] = decoded.split(":");
    return username === (process.env.ADMIN_USERNAME || "");
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    if (req.method !== "GET") return send(res, 405, { message: "Method Not Allowed", allowed: ["GET"] });

    const cookie = req.headers?.cookie || "";
    if (!verifyAuth(cookie)) return send(res, 401, { message: "Unauthorized" });

    const conn = process.env.DATABASE_URL;
    if (!conn) return send(res, 200, []);

    const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } });
    try {
      const r = await pool.query("SELECT * FROM applications ORDER BY created_at DESC");
      const items = (r.rows || []).map((row: Record<string, unknown>) => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        positionType: row.position_type,
        experienceYears: row.experience_years ?? 0,
        cdlNumber: row.cdl_number ?? null,
        hasCleanRecord: row.has_clean_record ?? true,
        resumeUrl: row.resume_url ?? null,
        status: row.status ?? "pending",
        createdAt: row.created_at,
      }));
      return send(res, 200, items);
    } finally {
      await pool.end().catch(() => {});
    }
  } catch (err) {
    console.error("[api/admin/applications] error:", err);
    return send(res, 500, { message: "Internal Server Error" });
  }
}
