# Portfolio Setup Guide

## Quick Setup

### 1. Run Database Migration

Tambahkan status `enrolled` ke tabel `formulir_pendaftaran`:

```bash
node run-migration-enrolled-status.js
```

**Output yang diharapkan:**
```
🚀 Starting migration: Add enrolled status
📄 Migration file loaded
📝 Executing SQL...
✅ Migration completed successfully!
📊 Status values now available:
   - draft
   - submitted
   - pending
   - reviewed
   - approved
   - rejected
   - enrolled ✨ (NEW)
✅ Verification: Column exists
🎉 Migration successful!
```

### 2. Verify API Endpoint

Test API endpoint:

```bash
# Start development server
npm run dev

# Test API (in another terminal)
curl http://localhost:3000/api/dashboard/student-portfolio
```

### 3. Test Frontend

1. Login ke dashboard
2. Navigate ke `/dashboard/portofolio`
3. ✅ Data muncul dari database
4. ✅ Timeline activities tampil
5. ✅ Progress bar sesuai status

## Troubleshooting

### Error: column fp.program does not exist

**Problem:** Kolom `program` tidak ada di tabel

**Solution:** ✅ Already fixed! API sekarang menggunakan `program_yang_dipilih`

### Error: invalid input value for enum

**Problem:** Status `enrolled` belum ada di constraint

**Solution:** Run migration:
```bash
node run-migration-enrolled-status.js
```

### Error: No data showing

**Problem:** Belum ada data di tabel `formulir_pendaftaran`

**Solution:** 
1. Isi formulir pendaftaran via `/dashboard/formulir`
2. Atau insert sample data:

```sql
INSERT INTO formulir_pendaftaran (
  user_id, nama_lengkap, nama_panggilan, jenis_kelamin,
  tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
  anak_ke, jumlah_saudara, bahasa_sehari_hari,
  alamat_lengkap, rt, rw, kelurahan, kecamatan, kabupaten_kota, provinsi, kode_pos, telepon,
  nama_ayah, pekerjaan_ayah, telepon_ayah,
  nama_ibu, pekerjaan_ibu, telepon_ibu,
  program_yang_dipilih, pernyataan_setuju, status
) VALUES (
  1, 'Ahmad Zaki', 'Zaki', 'Laki-laki',
  'Jakarta', '2017-03-15', 'Islam', 'Indonesia',
  1, 2, 'Indonesia',
  'Jl. Merdeka No. 123', '001', '002', 'Menteng', 'Menteng', 'Jakarta Pusat', 'DKI Jakarta', '10110', '081234567890',
  'Bapak Ahmad', 'Wiraswasta', '081234567890',
  'Ibu Siti', 'Ibu Rumah Tangga', '081234567891',
  'KBTK', true, 'approved'
);
```

## Column Mapping Reference

| Database Column | API Response | Description |
|----------------|--------------|-------------|
| `id` | `id` | Primary key |
| `nama_lengkap` | `studentName` | Student full name |
| `nama_panggilan` | `nickname` | Student nickname |
| `jenis_kelamin` | `gender` | Gender (Laki-laki/Perempuan) |
| `tanggal_lahir` | `birthDate` | Birth date |
| `program_yang_dipilih` | `program` | Selected program |
| `status` | `status` | Application status |
| `submission_date` | `registrationDate` | Registration date |
| `nama_ayah` | `fatherName` | Father's name |
| `nama_ibu` | `motherName` | Mother's name |
| `pekerjaan_ayah` | `fatherJob` | Father's job |
| `pekerjaan_ibu` | `motherJob` | Mother's job |
| `telepon_ayah` | `fatherPhone` | Father's phone |
| `telepon_ibu` | `motherPhone` | Mother's phone |
| `alamat_lengkap` | `address` | Full address |
| `hobi_minat` | `hobbies` | Hobbies |
| `prestasi_yang_pernah_diraih` | `achievements` | Achievements |

## Status Flow

```
draft (Belum selesai)
    ↓
submitted/pending (Baru dikirim)
    ↓
reviewed (Sudah direview)
    ↓
approved (Disetujui)
    ↓
enrolled (Terdaftar resmi) ✨
```

Alternative flow:
```
draft → submitted → reviewed → rejected (Ditolak)
```

## API Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "studentName": "Ahmad Zaki",
      "studentId": "IQL-2024-001",
      "program": "KBTK",
      "status": "approved",
      "progress": 80,
      "parent": "Bapak Ahmad",
      "parentEmail": "parent@iqrolife.com",
      "activities": [
        {
          "id": "1",
          "type": "registration",
          "title": "Pendaftaran Online",
          "description": "Pendaftaran akun dan data awal berhasil",
          "date": "15/10/2024, 09:30:00",
          "status": "completed"
        }
      ],
      "formData": {
        "birthDate": "2017-03-15",
        "age": 7,
        "gender": "Laki-laki",
        "address": "Jl. Merdeka No. 123",
        "fatherName": "Bapak Ahmad",
        "motherName": "Ibu Siti",
        "fatherJob": "Wiraswasta",
        "motherJob": "Ibu Rumah Tangga"
      }
    }
  ],
  "total": 1
}
```

## Testing Checklist

- [ ] Migration berhasil dijalankan
- [ ] API endpoint bisa diakses
- [ ] Data muncul di halaman portofolio
- [ ] Timeline activities tampil dengan benar
- [ ] Progress bar sesuai status
- [ ] Parent hanya melihat data anak sendiri
- [ ] Admin melihat semua data
- [ ] Search & filter berfungsi (admin)
- [ ] Detail dialog berfungsi (admin)

## Next Steps

1. ✅ Migration completed
2. ✅ API working
3. ✅ Frontend integrated
4. 🔄 Test with real data
5. 🔄 Add more features (document upload, payment tracking)

## Support

Jika ada masalah, cek:
1. Database connection (`.env` file)
2. Migration status
3. Browser console untuk error
4. Server logs untuk API error
