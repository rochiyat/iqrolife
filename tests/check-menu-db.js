const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkMenu() {
  try {
    const result = await pool.query(`
      SELECT id, name, label, roles 
      FROM menu 
      WHERE name = 'formulir-list'
    `);
    
    console.log('Menu formulir-list:', JSON.stringify(result.rows[0], null, 2));
    
    const allMenus = await pool.query(`SELECT name FROM menu`);
    console.log('All menus:', allMenus.rows.map(r => r.name).join(', '));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkMenu();
