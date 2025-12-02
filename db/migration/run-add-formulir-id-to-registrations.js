/**
 * Migration Runner: Add formulir_pendaftaran_id to registrations table
 * Run this script: node db/migration/run-add-formulir-id-to-registrations.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigration() {
  console.log('🚀 Starting migration: Add formulir_pendaftaran_id to registrations...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-formulir-id-to-registrations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements (simple split by semicolon)
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute.\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments
      if (statement.startsWith('--')) continue;

      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const result = await pool.query(statement);
        
        // If it's a SELECT query, show results
        if (statement.toUpperCase().includes('SELECT')) {
          console.log('✓ Query result:', result.rows);
        } else {
          console.log('✓ Success');
        }
      } catch (error) {
        // Check if error is "column already exists"
        if (error.code === '42701') {
          console.log('⚠️  Column already exists, skipping...');
        } else if (error.code === '42P07') {
          console.log('⚠️  Index already exists, skipping...');
        } else if (error.code === '42830') {
          console.log('⚠️  Foreign key constraint already exists, skipping...');
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nVerifying the changes...\n');

    // Final verification
    const verifyColumn = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'registrations' 
        AND column_name = 'formulir_pendaftaran_id'
    `);

    const verifyFK = await pool.query(`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'registrations'
        AND kcu.column_name = 'formulir_pendaftaran_id'
    `);

    console.log('📋 Column Details:');
    console.table(verifyColumn.rows);
    
    console.log('\n🔗 Foreign Key Constraint:');
    console.table(verifyFK.rows);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration();
