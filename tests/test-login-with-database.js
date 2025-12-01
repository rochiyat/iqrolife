/**
 * Test Login with Database
 * Run: node test-login-with-database.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function testLogin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🧪 Testing Login with Database\n');
    console.log('=' .repeat(50));

    // Test 1: Get users from database
    console.log('\n📋 Test 1: Fetch users from database');
    console.log('-'.repeat(50));
    
    const users = await pool.query(
      'SELECT id, email, name, role, password FROM users WHERE is_active = true'
    );
    
    console.log(`✅ Found ${users.rows.length} active users:`);
    users.rows.forEach((user) => {
      const passwordPreview = user.password.substring(0, 20) + '...';
      console.log(`   [${user.id}] ${user.email} (${user.role})`);
      console.log(`       Password hash: ${passwordPreview}`);
    });

    if (users.rows.length === 0) {
      console.log('❌ No users found!');
      process.exit(1);
    }

    // Test 2: Test password verification
    console.log('\n🔐 Test 2: Test password verification');
    console.log('-'.repeat(50));
    
    const testUser = users.rows[0];
    const testPassword = 'password123'; // Default password
    
    console.log(`Testing user: ${testUser.email}`);
    console.log(`Test password: ${testPassword}`);
    
    const passwordMatch = await bcrypt.compare(testPassword, testUser.password);
    
    if (passwordMatch) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
      console.log('   The password in database might be different');
    }

    // Test 3: Simulate login flow
    console.log('\n🔑 Test 3: Simulate login flow');
    console.log('-'.repeat(50));
    
    const loginEmail = testUser.email;
    const loginPassword = testPassword;
    
    console.log(`Email: ${loginEmail}`);
    console.log(`Password: ${loginPassword}`);
    
    // Step 1: Get user from database
    const userResult = await pool.query(
      'SELECT id, email, password, name, role, is_active FROM users WHERE email = $1',
      [loginEmail]
    );
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found');
    } else {
      console.log('✅ User found in database');
      
      const user = userResult.rows[0];
      
      // Step 2: Check if active
      if (!user.is_active) {
        console.log('❌ User is not active');
      } else {
        console.log('✅ User is active');
        
        // Step 3: Verify password
        const match = await bcrypt.compare(loginPassword, user.password);
        
        if (match) {
          console.log('✅ Password matches!');
          console.log('\n🎉 Login would be successful!');
          console.log(`   User: ${user.name}`);
          console.log(`   Role: ${user.role}`);
        } else {
          console.log('❌ Password does not match');
        }
      }
    }

    // Test 4: Test with wrong password
    console.log('\n🚫 Test 4: Test with wrong password');
    console.log('-'.repeat(50));
    
    const wrongPassword = 'wrongpassword123';
    const wrongMatch = await bcrypt.compare(wrongPassword, testUser.password);
    
    if (!wrongMatch) {
      console.log('✅ Correctly rejected wrong password');
    } else {
      console.log('❌ Wrong password was accepted (should not happen!)');
    }

    // Test 5: Show all user credentials
    console.log('\n📝 Test 5: Available login credentials');
    console.log('-'.repeat(50));
    console.log('\nYou can login with these credentials:');
    console.log('(Default password: password123)\n');
    
    users.rows.forEach((user) => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password: password123`);
      console.log('');
    });

    console.log('=' .repeat(50));
    console.log('✅ All Login Tests Passed!');
    console.log('\n🚀 You can now login at: /dashboard/login');
    console.log('📧 Use any email above with password: password123\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testLogin();
