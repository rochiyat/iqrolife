const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrateRegistrations() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting registrations table migration...');
    
    await client.query('BEGIN');
    
    // Create registrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        
        -- Data Anak
        nama_lengkap VARCHAR(255) NOT NULL,
        tanggal_lahir DATE NOT NULL,
        jenis_kelamin VARCHAR(20) NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
        asal_sekolah VARCHAR(255),
        
        -- Data Orang Tua/Wali
        nama_orang_tua VARCHAR(255) NOT NULL,
        no_telepon VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        alamat TEXT NOT NULL,
        
        -- Catatan Tambahan
        catatan TEXT,
        
        -- Bukti Transfer
        bukti_transfer_url TEXT NOT NULL,
        bukti_transfer_public_id VARCHAR(255),
        
        -- Status
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMP,
        review_notes TEXT,
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Created registrations table');
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
      CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
      CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
      CREATE INDEX IF NOT EXISTS idx_registrations_nama_lengkap ON registrations(nama_lengkap);
    `);
    
    console.log('✅ Created indexes');
    
    // Create trigger function if not exists
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('✅ Created trigger function');
    
    // Create trigger
    await client.query(`
      DROP TRIGGER IF EXISTS update_registrations_updated_at ON registrations;
      CREATE TRIGGER update_registrations_updated_at 
        BEFORE UPDATE ON registrations 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('✅ Created trigger');
    
    await client.query('COMMIT');
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateRegistrations();
