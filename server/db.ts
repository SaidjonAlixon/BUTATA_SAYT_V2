
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

let pool: any;
let db: ReturnType<typeof drizzle>;

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Please check your .env file.");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Always enable SSL-ish settings for remote connections to avoid "self-signed certificate" errors
    ssl: { rejectUnauthorized: false },
  });

  // Test the pool config implicitly by initializing drizzle
  db = drizzle(pool, { schema });

} catch (err) {
  console.error("Critical: Failed to initialize database connection:", err);
  // Fallback to prevent app crash - though it will fail on query
  pool = new Pool({ connectionString: "postgres://fallback-on-crash" });
  db = drizzle(pool, { schema });
}

export { pool, db };
