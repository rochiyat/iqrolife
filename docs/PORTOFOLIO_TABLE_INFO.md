# Tabel Portofolio - Informasi

## Kapan Dibuat?

### Git History
**Tanggal:** 13 November 2024, 23:10:49 WIB
**Commit by:** Rochiyat
**Commit message:** `feat(dashboard): add formulir list page with complete database migration`

### File Schema
**Location:** `db/schema-complete.sql`
**Section:** 6. PORTOFOLIO TABLE

---

## Status Saat Ini

✅ **Table EXISTS in database**

**Size:** 80 kB
**Records:** 3 records

---

## Struktur Tabel

```sql
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

-- Indexes
CREATE INDEX idx_portofolio_category ON portofolio(category);
CREATE INDEX idx_portofolio_is_published ON portofolio(is_published);
CREATE INDEX idx_portofolio_created_by ON portofolio(created_by);
```

---

## Kolom-Kolom

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | integer | NOT NULL | Primary key |
| `title` | varchar(255) | NOT NULL | Judul portfolio item |
| `description` | text | NULL | Deskripsi singkat |
| `category` | varchar(100) | NULL | Kategori (Kegiatan, Event, Program) |
| `image_url` | text | NULL | URL gambar (Cloudinary) |
| `image_public_id` | varchar(255) | NULL | Cloudinary public ID |
| `content` | text | NULL | Konten lengkap (HTML/Markdown) |
| `tags` | jsonb | NULL | Tags dalam format JSON array |
| `is_published` | boolean | NULL | Status publish (true/false) |
| `published_at` | timestamp | NULL | Tanggal publish |
| `created_by` | integer | NULL | User ID yang membuat |
| `created_at` | timestamp | NOT NULL | Tanggal dibuat |
| `updated_at` | timestamp | NOT NULL | Tanggal update terakhir |

---

## Data Saat Ini

**Total:** 3 records

### Sample Data:
1. ✅ **Published** | ID: 1 | Kegiatan Belajar KBTK | Category: Kegiatan
2. ✅ **Published** | ID: 2 | Wisuda Angkatan 2024 | Category: Event
3. ✅ **Published** | ID: 3 | Kelas Eksplorasi | Category: Program

---

## Purpose & Usage

### Tujuan Tabel
Tabel `portofolio` digunakan untuk **Content Management System (CMS)** untuk menampilkan:
- Kegiatan sekolah
- Event/acara
- Program-program
- Artikel/berita
- Portfolio items lainnya

### Bukan Untuk Student Portfolio!
⚠️ **PENTING:** Tabel ini **BUKAN** untuk student portfolio (data murid)

**Perbedaan:**
- `portofolio` table → Content management (artikel, kegiatan, event)
- Student portfolio → Menggunakan data dari `formulir_pendaftaran` table

---

## API Endpoints

### GET /api/dashboard/portofolio
Fetch all portfolio items

**Query Parameters:**
- `category` (optional) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Kegiatan Belajar KBTK",
      "description": "...",
      "category": "Kegiatan",
      "image_url": "https://...",
      "is_published": true,
      "published_at": "2024-11-13T...",
      "created_at": "2024-11-13T..."
    }
  ],
  "total": 3
}
```

### POST /api/dashboard/portofolio
Create new portfolio item

**Body:**
```json
{
  "title": "Judul Portfolio",
  "description": "Deskripsi singkat",
  "category": "Kegiatan",
  "image_url": "https://...",
  "image_public_id": "cloudinary_id",
  "content": "Konten lengkap...",
  "tags": ["tag1", "tag2"],
  "is_published": true,
  "created_by": 1
}
```

### PUT /api/dashboard/portofolio
Update portfolio item

### DELETE /api/dashboard/portofolio?id=1
Delete portfolio item

---

## Frontend Pages

### Admin/Staff View
**Page:** `/dashboard/portofolio` (untuk admin)
**Purpose:** Manage portfolio content (CRUD operations)

### Public View
**Page:** `/portofolio` atau `/` (public website)
**Purpose:** Display published portfolio items

---

## Relationship dengan Tabel Lain

### users → portofolio
**Type:** One-to-Many
**Foreign Key:** `portofolio.created_by` → `users.id`

```sql
SELECT 
  p.title,
  p.category,
  u.name as created_by_name
FROM portofolio p
LEFT JOIN users u ON p.created_by = u.id;
```

---

## Categories

Berdasarkan data yang ada:
- **Kegiatan** - Kegiatan sekolah sehari-hari
- **Event** - Acara khusus (wisuda, dll)
- **Program** - Program-program sekolah

---

## Timeline

```
13 Nov 2024, 23:10 WIB
    ↓
Schema created (db/schema-complete.sql)
    ↓
Table created in database
    ↓
3 sample records inserted
    ↓
API endpoints created (app/api/dashboard/portofolio/route.ts)
    ↓
Frontend page created (app/dashboard/(protected)/portofolio/page.tsx)
```

---

## Confusion Alert! ⚠️

### Nama yang Membingungkan

Ada **2 konsep berbeda** dengan nama mirip:

1. **Tabel `portofolio`** (CMS)
   - File: `db/schema-complete.sql`
   - API: `/api/dashboard/portofolio`
   - Purpose: Content management (artikel, kegiatan)
   - Data: 3 records (Kegiatan, Event, Program)

2. **Student Portfolio** (Data Murid)
   - File: `app/api/dashboard/student-portfolio/route.ts`
   - API: `/api/dashboard/student-portfolio`
   - Purpose: Student registration portfolio
   - Data: From `formulir_pendaftaran` table

### Solusi Penamaan

**Rekomendasi:** Rename untuk clarity

**Option 1:** Rename tabel
- `portofolio` → `content_portfolio` atau `cms_content`
- `student-portfolio` API → `student-portfolio` (sudah jelas)

**Option 2:** Rename API
- `/api/dashboard/portofolio` → `/api/dashboard/content`
- `/api/dashboard/student-portfolio` → `/api/dashboard/students/portfolio`

**Option 3:** Keep as is, document clearly
- Add comments in code
- Update documentation
- Train team about the difference

---

## Verification Commands

### Check table exists
```bash
node check-portofolio-table.js
```

### Query data
```sql
-- Get all published items
SELECT * FROM portofolio WHERE is_published = true;

-- Get by category
SELECT * FROM portofolio WHERE category = 'Kegiatan';

-- Get with creator info
SELECT 
  p.*,
  u.name as creator_name
FROM portofolio p
LEFT JOIN users u ON p.created_by = u.id;
```

---

## Summary

✅ **Tabel `portofolio` dibuat pada:**
- **Tanggal:** 13 November 2024, 23:10:49 WIB
- **Oleh:** Rochiyat
- **Purpose:** Content Management System (CMS)
- **Status:** Active, 3 records
- **Size:** 80 kB

⚠️ **Catatan Penting:**
- Tabel ini untuk CMS content (artikel, kegiatan, event)
- BUKAN untuk student portfolio (data murid)
- Student portfolio menggunakan `formulir_pendaftaran` table

📝 **Rekomendasi:**
- Pertimbangkan rename untuk menghindari confusion
- Atau dokumentasikan dengan jelas perbedaannya
- Update team tentang 2 konsep berbeda ini
