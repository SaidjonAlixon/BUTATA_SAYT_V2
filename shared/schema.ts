
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Admin Users
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job Postings (English-only)
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g., "Full-time", "Contract"
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// News/Blog Articles
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site Content (editable homepage/about content)
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull(), // 'text', 'html', 'json'
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Driver Applications (from Apply Now form)
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  positionType: text("position_type").notNull().default("Company Driver"),
  experienceYears: integer("experience_years").notNull(),
  cdlNumber: text("cdl_number"), // legacy, not used in form
  cdlType: text("cdl_type"), // CDL A, CDL B, etc.
  hasCleanRecord: boolean("has_clean_record").default(true),
  ssn: text("ssn"),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending"), // pending, reviewed, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact Messages
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSiteContentSchema = createInsertSchema(siteContent).omit({ id: true, updatedAt: true });

export const insertApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
  positionType: z.string().default("Company Driver"),
  experienceYears: z.number().int().min(0),
  cdlType: z.string().optional(),
  hasCleanRecord: z.boolean(),
  ssn: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });

// === TYPES ===

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
