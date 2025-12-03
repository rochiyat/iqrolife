/**
 * Update User Passwords to Bcrypt Hash
 * Run: node db/update-user-passwords.js
 */

const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function updateUserPasswords() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔐 Updating User Passwords to Bcrypt Hash\n');
    console.log('=' .repeat(50));

    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all users
    console.log('📋 Fetching users...');
    const users = await client.query('SELECT id, email, name, password FROM users');
    console.log(`Found ${users.rows.length} users\n`);

    // Check if passwords are already hashed
    console.log('🔍 Checking password format...\n');
    
    const updates = [];
    
    for (const user of users.rows) {
      // Bcrypt hashes start with $2b$ or $2a$ and are 60 characters long
      const isBcryptHash = user.password.startsWith('$2') && user.password.length === 60;
      
      if (isBcryptHash) {
        console.log(`✅ [${user.id}] ${user.email} - Already hashed`);
      } else {
        console.log(`⚠️  [${user.id}] ${user.email} - Plain text detected`);
        updates.push(user);
      }
    }

    if (updates.length === 0) {
      console.log('\n✅ All passwords are already hashed!');
      console.log('No updates needed.\n');
      return;
    }

    console.log(`\n📝 Found ${updates.length} users with plain text passwords`);
    console.log('Updating to bcrypt hash...\n');

    // Default password for existing users
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    console.log('Default password: password123');
    console.log(`Bcrypt hash: ${hashedPassword}\n`);

    // Update each user
    for (const user of updates) {
      await client.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, user.id]
      );
      console.log(`✅ Updated: [${user.id}] ${user.email}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Password Update Complete!');
    console.log('\n📝 Summary:');
    console.log(`   Total users: ${users.rows.length}`);
    console.log(`   Already hashed: ${users.rows.length - updates.length}`);
    console.log(`   Updated: ${updates.length}`);
    console.log('\n🔐 Default password for all users: password123');
    console.log('⚠️  Users should change their password after first login\n');

    // Verify updates
    console.log('🔍 Verifying updates...\n');
    const verifyResult = await client.query('SELECT id, email, password FROM users');
    
    let allHashed = true;
    for (const user of verifyResult.rows) {
      const isBcryptHash = user.password.startsWith('$2') && user.password.length === 60;
      if (!isBcryptHash) {
        console.log(`❌ [${user.id}] ${user.email} - Still not hashed!`);
        allHashed = false;
      }
    }

    if (allHashed) {
      console.log('✅ All passwords are now properly hashed!\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

updateUserPasswords();
