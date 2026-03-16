
import { db } from "./db";
import {
  admins,
  jobs,
  applications,
  contacts,
  news,
  siteContent,
  type Admin,
  type InsertAdmin,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
  type Contact,
  type InsertContact,
  type News,
  type InsertNews,
  type SiteContent,
  type InsertSiteContent,
} from "../shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Admins
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Jobs
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<void>;

  // News
  getNews(publishedOnly?: boolean): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(newsItem: InsertNews): Promise<News>;
  updateNews(id: number, newsItem: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<void>;

  // Site Content
  getSiteContent(key: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
  upsertSiteContent(content: InsertSiteContent): Promise<SiteContent>;

  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(app: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<void>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Admins
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  // Jobs
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(id: number, updateData: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // News
  async getNews(publishedOnly = false): Promise<News[]> {
    if (publishedOnly) {
      return await db.select().from(news).where(eq(news.published, true)).orderBy(desc(news.createdAt));
    }
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }

  async getNewsById(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  async updateNews(id: number, updateData: Partial<InsertNews>): Promise<News | undefined> {
    const [newsItem] = await db
      .update(news)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return newsItem;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Site Content
  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return await db.select().from(siteContent);
  }

  async upsertSiteContent(insertContent: InsertSiteContent): Promise<SiteContent> {
    const existing = await this.getSiteContent(insertContent.key);
    if (existing) {
      const [content] = await db
        .update(siteContent)
        .set({ value: insertContent.value, type: insertContent.type, updatedAt: new Date() })
        .where(eq(siteContent.key, insertContent.key))
        .returning();
      return content;
    } else {
      const [content] = await db.insert(siteContent).values(insertContent).returning();
      return content;
    }
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [app] = await db.select().from(applications).where(eq(applications.id, id));
    return app;
  }

  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const [app] = await db.insert(applications).values(insertApp).returning();
    return app;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [app] = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return app;
  }

  async deleteApplication(id: number): Promise<void> {
    await db.delete(applications).where(eq(applications.id, id));
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }
}

export const storage = new DatabaseStorage();
