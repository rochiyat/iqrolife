const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testFormulirListForAllRoles() {
  try {
    console.log('🔍 Testing "formulir-list" menu for all roles\n');
    console.log('='.repeat(70));

    const roles = ['superadmin', 'staff', 'teacher', 'parent'];

    for (const role of roles) {
      console.log(`\n📋 Testing role: ${role.toUpperCase()}`);
      console.log('-'.repeat(70));

      // Get menus for this role (same query as API)
      const menuResult = await pool.query(
        `SELECT name, label, href, roles
         FROM menu
         WHERE is_active = true
         AND roles @> $1::jsonb
         ORDER BY order_index, name`,
        [JSON.stringify([role])]
      );

      const menus = menuResult.rows;
      const menuNames = menus.map(m => m.name);
      const hasFormulirList = menuNames.includes('formulir-list');

      console.log(`Total menus: ${menus.length}`);
      console.log(`Menu names: ${menuNames.join(', ')}`);
      
      if (hasFormulirList) {
        const formulirMenu = menus.find(m => m.name === 'formulir-list');
        console.log(`\n✅ "formulir-list" IS accessible by ${role}`);
        console.log(`   Label: ${formulirMenu.label}`);
        console.log(`   Href: ${formulirMenu.href}`);
        console.log(`   Roles: ${formulirMenu.roles.join(', ')}`);
      } else {
        console.log(`\n❌ "formulir-list" is NOT accessible by ${role}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));

    // Check formulir-list menu details
    const formulirMenu = await pool.query(
      `SELECT * FROM menu WHERE name = 'formulir-list'`
    );

    if (formulirMenu.rows.length > 0) {
      const menu = formulirMenu.rows[0];
      console.log('\n✅ Menu "formulir-list" exists in database');
      console.log(`   ID: ${menu.id}`);
      console.log(`   Label: ${menu.label}`);
      console.log(`   Icon: ${menu.icon}`);
      console.log(`   Href: ${menu.href}`);
      console.log(`   Active: ${menu.is_active ? '✅ Yes' : '❌ No'}`);
      console.log(`   Order: ${menu.order_index}`);
      console.log(`   Roles: ${menu.roles.join(', ')}`);

      console.log('\n📝 Expected behavior:');
      menu.roles.forEach(role => {
        console.log(`   ✅ ${role} → SHOULD see "Formulir Review" menu`);
      });

      const notIncluded = ['parent'].filter(r => !menu.roles.includes(r));
      if (notIncluded.length > 0) {
        notIncluded.forEach(role => {
          console.log(`   ❌ ${role} → should NOT see "Formulir Review" menu`);
        });
      }
    } else {
      console.log('\n❌ Menu "formulir-list" NOT FOUND in database!');
    }

    console.log('\n' + '='.repeat(70));
    console.log('🔧 NEXT STEPS FOR USERS');
    console.log('='.repeat(70));
    console.log('\nIf menu is not showing after login:');
    console.log('1. Logout dari dashboard');
    console.log('2. Clear browser localStorage (or just logout will do it)');
    console.log('3. Login kembali');
    console.log('4. Menu "Formulir Review" akan muncul');
    console.log('\nOr use: http://localhost:3000/clear-menu-cache.html');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testFormulirListForAllRoles();
