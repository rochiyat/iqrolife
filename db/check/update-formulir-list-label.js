const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function updateFormulirListLabel() {
  try {
    console.log('🔄 Updating formulir-list menu label...\n');

    // Check current label
    const current = await pool.query(
      `SELECT id, name, label FROM menu WHERE name = 'formulir-list'`
    );

    if (current.rows.length === 0) {
      console.log('❌ Menu "formulir-list" not found!');
      return;
    }

    console.log('Current label:', current.rows[0].label);

    // Update to match layout.tsx
    const result = await pool.query(
      `UPDATE menu 
       SET label = 'Formulir Review',
           updated_at = NOW()
       WHERE name = 'formulir-list'
       RETURNING id, name, label, updated_at`
    );

    if (result.rows.length > 0) {
      console.log('✅ Label updated successfully!');
      console.log('New label:', result.rows[0].label);
      console.log('Updated at:', result.rows[0].updated_at);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateFormulirListLabel();
