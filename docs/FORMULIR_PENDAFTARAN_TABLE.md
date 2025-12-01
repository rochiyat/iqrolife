# Tabel Formulir Pendaftaran

## Deskripsi
Tabel `formulir_pendaftaran` digunakan untuk menyimpan data lengkap formulir pendaftaran murid yang diisi oleh orang tua/wali melalui halaman dashboard/formulir.

## Struktur Tabel

### Step 1: Data Pribadi
| Kolom | Tipe | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `nama_lengkap` | VARCHAR(255) | NOT NULL | Nama lengkap calon murid |
| `nama_panggilan` | VARCHAR(100) | NOT NULL | Nama panggilan calon murid |
| `jenis_kelamin` | VARCHAR(20) | NOT NULL | Jenis kelamin (Laki-laki/Perempuan) |
| `tempat_lahir` | VARCHAR(255) | NOT NULL | Tempat lahir |
| `tanggal_lahir` | DATE | NOT NULL | Tanggal lahir |
| `agama` | VARCHAR(50) | NOT NULL | Agama (Islam, Kristen, Katolik, Hindu, Buddha, Konghucu) |
| `kewarganegaraan` | VARCHAR(100) | NOT NULL | Kewarganegaraan (default: Indonesia) |
| `anak_ke` | INTEGER | NOT NULL | Anak ke berapa |
| `jumlah_saudara` | INTEGER | NOT NULL | Jumlah saudara kandung |
| `bahasa_sehari_hari` | VARCHAR(255) | NOT NULL | Bahasa yang digunakan sehari-hari |

### Step 2: Keterangan Tempat Tinggal
| Kolom | Tipe | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `alamat_lengkap` | TEXT | NOT NULL | Alamat lengkap |
| `rt` | VARCHAR(10) | NOT NULL | RT |
| `rw` | VARCHAR(10) | NOT NULL | RW |
| `kelurahan` | VARCHAR(255) | NOT NULL | Kelurahan/Desa |
| `kecamatan` | VARCHAR(255) | NOT NULL | Kecamatan |
| `kabupaten_kota` | VARCHAR(255) | NOT NULL | Kabupaten/Kota |
| `provinsi` | VARCHAR(255) | NOT NULL | Provinsi |
| `kode_pos` | VARCHAR(10) | NOT NULL | Kode pos |
| `telepon` | VARCHAR(50) | NOT NULL | Nomor telepon rumah/HP |
| `jarak_ke_sekolah` | VARCHAR(50) | NULL | Jarak ke sekolah (dalam km) |

### Step 3: Data Orang Tua/Wali
| Kolom | Tipe | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `nama_ayah` | VARCHAR(255) | NOT NULL | Nama lengkap ayah |
| `pekerjaan_ayah` | VARCHAR(255) | NOT NULL | Pekerjaan ayah |
| `pendidikan_ayah` | VARCHAR(50) | NULL | Pendidikan terakhir ayah |
| `telepon_ayah` | VARCHAR(50) | NOT NULL | Nomor telepon ayah |
| `nama_ibu` | VARCHAR(255) | NOT NULL | Nama lengkap ibu |
| `pekerjaan_ibu` | VARCHAR(255) | NOT NULL | Pekerjaan ibu |
| `pendidikan_ibu` | VARCHAR(50) | NULL | Pendidikan terakhir ibu |
| `telepon_ibu` | VARCHAR(50) | NOT NULL | Nomor telepon ibu |
| `nama_wali` | VARCHAR(255) | NULL | Nama lengkap wali (opsional) |
| `hubungan_wali` | VARCHAR(100) | NULL | Hubungan dengan wali |
| `telepon_wali` | VARCHAR(50) | NULL | Nomor telepon wali |

### Step 4: Data Kesehatan dan Lainnya
| Kolom | Tipe | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `golongan_darah` | VARCHAR(5) | NULL | Golongan darah (A, B, AB, O) |
| `riwayat_penyakit` | TEXT | NULL | Riwayat penyakit yang pernah diderita |
| `alergi` | TEXT | NULL | Alergi yang dimiliki |
| `tinggi_badan` | DECIMAL(5,2) | NULL | Tinggi badan (dalam cm) |
| `berat_badan` | DECIMAL(5,2) | NULL | Berat badan (dalam kg) |
| `riwayat_vaksinasi` | TEXT | NULL | Riwayat vaksinasi |
| `hobi_minat` | TEXT | NULL | Hobi dan minat anak |
| `prestasi_yang_pernah_diraih` | TEXT | NULL | Prestasi yang pernah diraih |

### Step 5: Pernyataan dan Konfirmasi
| Kolom | Tipe | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `program_yang_dipilih` | VARCHAR(100) | NOT NULL | Program yang dipilih (KBTK, Kelas Eksplorasi, dll) |
| `informasi_tambahan` | TEXT | NULL | Informasi tambahan |
| `pernyataan_setuju` | BOOLEAN | NOT NULL | Persetujuan orang tua/wali |

### Metadata dan Status
| Kolom | Tipe | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `id` | SERIAL | PRIMARY KEY | ID unik formulir |
| `user_id` | INTEGER | NULL | Reference ke tabel users (parent yang mengisi) |
| `status` | VARCHAR(50) | NOT NULL | Status: submitted, reviewed, approved, rejected |
| `reviewed_by` | INTEGER | NULL | User admin/staff yang mereview |
| `reviewed_at` | TIMESTAMP | NULL | Waktu review |
| `review_notes` | TEXT | NULL | Catatan hasil review |
| `submission_date` | TIMESTAMP | NOT NULL | Tanggal pengiriman formulir |
| `created_at` | TIMESTAMP | NOT NULL | Tanggal dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Tanggal terakhir diupdate |

## Indexes
- `idx_formulir_pendaftaran_user_id` - Index pada user_id
- `idx_formulir_pendaftaran_nama_lengkap` - Index pada nama_lengkap
- `idx_formulir_pendaftaran_status` - Index pada status
- `idx_formulir_pendaftaran_program` - Index pada program_yang_dipilih
- `idx_formulir_pendaftaran_submission_date` - Index pada submission_date
- `idx_formulir_pendaftaran_tanggal_lahir` - Index pada tanggal_lahir

## Status Formulir
1. **submitted** - Formulir baru dikirim oleh parent
2. **reviewed** - Formulir sudah direview oleh admin/staff
3. **approved** - Formulir disetujui
4. **rejected** - Formulir ditolak

## Program yang Tersedia
1. **KBTK** - Kelas Siap Sekolah
2. **Kelas Eksplorasi**
3. **Kelas Pra Aqil Baligh**
4. **Kelas Aqil Baligh**

## Cara Menjalankan Migration

### 1. Jalankan Migration
```bash
node db/migrate-formulir-pendaftaran.js
```

### 2. Rollback (jika diperlukan)
```bash
psql -d your_database -f db/rollback-formulir-pendaftaran.sql
```

## Relasi dengan Tabel Lain
- `user_id` → `users.id` (ON DELETE CASCADE)
- `reviewed_by` → `users.id` (ON DELETE SET NULL)

## Trigger
- `update_formulir_pendaftaran_updated_at` - Otomatis update kolom `updated_at` setiap kali ada perubahan data

## Contoh Query

### Insert Data Formulir Baru
```sql
INSERT INTO formulir_pendaftaran (
  user_id, nama_lengkap, nama_panggilan, jenis_kelamin, 
  tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
  anak_ke, jumlah_saudara, bahasa_sehari_hari,
  alamat_lengkap, rt, rw, kelurahan, kecamatan, 
  kabupaten_kota, provinsi, kode_pos, telepon,
  nama_ayah, pekerjaan_ayah, telepon_ayah,
  nama_ibu, pekerjaan_ibu, telepon_ibu,
  program_yang_dipilih, pernyataan_setuju
) VALUES (
  1, 'Ahmad Fauzi', 'Fauzi', 'Laki-laki',
  'Jakarta', '2018-05-15', 'Islam', 'Indonesia',
  1, 2, 'Bahasa Indonesia',
  'Jl. Merdeka No. 123', '001', '005', 'Menteng', 'Menteng',
  'Jakarta Pusat', 'DKI Jakarta', '10310', '081234567890',
  'Budi Santoso', 'Wiraswasta', '081234567891',
  'Siti Aminah', 'Ibu Rumah Tangga', '081234567892',
  'KBTK', true
);
```

### Ambil Semua Formulir dengan Status Submitted
```sql
SELECT 
  fp.*,
  u.name as parent_name,
  u.email as parent_email
FROM formulir_pendaftaran fp
LEFT JOIN users u ON fp.user_id = u.id
WHERE fp.status = 'submitted'
ORDER BY fp.submission_date DESC;
```

### Update Status Formulir
```sql
UPDATE formulir_pendaftaran
SET 
  status = 'approved',
  reviewed_by = 1,
  reviewed_at = CURRENT_TIMESTAMP,
  review_notes = 'Formulir lengkap dan memenuhi syarat'
WHERE id = 1;
```

### Statistik Formulir per Program
```sql
SELECT 
  program_yang_dipilih,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM formulir_pendaftaran
GROUP BY program_yang_dipilih;
```

## Catatan
- Semua field yang bertanda `NOT NULL` wajib diisi
- Field dengan tipe `TEXT` dapat menampung data yang panjang
- Gunakan `DECIMAL(5,2)` untuk tinggi dan berat badan agar presisi (contoh: 120.50 cm)
- Status default adalah `submitted` saat formulir pertama kali dikirim
- Trigger otomatis akan mengupdate `updated_at` setiap kali ada perubahan
