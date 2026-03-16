/**
 * Vercel API entry – forwards ALL /api/* to Express.
 * Build outputs: api/index.js
 */
import type { IncomingMessage, ServerResponse } from "http";

export const config = {
  api: { bodyParser: false },
};

const sendJson = (res: ServerResponse, status: number, body: object) => {
  if ((res as any).headersSent) return;
  (res as any).setHeader?.("Content-Type", "application/json");
  (res as any).writeHead?.(status);
  (res as any).end?.(JSON.stringify(body));
};

let app: any = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const reqUrl = req.url || "";
    const qs = reqUrl.includes("?") ? reqUrl.split("?")[1] : "";
    const pathParam = new URLSearchParams(qs).get("__path");
    if (pathParam) {
      (req as any).url = pathParam + (qs ? "?" + qs.replace(/__path=[^&]+&?/g, "").replace(/&$/, "") : "");
    }

    if (!app) {
      try {
        const mod = await import("../server/app");
        await mod.initializeApp();
        app = mod.app;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Vercel init error:", msg);
        sendJson(res, 500, { message: "Server initialization failed", error: msg });
        return;
      }
    }

    await new Promise<void>((resolve, reject) => {
      res.once("finish", () => resolve());
      res.once("error", reject);
      app(req, res);
    });
  } catch (err) {
    console.error("API handler error:", err);
    if (!(res as any).headersSent) {
      sendJson(res, 500, {
        message: "Internal Server Error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
