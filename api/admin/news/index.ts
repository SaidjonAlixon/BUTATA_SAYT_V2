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

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    imageUrl: row.image_url ?? null,
    published: row.published ?? false,
    createdAt: row.created_at,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    if (req.method !== "GET" && req.method !== "POST") {
      return send(res, 405, { message: "Method Not Allowed", allowed: ["GET", "POST"] });
    }

    const cookie = req.headers?.cookie || "";
    if (!verifyAuth(cookie)) return send(res, 401, { message: "Unauthorized" });

    const conn = process.env.DATABASE_URL;
    if (!conn) {
      if (req.method === "GET") return send(res, 200, []);
      return send(res, 500, { message: "Internal Server Error" });
    }

    const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } });

    try {
      if (req.method === "GET") {
        const r = await pool.query("SELECT * FROM news ORDER BY created_at DESC");
        const items = (r.rows || []).map((row: Record<string, unknown>) => mapRow(row));
        return send(res, 200, items);
      }

      if (req.method === "POST") {
        const body = typeof req.body === "object" && req.body !== null ? req.body : {};
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const excerpt = typeof body.excerpt === "string"
          ? body.excerpt.trim()
          : (typeof body.summary === "string" ? body.summary.trim() : "");
        const content = typeof body.content === "string" ? body.content.trim() : "";
        const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : null;
        const published = body.published === true || body.published === "true";

        if (!title) return send(res, 400, { message: "title is required" });
        if (!excerpt) return send(res, 400, { message: "excerpt or summary is required" });
        if (!content) return send(res, 400, { message: "content is required" });

        const r = await pool.query(
          `INSERT INTO news (title, excerpt, content, image_url, published) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id, title, excerpt, content, image_url, published, created_at`,
          [title, excerpt, content, imageUrl, published]
        );
        const row = r.rows?.[0] as Record<string, unknown> | undefined;
        if (!row) return send(res, 500, { message: "Internal Server Error" });

        const item = mapRow(row);
        return send(res, 201, { success: true, item });
      }
    } finally {
      await pool.end().catch(() => {});
    }

    return send(res, 405, { message: "Method Not Allowed" });
  } catch (err) {
    console.error("[api/admin/news] error:", err);
    return send(res, 500, { message: "Internal Server Error" });
  }
}
