import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const send = (res: VercelResponse, status: number, body: object) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    imageUrl: row.image_url ?? null,
    image_url: row.image_url ?? null,
    published: row.published ?? false,
    createdAt: row.created_at,
    created_at: row.created_at,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "OPTIONS") return send(res, 200, { ok: true });
    if (req.method !== "GET") return send(res, 405, { message: "Method Not Allowed", allowed: ["GET"] });

    const conn = process.env.DATABASE_URL;
    if (!conn) return send(res, 200, []);

    const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } });
    try {
      const limitRaw = typeof req.query?.limit === "string" ? parseInt(req.query.limit, 10) : undefined;
      const limitNum =
        typeof limitRaw === "number" && Number.isInteger(limitRaw) && limitRaw > 0
          ? Math.min(limitRaw, 100)
          : null;
      const r = await pool.query(
        "SELECT id, title, content, excerpt, image_url, published, created_at FROM news WHERE published = true ORDER BY created_at DESC" +
          (limitNum !== null ? ` LIMIT ${limitNum}` : "")
      );
      const items = (r.rows || []).map((row: Record<string, unknown>) => mapRow(row));
      return send(res, 200, items);
    } finally {
      await pool.end().catch(() => {});
    }
  } catch (err) {
    console.error("[api/news] error:", err);
    return send(res, 500, { message: "Internal Server Error" });
  }
}
