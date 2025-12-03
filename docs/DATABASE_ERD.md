# Database ERD - Iqrolife System

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ calon_murid : "approved_by/created_by"
    users ||--o{ calon_murid : "user_id (parent)"
    users ||--o{ formulir : "user_id (submitter)"
    users ||--o{ formulir : "reviewed_by"
    users ||--o{ formulir_pendaftaran : "user_id (parent)"
    users ||--o{ formulir_pendaftaran : "reviewed_by"
    users ||--o{ portofolio : "created_by"
    users ||--o{ activity_logs : "user_id"
    users ||--o{ notifications : "receives"
    
    users }o--|| roles : "role_id (FK - deprecated)"
    users ||--o{ user_roles : "has"
    roles ||--o{ user_roles : "assigned to"
    
    calon_murid ||--o{ student_documents : "has"
    calon_murid ||--o{ payments : "makes"
    
    formulir ||--o| calon_murid : "formulir_id"
    formulir_pendaftaran ||--o| calon_murid : "formulir_pendaftaran_id"
    
    menu ||--o{ menu : "parent_id (self-reference)"

    users {
        int id PK
        varchar email UK
        varchar password
        varchar name
        int role_id FK
        varchar role
        varchar avatar
        varchar phone
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    roles {
        int id PK
        varchar name UK
        varchar display_name
        text description
        jsonb permissions
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    user_roles {
        int id PK
        int user_id FK
        int role_id FK
        timestamp assigned_at
        int assigned_by FK
        boolean is_primary
    }

    calon_murid {
        int id PK
        int formulir_id FK
        int formulir_pendaftaran_id FK
        int user_id FK
        varchar name
        date birth_date
        int age
        varchar gender
        varchar parent_name
        varchar phone
        varchar email
        text address
        varchar previous_school
        varchar status
        text notes
        text payment_proof_url
        varchar payment_proof_public_id
        date registration_date
        int created_by FK
        timestamp created_at
        timestamp updated_at
    }

    formulir {
        int id PK
        int user_id FK
        varchar student_name
        date birth_date
        int age
        varchar gender
        varchar parent_name
        varchar phone
        varchar email
        text address
        varchar previous_school
        text notes
        text payment_proof_url
        varchar payment_proof_public_id
        varchar status
        int reviewed_by FK
        timestamp reviewed_at
        text review_notes
        timestamp submission_date
        timestamp created_at
        timestamp updated_at
    }

    formulir_pendaftaran {
        int id PK
        int user_id FK
        varchar nama_lengkap
        varchar nama_panggilan
        varchar jenis_kelamin
        varchar tempat_lahir
        date tanggal_lahir
        varchar agama
        varchar kewarganegaraan
        int anak_ke
        int jumlah_saudara
        varchar bahasa_sehari_hari
        text alamat_lengkap
        varchar rt
        varchar rw
        varchar kelurahan
        varchar kecamatan
        varchar kabupaten_kota
        varchar provinsi
        varchar kode_pos
        varchar telepon
        varchar jarak_ke_sekolah
        varchar nama_ayah
        varchar pekerjaan_ayah
        varchar pendidikan_ayah
        varchar telepon_ayah
        varchar nama_ibu
        varchar pekerjaan_ibu
        varchar pendidikan_ibu
        varchar telepon_ibu
        varchar nama_wali
        varchar hubungan_wali
        varchar telepon_wali
        varchar golongan_darah
        text riwayat_penyakit
        text alergi
        decimal tinggi_badan
        decimal berat_badan
        text riwayat_vaksinasi
        text hobi_minat
        text prestasi_yang_pernah_diraih
        varchar program_yang_dipilih
        text informasi_tambahan
        boolean pernyataan_setuju
        varchar status
        int reviewed_by FK
        timestamp reviewed_at
        text review_notes
        timestamp submission_date
        timestamp created_at
        timestamp updated_at
    }

    menu {
        int id PK
        varchar name
        varchar label
        varchar icon
        varchar href
        int parent_id FK
        int order_index
        boolean is_active
        jsonb roles
        timestamp created_at
        timestamp updated_at
    }

    portofolio {
        int id PK
        varchar title
        text description
        varchar category
        text image_url
        varchar image_public_id
        text content
        jsonb tags
        boolean is_published
        timestamp published_at
        int created_by FK
        timestamp created_at
        timestamp updated_at
    }

    settings {
        int id PK
        varchar key UK
        text value
        varchar type
        varchar category
        text description
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }

    activity_logs {
        int id PK
        int user_id FK
        varchar action
        varchar entity_type
        int entity_id
        text description
        varchar ip_address
        text user_agent
        timestamp created_at
    }

    student_documents {
        int id PK
        int student_id FK
        varchar document_type
        text file_url
        varchar file_public_id
        varchar file_name
        int file_size
        varchar mime_type
        int uploaded_by FK
        timestamp uploaded_at
        int verified_by FK
        timestamp verified_at
        varchar status
        text notes
        timestamp created_at
        timestamp updated_at
    }

    payments {
        int id PK
        int student_id FK
        varchar payment_type
        decimal amount
        varchar currency
        varchar payment_method
        date payment_date
        text proof_url
        varchar proof_public_id
        varchar status
        int verified_by FK
        timestamp verified_at
        text notes
        varchar reference_number
        varchar bank_name
        varchar account_name
        timestamp created_at
        timestamp updated_at
    }

    notifications {
        int id PK
        int user_id FK
        varchar type
        varchar channel
        varchar subject
        text message
        jsonb data
        varchar status
        timestamp sent_at
        timestamp read_at
        text error_message
        int retry_count
        timestamp created_at
    }
```

## Table Relationships

### 1. users (Core Table)
**Purpose:** Menyimpan data user (admin, staff, teacher, parent)

**Relationships:**
- `users` → `calon_murid` (approved_by, created_by, user_id)
- `users` → `formulir` (user_id, reviewed_by)
- `users` → `formulir_pendaftaran` (user_id, reviewed_by)
- `users` → `portofolio` (created_by)
- `users` → `activity_logs` (user_id)

**Key Columns:**
- `role`: superadmin, staff, teacher, parent
- `is_active`: Status aktif user

---

### 2. roles
**Purpose:** Menyimpan role dan permissions (configuration table)

**Relationships:**
- `roles` ← `users` (role_id: **FOREIGN KEY** ✅)

**Key Columns:**
- `name`: Role identifier (superadmin, staff, teacher, parent)
- `permissions`: JSONB untuk flexible permission structure

**How it works:**
```sql
-- NEW: Using FK relationship
SELECT u.*, r.name as role_name, r.permissions
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.id = 1;

-- OLD: Using string matching (deprecated)
SELECT u.*, r.permissions
FROM users u
LEFT JOIN roles r ON u.role = r.name
WHERE u.id = 1;
```

**Migration Status:**
- ✅ **NEW:** `users.role_id` → `roles.id` (FK constraint)
- ⚠️ **OLD:** `users.role` (VARCHAR, kept for backward compatibility)
- 🎯 **Future:** Drop `users.role` column after full migration

---

### 3. calon_murid (Approved Students)
**Purpose:** Data calon murid yang sudah diproses/disetujui admin

**Relationships:**
- `calon_murid` ← `users` (user_id: parent)
- `calon_murid` ← `users` (created_by: admin)
- `calon_murid` ← `formulir` (formulir_id: optional)
- `calon_murid` ← `formulir_pendaftaran` (formulir_pendaftaran_id: optional)

**Key Columns:**
- `user_id`: Link ke parent user (NEW - added via migration)
- `formulir_pendaftaran_id`: Link ke formulir baru (NEW - added via migration)
- `status`: pending, approved, rejected, enrolled

**Flow:**
```
Parent submit form → Admin review → Admin create calon_murid
```

---

### 4. formulir (Old Form System)
**Purpose:** Formulir pendaftaran lama (deprecated, diganti formulir_pendaftaran)

**Relationships:**
- `formulir` ← `users` (user_id: parent submitter)
- `formulir` ← `users` (reviewed_by: admin reviewer)
- `formulir` → `calon_murid` (formulir_id)

**Status:** Legacy table, masih digunakan untuk backward compatibility

---

### 5. formulir_pendaftaran (New Form System)
**Purpose:** Formulir pendaftaran lengkap dengan 5 steps

**Relationships:**
- `formulir_pendaftaran` ← `users` (user_id: parent)
- `formulir_pendaftaran` ← `users` (reviewed_by: admin)
- `formulir_pendaftaran` → `calon_murid` (formulir_pendaftaran_id)

**Key Columns:**
- `program_yang_dipilih`: KBTK, Kelas Eksplorasi, dll
- `status`: draft, submitted, pending, reviewed, approved, rejected, enrolled

**Steps:**
1. Data Pribadi
2. Keterangan Tempat Tinggal
3. Data Orang Tua/Wali
4. Data Kesehatan & Lainnya
5. Pernyataan & Konfirmasi

---

### 6. menu
**Purpose:** Konfigurasi menu navigasi

**Relationships:**
- `menu` → `menu` (parent_id: self-reference untuk submenu)

**Key Columns:**
- `roles`: JSONB array untuk role-based menu access
- `parent_id`: NULL untuk main menu, ID untuk submenu

---

### 7. portofolio (CMS Content)
**Purpose:** Content management untuk artikel/kegiatan sekolah

**Relationships:**
- `portofolio` ← `users` (created_by)

**Note:** ⚠️ Berbeda dengan "student portfolio"! Ini untuk CMS content.

---

### 8. settings
**Purpose:** Konfigurasi aplikasi

**Relationships:** None (standalone configuration table)

**Key Columns:**
- `key`: Unique identifier
- `type`: string, number, boolean, json
- `is_public`: Apakah bisa diakses public

---

### 9. activity_logs
**Purpose:** Log aktivitas user untuk audit trail

**Relationships:**
- `activity_logs` ← `users` (user_id)

**Key Columns:**
- `action`: LOGIN, CREATE, UPDATE, DELETE, etc.
- `entity_type`: users, calon_murid, formulir, etc.
- `entity_id`: ID dari entity yang diakses

---

## Data Flow Diagrams

### Student Registration Flow

```mermaid
flowchart TD
    A[Parent Register] --> B[users table - role: parent]
    B --> C[Parent Login]
    C --> D[Fill formulir_pendaftaran]
    D --> E[formulir_pendaftaran table - status: submitted]
    E --> F[Admin Review]
    F --> G{Approved?}
    G -->|Yes| H[Create calon_murid]
    G -->|No| I[formulir_pendaftaran - status: rejected]
    H --> J[calon_murid table - status: approved]
    J --> K[Admin Enroll]
    K --> L[calon_murid - status: enrolled]
```

### Portfolio Page Data Flow

```mermaid
flowchart TD
    A[User Access /dashboard/portofolio] --> B{User Role?}
    B -->|Parent| C[GET /api/dashboard/student-portfolio]
    B -->|Admin/Staff| C
    C --> D[Query calon_murid WHERE user_id = parent.id]
    D --> E[LEFT JOIN formulir_pendaftaran]
    E --> F[Return student portfolio data]
    F --> G[Display timeline & progress]
```

### Access Control Flow

```mermaid
flowchart TD
    A[User Login] --> B[Set cookie auth-token]
    B --> C[Access Protected Route]
    C --> D[Read cookie]
    D --> E{Valid?}
    E -->|Yes| F{Check Role}
    E -->|No| G[Redirect to /login]
    F -->|Parent| H[Filter by user_id]
    F -->|Admin/Staff| I[Show all data]
    H --> J[Return filtered data]
    I --> J
```

---

## Key Insights

### 1. Dual Form System
- **Old:** `formulir` table (simple, deprecated)
- **New:** `formulir_pendaftaran` table (complete, 5 steps)
- Both can create `calon_murid` records

### 2. User-Child Mapping
- **Before migration:** No direct link
- **After migration:** `calon_murid.user_id` → `users.id`
- **Benefit:** Role-based access control

### 3. Portfolio Confusion
- **CMS Portfolio:** `portofolio` table (articles, events)
- **Student Portfolio:** Data from `calon_murid` + `formulir_pendaftaran`
- **Different purposes!**

### 4. Status Flow
```
formulir_pendaftaran: draft → submitted → reviewed → approved → enrolled
                                                    ↓
                                                rejected

calon_murid: pending → approved → enrolled
                    ↓
                rejected
```

### 5. Audit Trail
- All user actions logged in `activity_logs`
- Includes IP address and user agent
- Useful for security and compliance

---

## Database Statistics

**Total Tables:** 9
- Core: users, roles
- Students: calon_murid, formulir, formulir_pendaftaran
- System: menu, portofolio, settings, activity_logs

**Total Relationships:** 15+ foreign keys

**Indexes:** 30+ for query optimization

**Triggers:** 7 auto-update timestamp triggers

---

## Migration History

### Recent Migrations
1. ✅ Add `enrolled` status to `formulir_pendaftaran`
2. ✅ Add `user_id` to `calon_murid`
3. ✅ Add `formulir_pendaftaran_id` to `calon_murid`

### Pending Improvements
- [ ] Add `approved_by` and `approved_at` to `calon_murid`
- [ ] Add document tracking table
- [ ] Add payment tracking table
- [ ] Deprecate old `formulir` table

---

## Summary

✅ **Well-structured database** with clear relationships
✅ **Role-based access control** via user_id mapping
✅ **Audit trail** via activity_logs
✅ **Flexible permissions** via JSONB
✅ **Auto-timestamps** via triggers

⚠️ **Areas for improvement:**
- Consolidate dual form system
- Add document management
- Add payment tracking
- Better naming conventions (avoid confusion)

🎉 **Database ready for production!**
