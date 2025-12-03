const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  console.log('🔍 Checking users-roles relationship\n');

  // Check columns
  const cols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name='users' AND column_name LIKE '%role%'
  `);
  console.log('Role columns in users:');
  cols.rows.forEach((c) => console.log(`  - ${c.column_name} (${c.data_type})`));
  console.log('');

  // Check FK constraints
  const fks = await pool.query(`
    SELECT
      tc.constraint_name,
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'users'
      AND kcu.column_name LIKE '%role%'
  `);

  if (fks.rows.length > 0) {
    console.log('✅ Foreign key exists:');
    fks.rows.forEach((fk) => {
      console.log(`  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
  } else {
    console.log('❌ No foreign key constraint found');
    console.log('   users.role is VARCHAR, not FK to roles table');
  }

  await pool.end();
})();
