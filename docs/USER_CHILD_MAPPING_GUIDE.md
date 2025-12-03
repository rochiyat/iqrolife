# User-Child Mapping Guide

## Overview
Dokumentasi tentang mapping antara user (parent) dengan anak (calon_murid) di sistem Iqrolife.

## Current Database Structure

### Before Migration ❌

**Problem:** Tidak ada mapping langsung antara parent user dan calon_murid

```
users (parent)
   ↓ (no direct link)
calon_murid (children)
```

**Existing Fields:**
- `calon_murid.email` - Email orang tua (string, bisa tidak match dengan users.email)
- `calon_murid.parent_name` - Nama orang tua (string, bukan foreign key)
- `calon_murid.created_by` - Admin yang approve (bukan parent)

### After Migration ✅

**Solution:** Tambah `user_id` untuk direct mapping

```
users (parent)
   ↓ user_id (foreign key)
calon_murid (children)
```

**New Fields:**
- `calon_murid.user_id` - Reference ke parent user (foreign key)
- `calon_murid.formulir_pendaftaran_id` - Link ke formulir baru (optional)

## Migration

### 1. Run Migration Script

```bash
node run-migration-user-mapping.js
```

**What it does:**
1. ✅ Add `user_id` column to `calon_murid`
2. ✅ Add `formulir_pendaftaran_id` column
3. ✅ Create indexes for performance
4. ✅ Auto-update existing records (match by email)
5. ✅ Add comments for documentation

### 2. Expected Output

```
🚀 Starting migration: Add user_id mapping to calon_murid
📄 Migration file loaded
📝 Executing SQL...
✅ Migration completed successfully!

📊 Verifying changes...
✅ New columns added:
   - formulir_pendaftaran_id (integer)
   - user_id (integer)

📈 Data Statistics:
   Total records: 10
   With user_id: 8
   Without user_id: 2

📋 Sample Data (first 5 records):
   ID: 1 | Student: Ahmad | Email: parent@example.com | User ID: 5 | Parent: Bapak Ahmad
   ID: 2 | Student: Siti | Email: siti@example.com | User ID: 6 | Parent: Ibu Siti

🎉 Migration successful!
```

## Data Flow

### Registration Flow

```
1. Parent register account
   ↓
   users table (role: parent)
   
2. Parent fill formulir_pendaftaran
   ↓
   formulir_pendaftaran table (user_id = parent.id)
   
3. Admin approve & create calon_murid
   ↓
   calon_murid table (user_id = parent.id, formulir_pendaftaran_id = form.id)
```

### Access Control Flow

```
Parent login
   ↓
GET /api/dashboard/calon-murid
   ↓
Filter: WHERE user_id = parent.id
   ↓
Return: Only their children
```

```
Admin/Staff login
   ↓
GET /api/dashboard/calon-murid
   ↓
No filter (see all)
   ↓
Return: All children
```

## API Changes

### GET /api/dashboard/calon-murid

**Before:**
```typescript
// No filtering, everyone sees all data
SELECT * FROM calon_murid
```

**After:**
```typescript
// Role-based filtering
if (user.role === 'parent') {
  SELECT * FROM calon_murid WHERE user_id = $1
} else {
  SELECT * FROM calon_murid
}
```

### POST /api/dashboard/calon-murid

**Before:**
```typescript
INSERT INTO calon_murid (name, email, ...)
VALUES ($1, $2, ...)
```

**After:**
```typescript
INSERT INTO calon_murid (name, email, user_id, ...)
VALUES ($1, $2, $3, ...)
// user_id = parent who registered
```

## Database Schema

### calon_murid Table

```sql
CREATE TABLE calon_murid (
  id SERIAL PRIMARY KEY,
  
  -- NEW: Direct mapping to parent user
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- NEW: Link to new form system
  formulir_pendaftaran_id INTEGER REFERENCES formulir_pendaftaran(id) ON DELETE SET NULL,
  
  -- Existing fields
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
  
  -- Admin fields
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_calon_murid_user_id ON calon_murid(user_id);
CREATE INDEX idx_calon_murid_formulir_pendaftaran_id ON calon_murid(formulir_pendaftaran_id);
```

## Relationships

### users ↔ calon_murid

**One-to-Many:** One parent can have multiple children

```sql
SELECT 
  u.name as parent_name,
  u.email as parent_email,
  cm.name as child_name,
  cm.age as child_age
FROM users u
LEFT JOIN calon_murid cm ON u.id = cm.user_id
WHERE u.role = 'parent';
```

### formulir_pendaftaran ↔ calon_murid

**One-to-One:** One form creates one calon_murid

```sql
SELECT 
  fp.nama_lengkap as form_name,
  fp.status as form_status,
  cm.name as student_name,
  cm.status as student_status
FROM formulir_pendaftaran fp
LEFT JOIN calon_murid cm ON fp.id = cm.formulir_pendaftaran_id;
```

## Use Cases

### 1. Parent View Their Children

```typescript
// Frontend: /dashboard/calon-murid
const { user } = useAuth();

// API automatically filters by user_id
const response = await fetch('/api/dashboard/calon-murid');
// Returns only children where user_id = parent.id
```

### 2. Admin View All Children

```typescript
// Frontend: /dashboard/calon-murid
const { user } = useAuth();

// API returns all data (no filter)
const response = await fetch('/api/dashboard/calon-murid');
// Returns all children
```

### 3. Create Child with Parent Link

```typescript
// When admin creates calon_murid from formulir_pendaftaran
const formData = await getFormData(formId);

await createCalonMurid({
  ...studentData,
  user_id: formData.user_id, // Link to parent
  formulir_pendaftaran_id: formId, // Link to form
});
```

### 4. Update Existing Records

```sql
-- Match existing calon_murid with users by email
UPDATE calon_murid cm
SET user_id = u.id
FROM users u
WHERE cm.email = u.email
  AND cm.user_id IS NULL;
```

## Testing

### 1. Verify Migration

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calon_murid' 
  AND column_name IN ('user_id', 'formulir_pendaftaran_id');
```

### 2. Check Data Mapping

```sql
-- See which records have user_id
SELECT 
  COUNT(*) as total,
  COUNT(user_id) as with_user_id,
  COUNT(*) - COUNT(user_id) as without_user_id
FROM calon_murid;
```

### 3. Test Parent Access

```sql
-- Get children for specific parent
SELECT * FROM calon_murid WHERE user_id = 5;
```

### 4. Test API

```bash
# Login as parent
curl -X POST http://localhost:3000/api/dashboard/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent@example.com","password":"password"}'

# Get children (should only return their children)
curl http://localhost:3000/api/dashboard/calon-murid \
  -H "Cookie: auth-token=..."
```

## Manual Data Entry

If you need to manually link existing data:

```sql
-- Find parent user
SELECT id, email, name FROM users WHERE role = 'parent';

-- Update calon_murid with user_id
UPDATE calon_murid 
SET user_id = 5  -- parent user id
WHERE email = 'parent@example.com';

-- Or match by name
UPDATE calon_murid 
SET user_id = (SELECT id FROM users WHERE email = 'parent@example.com')
WHERE parent_name = 'Bapak Ahmad';
```

## Files Changed

1. ✅ `db/migration-add-user-mapping-calon-murid.sql` - Migration script
2. ✅ `run-migration-user-mapping.js` - Migration runner
3. ✅ `app/api/dashboard/calon-murid/route.ts` - API with role-based filtering
4. ✅ `USER_CHILD_MAPPING_GUIDE.md` - This documentation

## Summary

✅ **Mapping Added:**
- `calon_murid.user_id` → `users.id` (parent)
- `calon_murid.formulir_pendaftaran_id` → `formulir_pendaftaran.id`

✅ **Benefits:**
- Parent can only see their own children
- Proper access control
- Better data integrity
- Easier to query relationships

✅ **Next Steps:**
1. Run migration
2. Test API with parent role
3. Verify data mapping
4. Update frontend if needed

🎉 **User-child mapping now properly implemented!**
