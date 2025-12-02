const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runSeed() {
  const client = await pool.connect();

  try {
    console.log('🔄 Running registrations menu seed...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'seed-registrations-menu.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await client.query(sql);

    console.log('✅ Registrations menu seed completed successfully!');

    // Verify the menu was added
    const result = await client.query(
      "SELECT * FROM menu WHERE name = 'registrations'"
    );

    if (result.rows.length > 0) {
      console.log('✅ Menu verified in database:');
      console.log('   - Name:', result.rows[0].name);
      console.log('   - Label:', result.rows[0].label);
      console.log('   - Href:', result.rows[0].href);
      console.log('   - Roles:', result.rows[0].roles);
    } else {
      console.log('⚠️ Warning: Menu not found after seed');
    }
  } catch (error) {
    console.error('❌ Error running seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
