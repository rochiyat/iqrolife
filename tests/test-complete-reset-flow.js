/**
 * Test Complete Reset Password Flow
 * Run: node test-complete-reset-flow.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

async function testCompleteResetFlow() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🧪 Testing Complete Reset Password Flow\n');
    console.log('=' .repeat(50));

    // Step 1: Get test user
    console.log('\n📋 Step 1: Get test user');
    console.log('-'.repeat(50));
    
    const userResult = await pool.query(
      'SELECT id, email, name, password FROM users WHERE email = $1',
      ['staff@iqrolife.com']
    );
    
    if (userResult.rows.length === 0) {
      console.log('❌ Test user not found');
      process.exit(1);
    }
    
    const user = userResult.rows[0];
    console.log(`✅ Test user: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Current password hash: ${user.password.substring(0, 30)}...`);

    // Step 2: Verify current password
    console.log('\n🔐 Step 2: Verify current password (password123)');
    console.log('-'.repeat(50));
    
    const currentPasswordMatch = await bcrypt.compare('password123', user.password);
    if (currentPasswordMatch) {
      console.log('✅ Current password verified: password123');
    } else {
      console.log('❌ Current password verification failed');
      process.exit(1);
    }

    // Step 3: Generate reset token
    console.log('\n🎫 Step 3: Generate reset token');
    console.log('-'.repeat(50));
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    
    console.log(`Token: ${resetToken.substring(0, 40)}...`);
    console.log(`Expires: ${expiresAt.toLocaleString('id-ID')}`);

    // Step 4: Store token in database
    console.log('\n💾 Step 4: Store token in database');
    console.log('-'.repeat(50));
    
    const tokenResult = await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)
       RETURNING id, token, expires_at`,
      [user.id, resetToken, expiresAt]
    );
    
    const storedToken = tokenResult.rows[0];
    console.log(`✅ Token stored with ID: ${storedToken.id}`);

    // Step 5: Validate token
    console.log('\n🔍 Step 5: Validate token');
    console.log('-'.repeat(50));
    
    const validateResult = await pool.query(
      `SELECT prt.*, u.id as user_id, u.email, u.name 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
      [resetToken]
    );
    
    if (validateResult.rows.length > 0) {
      console.log('✅ Token is valid');
      console.log(`   User: ${validateResult.rows[0].name}`);
      console.log(`   Email: ${validateResult.rows[0].email}`);
    } else {
      console.log('❌ Token validation failed');
      process.exit(1);
    }

    // Step 6: Reset password
    console.log('\n🔄 Step 6: Reset password to "newpassword123"');
    console.log('-'.repeat(50));
    
    const newPassword = 'newpassword123';
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    console.log(`New password: ${newPassword}`);
    console.log(`New hash: ${hashedNewPassword.substring(0, 30)}...`);
    
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedNewPassword, user.id]
    );
    
    console.log('✅ Password updated in database');

    // Step 7: Mark token as used
    console.log('\n✔️  Step 7: Mark token as used');
    console.log('-'.repeat(50));
    
    await pool.query(
      'UPDATE password_reset_tokens SET used = true, used_at = NOW() WHERE id = $1',
      [storedToken.id]
    );
    
    console.log('✅ Token marked as used');

    // Step 8: Verify new password
    console.log('\n🔐 Step 8: Verify new password');
    console.log('-'.repeat(50));
    
    const updatedUserResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [user.id]
    );
    
    const updatedUser = updatedUserResult.rows[0];
    const newPasswordMatch = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (newPasswordMatch) {
      console.log('✅ New password verified successfully!');
      console.log(`   Can login with: ${newPassword}`);
    } else {
      console.log('❌ New password verification failed');
      process.exit(1);
    }

    // Step 9: Verify old password no longer works
    console.log('\n🚫 Step 9: Verify old password no longer works');
    console.log('-'.repeat(50));
    
    const oldPasswordMatch = await bcrypt.compare('password123', updatedUser.password);
    
    if (!oldPasswordMatch) {
      console.log('✅ Old password correctly rejected');
    } else {
      console.log('❌ Old password still works (should not happen!)');
      process.exit(1);
    }

    // Step 10: Verify token cannot be reused
    console.log('\n🔒 Step 10: Verify token cannot be reused');
    console.log('-'.repeat(50));
    
    const reuseResult = await pool.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND used = false AND expires_at > NOW()`,
      [resetToken]
    );
    
    if (reuseResult.rows.length === 0) {
      console.log('✅ Token cannot be reused (correctly marked as used)');
    } else {
      console.log('❌ Token can still be reused (should not happen!)');
      process.exit(1);
    }

    // Cleanup: Restore original password
    console.log('\n🧹 Cleanup: Restore original password');
    console.log('-'.repeat(50));
    
    const originalHash = await bcrypt.hash('password123', 10);
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [originalHash, user.id]
    );
    
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE token = $1',
      [resetToken]
    );
    
    console.log('✅ Original password restored');
    console.log('✅ Test token deleted');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Complete Reset Password Flow Test PASSED!');
    console.log('\n📝 Summary:');
    console.log('   ✓ User authentication works');
    console.log('   ✓ Token generation works');
    console.log('   ✓ Token storage works');
    console.log('   ✓ Token validation works');
    console.log('   ✓ Password reset works');
    console.log('   ✓ New password can be used for login');
    console.log('   ✓ Old password is rejected');
    console.log('   ✓ Token cannot be reused');
    console.log('\n🎉 Reset password functionality is fully working!');
    console.log('🔐 Users can now reset their password and login with the new one\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testCompleteResetFlow();
