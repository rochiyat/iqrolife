-- Schema untuk tabel calon_murid
CREATE TABLE IF NOT EXISTS calon_murid (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  previous_school VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  notes TEXT,
  payment_proof_url TEXT,
  payment_proof_public_id VARCHAR(255),
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_calon_murid_name ON calon_murid(name);
CREATE INDEX idx_calon_murid_email ON calon_murid(email);
CREATE INDEX idx_calon_murid_status ON calon_murid(status);
CREATE INDEX idx_calon_murid_registration_date ON calon_murid(registration_date);

-- Trigger untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calon_murid_updated_at 
  BEFORE UPDATE ON calon_murid 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comments untuk dokumentasi
COMMENT ON TABLE calon_murid IS 'Tabel untuk menyimpan data calon murid yang mendaftar';
COMMENT ON COLUMN calon_murid.id IS 'Primary key auto increment';
COMMENT ON COLUMN calon_murid.name IS 'Nama lengkap anak';
COMMENT ON COLUMN calon_murid.birth_date IS 'Tanggal lahir anak';
COMMENT ON COLUMN calon_murid.age IS 'Usia anak (tahun)';
COMMENT ON COLUMN calon_murid.gender IS 'Jenis kelamin: Laki-laki atau Perempuan';
COMMENT ON COLUMN calon_murid.parent_name IS 'Nama orang tua/wali';
COMMENT ON COLUMN calon_murid.phone IS 'Nomor telepon/WhatsApp';
COMMENT ON COLUMN calon_murid.email IS 'Email orang tua/wali';
COMMENT ON COLUMN calon_murid.address IS 'Alamat lengkap';
COMMENT ON COLUMN calon_murid.previous_school IS 'Asal sekolah/TK sebelumnya (opsional)';
COMMENT ON COLUMN calon_murid.status IS 'Status pendaftaran: pending, approved, rejected';
COMMENT ON COLUMN calon_murid.notes IS 'Catatan tambahan';
COMMENT ON COLUMN calon_murid.payment_proof_url IS 'URL bukti transfer dari Cloudinary';
COMMENT ON COLUMN calon_murid.payment_proof_public_id IS 'Public ID Cloudinary untuk delete';
COMMENT ON COLUMN calon_murid.registration_date IS 'Tanggal pendaftaran';
