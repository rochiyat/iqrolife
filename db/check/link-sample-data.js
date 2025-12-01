/**
 * Link Sample Calon Murid to Parent User
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function linkSampleData() {
  console.log('🔗 Linking Sample Data to Parent User\n');

  try {
    // Get parent user
    const parentResult = await pool.query(
      "SELECT id, email, name FROM users WHERE role = 'parent' LIMIT 1"
    );

    if (parentResult.rows.length === 0) {
      console.log('❌ No parent user found!');
      console.log('💡 Create a parent user first:\n');
      console.log("   INSERT INTO users (email, name, role, password, is_active)");
      console.log("   VALUES ('parent@example.com', 'Parent User', 'parent', 'hashed_password', true);\n");
      return;
    }

    const parent = parentResult.rows[0];
    console.log('✅ Found parent user:');
    console.log(`   ID: ${parent.id}`);
    console.log(`   Email: ${parent.email}`);
    console.log(`   Name: ${parent.name}\n`);

    // Update all calon_murid to link to this parent
    const updateResult = await pool.query(
      'UPDATE calon_murid SET user_id = $1 WHERE user_id IS NULL RETURNING id, name',
      [parent.id]
    );

    console.log(`✅ Linked ${updateResult.rows.length} students to parent:\n`);
    updateResult.rows.forEach((s) => {
      console.log(`   ✓ ${s.name} (ID: ${s.id})`);
    });

    console.log('\n📊 Verification:');
    const verifyResult = await pool.query(`
      SELECT 
        cm.id,
        cm.name as student_name,
        u.name as parent_name,
        u.email as parent_email
      FROM calon_murid cm
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE cm.user_id = $1
    `, [parent.id]);

    console.log(`   Total linked: ${verifyResult.rows.length}`);
    verifyResult.rows.forEach((row) => {
      console.log(`   - ${row.student_name} → ${row.parent_name}`);
    });

    console.log('\n🎉 Sample data successfully linked!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

linkSampleData();
