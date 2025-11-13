-- Seed data dummy untuk tabel calon_murid
INSERT INTO calon_murid (
  name, 
  birth_date, 
  age, 
  gender, 
  parent_name, 
  phone, 
  email, 
  address, 
  previous_school, 
  status, 
  notes, 
  payment_proof_url, 
  registration_date
) VALUES
(
  'Ahmad Zaki',
  '2017-03-15',
  7,
  'Laki-laki',
  'Bapak Ahmad',
  '081234567890',
  'ahmad@example.com',
  'Jl. Merdeka No. 123, Jakarta Selatan',
  'TK Permata Hati',
  'approved',
  'Anak aktif dan suka belajar',
  'https://placehold.co/600x400/0ea5e9/white?text=Bukti+Transfer+Ahmad',
  '2024-10-15'
),
(
  'Siti Fatimah',
  '2014-08-20',
  10,
  'Perempuan',
  'Ibu Siti',
  '081234567891',
  'siti@example.com',
  'Jl. Kemang Raya No. 45, Jakarta Selatan',
  'SD Harapan Bangsa',
  'pending',
  NULL,
  'https://placehold.co/600x400/ec4899/white?text=Bukti+Transfer+Siti',
  '2024-10-20'
),
(
  'Muhammad Rizki',
  '2019-05-10',
  5,
  'Laki-laki',
  'Ibu Rina',
  '081234567892',
  'rizki@example.com',
  'Jl. Sudirman No. 78, Jakarta Pusat',
  NULL,
  'approved',
  'Belum pernah sekolah sebelumnya',
  'https://placehold.co/600x400/10b981/white?text=Bukti+Transfer+Rizki',
  '2024-10-18'
),
(
  'Fatimah Az-Zahra',
  '2018-11-25',
  6,
  'Perempuan',
  'Bapak Yusuf',
  '081234567893',
  'yusuf@example.com',
  'Jl. Gatot Subroto No. 99, Jakarta Selatan',
  'PAUD Ceria',
  'pending',
  NULL,
  'https://placehold.co/600x400/f97316/white?text=Bukti+Transfer+Fatimah',
  '2024-10-22'
),
(
  'Abdullah Rahman',
  '2016-02-14',
  8,
  'Laki-laki',
  'Ibu Aminah',
  '081234567894',
  'aminah@example.com',
  'Jl. Thamrin No. 112, Jakarta Pusat',
  'SD Islam Terpadu',
  'approved',
  'Hafal 5 juz Al-Quran',
  'https://placehold.co/600x400/8b5cf6/white?text=Bukti+Transfer+Abdullah',
  '2024-10-19'
);

-- Verify data
SELECT COUNT(*) as total_records FROM calon_murid;
SELECT * FROM calon_murid ORDER BY registration_date DESC;
