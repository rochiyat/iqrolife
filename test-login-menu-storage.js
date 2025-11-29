const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testLoginMenuFlow() {
  try {
    console.log('🔍 Testing Login → Menu → LocalStorage Flow\n');

    // Step 1: Get superadmin user
    console.log('Step 1: Finding superadmin user...');
    const userResult = await pool.query(
      `SELECT id, email, name, role FROM users WHERE role = $1 LIMIT 1`,
      ['superadmin']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ No superadmin user found!');
      return;
    }

    const user = userResult.rows[0];
    console.log('✅ Found superadmin:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);

    // Step 2: Simulate menu API call (what happens after login)
    console.log('\nStep 2: Fetching menus for role "superadmin"...');
    const menuResult = await pool.query(
      `SELECT id, name, label, icon, href, parent_id, order_index, is_active, roles
       FROM menu
       WHERE is_active = true
       AND roles @> $1::jsonb
       ORDER BY order_index, name`,
      [JSON.stringify(['superadmin'])]
    );

    console.log(`✅ Found ${menuResult.rows.length} menus for superadmin`);
    
    // Step 3: Check if formulir-list is included
    console.log('\nStep 3: Checking if "formulir-list" is in the result...');
    const formulirListMenu = menuResult.rows.find(m => m.name === 'formulir-list');
    
    if (formulirListMenu) {
      console.log('✅ "formulir-list" IS included in menu API response!');
      console.log('   Label:', formulirListMenu.label);
      console.log('   Href:', formulirListMenu.href);
      console.log('   Order:', formulirListMenu.order_index);
    } else {
      console.log('❌ "formulir-list" is NOT in menu API response!');
    }

    // Step 4: Show what would be saved to localStorage
    console.log('\nStep 4: Data that would be saved to localStorage:');
    console.log('   Key: "accessible-menus"');
    console.log('   Value:', JSON.stringify(menuResult.rows, null, 2));
    
    console.log('\n   Key: "menus-role"');
    console.log('   Value:', user.role);

    // Step 5: Show menu names that would be extracted
    console.log('\nStep 5: Menu names that would be used in sidebar:');
    const menuNames = menuResult.rows.map(m => m.name);
    console.log('   ', menuNames.join(', '));

    // Step 6: Check layout logic
    console.log('\nStep 6: Checking sidebar logic...');
    console.log('   Looking for menu with menuId: "formulir-list"');
    console.log('   Condition: accessibleMenus.includes("formulir-list")');
    console.log('   Result:', menuNames.includes('formulir-list') ? '✅ WILL SHOW' : '❌ WILL NOT SHOW');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log('Database has formulir-list menu:', formulirListMenu ? '✅ YES' : '❌ NO');
    console.log('Menu includes superadmin role:', formulirListMenu ? '✅ YES' : '❌ NO');
    console.log('API would return formulir-list:', formulirListMenu ? '✅ YES' : '❌ NO');
    console.log('Sidebar would show formulir-list:', menuNames.includes('formulir-list') ? '✅ YES' : '❌ NO');

    if (formulirListMenu && menuNames.includes('formulir-list')) {
      console.log('\n✅ Everything looks correct!');
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Clear browser localStorage:');
      console.log('   - Open DevTools (F12)');
      console.log('   - Go to Application → Local Storage');
      console.log('   - Right-click → Clear');
      console.log('   - Or run: localStorage.clear()');
      console.log('\n2. Logout and login again as superadmin');
      console.log('\n3. Check browser console for errors during login');
      console.log('\n4. Verify localStorage after login:');
      console.log('   localStorage.getItem("accessible-menus")');
      console.log('   localStorage.getItem("menus-role")');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testLoginMenuFlow();
