const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  console.log('🔍 Verifying user_roles table\n');

  // Check if table exists
  const tableCheck = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='user_roles'
  `);

  if (tableCheck.rows.length > 0) {
    console.log('✅ Table user_roles EXISTS\n');

    // Get columns
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name='user_roles' 
      ORDER BY ordinal_position
    `);

    console.log('📋 Columns:');
    columns.rows.forEach((col) => {
      console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    console.log('');

    // Get FK constraints
    const fks = await pool.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'user_roles'
    `);

    console.log('🔗 Foreign Keys:');
    fks.rows.forEach((fk) => {
      console.log(`   user_roles.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    console.log('');

    // Get data count
    const count = await pool.query('SELECT COUNT(*) as count FROM user_roles');
    console.log(`📊 Total records: ${count.rows[0].count}\n`);

    // Get sample data
    const sample = await pool.query(`
      SELECT 
        ur.id,
        u.email,
        r.name as role_name,
        ur.is_primary
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      JOIN roles r ON ur.role_id = r.id
      ORDER BY u.id, ur.is_primary DESC
      LIMIT 10
    `);

    console.log('📄 Sample Data:');
    sample.rows.forEach((row) => {
      const primary = row.is_primary ? '⭐' : '  ';
      console.log(`   ${primary} ${row.email} → ${row.role_name}`);
    });
    console.log('');

    // Check for users with multiple roles
    const multiRole = await pool.query(`
      SELECT 
        u.email,
        COUNT(ur.role_id) as role_count
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      GROUP BY u.id, u.email
      HAVING COUNT(ur.role_id) > 1
    `);

    if (multiRole.rows.length > 0) {
      console.log('👥 Users with multiple roles:');
      multiRole.rows.forEach((row) => {
        console.log(`   ${row.email} - ${row.role_count} roles`);
      });
    } else {
      console.log('ℹ️  No users with multiple roles yet');
    }
  } else {
    console.log('❌ Table user_roles NOT FOUND');
    console.log('   Run: node run-migration-multiple-roles.js');
  }

  await pool.end();
})();
