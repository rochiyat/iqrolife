// Manual LocalStorage Fix
// Copy-paste this entire code to browser console (F12) after login

(async function manualLocalStorageFix() {
  console.log('🔧 Manual LocalStorage Fix\n');

  // Step 1: Get current user role from cookie
  console.log('1️⃣ Getting user role from cookie...');
  let userRole = null;
  
  try {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((c) => c.trim().startsWith('auth-token='));
    
    if (authCookie) {
      const value = authCookie.split('=')[1];
      const user = JSON.parse(decodeURIComponent(value));
      userRole = user.role;
      console.log('   ✅ User role:', userRole);
    } else {
      console.error('   ❌ No auth cookie found. Please login first!');
      return;
    }
  } catch (error) {
    console.error('   ❌ Error parsing cookie:', error);
    return;
  }

  // Step 2: Fetch menus from API
  console.log('\n2️⃣ Fetching menus from API...');
  
  try {
    const response = await fetch(`/api/dashboard/menu?role=${userRole}`);
    console.log('   📡 API Status:', response.status);
    
    if (!response.ok) {
      console.error('   ❌ API failed:', response.status);
      return;
    }
    
    const data = await response.json();
    console.log('   ✅ API Success');
    console.log('   📋 Menus received:', data.total, 'items');
    console.log('   Menu names:', data.data.map(m => m.name).join(', '));
    
    // Step 3: Save to localStorage
    console.log('\n3️⃣ Saving to localStorage...');
    
    localStorage.setItem('accessible-menus', JSON.stringify(data.data));
    localStorage.setItem('menus-role', userRole);
    
    console.log('   ✅ Saved to localStorage');
    console.log('   - accessible-menus:', data.data.length, 'items');
    console.log('   - menus-role:', userRole);
    
    // Step 4: Verify
    console.log('\n4️⃣ Verifying...');
    
    const storedMenus = localStorage.getItem('accessible-menus');
    const storedRole = localStorage.getItem('menus-role');
    
    if (storedMenus && storedRole) {
      console.log('   ✅ Verification successful!');
      console.log('   - accessible-menus: exists (' + JSON.parse(storedMenus).length + ' items)');
      console.log('   - menus-role:', storedRole);
      
      console.log('\n✅ Fix complete! Reloading page...');
      setTimeout(() => location.reload(), 1000);
    } else {
      console.error('   ❌ Verification failed!');
    }
    
  } catch (error) {
    console.error('   ❌ Error:', error);
  }
})();
