require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkConstraints() {
  try {
    console.log('🔍 Checking settings table constraints...\n');

    const result = await pool.query(`
      SELECT 
        constraint_name, 
        constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'settings' 
        AND constraint_type IN ('UNIQUE', 'PRIMARY KEY')
    `);

    console.log('📊 Constraints found:');
    console.table(result.rows);

    // Check if key column has unique constraint
    const uniqueOnKey = await pool.query(`
      SELECT 
        tc.constraint_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'settings' 
        AND tc.constraint_type = 'UNIQUE'
        AND kcu.column_name = 'key'
    `);

    if (uniqueOnKey.rows.length > 0) {
      console.log('\n✅ UNIQUE constraint on "key" column exists!');
      console.log('   UPSERT will work correctly.');
    } else {
      console.log('\n❌ NO UNIQUE constraint on "key" column!');
      console.log('   Need to add: ALTER TABLE settings ADD CONSTRAINT settings_key_unique UNIQUE (key);');
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkConstraints();
