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
    if (req.method !== "PUT" && req.method !== "DELETE") {
      return send(res, 405, { message: "Method Not Allowed", allowed: ["PUT", "DELETE"] });
    }

    const cookie = req.headers?.cookie || "";
    if (!verifyAuth(cookie)) return send(res, 401, { message: "Unauthorized" });

    const id = typeof req.query?.id === "string" ? req.query.id : "";
    const idNum = parseInt(id, 10);
    if (!id || !Number.isInteger(idNum) || idNum < 1) {
      return send(res, 400, { message: "Invalid id" });
    }

    const conn = process.env.DATABASE_URL;
    if (!conn) return send(res, 500, { message: "Internal Server Error" });

    const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } });

    try {
      if (req.method === "DELETE") {
        const r = await pool.query("DELETE FROM news WHERE id = $1 RETURNING id", [idNum]);
        if ((r.rowCount ?? 0) === 0) {
          return send(res, 404, { message: "Not found" });
        }
        return send(res, 200, { success: true, id: idNum });
      }

      if (req.method === "PUT") {
        const body = typeof req.body === "object" && req.body !== null ? req.body : {};
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const excerpt = typeof body.excerpt === "string"
          ? body.excerpt.trim()
          : (typeof body.summary === "string" ? body.summary.trim() : "");
        const content = typeof body.content === "string" ? body.content.trim() : "";
        const imageUrl = body.imageUrl !== undefined
          ? (typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : null)
          : undefined;
        const published = body.published !== undefined
          ? (body.published === true || body.published === "true")
          : undefined;

        if (!title) return send(res, 400, { message: "title is required" });
        if (!excerpt) return send(res, 400, { message: "excerpt or summary is required" });
        if (!content) return send(res, 400, { message: "content is required" });

        const updates: string[] = [];
        const values: unknown[] = [];
        let i = 1;
        updates.push(`title = $${i++}`);
        values.push(title);
        updates.push(`excerpt = $${i++}`);
        values.push(excerpt);
        updates.push(`content = $${i++}`);
        values.push(content);
        if (imageUrl !== undefined) {
          updates.push(`image_url = $${i++}`);
          values.push(imageUrl);
        }
        if (published !== undefined) {
          updates.push(`published = $${i++}`);
          values.push(published);
        }
        updates.push("updated_at = NOW()");
        values.push(idNum);
        const idPlaceholder = i;

        const r = await pool.query(
          `UPDATE news SET ${updates.join(", ")} WHERE id = $${idPlaceholder} RETURNING id`,
          values
        );
        if ((r.rowCount ?? 0) === 0) {
          return send(res, 404, { message: "Not found" });
        }
        return send(res, 200, { success: true, id: idNum, updated: true });
      }
    } finally {
      await pool.end().catch(() => {});
    }

    return send(res, 405, { message: "Method Not Allowed" });
  } catch (err) {
    console.error("[api/admin/news-by-id] error:", err);
    return send(res, 500, { message: "Internal Server Error" });
  }
}
