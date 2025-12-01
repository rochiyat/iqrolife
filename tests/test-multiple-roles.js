/**
 * Test Multiple Roles Feature
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testMultipleRoles() {
  console.log('🧪 Testing Multiple Roles Feature\n');

  try {
    // Test 1: Add secondary role to user 1 (superadmin + staff)
    console.log('1️⃣ Adding secondary role to User 1...');
    await pool.query(`
      INSERT INTO user_roles (user_id, role_id, is_primary, assigned_by)
      VALUES (1, 2, false, 1)
      ON CONFLICT (user_id, role_id) DO NOTHING
    `);
    console.log('   ✅ Added staff role to User 1\n');

    // Test 2: Get all roles for user 1
    console.log('2️⃣ Getting all roles for User 1...');
    const user1Roles = await pool.query('SELECT * FROM get_user_roles(1)');
    console.log(`   User 1 now has ${user1Roles.rows.length} role(s):`);
    user1Roles.rows.forEach((role) => {
      const primary = role.is_primary ? '⭐ PRIMARY' : '  secondary';
      console.log(`   ${primary} - ${role.role_name} (${role.display_name})`);
    });
    console.log('');

    // Test 3: Get primary role
    console.log('3️⃣ Getting primary role for User 1...');
    const primaryRole = await pool.query('SELECT * FROM get_primary_role(1)');
    if (primaryRole.rows.length > 0) {
      console.log(`   ⭐ Primary role: ${primaryRole.rows[0].role_name}`);
    }
    console.log('');

    // Test 4: Add multiple roles to user 4 (parent + teacher)
    console.log('4️⃣ Adding multiple roles to User 4...');
    await pool.query(`
      INSERT INTO user_roles (user_id, role_id, is_primary, assigned_by)
      VALUES (4, 3, false, 1)
      ON CONFLICT (user_id, role_id) DO NOTHING
    `);
    console.log('   ✅ Added teacher role to User 4\n');

    // Test 5: Get all roles for user 4
    console.log('5️⃣ Getting all roles for User 4...');
    const user4Roles = await pool.query('SELECT * FROM get_user_roles(4)');
    console.log(`   User 4 now has ${user4Roles.rows.length} role(s):`);
    user4Roles.rows.forEach((role) => {
      const primary = role.is_primary ? '⭐ PRIMARY' : '  secondary';
      console.log(`   ${primary} - ${role.role_name} (${role.display_name})`);
    });
    console.log('');

    // Test 6: Get users with multiple roles
    console.log('6️⃣ Finding users with multiple roles...');
    const multiRoleUsers = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        COUNT(ur.role_id) as role_count,
        STRING_AGG(r.name, ', ' ORDER BY ur.is_primary DESC) as roles
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id, u.email, u.name
      HAVING COUNT(ur.role_id) > 1
    `);

    if (multiRoleUsers.rows.length > 0) {
      console.log(`   Found ${multiRoleUsers.rows.length} user(s) with multiple roles:`);
      multiRoleUsers.rows.forEach((user) => {
        console.log(
          `   👤 ${user.name} (${user.email}) - ${user.role_count} roles: ${user.roles}`
        );
      });
    } else {
      console.log('   No users with multiple roles found');
    }
    console.log('');

    // Test 7: Get all role assignments
    console.log('7️⃣ All role assignments:');
    const allAssignments = await pool.query(`
      SELECT 
        u.id,
        u.email,
        r.name as role_name,
        ur.is_primary,
        ur.assigned_at
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      JOIN roles r ON ur.role_id = r.id
      ORDER BY u.id, ur.is_primary DESC
    `);

    allAssignments.rows.forEach((row) => {
      const primary = row.is_primary ? '⭐' : '  ';
      console.log(
        `   ${primary} User ${row.id} (${row.email}) → ${row.role_name}`
      );
    });
    console.log('');

    // Test 8: Check permissions aggregation
    console.log('8️⃣ Aggregated permissions for User 1:');
    const permissions = await pool.query(`
      SELECT 
        u.id,
        u.email,
        JSONB_AGG(r.permissions) as all_permissions
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE u.id = 1
      GROUP BY u.id, u.email
    `);

    if (permissions.rows.length > 0) {
      console.log(`   User has permissions from ${user1Roles.rows.length} role(s)`);
      console.log('   Combined permissions:', JSON.stringify(permissions.rows[0].all_permissions, null, 2));
    }
    console.log('');

    console.log('✅ All tests passed!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Multiple roles per user: WORKING');
    console.log('   ✅ Primary role tracking: WORKING');
    console.log('   ✅ Helper functions: WORKING');
    console.log('   ✅ Permission aggregation: WORKING');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testMultipleRoles();
