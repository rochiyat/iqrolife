const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateFormulirPendaftaran() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting migration for formulir_pendaftaran table...\n');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema-formulir-pendaftaran.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    console.log('📝 Creating formulir_pendaftaran table...');
    await client.query(schema);
    console.log('✅ Table formulir_pendaftaran created successfully!\n');
    
    // Verify the table was created
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'formulir_pendaftaran'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Table structure:');
    console.log('─'.repeat(80));
    result.rows.forEach(row => {
      console.log(`${row.column_name.padEnd(30)} | ${row.data_type.padEnd(20)} | ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    console.log('─'.repeat(80));
    
    // Check indexes
    const indexResult = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'formulir_pendaftaran';
    `);
    
    console.log('\n📑 Indexes created:');
    console.log('─'.repeat(80));
    indexResult.rows.forEach(row => {
      console.log(`${row.indexname}`);
    });
    console.log('─'.repeat(80));
    
    console.log('\n✨ Migration completed successfully!');
    
    // Insert dummy data
    console.log('\n📝 Inserting dummy data...');
    
    // Data dummy untuk Zahra Amelia
    await client.query(`
      INSERT INTO formulir_pendaftaran (
        user_id, nama_lengkap, nama_panggilan, jenis_kelamin,
        tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
        anak_ke, jumlah_saudara, bahasa_sehari_hari,
        alamat_lengkap, rt, rw, kelurahan, kecamatan,
        kabupaten_kota, provinsi, kode_pos, telepon,
        nama_ayah, pekerjaan_ayah, pendidikan_ayah, telepon_ayah,
        nama_ibu, pekerjaan_ibu, pendidikan_ibu, telepon_ibu,
        golongan_darah, tinggi_badan, berat_badan,
        hobi_minat, prestasi_yang_pernah_diraih,
        program_yang_dipilih, informasi_tambahan, pernyataan_setuju,
        status
      ) VALUES (
        NULL, 'Zahra Amelia', 'Zahra', 'Perempuan',
        'Jakarta', '2018-03-15', 'Islam', 'Indonesia',
        1, 1, 'Bahasa Indonesia',
        'Jl. Melati Indah No. 45', '003', '008', 'Cipete', 'Cilandak',
        'Jakarta Selatan', 'DKI Jakarta', '12410', '081234567890',
        'Ahmad Hidayat', 'Pegawai Swasta', 'S1', '081234567891',
        'Siti Nurhaliza', 'Guru', 'S1', '081234567892',
        'A', 110.5, 18.5,
        'Menggambar, Membaca, Bermain boneka',
        'Juara 1 Lomba Mewarnai tingkat TK',
        'KBTK', 'Anak sangat aktif dan suka belajar hal baru',
        true, 'submitted'
      )
    `);
    console.log('✅ Data dummy Zahra Amelia berhasil ditambahkan');
    
    // Data dummy untuk Farhan Maulana
    await client.query(`
      INSERT INTO formulir_pendaftaran (
        user_id, nama_lengkap, nama_panggilan, jenis_kelamin,
        tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
        anak_ke, jumlah_saudara, bahasa_sehari_hari,
        alamat_lengkap, rt, rw, kelurahan, kecamatan,
        kabupaten_kota, provinsi, kode_pos, telepon,
        nama_ayah, pekerjaan_ayah, pendidikan_ayah, telepon_ayah,
        nama_ibu, pekerjaan_ibu, pendidikan_ibu, telepon_ibu,
        golongan_darah, tinggi_badan, berat_badan,
        hobi_minat, prestasi_yang_pernah_diraih,
        program_yang_dipilih, informasi_tambahan, pernyataan_setuju,
        status
      ) VALUES (
        NULL, 'Farhan Maulana', 'Farhan', 'Laki-laki',
        'Bandung', '2017-08-22', 'Islam', 'Indonesia',
        2, 2, 'Bahasa Indonesia dan Sunda',
        'Jl. Anggrek Raya No. 78', '005', '012', 'Kebayoran Baru', 'Kebayoran Baru',
        'Jakarta Selatan', 'DKI Jakarta', '12180', '082345678901',
        'Maulana Ibrahim', 'Wiraswasta', 'S1', '082345678902',
        'Dewi Kartika', 'Ibu Rumah Tangga', 'D3', '082345678903',
        'O', 120.0, 22.0,
        'Bermain sepak bola, Membaca komik, Bermain lego',
        'Juara 2 Lomba Cerdas Cermat tingkat SD, Juara 3 Lomba Futsal',
        'Kelas Eksplorasi', 'Anak sangat energik dan suka olahraga',
        true, 'submitted'
      )
    `);
    console.log('✅ Data dummy Farhan Maulana berhasil ditambahkan');
    
    // Verify inserted data
    const countResult = await client.query('SELECT COUNT(*) FROM formulir_pendaftaran');
    console.log(`\n📊 Total data formulir: ${countResult.rows[0].count}`);
    
    const dataResult = await client.query(`
      SELECT id, nama_lengkap, jenis_kelamin, program_yang_dipilih, status
      FROM formulir_pendaftaran
      ORDER BY id
    `);
    
    console.log('\n📋 Data yang berhasil ditambahkan:');
    console.log('─'.repeat(80));
    dataResult.rows.forEach(row => {
      console.log(`ID: ${row.id} | ${row.nama_lengkap} (${row.jenis_kelamin}) | ${row.program_yang_dipilih} | Status: ${row.status}`);
    });
    console.log('─'.repeat(80));
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
if (require.main === module) {
  migrateFormulirPendaftaran()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateFormulirPendaftaran };
