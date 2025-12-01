/**
 * Check Portofolio Table Status
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkPortofolioTable() {
  console.log('🔍 Checking Portofolio Table Status\n');

  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT 
        table_name,
        pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass)) as size
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'portofolio'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('❌ Table "portofolio" does NOT exist in database\n');
      console.log('💡 To create it, run:');
      console.log('   psql -d your_database -f db/schema-complete.sql\n');
      return;
    }

    console.log('✅ Table "portofolio" exists');
    console.log(`   Size: ${tableCheck.rows[0].size}\n`);

    // Get table structure
    console.log('📋 Table Structure:');
    const columnsResult = await pool.query(`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'portofolio'
      ORDER BY ordinal_position
    `);

    columnsResult.rows.forEach((col) => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const length = col.character_maximum_length
        ? `(${col.character_maximum_length})`
        : '';
      console.log(
        `   - ${col.column_name}: ${col.data_type}${length} ${nullable}`
      );
    });
    console.log('');

    // Get record count
    const countResult = await pool.query('SELECT COUNT(*) as count FROM portofolio');
    console.log(`📊 Total Records: ${countResult.rows[0].count}\n`);

    // Get sample data
    if (parseInt(countResult.rows[0].count) > 0) {
      const sampleResult = await pool.query(`
        SELECT id, title, category, is_published, created_at
        FROM portofolio
        ORDER BY created_at DESC
        LIMIT 5
      `);

      console.log('📄 Sample Data (latest 5):');
      sampleResult.rows.forEach((row) => {
        const status = row.is_published ? '✅ Published' : '📝 Draft';
        console.log(
          `   ${status} | ID: ${row.id} | ${row.title} | Category: ${row.category || 'N/A'}`
        );
      });
      console.log('');
    }

    // Get creation date from pg_class
    const creationResult = await pool.query(`
      SELECT 
        relname as table_name,
        pg_stat_file('base/'||oid::text)::text as file_info
      FROM pg_class
      WHERE relname = 'portofolio'
    `);

    console.log('📅 Table Information:');
    console.log('   Created from schema: db/schema-complete.sql');
    console.log('   Git commit date: 2025-11-13 23:10:49 +0700');
    console.log('   Commit by: Rochiyat');
    console.log(
      '   Commit message: feat(dashboard): add formulir list page with complete database migration'
    );
    console.log('');

    console.log('ℹ️  Note:');
    console.log(
      '   Tabel "portofolio" adalah untuk content management (artikel/portfolio items)'
    );
    console.log(
      '   Berbeda dengan "student portfolio" yang menggunakan data dari formulir_pendaftaran'
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPortofolioTable();
