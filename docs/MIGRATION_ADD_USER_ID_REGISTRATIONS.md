# Migration: Add user_id to Registrations Table

## Overview

Menambahkan kolom `user_id` pada tabel `registrations` untuk melakukan mapping antara data registrasi dengan user parent.

## Files Created/Modified

### 1. Migration Files

- **SQL**: `db/migration/add-user-id-to-registrations.sql`
- **Runner**: `db/migration/run-add-user-id-to-registrations.js`

### 2. API Route Modified

- **File**: `app/api/dashboard/calon-murid/create-user/route.ts`
- **Change**: Update dari `calon_murid.created_by` ke `registrations.user_id`

## Migration SQL

```sql
-- Add user_id column (nullable initially)
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
```

## How to Run Migration

### Option 1: Using Node Script

```bash
node db/migration/run-add-user-id-to-registrations.js
```

### Option 2: Manual via psql or Database Client

1. Copy the SQL from `db/migration/add-user-id-to-registrations.sql`
2. Execute directly in your database client
3. Verify with:
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'registrations' AND column_name = 'user_id';
   ```

## API Behavior After Migration

### POST `/api/dashboard/calon-murid/create-user`

**Request Body:**

```json
{
  "studentId": "123",
  "email": "parent@email.com",
  "name": "Nama Orang Tua"
}
```

**What Happens:**

1. **If email doesn't exist:**

   - Create new user with role `parent`
   - Generate random password
   - Send welcome email with credentials
   - **Update `registrations.user_id = new_user_id`**
   - Return: `action: "created"`

2. **If email exists but not parent:**

   - Update user role to `parent`
   - **Update `registrations.user_id = existing_user_id`**
   - Return: `action: "role_added"`

3. **If email exists and already parent:**
   - Just map the child
   - **Update `registrations.user_id = existing_user_id`**
   - Return: `action: "mapping_added"`

## Database Schema

### Before:

```
registrations
├── id
├── nama_lengkap
├── tanggal_lahir
├── jenis_kelamin
├── ...
└── (no user_id column)
```

### After:

```
registrations
├── id
├── nama_lengkap
├── tanggal_lahir
├── jenis_kelamin
├── ...
└── user_id (INTEGER, nullable, FK to users.id)
```

## Benefits

1. ✅ Proper relationship between registration and parent user
2. ✅ Can query all registrations for a specific parent:
   ```sql
   SELECT * FROM registrations WHERE user_id = $1;
   ```
3. ✅ Null `user_id` indicates unmapped registrations
4. ✅ Foreign key ensures data integrity
5. ✅ Index improves query performance

## Rollback (if needed)

```sql
-- Remove the column if needed
ALTER TABLE registrations DROP COLUMN IF EXISTS user_id;
DROP INDEX IF EXISTS idx_registrations_user_id;
```

## Notes

- Column is **nullable** to allow existing records without breaking
- **ON DELETE SET NULL** means if a user is deleted, registration remains but user_id becomes NULL
- Index on `user_id` improves performance for parent dashboard queries
