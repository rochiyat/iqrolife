# Manual Migration: Add user_id to Registrations

## ❌ Problem

Migration script gagal dengan error:

```
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

Ini terjadi karena issue koneksi database dari Node script.

## ✅ Solusi: Run SQL Manual

### **Option 1: Via Database Client (Recommended)**

1. **Buka database client** (pgAdmin, DBeaver, TablePlus, dll)
2. **Connect ke database Neon/PostgreSQL**
3. **Copy & Paste SQL berikut**, lalu **Execute**:

```sql
-- Add user_id column to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);

-- Add comment
COMMENT ON COLUMN registrations.user_id IS 'ID user parent yang terkait dengan registrasi ini (NULL jika belum dimapping)';

-- Verify column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'registrations' AND column_name = 'user_id';

-- Show sample data
SELECT id, nama_lengkap, email, user_id, created_at
FROM registrations
ORDER BY created_at DESC
LIMIT 5;
```

4. **Verifikasi** bahwa output query terakhir menunjukkan kolom `user_id` sudah ada

---

### **Option 2: Via Neon Console**

1. Login ke **https://console.neon.tech**
2. Pilih project Anda
3. Klik **SQL Editor**
4. Paste SQL dari Option 1
5. Klik **Run**

---

### **Option 3: Via psql CLI**

```bash
# Connect to database
psql "postgresql://[username]:[password]@[host]/[database]?sslmode=require"

# Or if you have DATABASE_URL in environment
psql $DATABASE_URL

# Then paste the SQL from Option 1
```

---

## 🔍 Verification

Setelah run migration, verifikasi dengan query berikut:

```sql
-- Check column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'registrations' AND column_name = 'user_id';

-- Expected result:
-- column_name | data_type | is_nullable | column_default
-- user_id     | integer   | YES         | NULL
```

```sql
-- Check index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'registrations' AND indexname = 'idx_registrations_user_id';

-- Expected result should show the index
```

```sql
-- Check foreign key constraint
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name='registrations'
    AND kcu.column_name = 'user_id';

-- Expected result should show foreign key to users table
```

---

## ✅ After Migration Success

Setelah migration berhasil, kembali ke aplikasi Next.js dan:

1. **Restart development server** (Ctrl+C, lalu `npm run dev`)
2. **Test API** `/api/dashboard/calon-murid/create-user`:

   - Login sebagai admin/staff
   - Buka `/dashboard/calon-murid`
   - Klik tombol "Create User" pada salah satu registrasi
   - Cek di database apakah `registrations.user_id` sudah ter-update

3. **Test Parent View**:
   - Login sebagai parent (user yang baru dibuat)
   - Buka `/dashboard/calon-murid`
   - Seharusnya parent hanya bisa lihat data anak mereka sendiri

---

## 🔧 Troubleshooting

### Error: "column already exists"

Berarti migration sudah pernah dijalankan. Skip saja.

### Error: "relation users does not exist"

Pastikan table `users` sudah ada di database.

### Error: "permission denied"

Pastikan database user Anda punya permission untuk ALTER TABLE.

### User_id tetap NULL setelah create user

1. Cek apakah API endpoint sudah di-update
2. Restart Next.js server
3. Coba create user lagi

---

## 📋 Rollback (Jika Diperlukan)

Jika ingin rollback migration:

```sql
-- Remove foreign key constraint first
ALTER TABLE registrations
DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;

-- Drop index
DROP INDEX IF EXISTS idx_registrations_user_id;

-- Remove column
ALTER TABLE registrations
DROP COLUMN IF EXISTS user_id;
```

---

## 📱 Contact

Jika masih ada masalah, coba:

1. Screenshoot error message
2. Check database connection string di `.env.local`
3. Test koneksi database via database client

Good luck! 🚀
