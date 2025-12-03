const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigration() {
  try {
    console.log('🚀 Starting migration: Add user_id to registrations table...\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'add-user-id-to-registrations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute migration
    await pool.query(sql);
    console.log('✅ Migration executed successfully!\n');

    // Verify column was added
    const verifyResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'registrations' AND column_name = 'user_id'
    `);

    if (verifyResult.rows.length > 0) {
      console.log('✅ Verification successful!');
      console.log('Column details:', verifyResult.rows[0]);
    } else {
      console.log('⚠️  Warning: Column not found after migration');
    }

    // Show sample data
    const sampleResult = await pool.query(`
      SELECT id, nama_lengkap, email, user_id
      FROM registrations
      LIMIT 5
    `);
    
    console.log('\n📊 Sample data from registrations table:');
    console.table(sampleResult.rows);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
    console.log('\n🔚 Database connection closed.');
  }
}

runMigration();
