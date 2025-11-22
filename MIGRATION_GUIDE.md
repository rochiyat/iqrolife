# 🚀 Complete Migration Guide

## 📦 What's Included

### Database Tables (8 tables)
1. **users** - User accounts & authentication
2. **roles** - Role definitions & permissions
3. **calon_murid** - Student candidates
4. **formulir** - Form submissions
5. **menu** - Navigation configuration
6. **portofolio** - Portfolio/gallery items
7. **settings** - Application settings
8. **activity_logs** - User activity tracking

### Seed Data
- 4 User accounts (all roles)
- 4 Role definitions
- 5 Calon murid records
- 2 Formulir submissions
- 9 Menu items
- 3 Portofolio items
- 11 Settings
- 5 Activity logs

## 🎯 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install pg dotenv bcrypt
```

### Step 2: Check Environment
Verify `.env` has DATABASE_URL:
```env
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"
```

### Step 3: Run Migration
```bash
node db/migrate-complete.js
```

## ✅ Expected Output

```
🔌 Connecting to database...
✅ Connected to database

📋 Running complete schema migration...
✅ Complete schema created successfully

🌱 Seeding complete data...
✅ Complete data seeded successfully

🔍 Verifying all tables...

┌─────────────────┬────────┐
│ Table           │ Count  │
├─────────────────┼────────┤
│ users           │      4 │
│ roles           │      4 │
│ calon_murid     │      5 │
│ formulir        │      2 │
│ menu            │      9 │
│ portofolio      │      3 │
│ settings        │     11 │
│ activity_logs   │      5 │
└─────────────────┴────────┘

🎉 Complete migration finished successfully!

📝 Default Login Credentials:
   Superadmin: admin@iqrolife.com / password123
   Staff:      staff@iqrolife.com / password123
   Teacher:    teacher@iqrolife.com / password123
   Parent:     parent@iqrolife.com / password123
```

## 🔐 Default Accounts

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@iqrolife.com | password123 | superadmin | Full access |
| staff@iqrolife.com | password123 | staff | Students, Forms |
| teacher@iqrolife.com | password123 | teacher | View only |
| parent@iqrolife.com | password123 | parent | Submit forms |

⚠️ **IMPORTANT:** Change passwords in production!

## 📊 Database Schema Overview

```
users (4)
  ├── id, email, password, name, role
  └── avatar, phone, is_active

roles (4)
  ├── id, name, display_name
  └── description, permissions (JSONB)

calon_murid (5)
  ├── id, name, birth_date, age, gender
  ├── parent_name, phone, email, address
  └── status, notes, payment_proof

formulir (2)
  ├── id, user_id, student_name
  ├── birth_date, age, gender
  └── status, submission_date

menu (9)
  ├── id, name, label, icon, href
  └── parent_id, order_index, roles (JSONB)

portofolio (3)
  ├── id, title, description, category
  ├── image_url, content
  └── tags (JSONB), is_published

settings (11)
  ├── id, key, value, type
  └── category, description, is_public

activity_logs (5)
  ├── id, user_id, action
  └── entity_type, entity_id, description
```

## 🔄 Rollback

If you need to start over:

```bash
# Using script
psql $DATABASE_URL -f db/rollback.sql

# Or manually
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS portofolio CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS formulir CASCADE;
DROP TABLE IF EXISTS calon_murid CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

## 📝 Files Reference

| File | Purpose |
|------|---------|
| `schema-complete.sql` | Complete database schema |
| `seed-complete.sql` | All seed data |
| `migrate-complete.js` | Automated migration |
| `rollback.sql` | Drop all tables |
| `DATABASE_COMPLETE_SETUP.md` | Full documentation |
| `MIGRATION_GUIDE.md` | This file |

## 🧪 Testing

After migration, test with:

```sql
-- Test user login
SELECT email, name, role FROM users;

-- Test calon murid
SELECT name, age, status FROM calon_murid;

-- Test menu
SELECT label, href FROM menu ORDER BY order_index;

-- Test settings
SELECT key, value FROM settings WHERE is_public = true;
```

## 🔗 Integration

### API Endpoints to Update
1. `/api/dashboard/login` - Use users table
2. `/api/dashboard/calon-murid` - Use calon_murid table
3. `/api/dashboard/formulir-list` - Use formulir table
4. `/api/dashboard/menu` - Use menu table
5. `/api/dashboard/portofolio` - Use portofolio table
6. `/api/dashboard/settings` - Use settings table

### Frontend Pages to Connect
1. `/dashboard/calon-murid` → calon_murid table
2. `/dashboard/formulir-list` → formulir table
3. `/dashboard/users` → users table
4. `/dashboard/roles` → roles table
5. `/dashboard/menu` → menu table
6. `/dashboard/portofolio` → portofolio table
7. `/dashboard/settings` → settings table

## ⚡ Performance

### Indexes Created
- All primary keys
- Foreign key columns
- Frequently queried columns (email, status, dates)
- JSONB columns for fast queries

### Auto-Update Triggers
All tables have `updated_at` auto-update triggers

## 🔐 Security Features

1. **Password Hashing** - bcrypt for user passwords
2. **Role-Based Access** - JSONB permissions
3. **Activity Logging** - Track all user actions
4. **SSL Required** - Secure connections
5. **Public/Private Settings** - Control visibility

## 📈 Next Steps

1. ✅ Run migration
2. ✅ Verify data
3. 🔄 Update API endpoints
4. 🔄 Connect frontend pages
5. 🔄 Implement authentication
6. 🔄 Add authorization middleware
7. 🔄 Test all features
8. 🔄 Deploy to production

## 🆘 Common Issues

### Issue: "Cannot connect to database"
**Solution:** Check DATABASE_URL and network

### Issue: "Table already exists"
**Solution:** Run rollback first

### Issue: "Permission denied"
**Solution:** Check database user permissions

### Issue: "SSL error"
**Solution:** Ensure `sslmode=require` in URL

## 📞 Support

Need help? Check:
1. DATABASE_URL format
2. PostgreSQL version (12+)
3. Network connectivity
4. SSL configuration
5. User permissions

## 🎉 Success!

If migration completed successfully:
- ✅ 8 tables created
- ✅ 43 records inserted
- ✅ All indexes created
- ✅ Triggers activated
- ✅ Ready for development!

Start building! 🚀
