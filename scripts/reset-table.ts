import 'dotenv/config';
import { pool } from '../server/db';

async function reset() {
    console.log('Dropping admins table...');
    try {
        await pool.query('DROP TABLE IF EXISTS admins CASCADE');
        console.log('✅ Admins table dropped.');
    } catch (err) {
        console.error('❌ Failed to drop table:', err);
    } finally {
        await pool.end();
    }
}

reset();
