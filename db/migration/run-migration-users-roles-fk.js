/**
 * Run Migration: Add Foreign Key between users and roles
 * 
 * Usage: node run-migration-users-roles-fk.js
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

async function runMigration() {
  console.log('🚀 Starting migration: Add users-roles FK relationship\n');

  try {
    // Check if roles table has data
    const rolesCheck = await pool.query('SELECT COUNT(*) as count FROM roles');
    const rolesCount = parseInt(rolesCheck.rows[0].count);

    if (rolesCount === 0) {
      console.log('⚠️  Warning: roles table is empty!');
      console.log('   Seeding default roles first...\n');

      // Seed default roles
      await pool.query(`
        INSERT INTO roles (name, display_name, description, permissions) VALUES
        ('superadmin', 'Super Admin', 'Full access to all features', 
          '{"canAccessAll": true, "canManageUsers": true, "canManageRoles": true, "canManageStudents": true, "canManageForms": true, "canManageFormsList": true, "canManageSettings": true, "canManageMenu": true, "canViewPortfolio": true}'::jsonb),
        ('staff', 'Staff', 'Limited administrative access', 
          '{"canManageStudents": true, "canManageForms": true, "canManageFormsList": true, "canViewPortfolio": true}'::jsonb),
        ('teacher', 'Teacher', 'View and manage assigned students', 
          '{"canManageStudents": true, "canManageFormsList": true, "canViewPortfolio": true}'::jsonb),
        ('parent', 'Parent', 'View own children only', 
          '{"canManageForms": true, "canViewPortfolio": true}'::jsonb)
        ON CONFLICT (name) DO NOTHING
      `);

      console.log('✅ Default roles seeded\n');
    }

    // Read migration file
    const migrationPath = path.join(
      __dirname,
      'db',
      'migration-add-users-roles-fk.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!\n');

    // Verify the changes
    console.log('📊 Verifying changes...\n');

    // Check if column exists
    const columnCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role_id'
    `);

    if (columnCheck.rows.length > 0) {
      console.log('✅ Column added:');
      console.log(`   - role_id (${columnCheck.rows[0].data_type})\n`);
    }

    // Check FK constraint
    const fkCheck = await pool.query(`
      SELECT
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'users'
        AND kcu.column_name = 'role_id'
    `);

    if (fkCheck.rows.length > 0) {
      console.log('✅ Foreign key constraint added:');
      fkCheck.rows.forEach((fk) => {
        console.log(
          `   users.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`
        );
      });
      console.log('');
    }

    // Check data mapping
    const dataCheck = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(role_id) as with_role_id,
        COUNT(*) - COUNT(role_id) as without_role_id
      FROM users
    `);

    const stats = dataCheck.rows[0];
    console.log('📈 Data Statistics:');
    console.log(`   Total users: ${stats.total}`);
    console.log(`   With role_id: ${stats.with_role_id} ✅`);
    console.log(`   Without role_id: ${stats.without_role_id} ${stats.without_role_id > 0 ? '⚠️' : '✅'}`);
    console.log('');

    // Show sample data
    const sampleData = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.role as old_role,
        r.name as new_role,
        u.role_id
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LIMIT 5
    `);

    if (sampleData.rows.length > 0) {
      console.log('📋 Sample Data (first 5 users):');
      sampleData.rows.forEach((row) => {
        const match = row.old_role === row.new_role ? '✅' : '⚠️';
        console.log(
          `   ${match} ID: ${row.id} | Email: ${row.email} | Old: ${row.old_role} | New: ${row.new_role} | FK: ${row.role_id}`
        );
      });
      console.log('');
    }

    // Check for mismatches
    const mismatchCheck = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.role as old_role,
        r.name as new_role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.role != r.name OR r.name IS NULL
    `);

    if (mismatchCheck.rows.length > 0) {
      console.log('⚠️  Warning: Found mismatched roles:');
      mismatchCheck.rows.forEach((row) => {
        console.log(
          `   User ${row.id} (${row.email}): old="${row.old_role}" new="${row.new_role || 'NULL'}"`
        );
      });
      console.log('');
    } else {
      console.log('✅ All roles matched correctly!\n');
    }

    console.log('🎉 Migration successful!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Update application code to use role_id');
    console.log('   2. Test all role-based features');
    console.log('   3. After verification, can drop old "role" column');
    console.log('   4. Update ERD documentation');
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
