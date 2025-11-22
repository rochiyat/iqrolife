# 🗄️ Complete Database Setup - Iqrolife

## 📋 Overview

Setup database PostgreSQL lengkap untuk semua menu di dashboard Iqrolife.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install pg dotenv bcrypt
```

### 2. Verify Environment Variables
```env
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"
```

### 3. Run Complete Migration
```bash
node db/migrate-complete.js
```

## 📊 Database Tables

### 1. **users** - User Management
- id, email, password, name, role, avatar, phone
- Roles: superadmin, staff, teacher, parent

### 2. **roles** - Role & Permissions
- id, name, display_name, description, permissions (JSONB)

### 3. **calon_murid** - Student Candidates
- id, name, birth_date, age, gender, parent_name, phone, email
- address, previous_school, status, notes, payment_proof

### 4. **formulir** - Form Submissions
- id, user_id, student_name, birth_date, age, gender
- parent_name, phone, email, address, status

### 5. **menu** - Navigation Menu
- id, name, label, icon, href, parent_id, order_index
- roles (JSONB), is_active

### 6. **portofolio** - Portfolio/Gallery
- id, title, description, category, image_url, content
- tags (JSONB), is_published, published_at

### 7. **settings** - App Settings
- id, key, value, type, category, description, is_public

### 8. **activity_logs** - Activity Tracking
- id, user_id, action, entity_type, entity_id
- description, ip_address, user_agent

## 🌱 Seed Data

### Users (4 accounts)
- **admin@iqrolife.com** - Superadmin
- **staff@iqrolife.com** - Staff
- **teacher@iqrolife.com** - Teacher
- **parent@iqrolife.com** - Parent

**Password:** `password123` (⚠️ Change in production!)

### Calon Murid (5 students)
- Ahmad Zaki (7 tahun, approved)
- Siti Fatimah (10 tahun, pending)
- Muhammad Rizki (5 tahun, approved)
- Fatimah Az-Zahra (6 tahun, pending)
- Abdullah Rahman (8 tahun, approved)

### Formulir (2 submissions)
- Zahra Amelia (6 tahun)
- Farhan Maulana (7 tahun)

### Menu (9 items)
- Dashboard, Calon Murid, Formulir List
- Users, Roles, Menu
- Formulir, Portofolio, Settings

### Portofolio (3 items)
- Kegiatan Belajar KBTK
- Wisuda Angkatan 2024
- Kelas Eksplorasi

### Settings (11 configs)
- Site info, Contact, Payment, Registration

## 📁 File Structure

```
db/
├── schema-complete.sql      # Complete schema
├── seed-complete.sql        # Complete seed data
├── migrate-complete.js      # Migration script
├── rollback.sql            # Rollback script
└── README.md               # Documentation
```

## 🔄 Manual Migration

```bash
# Connect to database
psql $DATABASE_URL

# Run schema
\i db/schema-complete.sql

# Run seed
\i db/seed-complete.sql

# Verify
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

## 🧹 Rollback

```bash
# Run rollback script
psql $DATABASE_URL -f db/rollback.sql

# Or manually
node db/migrate-complete.js
```

## ✅ Verification

After migration:

```sql
-- Check all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count records
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'calon_murid', COUNT(*) FROM calon_murid
UNION ALL SELECT 'formulir', COUNT(*) FROM formulir
UNION ALL SELECT 'menu', COUNT(*) FROM menu
UNION ALL SELECT 'portofolio', COUNT(*) FROM portofolio
UNION ALL SELECT 'settings', COUNT(*) FROM settings;
```

## 🔐 Security

- Passwords hashed with bcrypt
- SSL required for connections
- Sensitive settings marked as not public
- Activity logs for audit trail

## 📝 Next Steps

1. ✅ Run migration
2. ✅ Verify all tables
3. 🔄 Update API endpoints
4. 🔄 Connect frontend to database
5. 🔄 Implement authentication
6. 🔄 Add authorization middleware

## 🆘 Troubleshooting

### Error: "relation already exists"
```sql
-- Drop all tables first
\i db/rollback.sql
-- Then run migration again
```

### Error: "password authentication failed"
Check DATABASE_URL in `.env`

### Error: "SSL required"
Ensure `sslmode=require` in connection string

## 📞 Support

Check:
1. DATABASE_URL format
2. Network connectivity
3. PostgreSQL version (12+)
4. SSL configuration
