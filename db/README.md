# Database Migration Guide

## 📋 Files

- `schema.sql` - Database schema definition
- `seed.sql` - Dummy data for testing
- `migrate.js` - Migration script

## 🚀 How to Run

### 1. Install Dependencies
```bash
npm install pg dotenv
```

### 2. Setup Environment Variables
Make sure your `.env` file has the DATABASE_URL:
```env
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"
```

### 3. Run Migration
```bash
node db/migrate.js
```

## 📊 Database Schema

### Table: `calon_murid`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Nama lengkap anak |
| birth_date | DATE | Tanggal lahir |
| age | INTEGER | Usia (tahun) |
| gender | VARCHAR(50) | Jenis kelamin |
| parent_name | VARCHAR(255) | Nama orang tua/wali |
| phone | VARCHAR(50) | No. telepon |
| email | VARCHAR(255) | Email |
| address | TEXT | Alamat lengkap |
| previous_school | VARCHAR(255) | Asal sekolah (optional) |
| status | VARCHAR(50) | Status: pending/approved/rejected |
| notes | TEXT | Catatan (optional) |
| payment_proof_url | TEXT | URL bukti transfer |
| payment_proof_public_id | VARCHAR(255) | Cloudinary public ID |
| registration_date | DATE | Tanggal pendaftaran |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

## 🔍 Indexes

- `idx_calon_murid_name` - Index on name
- `idx_calon_murid_email` - Index on email
- `idx_calon_murid_status` - Index on status
- `idx_calon_murid_registration_date` - Index on registration_date

## 🌱 Seed Data

Migration includes 5 dummy records for testing.

## 🔄 Manual Migration (Alternative)

If you prefer to run SQL manually:

1. Connect to your PostgreSQL database
2. Run `schema.sql`
3. Run `seed.sql`

```bash
psql $DATABASE_URL -f db/schema.sql
psql $DATABASE_URL -f db/seed.sql
```

## 🧹 Rollback

To drop the table:
```sql
DROP TABLE IF EXISTS calon_murid CASCADE;
```

## 📝 Notes

- The table uses auto-incrementing ID
- Timestamps are automatically managed
- Indexes are created for better query performance
- SSL is required for Aiven PostgreSQL
