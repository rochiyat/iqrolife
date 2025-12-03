/**
 * Fix User Passwords - Set to password123
 * Run: node db/fix-user-passwords.js
 */

const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function fixUserPasswords() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔧 Fixing User Passwords\n');
    console.log('=' .repeat(50));

    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all users
    console.log('📋 Fetching users...');
    const users = await client.query('SELECT id, email, name, role FROM users');
    console.log(`Found ${users.rows.length} users\n`);

    // Generate new password hash
    const newPassword = 'password123';
    console.log(`🔐 Generating bcrypt hash for: ${newPassword}`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`✅ Hash generated: ${hashedPassword.substring(0, 30)}...\n`);

    // Verify the hash works
    console.log('🔍 Verifying hash...');
    const testVerify = await bcrypt.compare(newPassword, hashedPassword);
    if (testVerify) {
      console.log('✅ Hash verification successful\n');
    } else {
      console.log('❌ Hash verification failed!');
      process.exit(1);
    }

    // Update all users
    console.log('📝 Updating all users...\n');
    
    for (const user of users.rows) {
      await client.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, user.id]
      );
      console.log(`✅ Updated: [${user.id}] ${user.email} (${user.role})`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Password Update Complete!');
    console.log('\n📝 All users now have password: password123');
    console.log('\n🔐 Login Credentials:\n');
    
    users.rows.forEach((user) => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: password123`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    // Final verification
    console.log('=' .repeat(50));
    console.log('🧪 Final Verification\n');
    
    const verifyUsers = await client.query('SELECT id, email, password FROM users LIMIT 1');
    const testUser = verifyUsers.rows[0];
    
    console.log(`Testing: ${testUser.email}`);
    const finalVerify = await bcrypt.compare('password123', testUser.password);
    
    if (finalVerify) {
      console.log('✅ Password verification successful!');
      console.log('\n🎉 All users can now login with password: password123\n');
    } else {
      console.log('❌ Password verification failed!');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

fixUserPasswords();
