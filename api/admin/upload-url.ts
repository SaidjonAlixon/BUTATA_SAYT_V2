/**
 * POST /api/admin/upload-url
 * Direct-to-blob upload for admin (news images). Requires auth.
 * No file binary through server. Uses handleUpload.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const config = {
  api: { bodyParser: false },
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

function readBody(req: VercelRequest): Promise<HandleUploadBody> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    (req as any).on("data", (chunk: Buffer) => chunks.push(chunk));
    (req as any).on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        const body = raw?.trim() ? JSON.parse(raw) : {};
        resolve(body as HandleUploadBody);
      } catch (e) {
        reject(e);
      }
    });
    (req as any).on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers?.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const cookie = req.headers?.cookie || "";
  if (!verifyAuth(cookie)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const body = await readBody(req);
    const jsonResponse = await handleUpload({
      body,
      request: req as any,
      onBeforeGenerateToken: async () => ({
        access: "public",
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        addRandomSuffix: true,
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB per file
      }),
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/admin/upload-url] error:", message);
    return res.status(400).json({ error: message });
  }
}
