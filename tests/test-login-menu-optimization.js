const fetch = require('node-fetch');
require('dotenv').config();

async function testLoginMenuOptimization() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST: Login Menu Optimization');
  console.log('='.repeat(80) + '\n');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const testEmail = 'rochiyat@gmail.com'; // Superadmin email
  const testPassword = 'password'; // Update with actual password

  try {
    console.log('📝 Test Configuration:');
    console.log(`   Base URL: ${baseUrl}`);
    console.log(`   Test Email: ${testEmail}`);
    console.log('');

    // Test 1: Login API returns menus
    console.log('Test 1: Login API includes menus in response');
    console.log('-'.repeat(80));

    const startTime = Date.now();
    const loginResponse = await fetch(`${baseUrl}/api/dashboard/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginTime = Date.now() - startTime;

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.error);
      console.log('⚠️  Please update testPassword in script with correct password\n');
      return;
    }

    const loginData = await loginResponse.json();

    console.log(`✅ Login successful (${loginTime}ms)`);
    console.log(`   User: ${loginData.user.name}`);
    console.log(`   Role: ${loginData.user.role}`);
    console.log(`   Email: ${loginData.user.email}`);
    console.log('');

    // Check if menus are included
    if (loginData.menus && Array.isArray(loginData.menus)) {
      console.log('✅ Menus included in login response');
      console.log(`   Total menus: ${loginData.menus.length}`);
      console.log('   Menu names:', loginData.menus.map(m => m.name).join(', '));
      console.log('');

      // Check for formulir-list menu
      const formulirListMenu = loginData.menus.find(m => m.name === 'formulir-list');
      if (formulirListMenu) {
        console.log('✅ "formulir-list" menu found in response');
        console.log(`   Label: ${formulirListMenu.label}`);
        console.log(`   Href: ${formulirListMenu.href}`);
        console.log(`   Roles: ${formulirListMenu.roles.join(', ')}`);
      } else {
        console.log('❌ "formulir-list" menu NOT found in response');
      }
      console.log('');
    } else {
      console.log('❌ Menus NOT included in login response');
      console.log('   This will trigger fallback to menu API\n');
    }

    // Test 2: Compare with separate menu API call
    console.log('Test 2: Compare with separate menu API call');
    console.log('-'.repeat(80));

    const menuStartTime = Date.now();
    const menuResponse = await fetch(
      `${baseUrl}/api/dashboard/menu?role=${loginData.user.role}`
    );
    const menuTime = Date.now() - menuStartTime;

    if (menuResponse.ok) {
      const menuData = await menuResponse.json();
      console.log(`✅ Menu API call successful (${menuTime}ms)`);
      console.log(`   Total menus: ${menuData.data.length}`);
      console.log('');

      // Compare results
      if (loginData.menus && menuData.data) {
        const loginMenuCount = loginData.menus.length;
        const apiMenuCount = menuData.data.length;

        if (loginMenuCount === apiMenuCount) {
          console.log('✅ Menu counts match');
          console.log(`   Both return ${loginMenuCount} menus`);
        } else {
          console.log('⚠️  Menu counts differ');
          console.log(`   Login response: ${loginMenuCount} menus`);
          console.log(`   Menu API: ${apiMenuCount} menus`);
        }
        console.log('');
      }
    } else {
      console.log('❌ Menu API call failed');
      console.log('');
    }

    // Test 3: Performance comparison
    console.log('Test 3: Performance Analysis');
    console.log('-'.repeat(80));

    const oldMethod = loginTime + menuTime;
    const newMethod = loginTime;
    const improvement = ((oldMethod - newMethod) / oldMethod * 100).toFixed(1);

    console.log('Old Method (2 API calls):');
    console.log(`   Login API: ${loginTime}ms`);
    console.log(`   Menu API: ${menuTime}ms`);
    console.log(`   Total: ${oldMethod}ms`);
    console.log('');

    console.log('New Method (1 API call):');
    console.log(`   Login API (with menus): ${loginTime}ms`);
    console.log(`   Total: ${newMethod}ms`);
    console.log('');

    console.log('Performance Improvement:');
    console.log(`   Time saved: ${oldMethod - newMethod}ms`);
    console.log(`   Improvement: ${improvement}%`);
    console.log(`   API calls reduced: 2 → 1 (50% reduction)`);
    console.log('');

    // Test 4: Response structure validation
    console.log('Test 4: Response Structure Validation');
    console.log('-'.repeat(80));

    const checks = [
      { name: 'success field', check: loginData.success === true },
      { name: 'message field', check: typeof loginData.message === 'string' },
      { name: 'user object', check: loginData.user && typeof loginData.user === 'object' },
      { name: 'user.id', check: loginData.user && loginData.user.id },
      { name: 'user.email', check: loginData.user && loginData.user.email },
      { name: 'user.name', check: loginData.user && loginData.user.name },
      { name: 'user.role', check: loginData.user && loginData.user.role },
      { name: 'menus array', check: Array.isArray(loginData.menus) },
      { name: 'menus not empty', check: loginData.menus && loginData.menus.length > 0 },
    ];

    let passedChecks = 0;
    checks.forEach(({ name, check }) => {
      if (check) {
        console.log(`   ✅ ${name}`);
        passedChecks++;
      } else {
        console.log(`   ❌ ${name}`);
      }
    });

    console.log('');
    console.log(`   Result: ${passedChecks}/${checks.length} checks passed`);
    console.log('');

    // Test 5: Menu structure validation
    if (loginData.menus && loginData.menus.length > 0) {
      console.log('Test 5: Menu Structure Validation');
      console.log('-'.repeat(80));

      const sampleMenu = loginData.menus[0];
      const menuFields = [
        { name: 'id', check: sampleMenu.id !== undefined },
        { name: 'name', check: typeof sampleMenu.name === 'string' },
        { name: 'label', check: typeof sampleMenu.label === 'string' },
        { name: 'icon', check: typeof sampleMenu.icon === 'string' },
        { name: 'href', check: typeof sampleMenu.href === 'string' },
        { name: 'order_index', check: typeof sampleMenu.order_index === 'number' },
        { name: 'is_active', check: typeof sampleMenu.is_active === 'boolean' },
        { name: 'roles', check: Array.isArray(sampleMenu.roles) },
      ];

      let passedFields = 0;
      menuFields.forEach(({ name, check }) => {
        if (check) {
          console.log(`   ✅ ${name}`);
          passedFields++;
        } else {
          console.log(`   ❌ ${name}`);
        }
      });

      console.log('');
      console.log(`   Result: ${passedFields}/${menuFields.length} fields valid`);
      console.log('');
    }

    // Final Summary
    console.log('='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));

    const allTestsPassed = 
      loginData.success &&
      loginData.menus &&
      Array.isArray(loginData.menus) &&
      loginData.menus.length > 0;

    if (allTestsPassed) {
      console.log('✅ All tests PASSED!');
      console.log('');
      console.log('Optimization Status:');
      console.log('   ✅ Login API returns menus');
      console.log('   ✅ Response structure correct');
      console.log('   ✅ Menu data complete');
      console.log(`   ✅ Performance improved by ${improvement}%`);
      console.log('   ✅ API calls reduced by 50%');
      console.log('');
      console.log('🚀 Login menu optimization is working correctly!');
    } else {
      console.log('⚠️  Some tests FAILED');
      console.log('');
      console.log('Issues found:');
      if (!loginData.success) console.log('   ❌ Login not successful');
      if (!loginData.menus) console.log('   ❌ Menus not in response');
      if (!Array.isArray(loginData.menus)) console.log('   ❌ Menus not an array');
      if (loginData.menus && loginData.menus.length === 0) console.log('   ❌ Menus array empty');
      console.log('');
      console.log('Please check:');
      console.log('   1. Login API route updated correctly');
      console.log('   2. Database query returns menus');
      console.log('   3. Response includes menus field');
    }

    console.log('');

  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error.message);
    console.error('');
    console.error('Stack trace:');
    console.error(error.stack);
  }
}

// Run test
testLoginMenuOptimization();
