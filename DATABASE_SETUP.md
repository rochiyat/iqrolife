# 🗄️ Database Setup - Calon Murid

## 📋 Overview

Setup database PostgreSQL untuk tabel `calon_murid` dengan migrasi schema dan data dummy.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install pg dotenv
```

### 2. Verify Environment Variables
Pastikan `.env` sudah memiliki DATABASE_URL:
```env
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"
```

### 3. Run Migration
```bash
node db/migrate.js
```

## 📊 Database Schema

### Table: `calon_murid`

```sql
CREATE TABLE calon_murid (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `idx_calon_murid_name` - Pencarian berdasarkan nama
- `idx_calon_murid_email` - Pencarian berdasarkan email
- `idx_calon_murid_status` - Filter berdasarkan status
- `idx_calon_murid_registration_date` - Sort berdasarkan tanggal

### Auto-Update Timestamp
Trigger otomatis untuk update `updated_at` saat record diupdate.

## 🌱 Seed Data

Migration includes 5 dummy records:
1. Ahmad Zaki (7 tahun, approved)
2. Siti Fatimah (10 tahun, pending)
3. Muhammad Rizki (5 tahun, approved)
4. Fatimah Az-Zahra (6 tahun, pending)
5. Abdullah Rahman (8 tahun, approved)

## 📁 File Structure

```
db/
├── schema.sql          # Database schema
├── seed.sql           # Dummy data
├── migrate.js         # Migration script
└── README.md          # Documentation
```

## 🔄 Manual Migration

Jika ingin run manual via psql:

```bash
# Connect to database
psql $DATABASE_URL

# Run schema
\i db/schema.sql

# Run seed
\i db/seed.sql

# Verify
SELECT COUNT(*) FROM calon_murid;
```

## 🧹 Rollback

Untuk menghapus tabel:

```sql
DROP TABLE IF EXISTS calon_murid CASCADE;
```

## ✅ Verification

Setelah migration, verify dengan:

```sql
-- Check table exists
\dt calon_murid

-- Check data
SELECT * FROM calon_murid;

-- Check indexes
\di calon_murid*
```

## 🔐 Security Notes

- SSL required untuk Aiven PostgreSQL
- Credentials di `.env` (jangan commit!)
- Use prepared statements untuk prevent SQL injection

## 📝 Next Steps

1. ✅ Run migration
2. ✅ Verify data
3. 🔄 Update API endpoints untuk connect ke database
4. 🔄 Replace dummy data di frontend dengan API calls

## 🆘 Troubleshooting

### Error: "relation already exists"
Table sudah ada. Drop dulu atau skip schema creation.

### Error: "connection refused"
Check DATABASE_URL dan network connection.

### Error: "SSL required"
Pastikan `sslmode=require` ada di connection string.

## 📞 Support

Jika ada masalah, check:
1. DATABASE_URL di `.env`
2. Network connection
3. PostgreSQL version compatibility
4. SSL configuration
