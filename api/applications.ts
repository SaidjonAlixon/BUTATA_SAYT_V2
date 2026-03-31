/**
 * Vercel Serverless: POST /api/applications
 * Supports FormData (multipart) and JSON.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

type DocFile = { buffer: Buffer; name: string; type: string; section: string };
type DocUrl = { url: string; section: string; name: string };

type ParsedBody = {
  fullName: string;
  email: string;
  phone: string;
  positionType: string;
  experienceYears: string | number;
  address?: string;
  cdlType?: string;
  hasCleanRecord: boolean;
  docFiles: DocFile[];
  docUrls: DocUrl[];
};

async function parseBody(req: VercelRequest): Promise<ParsedBody> {
  const contentType = (req.headers["content-type"] || "") as string;

  if (contentType.includes("multipart/form-data")) {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB (legacy multipart fallback)
      maxFiles: 20,
    });

    const [fields, files] = await form.parse(req as any);

    const getStr = (v: unknown): string => {
      if (!v) return "";
      const arr = Array.isArray(v) ? v : [v];
      return (arr[0] ?? "").toString().trim();
    };

    const fullName =
      getStr(fields.fullName) ||
      [getStr(fields.firstName), getStr(fields.lastName)].filter(Boolean).join(" ").trim();

    const fs = await import("fs");
    const pushFile = (list: unknown, section: string, out: DocFile[]) => {
      if (!list) return;
      const arr = Array.isArray(list) ? list : [list];
      for (const item of arr) {
        const f = item as { filepath?: string; originalFilename?: string; mimetype?: string };
        if (f?.filepath && f?.originalFilename) {
          const buffer = fs.readFileSync(f.filepath);
          out.push({
            buffer,
            name: f.originalFilename,
            type: f.mimetype || "application/octet-stream",
            section,
          });
        }
      }
    };

    const docFiles: DocFile[] = [];
    const f = files as Record<string, unknown>;
    pushFile(f.driverLicenseFront, "Driver License (Front)", docFiles);
    pushFile(f.driverLicenseBack, "Driver License (Back)", docFiles);
    pushFile(f.medicalCard, "Medical Card", docFiles);
    pushFile(f.resumes, "Resume", docFiles);
    pushFile(f.annualTruckInspection, "Annual truck inspection", docFiles);
    pushFile(f.truckPicEngine, "Truck picture (engine)", docFiles);
    pushFile(f.truckPicUnderEngine, "Truck picture (under engine)", docFiles);
    pushFile(f.truckPicTires, "Truck picture (tires)", docFiles);
    pushFile(f.registrationCard, "Registration Card (CAP Card)", docFiles);

    return {
      fullName,
      email: getStr(fields.email),
      phone: getStr(fields.phone),
      positionType: getStr(fields.positionType) || "N/A",
      experienceYears: getStr(fields.experienceYears) || "N/A",
      address: getStr(fields.address) || undefined,
      cdlType: getStr(fields.cdlType) || undefined,
      hasCleanRecord: getStr(fields.hasCleanRecord) !== "false",
      docFiles,
      docUrls: [],
    };
  }

  // JSON fallback: read raw body
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  const body = raw?.trim() ? JSON.parse(raw) : {};
  const fullName =
    (typeof body.fullName === "string" ? body.fullName : "") ||
    [body.firstName, body.lastName].filter(Boolean).map(String).join(" ").trim();
  const docFiles: DocFile[] = [];
  const docUrls: DocUrl[] = [];

  if (Array.isArray(body.docUrls) && body.docUrls.length > 0) {
    for (const item of body.docUrls) {
      if (item && typeof item === "object" && typeof item.url === "string") {
        const url = String(item.url);
        if (!url.startsWith("https://")) throw new Error("Invalid blob URL: must start with https://");
        docUrls.push({
          url,
          section: String(item.section || "Document"),
          name: String(item.name || "file"),
        });
      }
    }
  } else {
    const rawResumes = body.resumes ?? (body.resume ? [body.resume] : []);
    for (const item of Array.isArray(rawResumes) ? rawResumes : []) {
      if (item && typeof item === "object" && item.data) {
        const base64 = String(item.data).includes(",")
          ? String(item.data).split(",")[1]
          : String(item.data);
        docFiles.push({
          buffer: Buffer.from(base64, "base64"),
          name: item.name || "resume.pdf",
          type: item.type || "application/pdf",
          section: "Resume",
        });
      }
    }
  }

  return {
    fullName,
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    positionType: (body.positionType as string) || "N/A",
    experienceYears: body.experienceYears ?? "N/A",
    address: typeof body.address === "string" ? body.address : undefined,
    cdlType: typeof body.cdlType === "string" ? body.cdlType : undefined,
    hasCleanRecord: body.hasCleanRecord !== false,
    docFiles,
    docUrls,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
      allowed: ["POST"],
    });
  }

  try {
    const body = await parseBody(req);

    if (!body.fullName || body.fullName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters.",
        field: "fullName",
      });
    }
    if (!body.email || !body.email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address.", field: "email" });
    }
    if (!body.phone || body.phone.length < 7) {
      return res.status(400).json({ message: "Valid phone number is required.", field: "phone" });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const docCount = body.docFiles.length + body.docUrls.length;
      let docSection = docCount > 0 ? `📎 ${docCount} file(s)\n` : "None\n";
      if (body.docUrls.length > 0) {
        for (const d of body.docUrls) {
          console.log("Sending blob URL:", d.url);
          docSection += `📎 ${esc(d.section)}: ${esc(d.url)}\n`;
        }
      }
      const message =
        `🚀 <b>New Driver Application</b>\n\n` +
        `<b>Position:</b> ${esc(body.positionType)}\n` +
        `<b>Name:</b> ${esc(body.fullName)}\n` +
        `<b>Phone:</b> ${esc(body.phone)}\n` +
        `<b>Email:</b> ${esc(body.email)}\n` +
        (body.address ? `<b>Address:</b> ${esc(body.address)}\n` : "") +
        `<b>Experience:</b> ${body.experienceYears} years\n` +
        (body.cdlType ? `<b>CDL Type:</b> ${esc(body.cdlType)}\n` : "") +
        `<b>Clean Record:</b> ${body.hasCleanRecord ? "Yes" : "No"}\n` +
        `<b>Documents:</b> ${docSection}`;

      try {
        const controller = new AbortController();
        const timeoutMs = Math.max(30000, (body.docFiles.length + body.docUrls.length) * 5000);
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          }),
          signal: controller.signal,
        });

        for (const file of body.docFiles) {
          if (file.buffer.length > 50 * 1024 * 1024) continue;
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("caption", `📄 ${file.section}: ${file.name}`);
          const blob = new Blob([new Uint8Array(file.buffer)], { type: file.type });
          formData.append("document", blob, file.name);
          await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
        }

        clearTimeout(timeoutId);
      } catch (tgError) {
        console.error("[api/applications] Telegram failed:", tgError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/applications] Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      details: message,
    });
  }
}
