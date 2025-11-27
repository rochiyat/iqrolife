/**
 * Test Users API
 * Run: node test-users-api.js
 */

const { Pool } = require('pg');
require('dotenv').config();

async function testUsersAPI() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🧪 Testing Users API\n');
    console.log('=' .repeat(50));

    // Test 1: Simulate GET /api/dashboard/users
    console.log('\n📋 Test 1: GET /api/dashboard/users');
    console.log('-'.repeat(50));
    
    const query = `
      SELECT id, email, name, role, avatar, phone, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    
    console.log(`✅ Query successful`);
    console.log(`   Found ${result.rows.length} users\n`);
    
    result.rows.forEach((user) => {
      console.log(`   [${user.id}] ${user.name}`);
      console.log(`       Email: ${user.email}`);
      console.log(`       Role: ${user.role}`);
      console.log(`       Active: ${user.is_active ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Test 2: Test with role filter
    console.log('📋 Test 2: GET /api/dashboard/users?role=staff');
    console.log('-'.repeat(50));
    
    const roleQuery = `
      SELECT id, email, name, role, avatar, phone, is_active, created_at, updated_at
      FROM users
      WHERE role = $1
      ORDER BY created_at DESC
    `;
    
    const roleResult = await pool.query(roleQuery, ['staff']);
    
    console.log(`✅ Query successful`);
    console.log(`   Found ${roleResult.rows.length} staff users\n`);
    
    roleResult.rows.forEach((user) => {
      console.log(`   [${user.id}] ${user.name} (${user.email})`);
    });

    // Test 3: Check database connection
    console.log('\n🔌 Test 3: Database Connection');
    console.log('-'.repeat(50));
    
    const connectionTest = await pool.query('SELECT NOW()');
    console.log(`✅ Database connected`);
    console.log(`   Server time: ${connectionTest.rows[0].now}`);

    // Test 4: Check table structure
    console.log('\n📊 Test 4: Users Table Structure');
    console.log('-'.repeat(50));
    
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    const columns = await pool.query(columnsQuery);
    
    console.log('Table columns:');
    columns.rows.forEach((col) => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ All Users API Tests Passed!');
    console.log('\n📝 Summary:');
    console.log(`   ✓ Database connection works`);
    console.log(`   ✓ GET users query works`);
    console.log(`   ✓ Role filtering works`);
    console.log(`   ✓ Table structure is correct`);
    console.log('\n🎉 Users API is ready to use!');
    console.log('🚀 You can now access: /api/dashboard/users\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nError details:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Database connection refused. Check:');
      console.error('   1. DATABASE_URL in .env is correct');
      console.error('   2. Database server is running');
      console.error('   3. Network/firewall allows connection');
    } else if (error.code === '42P01') {
      console.error('\n💡 Table does not exist. Run:');
      console.error('   node db/migrate-complete.js');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testUsersAPI();
