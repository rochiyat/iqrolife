/**
 * Check User-Child Mapping Status
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkMapping() {
  console.log('🔍 Checking User-Child Mapping Status\n');

  try {
    // Check parent users
    console.log('👥 Parent Users:');
    const usersResult = await pool.query(
      "SELECT id, email, name, role FROM users WHERE role = 'parent' ORDER BY id"
    );

    if (usersResult.rows.length === 0) {
      console.log('   ⚠️  No parent users found!\n');
    } else {
      usersResult.rows.forEach((u) => {
        console.log(`   ID: ${u.id} | Email: ${u.email} | Name: ${u.name}`);
      });
      console.log('');
    }

    // Check calon_murid
    console.log('👶 Calon Murid:');
    const studentsResult = await pool.query(`
      SELECT 
        cm.id,
        cm.name,
        cm.email,
        cm.user_id,
        u.name as parent_name,
        u.email as parent_email
      FROM calon_murid cm
      LEFT JOIN users u ON cm.user_id = u.id
      ORDER BY cm.id
    `);

    if (studentsResult.rows.length === 0) {
      console.log('   ⚠️  No calon murid found!\n');
    } else {
      studentsResult.rows.forEach((s) => {
        const status = s.user_id ? '✅' : '❌';
        console.log(
          `   ${status} ID: ${s.id} | Student: ${s.name} | Email: ${s.email}`
        );
        if (s.user_id) {
          console.log(
            `      → Linked to: ${s.parent_name} (${s.parent_email})`
          );
        } else {
          console.log(`      → Not linked to any user`);
        }
      });
      console.log('');
    }

    // Statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(user_id) as linked,
        COUNT(*) - COUNT(user_id) as unlinked
      FROM calon_murid
    `);

    const stats = statsResult.rows[0];
    console.log('📊 Statistics:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Linked: ${stats.linked} ✅`);
    console.log(`   Unlinked: ${stats.unlinked} ❌\n`);

    // Suggestions
    if (parseInt(stats.unlinked) > 0) {
      console.log('💡 Suggestions:');
      console.log('   1. Create parent users for unlinked students');
      console.log('   2. Or manually update user_id:');
      console.log(
        "      UPDATE calon_murid SET user_id = X WHERE id = Y;\n"
      );
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkMapping();
