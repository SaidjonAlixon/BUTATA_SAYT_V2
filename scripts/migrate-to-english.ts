import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function migrate() {
  console.log("🔄 Starting migration to English-only schema...");

  try {
    // Step 1: Create new tables
    console.log("📦 Creating new tables (admins, news, site_content)...");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        image_url TEXT,
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        type TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ New tables created");

    // Step 2: Migrate jobs table
    console.log("🔄 Migrating jobs table to English-only...");

    // Add new columns
    await db.execute(sql`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS title TEXT,
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);

    // Copy English data to new columns
    await db.execute(sql`
      UPDATE jobs 
      SET title = title_en, 
          description = description_en
      WHERE title IS NULL;
    `);

    // Make new columns NOT NULL
    await db.execute(sql`
      ALTER TABLE jobs 
      ALTER COLUMN title SET NOT NULL,
      ALTER COLUMN description SET NOT NULL;
    `);

    // Drop old bilingual columns
    await db.execute(sql`
      ALTER TABLE jobs 
      DROP COLUMN IF EXISTS title_uz,
      DROP COLUMN IF EXISTS title_en,
      DROP COLUMN IF EXISTS description_uz,
      DROP COLUMN IF EXISTS description_en;
    `);

    console.log("✅ Jobs table migrated");

    // Step 3: Create admin user
    console.log("👤 Creating admin user...");

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await db.execute(sql`
      INSERT INTO admins (username, password_hash)
      VALUES (${adminUsername}, ${passwordHash})
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log(`✅ Admin user created: ${adminUsername}`);

    // Step 4: Seed initial site content
    console.log("📝 Seeding initial site content...");

    const siteContentData = [
      { key: "hero_title", value: "Moving Your Business Forward, Mile by Mile", type: "text" },
      { key: "hero_subtitle", value: "Reliable logistics solutions tailored for the modern world. Join the fastest growing fleet in the region.", type: "text" },
      { key: "stats_miles", value: "1,000,000+", type: "text" },
      { key: "stats_drivers", value: "100+", type: "text" },
      { key: "stats_years", value: "5", type: "text" }
    ];

    for (const content of siteContentData) {
      await db.execute(sql`
        INSERT INTO site_content (key, value, type)
        VALUES (${content.key}, ${content.value}, ${content.type})
        ON CONFLICT (key) DO NOTHING;
      `);
    }

    console.log("✅ Site content seeded");

    // Step 5: Create sample news articles
    console.log("📰 Creating sample news articles...");

    await db.execute(sql`
      INSERT INTO news (title, excerpt, content, published)
      VALUES 
        ('Butata LLC Expands Fleet with 50 New Trucks', 'We are excited to announce a major expansion of our fleet with 50 state-of-the-art trucks.', '<p>Butata LLC is proud to announce the addition of 50 new trucks to our growing fleet. These modern vehicles are equipped with the latest safety features and fuel-efficient technology.</p>', true),
        ('Driver Safety Program Achieves Record Results', 'Our comprehensive safety training program has led to a 40% reduction in incidents.', '<p>Safety is our top priority at Butata LLC. We are thrilled to report that our enhanced driver safety program has achieved outstanding results.</p>', true),
        ('New Regional Routes Now Available', 'Expanding our service area with new routes across the Midwest and Southeast regions.', '<p>Butata LLC is expanding its service coverage with new regional routes. Drivers can now choose from a wider variety of routes.</p>', true)
      ON CONFLICT DO NOTHING;
    `);

    console.log("✅ Sample news created");
    console.log("\n🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

migrate()
  .then(() => {
    console.log("\n✨ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
