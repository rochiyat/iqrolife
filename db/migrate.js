/**
 * Database Migration Script
 * Run: node db/migrate.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Read and execute schema
    console.log('\n📋 Running schema migration...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    await client.query(schemaSQL);
    console.log('✅ Schema created successfully');

    // Read and execute seed data
    console.log('\n🌱 Seeding data...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seedSQL);
    console.log('✅ Data seeded successfully');

    // Verify
    console.log('\n🔍 Verifying data...');
    const result = await client.query('SELECT COUNT(*) FROM calon_murid');
    console.log(`✅ Total records: ${result.rows[0].count}`);

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

runMigration();
