-- ============================================
-- COMPLETE DATABASE SCHEMA FOR IQROLIFE
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'parent',
  avatar VARCHAR(255),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);

-- 3. CALON MURID TABLE
-- Data calon murid yang sudah diproses/disetujui oleh admin
CREATE TABLE IF NOT EXISTS calon_murid (
  id SERIAL PRIMARY KEY,
  formulir_id INTEGER REFERENCES formulir(id) ON DELETE SET NULL,
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
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calon_murid_formulir_id ON calon_murid(formulir_id);
CREATE INDEX idx_calon_murid_name ON calon_murid(name);
CREATE INDEX idx_calon_murid_email ON calon_murid(email);
CREATE INDEX idx_calon_murid_status ON calon_murid(status);
CREATE INDEX idx_calon_murid_registration_date ON calon_murid(registration_date);

-- 4. FORMULIR TABLE (Form Submissions)
-- Data formulir pendaftaran yang dikirim oleh parent (belum diproses)
CREATE TABLE IF NOT EXISTS formulir (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  previous_school VARCHAR(255),
  notes TEXT,
  payment_proof_url TEXT,
  payment_proof_public_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'submitted',
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  submission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_formulir_user_id ON formulir(user_id);
CREATE INDEX idx_formulir_status ON formulir(status);
CREATE INDEX idx_formulir_submission_date ON formulir(submission_date);

-- 5. MENU TABLE (Navigation Menu)
CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  href VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES menu(id),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  roles JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_parent_id ON menu(parent_id);
CREATE INDEX idx_menu_order_index ON menu(order_index);

-- 6. PORTOFOLIO TABLE
CREATE TABLE IF NOT EXISTS portofolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  image_public_id VARCHAR(255),
  content TEXT,
  tags JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portofolio_category ON portofolio(category);
CREATE INDEX idx_portofolio_is_published ON portofolio(is_published);
CREATE INDEX idx_portofolio_created_by ON portofolio(created_by);

-- 7. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(100),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- 8. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  description TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at 
  BEFORE UPDATE ON roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calon_murid_updated_at 
  BEFORE UPDATE ON calon_murid 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_formulir_updated_at 
  BEFORE UPDATE ON formulir 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_updated_at 
  BEFORE UPDATE ON menu 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portofolio_updated_at 
  BEFORE UPDATE ON portofolio 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE users IS 'Tabel untuk menyimpan data user (admin, staff, teacher, parent)';
COMMENT ON TABLE roles IS 'Tabel untuk menyimpan role dan permissions';
COMMENT ON TABLE calon_murid IS 'Tabel untuk menyimpan data calon murid yang sudah diproses/disetujui oleh admin';
COMMENT ON TABLE formulir IS 'Tabel untuk menyimpan formulir pendaftaran yang dikirim oleh parent (belum diproses)';
COMMENT ON TABLE menu IS 'Tabel untuk menyimpan konfigurasi menu navigasi';
COMMENT ON TABLE portofolio IS 'Tabel untuk menyimpan data portofolio/galeri kegiatan sekolah (tidak terkait langsung dengan calon murid)';
COMMENT ON TABLE settings IS 'Tabel untuk menyimpan konfigurasi aplikasi';
COMMENT ON TABLE activity_logs IS 'Tabel untuk menyimpan log aktivitas user';

-- Additional column comments
COMMENT ON COLUMN calon_murid.formulir_id IS 'Reference ke formulir asal (jika berasal dari formulir submission)';
COMMENT ON COLUMN calon_murid.approved_by IS 'User yang menyetujui calon murid ini';
COMMENT ON COLUMN calon_murid.approved_at IS 'Waktu persetujuan';
COMMENT ON COLUMN formulir.reviewed_by IS 'User yang mereview formulir';
COMMENT ON COLUMN formulir.reviewed_at IS 'Waktu review';
COMMENT ON COLUMN formulir.review_notes IS 'Catatan hasil review';
