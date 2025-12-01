/**
 * Test Cookie-Based Authentication
 * 
 * Script untuk test apakah cookie auth bekerja dengan baik
 * Run: node test-cookie-auth.js
 */

const BASE_URL = 'http://localhost:3000';

async function testCookieAuth() {
  console.log('🧪 Testing Cookie-Based Authentication\n');

  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await fetch(`${BASE_URL}/api/dashboard/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@iqrolife.com',
        password: 'admin123',
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('   User:', loginData.user.name);
    console.log('   Role:', loginData.user.role);

    // Get cookie from response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('   Cookie set:', cookies ? '✅' : '❌');

    if (!cookies) {
      console.error('❌ No cookie set in response');
      return;
    }

    // Extract auth-token cookie
    const authToken = cookies.split(';')[0].split('=')[1];
    console.log('   Auth token length:', authToken.length, 'chars\n');

    // Test 2: Verify cookie contains user data
    console.log('2️⃣ Testing Cookie Content...');
    try {
      const cookieData = JSON.parse(decodeURIComponent(authToken));
      console.log('✅ Cookie parsed successfully');
      console.log('   ID:', cookieData.id);
      console.log('   Email:', cookieData.email);
      console.log('   Name:', cookieData.name);
      console.log('   Role:', cookieData.role);
      console.log('   Active:', cookieData.is_active, '\n');
    } catch (error) {
      console.error('❌ Failed to parse cookie:', error.message);
      return;
    }

    // Test 3: Auth check with cookie
    console.log('3️⃣ Testing Auth Check with Cookie...');
    const authCheckResponse = await fetch(`${BASE_URL}/api/dashboard/login`, {
      headers: {
        Cookie: cookies,
      },
    });

    if (!authCheckResponse.ok) {
      console.error('❌ Auth check failed:', authCheckResponse.status);
      return;
    }

    const authCheckData = await authCheckResponse.json();
    console.log('✅ Auth check successful');
    console.log('   Authenticated:', authCheckData.authenticated);
    console.log('   User:', authCheckData.user.name, '\n');

    // Test 4: Validate session
    console.log('4️⃣ Testing Session Validation...');
    const validateResponse = await fetch(
      `${BASE_URL}/api/dashboard/validate-session`,
      {
        headers: {
          Cookie: cookies,
        },
      }
    );

    if (!validateResponse.ok) {
      console.error('❌ Session validation failed:', validateResponse.status);
      return;
    }

    const validateData = await validateResponse.json();
    console.log('✅ Session validation successful');
    console.log('   Authenticated:', validateData.authenticated);
    console.log('   User:', validateData.user.name, '\n');

    // Test 5: Logout
    console.log('5️⃣ Testing Logout...');
    const logoutResponse = await fetch(`${BASE_URL}/api/dashboard/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookies,
      },
    });

    if (!logoutResponse.ok) {
      console.error('❌ Logout failed:', logoutResponse.status);
      return;
    }

    console.log('✅ Logout successful\n');

    // Summary
    console.log('📊 Test Summary:');
    console.log('✅ All tests passed!');
    console.log('✅ Cookie-based auth working correctly');
    console.log('✅ No unnecessary API calls needed');
    console.log('\n🎉 Cookie authentication is working perfectly!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testCookieAuth();
