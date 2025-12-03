const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('🚀 Starting password reset migration...\n');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema-reset-password.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Executing schema...');
    await pool.query(schema);
    console.log('✅ Password reset table created successfully!\n');

    // Verify table creation
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'password_reset_tokens'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Verification: password_reset_tokens table exists');
      
      // Show table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'password_reset_tokens'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    }

    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
