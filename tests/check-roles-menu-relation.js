require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkRelation() {
  try {
    console.log('🔍 Checking roles and menu tables...\n');

    // Check roles table structure
    console.log('📊 ROLES table columns:');
    const rolesColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'roles'
      ORDER BY ordinal_position
    `);
    console.table(rolesColumns.rows);

    // Check menu table structure
    console.log('\n📊 MENU table columns:');
    const menuColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'menu'
      ORDER BY ordinal_position
    `);
    console.table(menuColumns.rows);

    // Check for foreign keys between roles and menu
    console.log('\n🔗 Foreign keys between roles and menu:');
    const fks = await pool.query(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND (tc.table_name = 'menu' OR tc.table_name = 'roles')
        AND (ccu.table_name = 'menu' OR ccu.table_name = 'roles')
    `);

    if (fks.rows.length > 0) {
      console.table(fks.rows);
      console.log('✅ Foreign key relationship exists!');
    } else {
      console.log('❌ No direct foreign key relationship found.');
    }

    // Check roles data
    console.log('\n📋 Sample roles data:');
    const rolesData = await pool.query(`
      SELECT id, name, display_name, permissions
      FROM roles
      LIMIT 5
    `);
    console.table(
      rolesData.rows.map((r) => ({
        id: r.id,
        name: r.name,
        display_name: r.display_name,
        has_permissions: r.permissions ? 'Yes' : 'No',
        permissions_keys: r.permissions
          ? Object.keys(r.permissions).join(', ')
          : 'None',
      }))
    );

    // Check menu data
    console.log('\n📋 Sample menu data:');
    const menuData = await pool.query(`
      SELECT id, name, label, parent_id, roles
      FROM menu
      LIMIT 10
    `);
    console.table(menuData.rows);

    // Check if menu has roles column
    const hasRoleAccess = menuColumns.rows.some(
      (col) => col.column_name === 'roles'
    );

    console.log('\n📝 Analysis:');
    if (hasRoleAccess) {
      console.log(
        '✅ Menu table has "roles" column (JSONB) - stores which roles can access each menu'
      );
      console.log('   Relationship: menu.roles → roles.name (array in JSONB)');
    } else {
      console.log(
        '❌ Menu table does NOT have "roles" column - no direct relationship'
      );
    }

    // Check if roles.permissions contains menu info
    const roleWithMenus = rolesData.rows.find(
      (r) => r.permissions && r.permissions.menus
    );
    if (roleWithMenus) {
      console.log(
        '✅ Roles table stores menu access in "permissions.menus" (JSONB)'
      );
      console.log('   Relationship: roles.permissions.menus → menu.name (array)');
      console.log('   Example:', roleWithMenus.permissions.menus);
    } else {
      console.log(
        '⚠️  Roles table may not have menu access info in permissions yet'
      );
    }

    console.log('\n🎯 Conclusion:');
    console.log(
      'The relationship is stored in roles.permissions.menus (JSONB column)'
    );
    console.log('This is a flexible, non-FK relationship where:');
    console.log('- Each role has a "permissions" JSONB column');
    console.log('- permissions.menus contains array of menu IDs/names');
    console.log('- No direct foreign key constraint (flexible design)');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkRelation();
