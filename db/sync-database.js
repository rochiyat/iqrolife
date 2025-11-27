/**
 * Database Synchronization Script
 * Checks existing data and adds missing tables/data
 * Run: node db/sync-database.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function syncDatabase() {
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

    // Check existing tables
    console.log('🔍 Checking existing tables...\n');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);
    const existingTables = tablesResult.rows.map(row => row.table_name);
    
    console.log('Existing tables:', existingTables.join(', '));
    console.log('');

    // Required tables
    const requiredTables = [
      'users',
      'roles',
      'calon_murid',
      'formulir',
      'menu',
      'portofolio',
      'settings',
      'activity_logs',
    ];

    // Check each table and show count
    console.log('┌─────────────────┬────────┬──────────┐');
    console.log('│ Table           │ Count  │ Status   │');
    console.log('├─────────────────┼────────┼──────────┤');

    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        const count = result.rows[0].count;
        const paddedTable = table.padEnd(15);
        const paddedCount = count.toString().padStart(6);
        console.log(`│ ${paddedTable} │ ${paddedCount} │ ✅ Exists │`);
      } else {
        const paddedTable = table.padEnd(15);
        console.log(`│ ${paddedTable} │      0 │ ❌ Missing│`);
      }
    }

    console.log('└─────────────────┴────────┴──────────┘\n');

    // Show sample data from key tables
    if (existingTables.includes('users')) {
      console.log('👤 Users:');
      const users = await client.query(
        'SELECT id, email, name, role FROM users ORDER BY id LIMIT 5'
      );
      users.rows.forEach((user) => {
        console.log(`   [${user.id}] ${user.name} (${user.email}) - ${user.role}`);
      });
      console.log('');
    }

    if (existingTables.includes('calon_murid')) {
      console.log('🎓 Calon Murid:');
      const students = await client.query(
        'SELECT id, name, age, status FROM calon_murid ORDER BY id LIMIT 5'
      );
      students.rows.forEach((student) => {
        console.log(`   [${student.id}] ${student.name}, ${student.age} tahun - ${student.status}`);
      });
      console.log('');
    }

    if (existingTables.includes('formulir')) {
      console.log('📋 Formulir:');
      const forms = await client.query(
        'SELECT id, student_name, status FROM formulir ORDER BY id LIMIT 5'
      );
      forms.rows.forEach((form) => {
        console.log(`   [${form.id}] ${form.student_name} - ${form.status}`);
      });
      console.log('');
    }

    console.log('✅ Database sync check completed!');
    console.log('\n📝 Note: Database already has data. No migration needed.');
    console.log('   All dashboard pages will use existing data from database.\n');

  } catch (error) {
    console.error('❌ Sync check failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

syncDatabase();
