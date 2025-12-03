const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const r = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name='calon_murid' 
    ORDER BY ordinal_position
  `);
  console.log('Columns in calon_murid:');
  r.rows.forEach((c) => console.log(`  - ${c.column_name} (${c.data_type})`));
  await pool.end();
})();
