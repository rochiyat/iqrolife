/**
 * Run Migration: Add 'enrolled' status to formulir_pendaftaran
 * 
 * Usage: node run-migration-enrolled-status.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigration() {
  console.log('🚀 Starting migration: Add enrolled status\n');

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'db', 'migration-add-enrolled-status.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Status values now available:');
    console.log('   - draft');
    console.log('   - submitted');
    console.log('   - pending');
    console.log('   - reviewed');
    console.log('   - approved');
    console.log('   - rejected');
    console.log('   - enrolled ✨ (NEW)\n');

    // Verify the change
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'formulir_pendaftaran' AND column_name = 'status'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Verification: Column exists');
      console.log('   Column:', result.rows[0].column_name);
      console.log('   Type:', result.rows[0].data_type);
      console.log('   Nullable:', result.rows[0].is_nullable);
    }

    console.log('\n🎉 Migration successful! You can now use "enrolled" status.');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration();
