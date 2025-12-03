const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyData() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying formulir_pendaftaran data...\n');
    
    const result = await client.query(`
      SELECT 
        id,
        nama_lengkap,
        nama_panggilan,
        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        anak_ke,
        jumlah_saudara,
        alamat_lengkap,
        kelurahan,
        kecamatan,
        kabupaten_kota,
        provinsi,
        nama_ayah,
        pekerjaan_ayah,
        nama_ibu,
        pekerjaan_ibu,
        golongan_darah,
        tinggi_badan,
        berat_badan,
        hobi_minat,
        prestasi_yang_pernah_diraih,
        program_yang_dipilih,
        status,
        submission_date
      FROM formulir_pendaftaran
      ORDER BY id
    `);
    
    console.log(`📊 Total data: ${result.rows.length}\n`);
    
    result.rows.forEach((row, index) => {
      console.log(`${'='.repeat(80)}`);
      console.log(`DATA #${index + 1}`);
      console.log(`${'='.repeat(80)}`);
      console.log(`ID: ${row.id}`);
      console.log(`Nama Lengkap: ${row.nama_lengkap}`);
      console.log(`Nama Panggilan: ${row.nama_panggilan}`);
      console.log(`Jenis Kelamin: ${row.jenis_kelamin}`);
      console.log(`Tempat, Tanggal Lahir: ${row.tempat_lahir}, ${row.tanggal_lahir.toISOString().split('T')[0]}`);
      console.log(`Anak ke-${row.anak_ke} dari ${row.jumlah_saudara} bersaudara`);
      console.log(`\nAlamat:`);
      console.log(`  ${row.alamat_lengkap}`);
      console.log(`  ${row.kelurahan}, ${row.kecamatan}`);
      console.log(`  ${row.kabupaten_kota}, ${row.provinsi}`);
      console.log(`\nOrang Tua:`);
      console.log(`  Ayah: ${row.nama_ayah} (${row.pekerjaan_ayah})`);
      console.log(`  Ibu: ${row.nama_ibu} (${row.pekerjaan_ibu})`);
      console.log(`\nData Kesehatan:`);
      console.log(`  Golongan Darah: ${row.golongan_darah || '-'}`);
      console.log(`  Tinggi Badan: ${row.tinggi_badan || '-'} cm`);
      console.log(`  Berat Badan: ${row.berat_badan || '-'} kg`);
      console.log(`\nHobi & Minat:`);
      console.log(`  ${row.hobi_minat || '-'}`);
      console.log(`\nPrestasi:`);
      console.log(`  ${row.prestasi_yang_pernah_diraih || '-'}`);
      console.log(`\nProgram: ${row.program_yang_dipilih}`);
      console.log(`Status: ${row.status}`);
      console.log(`Tanggal Submit: ${row.submission_date.toISOString()}`);
      console.log('');
    });
    
    console.log('✅ Verification completed!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

verifyData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
