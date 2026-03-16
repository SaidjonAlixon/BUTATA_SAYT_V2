
import { db } from "../server/db";
import { users } from "../shared/schema";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Seeding admin user...");

    const username = "Butata LLC2026";
    const password = "butata2026";

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.insert(users).values({
            username,
            password: hashedPassword,
            role: 'admin'
        }).onConflictDoUpdate({
            target: users.username,
            set: { password: hashedPassword }
        });
        console.log("Admin user seeded successfully!");
    } catch (error) {
        console.error("Error seeding admin:", error);
    } finally {
        process.exit(0);
    }
}

main();
