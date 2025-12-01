async function testMenuLocalStorage() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Menu LocalStorage Implementation\n');

  try {
    // Test 1: Check menu API with role filter
    console.log('1️⃣ Testing Menu API with role filter...');
    
    const roles = ['superadmin', 'staff', 'teacher', 'parent'];
    
    for (const role of roles) {
      const response = await fetch(`${baseUrl}/api/dashboard/menu?role=${role}`);
      const data = await response.json();
      
      console.log(`\n   Role: ${role}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${data.success}`);
      console.log(`   Menus: ${data.total} items`);
      
      if (data.data && data.data.length > 0) {
        console.log(`   Menu names: ${data.data.map(m => m.name).join(', ')}`);
      }
    }

    // Test 2: Check menu API without role filter
    console.log('\n2️⃣ Testing Menu API without role filter...');
    const allMenusRes = await fetch(`${baseUrl}/api/dashboard/menu`);
    const allMenusData = await allMenusRes.json();
    
    console.log(`   Status: ${allMenusRes.status}`);
    console.log(`   Total menus: ${allMenusData.total}`);
    console.log(`   All menu names: ${allMenusData.data.map(m => m.name).join(', ')}`);

    // Test 3: Instructions for manual testing
    console.log('\n📋 Manual Testing Steps:\n');
    
    console.log('Step 1: Clear localStorage');
    console.log('   - Open DevTools (F12)');
    console.log('   - Go to Application → Local Storage');
    console.log('   - Right-click → Clear');
    console.log('   - Or run: localStorage.clear()');
    console.log('');
    
    console.log('Step 2: Login');
    console.log('   - Go to http://localhost:3000/dashboard/login');
    console.log('   - Login with any account');
    console.log('   - Watch Console for logs:');
    console.log('     🔍 Fetching menus for role: ...');
    console.log('     📡 Menu API response status: ...');
    console.log('     📋 Menu data received: ...');
    console.log('     ✅ Menus saved to localStorage');
    console.log('');
    
    console.log('Step 3: Check localStorage');
    console.log('   - Open DevTools → Application → Local Storage');
    console.log('   - Look for keys:');
    console.log('     • accessible-menus (array of menu objects)');
    console.log('     • menus-role (user role string)');
    console.log('   - Or run in Console:');
    console.log('     localStorage.getItem("accessible-menus")');
    console.log('     localStorage.getItem("menus-role")');
    console.log('');
    
    console.log('Step 4: Verify sidebar');
    console.log('   - Check sidebar shows correct menus');
    console.log('   - Refresh page');
    console.log('   - Sidebar should load instantly (from localStorage)');
    console.log('');
    
    console.log('Expected localStorage content:');
    console.log('```javascript');
    console.log('// Key: accessible-menus');
    console.log('[');
    console.log('  {');
    console.log('    "id": 1,');
    console.log('    "name": "home",');
    console.log('    "label": "Dashboard",');
    console.log('    "icon": "LayoutDashboard",');
    console.log('    "href": "/dashboard/home",');
    console.log('    "order_index": 1,');
    console.log('    "is_active": true,');
    console.log('    "roles": ["superadmin", "staff", "teacher", "parent"]');
    console.log('  },');
    console.log('  // ... more menus');
    console.log(']');
    console.log('');
    console.log('// Key: menus-role');
    console.log('"staff"  // or "superadmin", "teacher", "parent"');
    console.log('```');
    console.log('');

    console.log('🔍 Troubleshooting:\n');
    console.log('If localStorage is empty after login:');
    console.log('1. Check Console for error messages');
    console.log('2. Check Network tab for /api/dashboard/menu call');
    console.log('3. Verify menu API returns data (run this script)');
    console.log('4. Check if menu table has data in database');
    console.log('5. Verify user.role is correct');
    console.log('');

    console.log('✅ API tests complete!');
    console.log('📝 Now test manually by logging in and checking localStorage');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMenuLocalStorage();
