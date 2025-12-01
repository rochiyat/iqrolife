/**
 * Run Migration: Add user_id mapping to calon_murid
 * 
 * Usage: node run-migration-user-mapping.js
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
  console.log('🚀 Starting migration: Add user_id mapping to calon_murid\n');

  try {
    // Read migration file
    const migrationPath = path.join(
      __dirname,
      'db',
      'migration-add-user-mapping-calon-murid.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!\n');

    // Verify the changes
    console.log('📊 Verifying changes...\n');

    // Check if columns exist
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'calon_murid' 
        AND column_name IN ('user_id', 'formulir_pendaftaran_id')
      ORDER BY column_name
    `);

    if (columnsResult.rows.length > 0) {
      console.log('✅ New columns added:');
      columnsResult.rows.forEach((col) => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
      console.log('');
    }

    // Check how many records were updated
    const updateResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(user_id) as with_user_id,
        COUNT(*) - COUNT(user_id) as without_user_id
      FROM calon_murid
    `);

    if (updateResult.rows.length > 0) {
      const stats = updateResult.rows[0];
      console.log('📈 Data Statistics:');
      console.log(`   Total records: ${stats.total}`);
      console.log(`   With user_id: ${stats.with_user_id}`);
      console.log(`   Without user_id: ${stats.without_user_id}`);
      console.log('');
    }

    // Show sample data
    const sampleResult = await pool.query(`
      SELECT 
        cm.id,
        cm.name,
        cm.email,
        cm.user_id,
        u.name as parent_user_name
      FROM calon_murid cm
      LEFT JOIN users u ON cm.user_id = u.id
      LIMIT 5
    `);

    if (sampleResult.rows.length > 0) {
      console.log('📋 Sample Data (first 5 records):');
      sampleResult.rows.forEach((row) => {
        console.log(
          `   ID: ${row.id} | Student: ${row.name} | Email: ${row.email} | User ID: ${row.user_id || 'NULL'} | Parent: ${row.parent_user_name || 'N/A'}`
        );
      });
      console.log('');
    }

    console.log('🎉 Migration successful!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Update API to use user_id for filtering');
    console.log('   2. Test parent access to their children data');
    console.log('   3. Verify role-based access control');
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
