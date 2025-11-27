-- ============================================
-- FORMULIR PENDAFTARAN TABLE
-- Tabel untuk menyimpan data lengkap formulir pendaftaran murid
-- ============================================

CREATE TABLE IF NOT EXISTS formulir_pendaftaran (
  id SERIAL PRIMARY KEY,
  
  -- Reference ke user yang mengisi formulir
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  
  -- STEP 1: DATA PRIBADI
  nama_lengkap VARCHAR(255) NOT NULL,
  nama_panggilan VARCHAR(100) NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  tempat_lahir VARCHAR(255) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  agama VARCHAR(50) NOT NULL,
  kewarganegaraan VARCHAR(100) NOT NULL DEFAULT 'Indonesia',
  anak_ke INTEGER NOT NULL,
  jumlah_saudara INTEGER NOT NULL,
  bahasa_sehari_hari VARCHAR(255) NOT NULL,
  
  -- STEP 2: KETERANGAN TEMPAT TINGGAL
  alamat_lengkap TEXT NOT NULL,
  rt VARCHAR(10) NOT NULL,
  rw VARCHAR(10) NOT NULL,
  kelurahan VARCHAR(255) NOT NULL,
  kecamatan VARCHAR(255) NOT NULL,
  kabupaten_kota VARCHAR(255) NOT NULL,
  provinsi VARCHAR(255) NOT NULL,
  kode_pos VARCHAR(10) NOT NULL,
  telepon VARCHAR(50) NOT NULL,
  jarak_ke_sekolah VARCHAR(50),
  
  -- STEP 3: DATA ORANG TUA/WALI
  -- Data Ayah
  nama_ayah VARCHAR(255) NOT NULL,
  pekerjaan_ayah VARCHAR(255) NOT NULL,
  pendidikan_ayah VARCHAR(50),
  telepon_ayah VARCHAR(50) NOT NULL,
  
  -- Data Ibu
  nama_ibu VARCHAR(255) NOT NULL,
  pekerjaan_ibu VARCHAR(255) NOT NULL,
  pendidikan_ibu VARCHAR(50),
  telepon_ibu VARCHAR(50) NOT NULL,
  
  -- Data Wali (Opsional)
  nama_wali VARCHAR(255),
  hubungan_wali VARCHAR(100),
  telepon_wali VARCHAR(50),
  
  -- STEP 4: DATA KESEHATAN DAN LAINNYA
  golongan_darah VARCHAR(5),
  riwayat_penyakit TEXT,
  alergi TEXT,
  tinggi_badan DECIMAL(5,2),
  berat_badan DECIMAL(5,2),
  riwayat_vaksinasi TEXT,
  hobi_minat TEXT,
  prestasi_yang_pernah_diraih TEXT,
  
  -- STEP 5: PERNYATAAN DAN KONFIRMASI
  program_yang_dipilih VARCHAR(100) NOT NULL,
  informasi_tambahan TEXT,
  pernyataan_setuju BOOLEAN NOT NULL DEFAULT false,
  
  -- STATUS DAN METADATA
  status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'approved', 'rejected')),
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  -- TIMESTAMPS
  submission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_formulir_pendaftaran_user_id ON formulir_pendaftaran(user_id);
CREATE INDEX idx_formulir_pendaftaran_nama_lengkap ON formulir_pendaftaran(nama_lengkap);
CREATE INDEX idx_formulir_pendaftaran_status ON formulir_pendaftaran(status);
CREATE INDEX idx_formulir_pendaftaran_program ON formulir_pendaftaran(program_yang_dipilih);
CREATE INDEX idx_formulir_pendaftaran_submission_date ON formulir_pendaftaran(submission_date);
CREATE INDEX idx_formulir_pendaftaran_tanggal_lahir ON formulir_pendaftaran(tanggal_lahir);

-- ============================================
-- TRIGGER FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

CREATE TRIGGER update_formulir_pendaftaran_updated_at 
  BEFORE UPDATE ON formulir_pendaftaran 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE formulir_pendaftaran IS 'Tabel untuk menyimpan data lengkap formulir pendaftaran murid dengan 5 step (Data Pribadi, Tempat Tinggal, Orang Tua/Wali, Kesehatan & Lainnya, Konfirmasi)';

COMMENT ON COLUMN formulir_pendaftaran.user_id IS 'Reference ke user yang mengisi formulir (parent)';
COMMENT ON COLUMN formulir_pendaftaran.status IS 'Status formulir: submitted (baru dikirim), reviewed (sudah direview), approved (disetujui), rejected (ditolak)';
COMMENT ON COLUMN formulir_pendaftaran.reviewed_by IS 'User admin/staff yang mereview formulir';
COMMENT ON COLUMN formulir_pendaftaran.reviewed_at IS 'Waktu review formulir';
COMMENT ON COLUMN formulir_pendaftaran.review_notes IS 'Catatan hasil review dari admin';
COMMENT ON COLUMN formulir_pendaftaran.program_yang_dipilih IS 'Program yang dipilih: KBTK, Kelas Eksplorasi, Kelas Pra Aqil Baligh, Kelas Aqil Baligh';
COMMENT ON COLUMN formulir_pendaftaran.pernyataan_setuju IS 'Pernyataan persetujuan dari orang tua/wali';
