const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkFormulirListMenu() {
  try {
    console.log('🔍 Checking formulir-list menu in database...\n');

    // Check if menu exists
    const menuResult = await pool.query(
      `SELECT id, name, label, icon, href, roles, is_active, order_index 
       FROM menu 
       WHERE name = $1`,
      ['formulir-list']
    );

    if (menuResult.rows.length === 0) {
      console.log('❌ Menu "formulir-list" NOT FOUND in database!');
      console.log('\n📝 You need to add it to the database.');
      console.log('\nRun this SQL:');
      console.log(`
INSERT INTO menu (name, label, icon, href, parent_id, order_index, is_active, roles, created_at, updated_at)
VALUES (
  'formulir-list',
  'Formulir Review',
  'FileText',
  '/dashboard/formulir-list',
  NULL,
  3,
  true,
  '["superadmin", "staff", "teacher"]'::jsonb,
  NOW(),
  NOW()
);
      `);
    } else {
      const menu = menuResult.rows[0];
      console.log('✅ Menu "formulir-list" found in database!');
      console.log('\nMenu details:');
      console.log(JSON.stringify(menu, null, 2));

      // Check if superadmin is in roles
      const roles = menu.roles;
      if (roles && roles.includes('superadmin')) {
        console.log('\n✅ "superadmin" is included in roles');
      } else {
        console.log('\n❌ "superadmin" is NOT in roles!');
        console.log('Current roles:', roles);
        console.log('\n📝 Update the menu to include superadmin:');
        console.log(`
UPDATE menu 
SET roles = '["superadmin", "staff", "teacher"]'::jsonb
WHERE name = 'formulir-list';
        `);
      }

      // Check if menu is active
      if (menu.is_active) {
        console.log('✅ Menu is active');
      } else {
        console.log('❌ Menu is NOT active!');
      }
    }

    // Check all menus for superadmin
    console.log('\n\n📋 All menus accessible by superadmin:');
    const allMenus = await pool.query(
      `SELECT name, label, roles 
       FROM menu 
       WHERE is_active = true 
       AND roles @> $1::jsonb
       ORDER BY order_index, name`,
      [JSON.stringify(['superadmin'])]
    );

    console.log(`\nTotal: ${allMenus.rows.length} menus`);
    allMenus.rows.forEach((m, i) => {
      console.log(`${i + 1}. ${m.name} (${m.label})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkFormulirListMenu();
