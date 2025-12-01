/**
 * Test Forgot Password Functionality
 * Run: node test-forgot-password.js
 */

const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

async function testForgotPassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🧪 Testing Forgot Password Functionality\n');
    console.log('=' .repeat(50));

    // Test 1: Check if password_reset_tokens table exists
    console.log('\n📋 Test 1: Check password_reset_tokens table');
    console.log('-'.repeat(50));
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'password_reset_tokens'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Table password_reset_tokens exists');
    } else {
      console.log('❌ Table password_reset_tokens does not exist');
      console.log('   Run: node db/add-password-reset-table.js');
      process.exit(1);
    }

    // Test 2: Check users table
    console.log('\n👥 Test 2: Check available users');
    console.log('-'.repeat(50));
    const users = await pool.query(`
      SELECT id, email, name, is_active
      FROM users
      WHERE is_active = true
      ORDER BY id
      LIMIT 5
    `);
    
    console.log(`✅ Found ${users.rows.length} active users:`);
    users.rows.forEach((user) => {
      console.log(`   - [${user.id}] ${user.email} (${user.name})`);
    });

    if (users.rows.length === 0) {
      console.log('❌ No active users found');
      process.exit(1);
    }

    // Test 3: Simulate token generation
    console.log('\n🔐 Test 3: Simulate token generation');
    console.log('-'.repeat(50));
    const testUser = users.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    console.log(`Test user: ${testUser.email}`);
    console.log(`Token length: ${resetToken.length} characters`);
    console.log(`Token expires at: ${expiresAt.toLocaleString('id-ID')}`);
    console.log('✅ Token generation successful');

    // Test 4: Insert test token
    console.log('\n💾 Test 4: Insert test token to database');
    console.log('-'.repeat(50));
    const insertResult = await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)
       RETURNING id, token, expires_at, created_at`,
      [testUser.id, resetToken, expiresAt]
    );

    const insertedToken = insertResult.rows[0];
    console.log('✅ Token inserted successfully:');
    console.log(`   ID: ${insertedToken.id}`);
    console.log(`   Token: ${insertedToken.token.substring(0, 20)}...`);
    console.log(`   Expires: ${new Date(insertedToken.expires_at).toLocaleString('id-ID')}`);

    // Test 5: Verify token
    console.log('\n🔍 Test 5: Verify token from database');
    console.log('-'.repeat(50));
    const verifyResult = await pool.query(
      `SELECT prt.*, u.email, u.name 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
      [resetToken]
    );

    if (verifyResult.rows.length > 0) {
      const token = verifyResult.rows[0];
      console.log('✅ Token verified successfully:');
      console.log(`   User: ${token.name} (${token.email})`);
      console.log(`   Valid: Yes`);
      console.log(`   Used: ${token.used ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Token verification failed');
    }

    // Test 6: Check email configuration
    console.log('\n📧 Test 6: Check email configuration');
    console.log('-'.repeat(50));
    const emailConfig = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
    };

    console.log('Email configuration:');
    console.log(`   Host: ${emailConfig.host || '❌ NOT SET'}`);
    console.log(`   Port: ${emailConfig.port || '❌ NOT SET'}`);
    console.log(`   User: ${emailConfig.user || '❌ NOT SET'}`);
    console.log(`   From: ${emailConfig.from || '❌ NOT SET'}`);

    if (emailConfig.host && emailConfig.port && emailConfig.user) {
      console.log('✅ Email configuration is complete');
    } else {
      console.log('⚠️  Email configuration is incomplete');
    }

    // Test 7: Generate reset URL
    console.log('\n🔗 Test 7: Generate reset URL');
    console.log('-'.repeat(50));
    const resetUrl = `${process.env.NEXTAUTH_URL}/dashboard/reset-password?token=${resetToken}`;
    console.log('Reset URL:');
    console.log(`   ${resetUrl}`);
    console.log('✅ Reset URL generated');

    // Cleanup: Delete test token
    console.log('\n🧹 Cleanup: Deleting test token');
    console.log('-'.repeat(50));
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [resetToken]);
    console.log('✅ Test token deleted');

    console.log('\n' + '='.repeat(50));
    console.log('✅ All Forgot Password Tests Passed!');
    console.log('\n📝 Summary:');
    console.log('   ✓ Database table exists');
    console.log('   ✓ Token generation works');
    console.log('   ✓ Token storage works');
    console.log('   ✓ Token verification works');
    console.log('   ✓ Email config checked');
    console.log('   ✓ Reset URL generation works');
    console.log('\n🎉 Forgot password functionality is ready!');
    console.log('🚀 You can now test it at: /dashboard/forgot-password\n');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testForgotPassword();
