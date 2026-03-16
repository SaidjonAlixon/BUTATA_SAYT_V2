import 'dotenv/config';
import { db } from '../server/db';
import { admins } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    console.log(`Setting up admin user: ${username}`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existing] = await db.select().from(admins).where(eq(admins.username, username));

        if (existing) {
            console.log(`User ${username} already exists. Updating password...`);
            await db.update(admins).set({ passwordHash: hashedPassword }).where(eq(admins.id, existing.id));
        } else {
            console.log(`Creating new user...`);
            await db.insert(admins).values({
                username,
                passwordHash: hashedPassword,
            });
        }

        console.log('✅ Admin user setup successful!');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to setup admin user:', error);
        process.exit(1);
    }
}

main();
