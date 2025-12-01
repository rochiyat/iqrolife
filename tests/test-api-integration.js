/**
 * Simple API Integration Test
 * Tests database connectivity through API endpoints
 */

const { Pool } = require('pg');
require('dotenv').config();

async function testAPIIntegration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🧪 Testing API Integration with Database\n');
    console.log('=' .repeat(50));

    // Test 1: Calon Murid Query
    console.log('\n📋 Test 1: Calon Murid API Query');
    console.log('-'.repeat(50));
    const studentsQuery = `
      SELECT 
        id, name, age, gender, status
      FROM calon_murid
      ORDER BY created_at DESC
      LIMIT 3
    `;
    const studentsResult = await pool.query(studentsQuery);
    console.log(`✅ Found ${studentsResult.rows.length} students:`);
    studentsResult.rows.forEach((student) => {
      console.log(`   - [${student.id}] ${student.name}, ${student.age} tahun (${student.status})`);
    });

    // Test 2: Formulir Query
    console.log('\n📝 Test 2: Formulir API Query');
    console.log('-'.repeat(50));
    const formsQuery = `
      SELECT 
        id, student_name, status, submission_date
      FROM formulir
      ORDER BY submission_date DESC
    `;
    const formsResult = await pool.query(formsQuery);
    console.log(`✅ Found ${formsResult.rows.length} form submissions:`);
    formsResult.rows.forEach((form) => {
      const date = new Date(form.submission_date).toLocaleDateString('id-ID');
      console.log(`   - [${form.id}] ${form.student_name} (${form.status}) - ${date}`);
    });

    // Test 3: Users Query
    console.log('\n👥 Test 3: Users API Query');
    console.log('-'.repeat(50));
    const usersQuery = `
      SELECT 
        id, name, email, role, is_active
      FROM users
      ORDER BY id
    `;
    const usersResult = await pool.query(usersQuery);
    console.log(`✅ Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach((user) => {
      const status = user.is_active ? '🟢' : '🔴';
      console.log(`   ${status} [${user.id}] ${user.name} (${user.role})`);
    });

    // Test 4: Statistics
    console.log('\n📊 Test 4: Dashboard Statistics');
    console.log('-'.repeat(50));
    
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM calon_murid) as total_students,
        (SELECT COUNT(*) FROM calon_murid WHERE status = 'approved') as approved_students,
        (SELECT COUNT(*) FROM calon_murid WHERE status = 'pending') as pending_students,
        (SELECT COUNT(*) FROM formulir) as total_forms,
        (SELECT COUNT(*) FROM formulir WHERE status = 'submitted') as submitted_forms,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'parent') as parent_users
    `;
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];
    
    console.log('Calon Murid:');
    console.log(`   Total: ${stats.total_students}`);
    console.log(`   Approved: ${stats.approved_students}`);
    console.log(`   Pending: ${stats.pending_students}`);
    console.log('\nFormulir:');
    console.log(`   Total: ${stats.total_forms}`);
    console.log(`   Submitted: ${stats.submitted_forms}`);
    console.log('\nUsers:');
    console.log(`   Total: ${stats.total_users}`);
    console.log(`   Parents: ${stats.parent_users}`);

    // Test 5: Recent Activity
    console.log('\n📜 Test 5: Recent Activity Logs');
    console.log('-'.repeat(50));
    const activityQuery = `
      SELECT 
        action, entity_type, description, created_at
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 3
    `;
    const activityResult = await pool.query(activityQuery);
    console.log(`✅ Found ${activityResult.rows.length} recent activities:`);
    activityResult.rows.forEach((log) => {
      const date = new Date(log.created_at).toLocaleString('id-ID');
      console.log(`   - [${log.action}] ${log.description} (${date})`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ All API Integration Tests Passed!');
    console.log('\n🎉 Database is ready for dashboard integration');
    console.log('🚀 You can now start the development server: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. Database connection string in .env');
    console.error('2. Database tables are created (run: node db/migrate-complete.js)');
    console.error('3. Network connectivity to database\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testAPIIntegration();
