/**
 * Run Migration: Add Multiple Roles Support
 * 
 * Usage: node run-migration-multiple-roles.js
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
  console.log('🚀 Starting migration: Add Multiple Roles Support\n');

  try {
    // Read migration file
    const migrationPath = path.join(
      __dirname,
      'db',
      'migration-add-multiple-roles.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📝 Executing SQL...\n');

    // Execute migration
    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!\n');

    // Verify the changes
    console.log('📊 Verifying changes...\n');

    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name = 'user_roles'
    `);

    if (tableCheck.rows.length > 0) {
      console.log('✅ Table created: user_roles\n');
    }

    // Check columns
    const columnsCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'user_roles'
      ORDER BY ordinal_position
    `);

    console.log('📋 Columns in user_roles:');
    columnsCheck.rows.forEach((col) => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // Check FK constraints
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
        AND tc.table_name = 'user_roles'
    `);

    console.log('🔗 Foreign key constraints:');
    fkCheck.rows.forEach((fk) => {
      console.log(
        `   user_roles.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`
      );
    });
    console.log('');

    // Check migrated data
    const dataCheck = await pool.query(`
      SELECT 
        COUNT(*) as total_assignments,
        COUNT(DISTINCT user_id) as users_with_roles,
        COUNT(CASE WHEN is_primary THEN 1 END) as primary_roles
      FROM user_roles
    `);

    const stats = dataCheck.rows[0];
    console.log('📈 Data Statistics:');
    console.log(`   Total role assignments: ${stats.total_assignments}`);
    console.log(`   Users with roles: ${stats.users_with_roles}`);
    console.log(`   Primary roles: ${stats.primary_roles}`);
    console.log('');

    // Show sample data
    const sampleData = await pool.query(`
      SELECT 
        u.id,
        u.email,
        r.name as role_name,
        ur.is_primary
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      JOIN roles r ON ur.role_id = r.id
      ORDER BY u.id, ur.is_primary DESC
      LIMIT 10
    `);

    if (sampleData.rows.length > 0) {
      console.log('📋 Sample Data:');
      sampleData.rows.forEach((row) => {
        const primary = row.is_primary ? '⭐ PRIMARY' : '  secondary';
        console.log(
          `   ${primary} | User ${row.id} (${row.email}) → ${row.role_name}`
        );
      });
      console.log('');
    }

    // Test helper functions
    console.log('🧪 Testing helper functions...\n');

    // Test get_user_roles
    const userRolesTest = await pool.query(
      'SELECT * FROM get_user_roles(1)'
    );
    if (userRolesTest.rows.length > 0) {
      console.log('✅ get_user_roles() function works');
      console.log(`   User 1 has ${userRolesTest.rows.length} role(s)`);
    }

    // Test get_primary_role
    const primaryRoleTest = await pool.query(
      'SELECT * FROM get_primary_role(1)'
    );
    if (primaryRoleTest.rows.length > 0) {
      console.log('✅ get_primary_role() function works');
      console.log(`   User 1 primary role: ${primaryRoleTest.rows[0].role_name}`);
    }
    console.log('');

    console.log('🎉 Migration successful!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Users can now have multiple roles');
    console.log('   2. Use user_roles table for role assignments');
    console.log('   3. Update application code to support multiple roles');
    console.log('   4. Test role-based access control');
    console.log('\n💡 Usage Examples:');
    console.log('   -- Get all roles for user 1:');
    console.log('   SELECT * FROM get_user_roles(1);');
    console.log('');
    console.log('   -- Add additional role to user:');
    console.log('   INSERT INTO user_roles (user_id, role_id, is_primary)');
    console.log('   VALUES (1, 2, false);');
    console.log('');
    console.log('   -- Get users with multiple roles:');
    console.log('   SELECT u.email, COUNT(ur.role_id) as role_count');
    console.log('   FROM users u');
    console.log('   JOIN user_roles ur ON u.id = ur.user_id');
    console.log('   GROUP BY u.id, u.email');
    console.log('   HAVING COUNT(ur.role_id) > 1;');
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
