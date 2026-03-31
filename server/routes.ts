
import express, { type Express, type Request, type Response } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Debug Environment Variables (Safe check)
  app.get("/api/env-check", (req, res) => {
    res.json({
      status: "online",
      env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "✅ Set" : "❌ Missing",
        TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? "✅ Set" : "❌ Missing",
        DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
        NODE_ENV: process.env.NODE_ENV || "unknown"
      }
    });
  });

  // Health Check - Standard endpoint for monitoring
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: "rest-express"
    });
  });

  // Direct-to-blob: /api/upload-url (generates client token, no file binary)
  app.post("/api/upload-url", async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request: req as any,
        onBeforeGenerateToken: async () => ({
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
        }),
      });
      res.status(200).json(jsonResponse);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[upload-url] error:", msg);
      res.status(400).json({ error: msg });
    }
  });

  // Jobs (DB xatolarida ham JSON qaytarish – Vercel uchun)
  app.get(api.jobs.list.path, async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (err) {
      console.error("getJobs error:", err);
      res.status(500).json({ message: "Internal Server Error", jobs: [] });
    }
  });

  app.get(api.jobs.get.path, async (req, res) => {
    try {
      const job = await storage.getJob(Number(req.params.id));
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json(job);
    } catch (err) {
      console.error("getJob error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Applications – JSON only (docUrls from direct-to-blob uploads)
  app.post(api.applications.create.path, async (req, res) => {
    try {
      // Get body – JSON only (docUrls from direct-to-blob)
      let body: any = req.body;
      if (!body || typeof body !== 'object') body = {};

      // Debug: log what we received
      console.log("Content-Type:", req.headers['content-type']);
      console.log("Received body:", body);
      console.log("Body keys:", Object.keys(body));
      console.log("Body type:", typeof body);
      console.log("Has file:", !!req.file);

      // If body is still empty, try to parse from rawBody (fallback)
      if (!body || typeof body === 'string' || Object.keys(body).length === 0) {
        try {
          if ((req as any).rawBody) {
            const rawBodyStr = (req as any).rawBody.toString();
            if (rawBodyStr && rawBodyStr.trim() !== '') {
              body = JSON.parse(rawBodyStr);
              console.log("Parsed from rawBody:", body);
            }
          }
        } catch (e) {
          console.error("Failed to parse body:", e);
        }
      }

      // Fayllar: legacy base64 fallback only (multer removed; all uploads direct-to-blob)
      const FIELD_SECTIONS: Record<string, string> = {
        driverLicenseFront: "Driver License (Front)",
        driverLicenseBack: "Driver License (Back)",
        medicalCard: "Medical Card",
        resumes: "Resume",
        annualTruckInspection: "Annual truck inspection",
        truckPicEngine: "Truck picture (engine)",
        truckPicUnderEngine: "Truck picture (under engine)",
        truckPicTires: "Truck picture (tires)",
        registrationCard: "Registration Card (CAP Card)",
      };
      const docFiles: { buffer: Buffer; originalname: string; mimetype: string; section: string }[] = [];
      const allFiles = (req as any).files as { buffer?: Buffer; fieldname?: string; originalname?: string; mimetype?: string }[] | undefined;
      if (Array.isArray(allFiles)) {
        for (const f of allFiles) {
          if (f?.buffer) {
            const section = FIELD_SECTIONS[f.fieldname] || "Document";
            docFiles.push({
              buffer: f.buffer,
              originalname: f.originalname || 'file',
              mimetype: f.mimetype || 'application/octet-stream',
              section,
            });
          }
        }
      }
      const docUrls: { url: string; section: string; name: string }[] = [];
      if (Array.isArray(body.docUrls) && body.docUrls.length > 0) {
        for (const item of body.docUrls) {
          if (item && typeof item === 'object' && typeof item.url === 'string') {
            const url = String(item.url);
            if (!url.startsWith('https://')) throw new Error('Invalid blob URL: must start with https://');
            docUrls.push({
              url,
              section: String(item.section || 'Document'),
              name: String(item.name || 'file'),
            });
          }
        }
      }
      const rawResumes = body.resumes ?? (body.resume ? [body.resume] : []);
      if (docFiles.length === 0 && docUrls.length === 0 && Array.isArray(rawResumes) && rawResumes.length > 0) {
        for (const item of rawResumes) {
          if (!item || typeof item !== 'object' || !item.data) continue;
          try {
            const base64Data = item.data.includes(',') ? item.data.split(',')[1] : item.data;
            const buffer = Buffer.from(base64Data, 'base64');
            docFiles.push({
              buffer,
              originalname: item.name || 'resume.pdf',
              mimetype: item.type || 'application/pdf',
              section: "Resume",
            });
          } catch (e) {
            console.error("Failed to decode base64 resume:", e);
          }
        }
        delete body.resume;
        delete body.resumes;
      }
      if (req.file) {
        docFiles.push({
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          section: "Resume",
        });
      }

      // fullName: from fullName or firstName + lastName
      const fullName = body.fullName && typeof body.fullName === 'string'
        ? body.fullName.trim()
        : [body.firstName, body.lastName].filter(Boolean).map(String).join(' ').trim();

      const rawData: any = {
        fullName: String(fullName || body.fullName || '').trim() || 'N/A',
        email: String(body.email || '').trim(),
        phone: String(body.phone || '').trim(),
        positionType: String(body.positionType || 'Company Driver').trim(),
        experienceYears: typeof body.experienceYears === 'number' ? body.experienceYears : (Number(body.experienceYears) || 0),
        hasCleanRecord: body.hasCleanRecord === true || body.hasCleanRecord === 'true',
      };

      if (body.address && typeof body.address === 'string' && body.address.trim() !== '') {
        rawData.address = body.address.trim();
      }
      if (body.cdlType && typeof body.cdlType === 'string' && body.cdlType.trim() !== '') {
        rawData.cdlType = body.cdlType.trim();
      }
      if (body.resumeUrl && typeof body.resumeUrl === 'string' && body.resumeUrl.trim() !== '') {
        rawData.resumeUrl = body.resumeUrl.trim();
      }

      console.log("Parsed rawData for validation:", rawData);

      const input = api.applications.create.input.parse(rawData);

      const resumeUrlText = docFiles.length > 0
        ? docFiles.map(f => `${f.section}: ${f.originalname}`).join(", ")
        : docUrls.length > 0
          ? docUrls.map(d => `${d.section}: ${d.url}`).join(", ")
          : (input.resumeUrl || undefined);
      const applicationData = {
        ...input,
        resumeUrl: resumeUrlText
      };

      // Database Entry (Optional)
      let application;
      if (process.env.DATABASE_URL) {
        try {
          // Race DB insert against a 3s timeout to ensure Telegram is not blocked
          application = await Promise.race([
            storage.createApplication(applicationData),
            new Promise<any>((_, reject) =>
              setTimeout(() => reject(new Error("DB Insert Timeout")), 3000)
            )
          ]);
        } catch (dbError) {
          console.error("Database save failed (proceeding to Telegram):", dbError);
          // Mock application object so Telegram logic can proceed
          application = { ...applicationData, id: 0, createdAt: new Date() };
        }
      } else {
        // If DATABASE_URL is not set, directly mock the application
        application = { ...applicationData, id: 0, createdAt: new Date() };
      }

      // Telegram Notification
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (token && chatId) {
        const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const docCount = docFiles.length + docUrls.length;
        let docSection = docCount > 0 ? `📎 ${docCount} file(s)\n` : (input.resumeUrl || "None") + "\n";
        if (docUrls.length > 0) {
          for (const d of docUrls) {
            console.log("Sending blob URL:", d.url);
            docSection += `📎 ${esc(d.section)}: ${esc(d.url)}\n`;
          }
        }
        const message =
          `🚀 <b>New Driver Application</b>\n\n` +
          `<b>Position:</b> ${esc(input.positionType || "N/A")}\n` +
          `<b>Name:</b> ${esc(input.fullName)}\n` +
          `<b>Phone:</b> ${esc(input.phone)}\n` +
          `<b>Email:</b> ${esc(input.email)}\n` +
          (input.address ? `<b>Address:</b> ${esc(input.address)}\n` : "") +
          `<b>Experience:</b> ${input.experienceYears} years\n` +
          (input.cdlType ? `<b>CDL Type:</b> ${esc(input.cdlType)}\n` : "") +
          `<b>Clean Record:</b> ${input.hasCleanRecord ? "Yes" : "No"}\n` +
          `<b>Documents:</b> ${docSection}`;

        try {
          const controller = new AbortController();
          const timeoutMs = Math.max(30000, docCount * 5000);
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          const textRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML'
            }),
            signal: controller.signal
          });
          if (!textRes.ok) {
            const errText = await textRes.text();
            console.error("Telegram Message Error:", errText);
          }

          for (const fileToSend of docFiles) {
            if (fileToSend.buffer.length > 50 * 1024 * 1024) {
              console.error(`File too large for Telegram: ${fileToSend.originalname}`);
              continue;
            }
            const formData = new FormData();
            formData.append('chat_id', chatId!);
            formData.append('caption', `📄 ${fileToSend.section}: ${fileToSend.originalname}`);
            const fileBlob = new Blob([new Uint8Array(fileToSend.buffer)], { type: fileToSend.mimetype });
            formData.append('document', fileBlob, fileToSend.originalname || 'file');
            const docRes = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
              method: 'POST',
              body: formData,
              signal: controller.signal
            });
            if (!docRes.ok) {
              const errText = await docRes.text();
              console.error("Telegram Document Error:", errText);
            } else {
              console.log(`✅ Telegram: ${fileToSend.originalname}`);
            }
          }

          clearTimeout(timeoutId);
        } catch (error) {
          console.error("Failed to send Telegram notification (non-blocking):", error);
        }
      }

      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Validation error:", err.errors);
        const firstError = err.errors[0];
        return res.status(400).json({
          message: firstError.message || "Validation error",
          field: firstError.path.join('.'),
          errors: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      console.error("Error processing application:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      const errStack = err instanceof Error ? err.stack : undefined;
      if (process.env.NODE_ENV === "development" && errStack) console.error(errStack);
      res.status(500).json({
        message: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? errMsg : undefined
      });
    }
  });

  // Contacts
  app.post(api.contacts.create.path, async (req, res) => {
    try {
      const input = api.contacts.create.input.parse(req.body);
      const contact = await storage.createContact(input);

      // Telegram Notification (use HTML to avoid Markdown escaping issues)
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (token && chatId) {
        const esc = (s: string) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const message =
          `📩 <b>New Contact Message</b>\n\n` +
          `<b>Name:</b> ${esc(input.name)}\n` +
          `<b>Email:</b> ${esc(input.email)}\n` +
          `<b>Message:</b>\n${esc(input.message)}`;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "HTML",
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (!tgRes.ok) {
            const errBody = await tgRes.text();
            console.error("[contacts] Telegram error:", tgRes.status, errBody);
          } else {
            console.log("[contacts] Telegram sent OK");
          }
        } catch (tgErr) {
          console.error("[contacts] Telegram failed:", tgErr);
        }
      } else {
        console.warn("[contacts] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
      }

      res.status(201).json(contact);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Contact create error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Quote Requests (Robust implementation for Vercel/Serverless)
  app.post('/api/quotes', async (req, res) => {
    try {
      console.log(`[POST /api/quotes] Received request`);

      const schema = z.object({
        fullName: z.string().min(2),
        phone: z.string().min(5),
        comment: z.string().optional(),
      });

      // Safe body parsing for Vercel
      const body = req.body && typeof req.body === 'object' ? req.body : {};

      console.log(`[POST /api/quotes] Parsed body keys:`, Object.keys(body));

      const input = schema.parse(body);

      // Telegram Notification
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (token && chatId) {
        const message = `💬 *New Quote Request*\n\n` +
          `*Name:* ${input.fullName}\n` +
          `*Phone:* ${input.phone}\n` +
          `*Comment:* ${input.comment || "N/A"}\n`;

        try {
          console.log(`[POST /api/quotes] Sending Telegram message...`);

          // Helper for timeout-wrapped fetch
          const sendTelegram = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

            try {
              const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: message,
                  parse_mode: 'Markdown'
                }),
                signal: controller.signal
              });

              if (!response.ok) {
                const text = await response.text();
                console.error(`[POST /api/quotes] Telegram Error: ${response.status} - ${text}`);
              } else {
                console.log(`[POST /api/quotes] Telegram Sent Successfully`);
              }
            } finally {
              clearTimeout(timeoutId);
            }
          };

          // Don't await if we want to return fast, but Vercel function might freeze. 
          // Better to await with a timeout race to ensure execution.
          await Promise.race([
            sendTelegram(),
            new Promise<void>((_, reject) => setTimeout(() => reject(new Error("Telegram Timeout")), 9000))
          ]);

        } catch (error) {
          console.error("Failed to send Telegram quote notification (non-blocking):", error);
        }
      } else {
        console.warn("[POST /api/quotes] Telegram credentials missing");
      }

      res.status(200).json({ success: true, message: "Quote requested successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.warn(`[POST /api/quotes] Validation Error:`, err.errors);
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("[POST /api/quotes] Critical Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal Server Error", details: err instanceof Error ? err.message : String(err) });
      }
    }
  });

  // ==================== ADMIN ROUTES ====================

  const { requireAdmin, adminLogin, adminLogout, getDashboardStats } = await import("./admin-auth");

  // Admin Authentication
  app.post("/api/admin/login", adminLogin);
  app.post("/api/admin/logout", adminLogout);
  app.get("/api/admin/dashboard", requireAdmin, getDashboardStats);

  // Admin - Direct-to-blob upload-url (no file binary; uses handleUpload)
  app.post("/api/admin/upload-url", requireAdmin, async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request: req as any,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          addRandomSuffix: true,
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB per file
        }),
      });
      res.status(200).json(jsonResponse);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[admin/upload-url] error:", msg);
      res.status(400).json({ error: msg });
    }
  });

  // Admin - Jobs Management
  app.get("/api/admin/jobs", requireAdmin, async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Admin get jobs error:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post("/api/admin/jobs", requireAdmin, async (req, res) => {
    try {
      const job = await storage.createJob(req.body);
      res.status(201).json(job);
    } catch (error) {
      console.error("Admin create job error:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put("/api/admin/jobs/:id", requireAdmin, async (req, res) => {
    try {
      const job = await storage.updateJob(Number(req.params.id), req.body);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Admin update job error:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.delete("/api/admin/jobs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteJob(Number(req.params.id));
      res.json({ success: true, message: "Job deleted" });
    } catch (error) {
      console.error("Admin delete job error:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // Admin - News Management
  app.get("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const newsItems = await storage.getNews();
      res.json(newsItems);
    } catch (error) {
      console.error("Admin get news error:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const newsItem = await storage.createNews(req.body);
      res.status(201).json(newsItem);
    } catch (error) {
      console.error("Admin create news error:", error);
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  app.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const newsItem = await storage.updateNews(Number(req.params.id), req.body);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json(newsItem);
    } catch (error) {
      console.error("Admin update news error:", error);
      res.status(500).json({ message: "Failed to update news" });
    }
  });

  app.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(Number(req.params.id));
      res.json({ success: true, message: "News deleted" });
    } catch (error) {
      console.error("Admin delete news error:", error);
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  // Admin - Applications Management
  app.get("/api/admin/applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      console.error("Admin get applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.put("/api/admin/applications/:id", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const application = await storage.updateApplicationStatus(Number(req.params.id), status);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Admin update application error:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  app.delete("/api/admin/applications/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteApplication(Number(req.params.id));
      res.json({ success: true, message: "Application deleted" });
    } catch (error) {
      console.error("Admin delete application error:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // Admin - Contacts Management
  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Admin get contacts error:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteContact(Number(req.params.id));
      res.json({ success: true, message: "Contact deleted" });
    } catch (error) {
      console.error("Admin delete contact error:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Admin - Site Content Management
  app.get("/api/admin/content", requireAdmin, async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Admin get content error:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.put("/api/admin/content/:key", requireAdmin, async (req, res) => {
    try {
      const { value, type } = req.body;
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      const content = await storage.upsertSiteContent({
        key,
        value,
        type: type || "text"
      });
      res.json(content);
    } catch (error) {
      console.error("Admin update content error:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Public - News endpoint (for frontend)
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      let newsItems = await storage.getNews(true); // published only
      if (limit) {
        newsItems = newsItems.slice(0, limit);
      }
      res.json(newsItems);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Public - Site Content endpoint (for frontend)
  app.get("/api/content/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContent(req.params.key);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Get content error:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Seed Data - disabled to prevent Vercel cold-start timeouts
  // if (process.env.DATABASE_URL) {
  //   seedDatabase().catch(err => console.error("Seed failed:", err));
  // }

  // API 404 – barcha /api/* uchun JSON qaytarish, response yopilishi uchun
  app.use("/api", (_req, res) => {
    if (!res.headersSent) res.status(404).json({ message: "Not Found" });
  });

  // Global error handler – route'lardan keyin, har doim JSON 500 (Vercel HTML o‘rniga)
  app.use((err: unknown, _req: Request, res: Response, _next: () => void) => {
    console.error("Route error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return httpServer;
}

async function seedDatabase() {
  const existingJobs = await storage.getJobs();
  if (existingJobs.length === 0) {
    await storage.createJob({
      title: "Long Haul Truck Driver (CDL Class A)",
      description: "We are looking for experienced drivers to haul freight across the USA. Competitive pay and bonuses.",
      type: "Full-time",
      location: "Nationwide",
    });

    await storage.createJob({
      title: "Regional Driver",
      description: "Operate within a specific region with frequent home time.",
      type: "Full-time",
      location: "Midwest",
    });
  }
}
