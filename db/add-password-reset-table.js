/**
 * Add password_reset_tokens table
 * Run: node db/add-password-reset-table.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function addPasswordResetTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if table already exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'password_reset_tokens'
      );
    `);

    if (checkTable.rows[0].exists) {
      console.log('ℹ️  Table password_reset_tokens already exists');
      console.log('✅ No migration needed\n');
    } else {
      console.log('📋 Creating password_reset_tokens table...');
      
      // Read and execute SQL
      const sql = fs.readFileSync(
        path.join(__dirname, 'add-password-reset-tokens.sql'),
        'utf8'
      );
      await client.query(sql);
      
      console.log('✅ Table password_reset_tokens created successfully\n');
    }

    // Verify table structure
    console.log('🔍 Verifying table structure...\n');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'password_reset_tokens'
      ORDER BY ordinal_position;
    `);

    console.log('┌─────────────────────┬──────────────────────┬─────────────┐');
    console.log('│ Column              │ Type                 │ Nullable    │');
    console.log('├─────────────────────┼──────────────────────┼─────────────┤');
    columns.rows.forEach((col) => {
      const paddedName = col.column_name.padEnd(19);
      const paddedType = col.data_type.padEnd(20);
      const paddedNull = col.is_nullable.padEnd(11);
      console.log(`│ ${paddedName} │ ${paddedType} │ ${paddedNull} │`);
    });
    console.log('└─────────────────────┴──────────────────────┴─────────────┘\n');

    // Check indexes
    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'password_reset_tokens';
    `);

    console.log('📊 Indexes:');
    indexes.rows.forEach((idx) => {
      console.log(`   ✓ ${idx.indexname}`);
    });

    console.log('\n✅ Password reset table setup complete!');
    console.log('🔐 Forgot password functionality is now ready to use\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

addPasswordResetTable();
