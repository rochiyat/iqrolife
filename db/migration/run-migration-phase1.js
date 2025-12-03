/**
 * Run Phase 1 Migrations
 * 
 * Implements recommendations from DATABASE_INSIGHTS_AND_RECOMMENDATIONS.md
 * 
 * Phase 1 includes:
 * 1. Student Documents Management
 * 2. Payment Tracking
 * 3. Notifications System
 * 4. Soft Delete Implementation
 * 
 * Usage: node run-migration-phase1.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const migrations = [
  {
    name: 'Student Documents',
    file: 'migration-phase1-student-documents.sql',
    table: 'student_documents',
  },
  {
    name: 'Payments',
    file: 'migration-phase1-payments.sql',
    table: 'payments',
  },
  {
    name: 'Notifications',
    file: 'migration-phase1-notifications.sql',
    table: 'notifications',
  },
  {
    name: 'Soft Delete',
    file: 'migration-phase1-soft-delete.sql',
    table: null, // Multiple tables
  },
];

async function runMigrations() {
  console.log('🚀 Starting Phase 1 Migrations');
  console.log('📋 Based on: DATABASE_INSIGHTS_AND_RECOMMENDATIONS.md\n');

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Migration: ${migration.name}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      // Read migration file
      const migrationPath = path.join(__dirname, 'db', migration.file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      console.log(`📄 File: ${migration.file}`);
      console.log('📝 Executing SQL...\n');

      // Execute migration
      await pool.query(migrationSQL);

      console.log(`✅ ${migration.name} migration completed!\n`);

      // Verify table creation (if applicable)
      if (migration.table) {
        const tableCheck = await pool.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_name = $1
        `, [migration.table]);

        if (tableCheck.rows.length > 0) {
          console.log(`✅ Table '${migration.table}' verified\n`);

          // Get column count
          const columnCheck = await pool.query(`
            SELECT COUNT(*) as count
            FROM information_schema.columns
            WHERE table_name = $1
          `, [migration.table]);

          console.log(`📊 Columns: ${columnCheck.rows[0].count}`);

          // Get index count
          const indexCheck = await pool.query(`
            SELECT COUNT(*) as count
            FROM pg_indexes
            WHERE tablename = $1
          `, [migration.table]);

          console.log(`🔗 Indexes: ${indexCheck.rows[0].count}`);
        }
      } else {
        // Verify soft delete columns
        console.log('✅ Soft delete columns added to:');
        const tables = ['calon_murid', 'users', 'formulir_pendaftaran', 'formulir'];
        
        for (const table of tables) {
          const colCheck = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = $1 AND column_name = 'deleted_at'
          `, [table]);

          if (colCheck.rows.length > 0) {
            console.log(`   ✓ ${table}.deleted_at`);
          }
        }
      }

      successCount++;
    } catch (error) {
      console.error(`❌ ${migration.name} migration failed:`, error.message);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 MIGRATION SUMMARY');
  console.log(`${'='.repeat(60)}\n`);

  console.log(`✅ Successful: ${successCount}/${migrations.length}`);
  console.log(`❌ Failed: ${failCount}/${migrations.length}\n`);

  if (successCount === migrations.length) {
    console.log('🎉 All Phase 1 migrations completed successfully!\n');

    // Show what was added
    console.log('📦 New Tables Added:');
    console.log('   1. student_documents - Document management');
    console.log('   2. payments - Payment tracking');
    console.log('   3. notifications - Notification system\n');

    console.log('🔧 Features Added:');
    console.log('   1. Soft delete (deleted_at columns)');
    console.log('   2. Helper functions (soft_delete, restore_deleted, hard_delete)\n');

    console.log('📝 Next Steps:');
    console.log('   1. Update application code to use new tables');
    console.log('   2. Implement document upload functionality');
    console.log('   3. Implement payment verification workflow');
    console.log('   4. Implement notification sending');
    console.log('   5. Update queries to exclude soft-deleted records\n');

    console.log('💡 Usage Examples:');
    console.log('   -- Upload document:');
    console.log('   INSERT INTO student_documents (student_id, document_type, file_url, uploaded_by)');
    console.log('   VALUES (1, \'birth_cert\', \'https://...\', 4);\n');

    console.log('   -- Record payment:');
    console.log('   INSERT INTO payments (student_id, payment_type, amount, payment_date)');
    console.log('   VALUES (1, \'registration\', 500000, \'2024-11-29\');\n');

    console.log('   -- Send notification:');
    console.log('   INSERT INTO notifications (user_id, type, channel, message)');
    console.log('   VALUES (1, \'email\', \'email\', \'Welcome to Iqrolife!\');\n');

    console.log('   -- Soft delete:');
    console.log('   UPDATE calon_murid SET deleted_at = NOW() WHERE id = 1;\n');

    console.log('   -- Query active records:');
    console.log('   SELECT * FROM calon_murid WHERE deleted_at IS NULL;\n');
  } else {
    console.log('⚠️  Some migrations failed. Please check errors above.\n');
  }

  await pool.end();
}

// Run migrations
runMigrations().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
