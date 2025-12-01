# ✅ Formulir - Student Selection Feature

## Status
**COMPLETED** - 27 November 2025

## Fitur yang Ditambahkan

### 1. API Endpoint Baru
✅ **File**: `app/api/dashboard/calon-murid-list/route.ts`

**Fungsi**: Mengambil daftar calon murid berdasarkan role user

**Logic berdasarkan Role**:
- **Superadmin, Staff, Guru**: Menampilkan SEMUA calon murid yang aktif
- **Parent**: Menampilkan HANYA anak yang didaftarkan oleh parent tersebut (berdasarkan `user_id`)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Zahra Amelia",
      "birthDate": "2018-03-15",
      "age": 7,
      "gender": "Perempuan",
      "parentName": "Ahmad Hidayat",
      "phone": "081234567890",
      "email": "ahmad@example.com",
      "address": "Jakarta Selatan",
      "status": "active"
    }
  ],
  "total": 1,
  "userRole": "parent"
}
```

### 2. Update Halaman Formulir
✅ **File**: `app/dashboard/(protected)/formulir/page.tsx`

#### Perubahan Struktur
- **Step 0 (Baru)**: Pemilihan calon murid
- **Step 1-5**: Form pengisian (seperti sebelumnya)

#### State Baru
```typescript
const [currentStep, setCurrentStep] = useState(0); // Start at 0
const [selectedStudent, setSelectedStudent | null>(null);
const [students, setStudents] = useState<CalonMurid[]>([]);
const [loading, setLoading] = useState(true);
const [userRole, setUserRole] = useState<string>('');
```

#### Flow Pengisian Formulir

**1. Step 0: Pilih Calon Murid**
- Tampilkan card untuk setiap calon murid
- Informasi yang ditampilkan:
  - Nama lengkap
  - Usia & jenis kelamin
  - Nama orang tua
  - Nomor telepon
- Button "Pilih & Isi Formulir"

**2. Auto-fill Data**
Saat murid dipilih, otomatis mengisi:
- Nama Lengkap
- Nama Panggilan (dari kata pertama)
- Jenis Kelamin
- Tanggal Lahir
- Alamat Lengkap
- Telepon

**3. Info Bar**
Menampilkan nama murid yang sedang diisi + tombol "Ganti Murid"

**4. Form Steps 1-5**
Melanjutkan pengisian data lengkap seperti biasa

## UI/UX Features

### Card Selection (Step 0)
```
┌─────────────────────────────────────┐
│ 👤 Pilih Calon Murid                │
├─────────────────────────────────────┤
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │ 👤 Zahra │  │ 👤 Farhan│         │
│ │ 7 tahun  │  │ 8 tahun  │         │
│ │ Perempuan│  │ Laki-laki│         │
│ │ Ahmad H. │  │ Maulana I│         │
│ │ 0812...  │  │ 0823...  │         │
│ │          │  │          │         │
│ │ [Pilih]  │  │ [Pilih]  │         │
│ └──────────┘  └──────────┘         │
│                                     │
└─────────────────────────────────────┘
```

### Info Bar (Step 1-5)
```
┌─────────────────────────────────────┐
│ 👤 Mengisi formulir untuk:          │
│    Zahra Amelia    [Ganti Murid]    │
└─────────────────────────────────────┘
```

### Empty State
**Untuk Parent tanpa anak**:
```
┌─────────────────────────────────────┐
│         👤                          │
│   Belum Ada Calon Murid             │
│                                     │
│ Anda belum mendaftarkan calon murid.│
│ Silakan hubungi admin untuk         │
│ mendaftarkan anak Anda.             │
└─────────────────────────────────────┘
```

**Untuk Admin/Staff/Guru tanpa data**:
```
┌─────────────────────────────────────┐
│         👤                          │
│   Belum Ada Calon Murid             │
│                                     │
│ Belum ada data calon murid yang     │
│ terdaftar.                          │
└─────────────────────────────────────┘
```

## Keamanan & Authorization

### Role-Based Access
- ✅ Parent hanya bisa melihat anak mereka sendiri
- ✅ Admin/Staff/Guru bisa melihat semua calon murid
- ✅ Menggunakan cookie `auth-token` untuk validasi
- ✅ Query database dengan filter `user_id` untuk parent

### Data Privacy
- Parent tidak bisa melihat data anak orang lain
- Setiap user hanya bisa mengisi formulir untuk murid yang berhak

## Testing

### Test sebagai Parent
1. Login sebagai parent
2. Buka `/dashboard/formulir`
3. Harus melihat hanya anak yang didaftarkan
4. Pilih salah satu anak
5. Form otomatis terisi dengan data anak
6. Lanjutkan pengisian formulir

### Test sebagai Admin/Staff/Guru
1. Login sebagai admin/staff/guru
2. Buka `/dashboard/formulir`
3. Harus melihat SEMUA calon murid
4. Pilih salah satu murid
5. Form otomatis terisi dengan data murid
6. Lanjutkan pengisian formulir

### Test Ganti Murid
1. Pilih murid pertama
2. Isi beberapa field
3. Klik "Ganti Murid"
4. Kembali ke step 0
5. Pilih murid lain
6. Data form ter-reset dengan data murid baru

## API Integration

### Endpoint yang Digunakan
```
GET /api/dashboard/calon-murid-list
- Headers: Cookie (auth-token)
- Response: List calon murid berdasarkan role
```

### Database Query

**Untuk Superadmin/Staff/Guru**:
```sql
SELECT * FROM calon_murid
WHERE status = 'active'
ORDER BY name ASC
```

**Untuk Parent**:
```sql
SELECT * FROM calon_murid
WHERE user_id = $1 AND status = 'active'
ORDER BY name ASC
```

## Next Steps (Opsional)

### 1. Integrasi Submit Formulir
- Update `handleSubmit()` untuk menyimpan ke `formulir_pendaftaran`
- Include `selectedStudent.id` sebagai reference
- Redirect ke formulir-list setelah berhasil

### 2. Validasi Duplikasi
- Cek apakah murid sudah pernah submit formulir
- Tampilkan warning jika sudah ada formulir aktif
- Option untuk edit formulir yang sudah ada

### 3. Filter & Search
- Tambahkan search box di step 0
- Filter berdasarkan gender, usia, dll
- Sort berdasarkan nama, usia, tanggal daftar

### 4. Bulk Selection (untuk Admin)
- Checkbox untuk pilih multiple murid
- Isi formulir untuk beberapa murid sekaligus
- Batch submit

## File yang Terlibat

```
app/
├── api/
│   └── dashboard/
│       └── calon-murid-list/
│           └── route.ts (NEW)
└── dashboard/
    └── (protected)/
        └── formulir/
            └── page.tsx (UPDATED)
```

## Catatan Penting

- ✅ Step dimulai dari 0 (selection) bukan 1
- ✅ Auto-fill data saat murid dipilih
- ✅ Tombol "Ganti Murid" untuk kembali ke selection
- ✅ Info bar menampilkan nama murid yang sedang diisi
- ✅ Role-based access untuk keamanan data
- ✅ Loading state saat fetch data
- ✅ Empty state untuk kondisi tanpa data
- ✅ Responsive design untuk mobile & desktop
