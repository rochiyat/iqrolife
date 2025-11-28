# Portfolio API Integration

## Overview
Integrasi halaman `/dashboard/portofolio` dengan API backend untuk menampilkan data student portfolio dari database `formulir_pendaftaran`.

## API Endpoint

### GET /api/dashboard/student-portfolio

**Purpose:** Fetch student portfolios dengan timeline dan progress pendaftaran

**Authentication:** Required (cookie-based)

**Query Parameters:**
- `user_id` (optional): Filter by parent user ID
- `status` (optional): Filter by status (pending, approved, rejected, enrolled)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "studentName": "Ahmad Zaki",
      "studentId": "IQL-2024-001",
      "program": "KBTK",
      "registrationDate": "2024-10-15",
      "status": "enrolled",
      "progress": 100,
      "parent": "Bapak Ahmad",
      "parentEmail": "parent@iqrolife.com",
      "email": "parent@iqrolife.com",
      "phone": "081234567890",
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
      "documents": {
        "formData": true,
        "paymentProof": false,
        "birthCertificate": false,
        "healthCertificate": false,
        "photo": false
      },
      "formData": {
        "birthDate": "2017-03-15",
        "age": 7,
        "gender": "Laki-laki",
        "address": "Jl. Merdeka No. 123",
        "previousSchool": "TK Permata Hati",
        "parentName": "Bapak Ahmad",
        "parentEmail": "parent@iqrolife.com",
        "parentPhone": "081234567890",
        "fatherName": "Ahmad",
        "motherName": "Siti",
        "fatherJob": "Wiraswasta",
        "motherJob": "Ibu Rumah Tangga",
        "fatherPhone": "081234567890",
        "motherPhone": "081234567891"
      },
      "reviewNotes": "Data lengkap dan valid"
    }
  ],
  "total": 1
}
```

## Data Mapping

### Status Mapping
Database → Frontend:
- `draft` → `pending` (20% progress)
- `submitted` / `pending` → `pending` (40% progress)
- `reviewed` → `approved` (60% progress)
- `approved` → `approved` (80% progress)
- `enrolled` → `enrolled` (100% progress)
- `rejected` → `rejected` (0% progress)

### Student ID Generation
Format: `IQL-{YEAR}-{ID}`
Example: `IQL-2024-001`

### Age Calculation
Calculated from `tanggal_lahir` (birth date) to current date

### Activities Timeline
Auto-generated based on database timestamps:
1. **Registration** - From `created_at`
2. **Form Submission** - From `submission_date`
3. **Approval/Review** - From `reviewed_at`
4. **Enrollment** - From `updated_at` (if status = enrolled)

## Frontend Integration

### File: `app/dashboard/(protected)/portofolio/page.tsx`

**Changes:**
1. ✅ Remove dummy data
2. ✅ Add `fetchPortfolios()` function
3. ✅ Add `isLoadingData` state
4. ✅ Call API on component mount
5. ✅ Add loading state UI

**Code:**
```tsx
const [portfolios, setPortfolios] = useState<StudentPortfolio[]>([]);
const [isLoadingData, setIsLoadingData] = useState(true);

useEffect(() => {
  if (user) {
    fetchPortfolios();
  }
}, [user]);

const fetchPortfolios = async () => {
  try {
    setIsLoadingData(true);
    const response = await fetch('/api/dashboard/student-portfolio');
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        setPortfolios(result.data);
      }
    }
  } catch (error) {
    console.error('Error fetching portfolios:', error);
  } finally {
    setIsLoadingData(false);
  }
};
```

## Role-Based Access

### Parent Role
- ✅ Auto-filtered by `user_id` di backend
- ✅ Hanya melihat data anak sendiri
- ✅ View: Accordion style dengan timeline detail

### Admin/Staff/Teacher Role
- ✅ Melihat semua data portfolio
- ✅ View: Table dengan search & filter
- ✅ Dapat melihat detail setiap portfolio

## Features

### 1. Timeline Activities
Menampilkan progress pendaftaran:
- 📝 Pendaftaran Online
- 📋 Pengisian Formulir
- ✅ Verifikasi Admin
- 🎓 Terdaftar Resmi

### 2. Progress Bar
Visual indicator progress pendaftaran (0-100%)

### 3. Status Badge
Color-coded status:
- 🟢 Enrolled (Terdaftar)
- 🔵 Approved (Disetujui)
- 🟡 Pending (Menunggu)
- 🔴 Rejected (Ditolak)

### 4. Document Checklist
Track dokumen yang sudah diupload:
- Formulir Pendaftaran
- Bukti Transfer
- Akta Kelahiran
- Surat Keterangan Sehat
- Pas Foto

### 5. Student Details
Informasi lengkap:
- Data pribadi murid
- Data orang tua
- Alamat
- Asal sekolah
- Review notes

## Database Schema

### Table: `formulir_pendaftaran`

**Key Fields:**
- `id` - Primary key
- `user_id` - Foreign key to users (parent)
- `nama_lengkap` - Student name
- `tanggal_lahir` - Birth date
- `program_yang_dipilih` - Program selection (KBTK, Kelas Eksplorasi, dll)
- `status` - Application status (draft, submitted, pending, reviewed, approved, rejected, enrolled)
- `submission_date` - Form submission date
- `reviewed_at` - Review timestamp
- `review_notes` - Admin notes
- `created_at` - Registration date
- `updated_at` - Last update
- `nama_ayah`, `nama_ibu` - Parent names
- `pekerjaan_ayah`, `pekerjaan_ibu` - Parent jobs
- `telepon_ayah`, `telepon_ibu` - Parent phones
- `alamat_lengkap` - Full address
- `hobi_minat` - Hobbies and interests
- `prestasi_yang_pernah_diraih` - Achievements

### Migration Required

**Add 'enrolled' status:**
```bash
node run-migration-enrolled-status.js
```

This adds `enrolled` status to the status constraint.

## Testing

### Manual Test
1. Login sebagai parent
2. Navigate ke `/dashboard/portofolio`
3. ✅ Harus melihat data anak sendiri
4. ✅ Timeline activities muncul
5. ✅ Progress bar sesuai status

### Admin Test
1. Login sebagai superadmin/staff
2. Navigate ke `/dashboard/portofolio`
3. ✅ Melihat semua portfolio
4. ✅ Search & filter berfungsi
5. ✅ Detail dialog berfungsi

### API Test
```bash
# Test as parent
curl -X GET http://localhost:3000/api/dashboard/student-portfolio \
  -H "Cookie: auth-token=..."

# Test with filter
curl -X GET "http://localhost:3000/api/dashboard/student-portfolio?status=approved" \
  -H "Cookie: auth-token=..."
```

## Files Changed

1. ✅ `app/api/dashboard/student-portfolio/route.ts` - New API endpoint
2. ✅ `app/dashboard/(protected)/portofolio/page.tsx` - Frontend integration
3. ✅ `db/migration-add-enrolled-status.sql` - Database migration
4. ✅ `run-migration-enrolled-status.js` - Migration script

## Next Steps (Optional)

1. **Document Upload Tracking**
   - Add `documents` table
   - Track uploaded files
   - Update `documents` object in response

2. **Payment Tracking**
   - Add `payments` table
   - Track payment status
   - Add payment activity to timeline

3. **Real-time Updates**
   - WebSocket for live updates
   - Notification when status changes

4. **Export Portfolio**
   - PDF export
   - Print-friendly view

5. **Bulk Actions (Admin)**
   - Approve multiple
   - Export to Excel
   - Send bulk notifications

## Summary

✅ **Integration Complete!**
- API endpoint created
- Frontend connected to backend
- Role-based access implemented
- Loading states added
- Data mapping working correctly

🎉 **Portfolio page now displays real data from database!**
