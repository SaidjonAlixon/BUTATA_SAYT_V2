import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SESSION_SECRET || "super-secret-admin-key-change-this";

// Extend Express Request type to include session
declare module "express-session" {
    interface SessionData {
        adminId?: number;
        username?: string;
    }
}

// Authentication middleware – accepts session, admin_token JWT, or admin_session (env-based login)
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.session?.adminId) {
            return next();
        }
        const cookies = (req as any).cookies || {};
        // admin_auth: from api/admin/login.ts (ADMIN_USERNAME/ADMIN_PASSWORD)
        const sessionToken = cookies.admin_auth;
        if (sessionToken) {
            try {
                const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
                const [username] = decoded.split(":");
                if (username === process.env.ADMIN_USERNAME) {
                    (req as any).session = { adminId: 1, username };
                    return next();
                }
            } catch (_) {
                /* invalid */
            }
        }
        // admin_token: JWT from database login
        const token = cookies.admin_token;
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
                const admin = await storage.getAdminByUsername(decoded.username);
                if (admin && admin.id === decoded.id) {
                    (req as any).session = { adminId: admin.id, username: admin.username };
                    return next();
                }
            } catch (_) {
                /* invalid token */
            }
        }
        return res.status(401).json({ message: "Unauthorized - Please login" });
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Login handler
export async function adminLogin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const admin = await storage.getAdminByUsername(username);

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Set session
        req.session.adminId = admin.id;
        req.session.username = admin.username;

        return res.json({
            success: true,
            message: "Login successful",
            admin: { id: admin.id, username: admin.username }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Logout handler
export async function adminLogout(req: Request, res: Response) {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Logout error:", err);
                return res.status(500).json({ message: "Logout failed" });
            }
            res.clearCookie("connect.sid");
            return res.json({ success: true, message: "Logged out successfully" });
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Dashboard stats
export async function getDashboardStats(req: Request, res: Response) {
    try {
        const [applications, jobs, contacts, newsItems] = await Promise.all([
            storage.getApplications(),
            storage.getJobs(),
            storage.getContacts(),
            storage.getNews()
        ]);

        return res.json({
            stats: {
                applications: applications.length,
                jobs: jobs.length,
                messages: contacts.length,
                news: newsItems.length
            }
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return res.status(500).json({ message: "Failed to load dashboard stats" });
    }
}
