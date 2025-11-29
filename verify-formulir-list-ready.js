const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function verifyFormulirListReady() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFIKASI MENU "FORMULIR REVIEW" (formulir-list)');
  console.log('='.repeat(80) + '\n');

  let allChecks = true;

  try {
    // Check 1: Menu exists in database
    console.log('✓ Check 1: Menu exists in database');
    const menuResult = await pool.query(
      `SELECT * FROM menu WHERE name = 'formulir-list'`
    );

    if (menuResult.rows.length === 0) {
      console.log('  ❌ FAILED: Menu not found in database!\n');
      allChecks = false;
    } else {
      const menu = menuResult.rows[0];
      console.log('  ✅ PASSED: Menu found');
      console.log(`     - ID: ${menu.id}`);
      console.log(`     - Label: ${menu.label}`);
      console.log(`     - Href: ${menu.href}`);
      console.log(`     - Active: ${menu.is_active}`);
      console.log(`     - Roles: ${menu.roles.join(', ')}\n`);

      // Check 2: Menu is active
      console.log('✓ Check 2: Menu is active');
      if (menu.is_active) {
        console.log('  ✅ PASSED: Menu is active\n');
      } else {
        console.log('  ❌ FAILED: Menu is not active!\n');
        allChecks = false;
      }

      // Check 3: Correct roles assigned
      console.log('✓ Check 3: Correct roles assigned');
      const expectedRoles = ['superadmin', 'staff', 'teacher'];
      const hasAllRoles = expectedRoles.every(role => menu.roles.includes(role));
      
      if (hasAllRoles) {
        console.log('  ✅ PASSED: All expected roles present');
        expectedRoles.forEach(role => {
          console.log(`     ✓ ${role}`);
        });
        console.log('');
      } else {
        console.log('  ❌ FAILED: Missing some roles');
        console.log(`     Expected: ${expectedRoles.join(', ')}`);
        console.log(`     Actual: ${menu.roles.join(', ')}\n`);
        allChecks = false;
      }
    }

    // Check 4: API returns menu for each role
    console.log('✓ Check 4: API query returns menu for each role');
    const testRoles = ['superadmin', 'staff', 'teacher'];
    let apiCheckPassed = true;

    for (const role of testRoles) {
      const apiResult = await pool.query(
        `SELECT name FROM menu 
         WHERE is_active = true 
         AND roles @> $1::jsonb 
         AND name = 'formulir-list'`,
        [JSON.stringify([role])]
      );

      if (apiResult.rows.length > 0) {
        console.log(`  ✓ ${role}: ✅ Menu accessible`);
      } else {
        console.log(`  ✓ ${role}: ❌ Menu NOT accessible`);
        apiCheckPassed = false;
        allChecks = false;
      }
    }

    if (apiCheckPassed) {
      console.log('  ✅ PASSED: All roles can access menu via API\n');
    } else {
      console.log('  ❌ FAILED: Some roles cannot access menu\n');
    }

    // Check 5: Parent should NOT have access
    console.log('✓ Check 5: Parent role should NOT have access');
    const parentResult = await pool.query(
      `SELECT name FROM menu 
       WHERE is_active = true 
       AND roles @> $1::jsonb 
       AND name = 'formulir-list'`,
      [JSON.stringify(['parent'])]
    );

    if (parentResult.rows.length === 0) {
      console.log('  ✅ PASSED: Parent correctly does NOT have access\n');
    } else {
      console.log('  ❌ FAILED: Parent should not have access!\n');
      allChecks = false;
    }

    // Check 6: Page file exists
    console.log('✓ Check 6: Page file exists');
    const fs = require('fs');
    const pagePath = 'app/dashboard/(protected)/formulir-list/page.tsx';
    
    if (fs.existsSync(pagePath)) {
      console.log('  ✅ PASSED: Page file exists');
      console.log(`     Path: ${pagePath}\n`);
    } else {
      console.log('  ❌ FAILED: Page file not found!');
      console.log(`     Expected: ${pagePath}\n`);
      allChecks = false;
    }

    // Check 7: Layout includes menu item
    console.log('✓ Check 7: Layout includes menu item');
    const layoutPath = 'app/dashboard/(protected)/layout.tsx';
    
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      if (layoutContent.includes('formulir-list')) {
        console.log('  ✅ PASSED: Layout includes formulir-list menu\n');
      } else {
        console.log('  ❌ FAILED: Layout does not include formulir-list\n');
        allChecks = false;
      }
    } else {
      console.log('  ⚠️  WARNING: Layout file not found\n');
    }

    // Final Summary
    console.log('='.repeat(80));
    if (allChecks) {
      console.log('✅ ALL CHECKS PASSED!');
      console.log('='.repeat(80));
      console.log('\n🎉 Menu "Formulir Review" sudah siap digunakan!\n');
      console.log('📋 Yang bisa akses:');
      console.log('   ✅ Superadmin');
      console.log('   ✅ Staff');
      console.log('   ✅ Teacher');
      console.log('   ❌ Parent (tidak bisa akses)\n');
      console.log('🔧 Cara melihat menu:');
      console.log('   1. Logout dari dashboard');
      console.log('   2. Login kembali dengan salah satu role di atas');
      console.log('   3. Menu "Formulir Review" akan muncul di sidebar\n');
      console.log('💡 Atau gunakan Clear Cache Tool:');
      console.log('   http://localhost:3000/clear-menu-cache.html\n');
      console.log('📚 Dokumentasi lengkap:');
      console.log('   - FORMULIR_LIST_MENU_READY.md');
      console.log('   - FIX_FORMULIR_LIST_MENU.md');
      console.log('   - MENU_VERSION_SYSTEM.md\n');
    } else {
      console.log('❌ SOME CHECKS FAILED!');
      console.log('='.repeat(80));
      console.log('\n⚠️  Ada masalah yang perlu diperbaiki.');
      console.log('Lihat detail di atas untuk informasi lebih lanjut.\n');
    }

  } catch (error) {
    console.error('\n❌ ERROR during verification:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

verifyFormulirListReady();
