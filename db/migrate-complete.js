/**
 * Complete Database Migration Script
 * Run: node db/migrate-complete.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runCompleteMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read and execute complete schema
    console.log('📋 Running complete schema migration...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema-complete.sql'),
      'utf8'
    );
    await client.query(schemaSQL);
    console.log('✅ Complete schema created successfully\n');

    // Read and execute complete seed data
    console.log('🌱 Seeding complete data...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'seed-complete.sql'),
      'utf8'
    );
    await client.query(seedSQL);
    console.log('✅ Complete data seeded successfully\n');

    // Verify all tables
    console.log('🔍 Verifying all tables...\n');
    
    const tables = [
      'users',
      'roles',
      'calon_murid',
      'formulir',
      'menu',
      'portofolio',
      'settings',
      'activity_logs',
    ];

    console.log('┌─────────────────┬────────┐');
    console.log('│ Table           │ Count  │');
    console.log('├─────────────────┼────────┤');

    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      const count = result.rows[0].count;
      const paddedTable = table.padEnd(15);
      const paddedCount = count.toString().padStart(6);
      console.log(`│ ${paddedTable} │ ${paddedCount} │`);
    }

    console.log('└─────────────────┴────────┘\n');

    // Show sample data
    console.log('📊 Sample Data:\n');

    console.log('👤 Users:');
    const users = await client.query(
      'SELECT email, name, role FROM users ORDER BY id LIMIT 4'
    );
    users.rows.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\n🎓 Calon Murid:');
    const students = await client.query(
      'SELECT name, age, status FROM calon_murid ORDER BY id LIMIT 3'
    );
    students.rows.forEach((student) => {
      console.log(`   - ${student.name}, ${student.age} tahun - ${student.status}`);
    });

    console.log('\n📋 Menu Items:');
    const menus = await client.query(
      'SELECT label, href FROM menu ORDER BY order_index LIMIT 5'
    );
    menus.rows.forEach((menu) => {
      console.log(`   - ${menu.label} → ${menu.href}`);
    });

    console.log('\n🎉 Complete migration finished successfully!');
    console.log('\n📝 Default Login Credentials:');
    console.log('   Superadmin: admin@iqrolife.com / password123');
    console.log('   Staff:      staff@iqrolife.com / password123');
    console.log('   Teacher:    teacher@iqrolife.com / password123');
    console.log('   Parent:     parent@iqrolife.com / password123');
    console.log('\n⚠️  IMPORTANT: Change these passwords in production!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

runCompleteMigration();
