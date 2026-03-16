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

async function getStats(): Promise<{ applications: number; jobs: number; messages: number; news: number }> {
  const conn = process.env.DATABASE_URL;
  if (!conn) return { applications: 0, jobs: 0, messages: 0, news: 0 };
  const pool = new Pool({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
  });
  try {
    const [a, j, c, n] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS c FROM applications").then((r) => r.rows[0]?.c ?? 0),
      pool.query("SELECT COUNT(*)::int AS c FROM jobs").then((r) => r.rows[0]?.c ?? 0),
      pool.query("SELECT COUNT(*)::int AS c FROM contacts").then((r) => r.rows[0]?.c ?? 0),
      pool.query("SELECT COUNT(*)::int AS c FROM news").then((r) => r.rows[0]?.c ?? 0),
    ]);
    return { applications: a, jobs: j, messages: c, news: n };
  } finally {
    await pool.end().catch(() => {});
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    if (req.method !== "GET") return send(res, 405, { message: "Method Not Allowed", allowed: ["GET"] });

    const cookieHeader = typeof req.headers?.cookie === "string" ? req.headers.cookie : "";
    const cookies = parseCookie(cookieHeader);
    const token = cookies.admin_auth;

    if (!token) return send(res, 401, { message: "Unauthorized" });

    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const [username] = decoded.split(":");
      const adminUser = process.env.ADMIN_USERNAME || "";
      if (username !== adminUser) return send(res, 401, { message: "Unauthorized" });
    } catch {
      return send(res, 401, { message: "Unauthorized" });
    }

    const stats = await getStats();
    return send(res, 200, { stats });
  } catch (err) {
    console.error("[api/admin/stats] error:", err);
    return send(res, 500, { message: "Internal Server Error" });
  }
}
