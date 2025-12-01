/**
 * Test Portfolio API with calon_murid data
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testPortfolioAPI() {
  console.log('🧪 Testing Portfolio API with calon_murid data\n');

  try {
    // Simulate the API query
    const query = `
      SELECT 
        cm.id,
        cm.name as student_name,
        cm.birth_date,
        cm.age,
        cm.gender,
        cm.parent_name,
        cm.phone as parent_phone,
        cm.email as parent_email,
        cm.address,
        cm.previous_school,
        cm.status,
        cm.notes as review_notes,
        cm.registration_date,
        cm.user_id,
        cm.formulir_pendaftaran_id,
        u.name as user_parent_name,
        u.email as user_email,
        u.phone as user_phone,
        cm.created_at,
        cm.updated_at,
        fp.program_yang_dipilih as program
      FROM calon_murid cm
      LEFT JOIN users u ON cm.user_id = u.id
      LEFT JOIN formulir_pendaftaran fp ON cm.formulir_pendaftaran_id = fp.id
      ORDER BY cm.registration_date DESC
    `;

    const result = await pool.query(query);

    console.log(`📊 Total Records: ${result.rows.length}\n`);

    if (result.rows.length === 0) {
      console.log('⚠️  No data found in calon_murid table\n');
      console.log('💡 Run: node link-sample-data.js to link data');
      return;
    }

    console.log('📋 Sample Data:\n');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.student_name}`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Age: ${row.age} years`);
      console.log(`   Gender: ${row.gender}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   Program: ${row.program || 'N/A'}`);
      console.log(`   Parent: ${row.parent_name}`);
      console.log(`   User ID: ${row.user_id || 'NULL'}`);
      console.log(
        `   Linked User: ${row.user_parent_name || 'N/A'} (${row.user_email || 'N/A'})`
      );
      console.log(`   Registration: ${row.registration_date}`);
      console.log('');
    });

    // Test with parent filter
    console.log('🔍 Testing Parent Filter (user_id = 4):\n');
    const parentQuery = `
      SELECT 
        cm.id,
        cm.name as student_name,
        cm.status,
        u.name as parent_name
      FROM calon_murid cm
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE cm.user_id = 4
    `;

    const parentResult = await pool.query(parentQuery);
    console.log(`   Found: ${parentResult.rows.length} students\n`);

    if (parentResult.rows.length > 0) {
      parentResult.rows.forEach((row) => {
        console.log(`   ✅ ${row.student_name} (${row.status})`);
      });
      console.log('');
    }

    // Check data completeness
    console.log('📈 Data Completeness:\n');
    const stats = {
      total: result.rows.length,
      withUserId: result.rows.filter((r) => r.user_id).length,
      withProgram: result.rows.filter((r) => r.program).length,
      withFormulir: result.rows.filter((r) => r.formulir_pendaftaran_id)
        .length,
      approved: result.rows.filter((r) => r.status === 'approved').length,
      enrolled: result.rows.filter((r) => r.status === 'enrolled').length,
      pending: result.rows.filter((r) => r.status === 'pending').length,
    };

    console.log(`   Total: ${stats.total}`);
    console.log(`   With user_id: ${stats.withUserId} (${Math.round((stats.withUserId / stats.total) * 100)}%)`);
    console.log(`   With program: ${stats.withProgram} (${Math.round((stats.withProgram / stats.total) * 100)}%)`);
    console.log(`   With formulir link: ${stats.withFormulir} (${Math.round((stats.withFormulir / stats.total) * 100)}%)`);
    console.log('');
    console.log('   Status breakdown:');
    console.log(`   - Approved: ${stats.approved}`);
    console.log(`   - Enrolled: ${stats.enrolled}`);
    console.log(`   - Pending: ${stats.pending}`);
    console.log('');

    console.log('✅ API Test Complete!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Login as parent: parent@iqrolife.com');
    console.log('   3. Navigate to: /dashboard/portofolio');
    console.log(`   4. Should see: ${parentResult.rows.length} students`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testPortfolioAPI();
