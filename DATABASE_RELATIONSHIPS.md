# 🔗 Database Relationships - Iqrolife

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────┐
│   users     │
│  (4 users)  │
└──────┬──────┘
       │
       │ created_by, approved_by, reviewed_by
       │
       ├──────────────────┬──────────────────┬──────────────────┐
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  formulir   │───▶│ calon_murid │    │ portofolio  │    │activity_logs│
│(submissions)│    │ (processed) │    │  (gallery)  │    │   (logs)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  ▲
       │ user_id          │ formulir_id
       │                  │
       └──────────────────┘
```

## 🔄 Data Flow

### 1. **Formulir → Calon Murid** (Main Flow)

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: Parent Submit Form                                   │
├──────────────────────────────────────────────────────────────┤
│ Parent login → Fill form → Upload bukti transfer → Submit   │
│ Data masuk ke tabel: formulir                               │
│ Status: "submitted"                                          │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Admin Review                                         │
├──────────────────────────────────────────────────────────────┤
│ Admin/Staff buka "Formulir List"                            │
│ Review data formulir                                         │
│ Status: "submitted" → "reviewed"                             │
│ reviewed_by: admin_id                                        │
│ reviewed_at: timestamp                                       │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: Approve & Create Calon Murid                        │
├──────────────────────────────────────────────────────────────┤
│ Admin approve formulir                                       │
│ Data copy dari formulir → calon_murid                       │
│ calon_murid.formulir_id = formulir.id (link)               │
│ calon_murid.approved_by = admin_id                          │
│ calon_murid.status = "approved"                             │
│ formulir.status = "processed"                               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: Student Management                                   │
├──────────────────────────────────────────────────────────────┤
│ Data di "Calon Murid" page                                  │
│ Admin bisa update status: pending → approved → enrolled     │
│ Bisa create user account untuk parent                       │
└──────────────────────────────────────────────────────────────┘
```

## 📋 Table Relationships

### 1. **formulir** (Form Submissions)

**Purpose:** Menyimpan formulir yang dikirim oleh parent

**Relationships:**
- `user_id` → `users.id` (Parent yang submit)
- `reviewed_by` → `users.id` (Admin yang review)

**Status Flow:**
```
submitted → reviewed → processed/rejected
```

**Fields:**
- Basic: student_name, birth_date, age, gender
- Contact: parent_name, phone, email, address
- Additional: previous_school, notes
- Payment: payment_proof_url, payment_proof_public_id
- Review: reviewed_by, reviewed_at, review_notes

### 2. **calon_murid** (Student Candidates)

**Purpose:** Menyimpan data calon murid yang sudah diproses/disetujui

**Relationships:**
- `formulir_id` → `formulir.id` (Formulir asal, optional)
- `created_by` → `users.id` (Admin yang create)
- `approved_by` → `users.id` (Admin yang approve)

**Status Flow:**
```
pending → approved → enrolled/rejected
```

**Fields:**
- Basic: name, birth_date, age, gender
- Contact: parent_name, phone, email, address
- Additional: previous_school, notes
- Payment: payment_proof_url, payment_proof_public_id
- Tracking: formulir_id, approved_by, approved_at

**Note:** 
- Bisa dibuat langsung oleh admin (formulir_id = NULL)
- Atau berasal dari formulir (formulir_id = formulir.id)

### 3. **portofolio** (Portfolio/Gallery)

**Purpose:** Menyimpan dokumentasi kegiatan sekolah

**Relationships:**
- `created_by` → `users.id` (Admin yang create)

**No Direct Link to:**
- ❌ calon_murid (tidak ada hubungan langsung)
- ❌ formulir (tidak ada hubungan langsung)

**Purpose:** 
- Showcase kegiatan sekolah
- Galeri foto/video
- Dokumentasi event
- Marketing material

## 🎯 Use Cases

### Use Case 1: Parent Submit Form

```sql
-- 1. Parent submit form
INSERT INTO formulir (
  user_id, student_name, birth_date, age, gender,
  parent_name, phone, email, address, status
) VALUES (
  4, 'Ahmad Zaki', '2017-03-15', 7, 'Laki-laki',
  'Bapak Ahmad', '081234567890', 'ahmad@example.com',
  'Jl. Merdeka No. 123', 'submitted'
);

-- 2. Admin review
UPDATE formulir 
SET status = 'reviewed',
    reviewed_by = 1,
    reviewed_at = CURRENT_TIMESTAMP,
    review_notes = 'Data lengkap, siap diproses'
WHERE id = 1;

-- 3. Admin approve & create calon murid
INSERT INTO calon_murid (
  formulir_id, name, birth_date, age, gender,
  parent_name, phone, email, address,
  status, approved_by, approved_at
)
SELECT 
  id, student_name, birth_date, age, gender,
  parent_name, phone, email, address,
  'approved', 1, CURRENT_TIMESTAMP
FROM formulir
WHERE id = 1;

-- 4. Update formulir status
UPDATE formulir 
SET status = 'processed'
WHERE id = 1;
```

### Use Case 2: Admin Create Direct

```sql
-- Admin create calon murid langsung (tanpa formulir)
INSERT INTO calon_murid (
  formulir_id, name, birth_date, age, gender,
  parent_name, phone, email, address,
  status, created_by, approved_by, approved_at
) VALUES (
  NULL, 'Siti Fatimah', '2014-08-20', 10, 'Perempuan',
  'Ibu Siti', '081234567891', 'siti@example.com',
  'Jl. Kemang No. 45', 'approved', 1, 1, CURRENT_TIMESTAMP
);
```

### Use Case 3: Query with Relationships

```sql
-- Get calon murid with formulir info
SELECT 
  cm.id,
  cm.name,
  cm.status as cm_status,
  f.id as formulir_id,
  f.status as formulir_status,
  f.submission_date,
  u1.name as approved_by_name,
  u2.name as reviewed_by_name
FROM calon_murid cm
LEFT JOIN formulir f ON cm.formulir_id = f.id
LEFT JOIN users u1 ON cm.approved_by = u1.id
LEFT JOIN users u2 ON f.reviewed_by = u2.id
WHERE cm.status = 'approved';

-- Get formulir that haven't been processed
SELECT 
  f.*,
  u.name as parent_name,
  u.email as parent_email
FROM formulir f
JOIN users u ON f.user_id = u.id
WHERE f.status = 'submitted'
ORDER BY f.submission_date DESC;
```

## 📊 Status Definitions

### Formulir Status
- **submitted** - Baru dikirim, belum direview
- **reviewed** - Sudah direview, menunggu keputusan
- **processed** - Sudah diproses, data dipindah ke calon_murid
- **rejected** - Ditolak, tidak dilanjutkan

### Calon Murid Status
- **pending** - Menunggu verifikasi
- **approved** - Disetujui, bisa daftar
- **enrolled** - Sudah terdaftar sebagai siswa
- **rejected** - Ditolak

## 🔐 Access Control

### Formulir
- **Parent:** Can create, view own
- **Staff/Teacher:** Can view all, review
- **Superadmin:** Full access

### Calon Murid
- **Parent:** Cannot access
- **Staff/Teacher:** Can view, update
- **Superadmin:** Full access

### Portofolio
- **All roles:** Can view published
- **Staff/Teacher:** Can create, edit
- **Superadmin:** Full access

## 🎨 UI Flow

### Parent Dashboard
```
Login → Dashboard → Formulir → Fill Form → Submit
                                              ↓
                                    Formulir List (view own)
```

### Admin Dashboard
```
Login → Dashboard → Formulir List → Review → Approve
                                                ↓
                         Calon Murid (new entry created)
                                                ↓
                         Update Status → Create User Account
```

## 📝 Best Practices

1. **Always link formulir to calon_murid** when approving
2. **Update formulir status** to 'processed' after creating calon_murid
3. **Log all actions** in activity_logs
4. **Keep formulir data** for audit trail (don't delete)
5. **Use soft delete** if needed (add deleted_at column)

## 🔄 Migration Path

If you have existing data:

```sql
-- Link existing calon_murid to formulir
UPDATE calon_murid cm
SET formulir_id = f.id
FROM formulir f
WHERE cm.email = f.email
  AND cm.student_name = f.student_name
  AND cm.formulir_id IS NULL;
```

## 🆘 Troubleshooting

### Orphaned Records
```sql
-- Find calon_murid without formulir
SELECT * FROM calon_murid WHERE formulir_id IS NULL;

-- Find formulir without calon_murid
SELECT f.* 
FROM formulir f
LEFT JOIN calon_murid cm ON f.id = cm.formulir_id
WHERE cm.id IS NULL AND f.status = 'processed';
```

### Data Consistency
```sql
-- Check for inconsistent statuses
SELECT 
  f.id,
  f.status as formulir_status,
  cm.status as calon_murid_status
FROM formulir f
JOIN calon_murid cm ON f.id = cm.formulir_id
WHERE f.status != 'processed' OR cm.status = 'pending';
```

## 📈 Future Enhancements

1. **Student Table** - For enrolled students
2. **Class Assignment** - Link students to classes
3. **Payment Tracking** - Detailed payment records
4. **Document Management** - Additional documents per student
5. **Parent-Student Link** - Multiple children per parent

---

**Summary:** 
- `formulir` = Submissions (from parents)
- `calon_murid` = Processed candidates (by admin)
- `portofolio` = School gallery (independent)
- Clear flow: Submit → Review → Approve → Manage
