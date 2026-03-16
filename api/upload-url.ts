/**
 * POST /api/upload-url
 * Vercel Blob client upload – generates signed token for direct-to-blob upload.
 * No file binary passes through this endpoint. Supports 20MB+ files.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const config = {
  api: { bodyParser: false },
};

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = await readBody(req);
    const jsonResponse = await handleUpload({
      body,
      request: req as any,
      onBeforeGenerateToken: async (pathname) => {
        return {
          access: "public",
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB per file
        };
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/upload-url] error:", message);
    return res.status(400).json({ error: message });
  }
}
