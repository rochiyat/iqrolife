-- ============================================
-- COMPLETE SEED DATA FOR IQROLIFE
-- ============================================

-- 1. SEED ROLES
INSERT INTO roles (name, display_name, description, permissions) VALUES
('superadmin', 'Super Admin', 'Full access to all features', 
  '{"canAccessAll": true, "canManageUsers": true, "canManageRoles": true, "canManageStudents": true, "canManageForms": true, "canManageFormsList": true, "canManageSettings": true, "canManageMenu": true, "canViewPortfolio": true}'::jsonb),
('staff', 'Staff', 'Can manage students and forms', 
  '{"canAccessAll": false, "canManageUsers": false, "canManageRoles": false, "canManageStudents": true, "canManageForms": true, "canManageFormsList": true, "canManageSettings": false, "canManageMenu": false, "canViewPortfolio": true}'::jsonb),
('teacher', 'Teacher', 'Can view students and portfolio', 
  '{"canAccessAll": false, "canManageUsers": false, "canManageRoles": false, "canManageStudents": true, "canManageForms": false, "canManageFormsList": true, "canManageSettings": false, "canManageMenu": false, "canViewPortfolio": true}'::jsonb),
('parent', 'Parent', 'Can submit forms and view portfolio', 
  '{"canAccessAll": false, "canManageUsers": false, "canManageRoles": false, "canManageStudents": false, "canManageForms": true, "canManageFormsList": false, "canManageSettings": false, "canManageMenu": false, "canViewPortfolio": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. SEED USERS
-- Password: "password123" (hashed with bcrypt)
INSERT INTO users (email, password, name, role, phone) VALUES
('admin@iqrolife.com', '$2b$10$rKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZq', 'Admin Iqrolife', 'superadmin', '081234567890'),
('staff@iqrolife.com', '$2b$10$rKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZq', 'Staff Iqrolife', 'staff', '081234567891'),
('teacher@iqrolife.com', '$2b$10$rKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZq', 'Guru Iqrolife', 'teacher', '081234567892'),
('parent@iqrolife.com', '$2b$10$rKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZqXmJ5YJ5YJ5eKvVJvHzPZq', 'Orang Tua', 'parent', '081234567893')
ON CONFLICT (email) DO NOTHING;

-- 3. SEED FORMULIR (must be before calon_murid for FK)
INSERT INTO formulir (
  user_id, student_name, birth_date, age, gender, parent_name, phone, email, 
  address, previous_school, notes, payment_proof_url, status, reviewed_by, reviewed_at, review_notes
) VALUES
(4, 'Zahra Amelia', '2018-06-12', 6, 'Perempuan', 'Orang Tua', '081234567893', 'parent@iqrolife.com',
  'Jl. Sudirman No. 45, Jakarta', 'TK Harapan', 'Anak ceria dan aktif',
  'https://placehold.co/600x400/22c55e/white?text=Bukti+Transfer+Zahra', 'processed', 1, CURRENT_TIMESTAMP, 'Disetujui dan sudah diproses'),
(4, 'Farhan Maulana', '2017-09-20', 7, 'Laki-laki', 'Orang Tua', '081234567893', 'parent@iqrolife.com',
  'Jl. Sudirman No. 45, Jakarta', NULL, 'Suka membaca',
  'https://placehold.co/600x400/3b82f6/white?text=Bukti+Transfer+Farhan', 'reviewed', 1, CURRENT_TIMESTAMP, 'Sedang dalam proses verifikasi'),
(4, 'Ahmad Zaki', '2017-03-15', 7, 'Laki-laki', 'Bapak Ahmad', '081234567890', 'ahmad@example.com',
  'Jl. Merdeka No. 123, Jakarta Selatan', 'TK Permata Hati', 'Anak aktif dan suka belajar',
  'https://placehold.co/600x400/0ea5e9/white?text=Bukti+Transfer+Ahmad', 'processed', 1, CURRENT_TIMESTAMP, 'Disetujui'),
(4, 'Muhammad Rizki', '2019-05-10', 5, 'Laki-laki', 'Ibu Rina', '081234567892', 'rizki@example.com',
  'Jl. Sudirman No. 78, Jakarta Pusat', NULL, 'Belum pernah sekolah sebelumnya',
  'https://placehold.co/600x400/10b981/white?text=Bukti+Transfer+Rizki', 'processed', 1, CURRENT_TIMESTAMP, 'Disetujui');

-- 4. SEED CALON MURID (linked to formulir)
INSERT INTO calon_murid (
  formulir_id, name, birth_date, age, gender, parent_name, phone, email, address, 
  previous_school, status, notes, payment_proof_url, registration_date, 
  created_by, approved_by, approved_at
) VALUES
-- From formulir #1 (Zahra Amelia)
(1, 'Zahra Amelia', '2018-06-12', 6, 'Perempuan', 'Orang Tua', '081234567893', 'parent@iqrolife.com',
  'Jl. Sudirman No. 45, Jakarta', 'TK Harapan', 'approved', 'Anak ceria dan aktif',
  'https://placehold.co/600x400/22c55e/white?text=Bukti+Transfer+Zahra', '2024-11-01', 1, 1, CURRENT_TIMESTAMP),
-- From formulir #3 (Ahmad Zaki)
(3, 'Ahmad Zaki', '2017-03-15', 7, 'Laki-laki', 'Bapak Ahmad', '081234567890', 'ahmad@example.com', 
  'Jl. Merdeka No. 123, Jakarta Selatan', 'TK Permata Hati', 'approved', 'Anak aktif dan suka belajar',
  'https://placehold.co/600x400/0ea5e9/white?text=Bukti+Transfer+Ahmad', '2024-10-15', 1, 1, CURRENT_TIMESTAMP),
-- From formulir #4 (Muhammad Rizki)
(4, 'Muhammad Rizki', '2019-05-10', 5, 'Laki-laki', 'Ibu Rina', '081234567892', 'rizki@example.com',
  'Jl. Sudirman No. 78, Jakarta Pusat', NULL, 'approved', 'Belum pernah sekolah sebelumnya',
  'https://placehold.co/600x400/10b981/white?text=Bukti+Transfer+Rizki', '2024-10-18', 1, 1, CURRENT_TIMESTAMP),
-- Direct entry by admin (no formulir)
(NULL, 'Siti Fatimah', '2014-08-20', 10, 'Perempuan', 'Ibu Siti', '081234567891', 'siti@example.com',
  'Jl. Kemang Raya No. 45, Jakarta Selatan', 'SD Harapan Bangsa', 'pending', NULL,
  'https://placehold.co/600x400/ec4899/white?text=Bukti+Transfer+Siti', '2024-10-20', 1, NULL, NULL),
-- Direct entry by admin (no formulir)
(NULL, 'Fatimah Az-Zahra', '2018-11-25', 6, 'Perempuan', 'Bapak Yusuf', '081234567893', 'yusuf@example.com',
  'Jl. Gatot Subroto No. 99, Jakarta Selatan', 'PAUD Ceria', 'pending', NULL,
  'https://placehold.co/600x400/f97316/white?text=Bukti+Transfer+Fatimah', '2024-10-22', 1, NULL, NULL),
-- Direct entry by admin (no formulir)
(NULL, 'Abdullah Rahman', '2016-02-14', 8, 'Laki-laki', 'Ibu Aminah', '081234567894', 'aminah@example.com',
  'Jl. Thamrin No. 112, Jakarta Pusat', 'SD Islam Terpadu', 'approved', 'Hafal 5 juz Al-Quran',
  'https://placehold.co/600x400/8b5cf6/white?text=Bukti+Transfer+Abdullah', '2024-10-19', 1, 1, CURRENT_TIMESTAMP);



-- 5. SEED MENU
INSERT INTO menu (name, label, icon, href, parent_id, order_index, roles) VALUES
('home', 'Dashboard', 'LayoutDashboard', '/dashboard/home', NULL, 1, '["superadmin", "staff", "teacher", "parent"]'::jsonb),
('calon-murid', 'Calon Murid', 'GraduationCap', '/dashboard/calon-murid', NULL, 2, '["superadmin", "staff", "teacher"]'::jsonb),
('formulir-list', 'Formulir List', 'FileText', '/dashboard/formulir-list', NULL, 3, '["superadmin", "staff", "teacher"]'::jsonb),
('users', 'Users', 'Users', '/dashboard/users', NULL, 4, '["superadmin"]'::jsonb),
('roles', 'Roles', 'UserCog', '/dashboard/roles', NULL, 5, '["superadmin"]'::jsonb),
('menu', 'Menu', 'Menu', '/dashboard/menu', NULL, 6, '["superadmin"]'::jsonb),
('formulir', 'Formulir', 'FileText', '/dashboard/formulir', NULL, 7, '["superadmin", "staff", "parent"]'::jsonb),
('portofolio', 'Portofolio', 'Briefcase', '/dashboard/portofolio', NULL, 8, '["superadmin", "staff", "teacher", "parent"]'::jsonb),
('settings', 'Settings', 'Settings', '/dashboard/settings', NULL, 9, '["superadmin"]'::jsonb);

-- 6. SEED PORTOFOLIO
INSERT INTO portofolio (title, description, category, image_url, content, tags, is_published, published_at, created_by) VALUES
('Kegiatan Belajar KBTK', 'Dokumentasi kegiatan belajar mengajar di KBTK Iqrolife', 'Kegiatan', 
  'https://placehold.co/800x600/0ea5e9/white?text=KBTK+Iqrolife',
  'Kegiatan belajar mengajar yang menyenangkan dan edukatif untuk anak-anak usia dini.',
  '["kbtk", "pendidikan", "anak"]'::jsonb, true, CURRENT_TIMESTAMP, 1),
('Wisuda Angkatan 2024', 'Wisuda siswa-siswi Iqrolife angkatan 2024', 'Event',
  'https://placehold.co/800x600/ec4899/white?text=Wisuda+2024',
  'Perayaan wisuda untuk siswa-siswi yang telah menyelesaikan program pembelajaran.',
  '["wisuda", "event", "2024"]'::jsonb, true, CURRENT_TIMESTAMP, 1),
('Kelas Eksplorasi', 'Program kelas eksplorasi untuk mengembangkan bakat anak', 'Program',
  'https://placehold.co/800x600/10b981/white?text=Kelas+Eksplorasi',
  'Program khusus untuk mengeksplorasi dan mengembangkan bakat serta minat anak.',
  '["eksplorasi", "program", "bakat"]'::jsonb, true, CURRENT_TIMESTAMP, 1);

-- 7. SEED SETTINGS
INSERT INTO settings (key, value, type, category, description, is_public) VALUES
('site_name', 'Iqrolife', 'string', 'general', 'Nama website', true),
('site_description', 'Lembaga Pendidikan Islam Terpadu', 'string', 'general', 'Deskripsi website', true),
('contact_email', 'info@iqrolife.com', 'string', 'contact', 'Email kontak', true),
('contact_phone', '021-12345678', 'string', 'contact', 'Nomor telepon', true),
('contact_address', 'Jl. Pendidikan No. 123, Jakarta', 'text', 'contact', 'Alamat lengkap', true),
('registration_fee', '500000', 'number', 'payment', 'Biaya pendaftaran (Rupiah)', false),
('bank_name', 'BCA', 'string', 'payment', 'Nama bank', true),
('bank_account', '1234567890', 'string', 'payment', 'Nomor rekening', true),
('bank_account_name', 'Yayasan Iqrolife', 'string', 'payment', 'Atas nama rekening', true),
('max_students', '100', 'number', 'registration', 'Maksimal jumlah siswa per tahun', false),
('registration_open', 'true', 'boolean', 'registration', 'Status pendaftaran dibuka/ditutup', false);

-- 8. SEED ACTIVITY LOGS
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES
(1, 'login', 'user', 1, 'Admin login to dashboard'),
(1, 'create', 'calon_murid', 1, 'Created new student: Ahmad Zaki'),
(1, 'update', 'calon_murid', 1, 'Updated student status to approved'),
(2, 'login', 'user', 2, 'Staff login to dashboard'),
(4, 'create', 'formulir', 1, 'Parent submitted registration form');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'calon_murid', COUNT(*) FROM calon_murid
UNION ALL
SELECT 'formulir', COUNT(*) FROM formulir
UNION ALL
SELECT 'menu', COUNT(*) FROM menu
UNION ALL
SELECT 'portofolio', COUNT(*) FROM portofolio
UNION ALL
SELECT 'settings', COUNT(*) FROM settings
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
ORDER BY table_name;
