import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function updateAdminPassword() {
    console.log("🔄 Updating admin password...");

    try {
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Delete existing admin
        await db.execute(sql`DELETE FROM admins WHERE username = ${adminUsername}`);

        // Create new admin with updated password
        await db.execute(sql`
      INSERT INTO admins (username, password_hash)
      VALUES (${adminUsername}, ${passwordHash})
    `);

        console.log(`✅ Admin password updated successfully!`);
        console.log(`   Username: ${adminUsername}`);
        console.log(`   Password: ${adminPassword}`);

    } catch (error) {
        console.error("❌ Failed to update password:", error);
        throw error;
    }
}

updateAdminPassword()
    .then(() => {
        console.log("\n✨ Done!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Fatal error:", error);
        process.exit(1);
    });
