-- ============================================
-- REGISTRATIONS TABLE
-- Tabel untuk menyimpan data pendaftaran online Kelas Siap Sekolah
-- ============================================

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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_nama_lengkap ON registrations(nama_lengkap);

-- ============================================
-- TRIGGER FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registrations_updated_at 
  BEFORE UPDATE ON registrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE registrations IS 'Tabel untuk menyimpan data pendaftaran online Kelas Siap Sekolah dari website';
COMMENT ON COLUMN registrations.status IS 'Status pendaftaran: pending (baru dikirim), reviewed (sudah direview), approved (disetujui), rejected (ditolak)';
COMMENT ON COLUMN registrations.bukti_transfer_url IS 'URL bukti transfer yang diupload ke Cloudinary';
COMMENT ON COLUMN registrations.bukti_transfer_public_id IS 'Public ID dari Cloudinary untuk menghapus file jika diperlukan';
