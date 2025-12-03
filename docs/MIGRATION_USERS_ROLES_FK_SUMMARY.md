# Migration Summary: users ↔ roles Foreign Key

## Migration Completed ✅

**Date:** 2024-11-29
**Status:** SUCCESS
**Execution Time:** < 1 second

---

## What Changed?

### Before Migration ❌

```
users.role (VARCHAR) ←→ roles.name (VARCHAR)
     ↓                        ↓
'superadmin'    matches   'superadmin'  (implicit, no FK)
```

**Issues:**
- ❌ No referential integrity
- ❌ Can insert invalid role names
- ❌ Typo = no permissions
- ❌ No DB-level validation

### After Migration ✅

```
users.role_id (INTEGER FK) → roles.id (INTEGER PK)
     ↓                             ↓
     1          references         1 (superadmin)
     2          references         2 (staff)
     3          references         3 (teacher)
     4          references         4 (parent)
```

**Benefits:**
- ✅ Referential integrity enforced
- ✅ Can't insert invalid role_id
- ✅ Cascade protection (ON DELETE RESTRICT)
- ✅ Better data consistency

---

## Migration Details

### 1. Added Column

```sql
ALTER TABLE users 
ADD COLUMN role_id INTEGER;
```

**Result:** New column `users.role_id`

### 2. Populated Data

```sql
UPDATE users u
SET role_id = r.id
FROM roles r
WHERE u.role = r.name;
```

**Result:** All 4 users mapped correctly

### 3. Added FK Constraint

```sql
ALTER TABLE users 
ADD CONSTRAINT fk_users_role_id 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;
```

**Result:** FK constraint `fk_users_role_id` created

### 4. Created Index

```sql
CREATE INDEX idx_users_role_id ON users(role_id);
```

**Result:** Index for query performance

---

## Verification Results

### Column Check ✅

```
users table columns:
  - role_id (integer) ← NEW
  - role (character varying) ← OLD (kept for compatibility)
```

### FK Constraint ✅

```
Foreign key exists:
  users.role_id → roles.id
```

### Data Mapping ✅

```
Total users: 4
With role_id: 4 ✅
Without role_id: 0 ✅

Sample Data:
  ✅ ID: 1 | rochiyat@gmail.com | Old: superadmin | New: superadmin | FK: 1
  ✅ ID: 2 | staff@iqrolife.com | Old: staff | New: staff | FK: 2
  ✅ ID: 3 | teacher@iqrolife.com | Old: teacher | New: teacher | FK: 3
  ✅ ID: 4 | parent@iqrolife.com | Old: parent | New: parent | FK: 4

All roles matched correctly! ✅
```

---

## Database Schema

### users Table (Updated)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id INTEGER,                    -- NEW: FK to roles
  role VARCHAR(50) NOT NULL,          -- OLD: Kept for compatibility
  avatar VARCHAR(255),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_users_role_id 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE INDEX idx_users_role_id ON users(role_id);
```

### roles Table (Unchanged)

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Query Examples

### Get User with Role (NEW Way)

```sql
SELECT 
  u.id,
  u.email,
  u.name,
  r.name as role_name,
  r.display_name,
  r.permissions
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.id = 1;
```

**Result:**
```
id | email              | name     | role_name  | display_name | permissions
---+--------------------+----------+------------+--------------+-------------
1  | rochiyat@gmail.com | Rochiyat | superadmin | Super Admin  | {...}
```

### Get User with Role (OLD Way - Still Works)

```sql
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  r.permissions
FROM users u
LEFT JOIN roles r ON u.role = r.name
WHERE u.id = 1;
```

**Note:** This still works but is deprecated. Use role_id instead.

---

## Backward Compatibility

### Both Columns Exist

- ✅ `role_id` (INTEGER FK) - **NEW, preferred**
- ✅ `role` (VARCHAR) - **OLD, deprecated**

### Why Keep Both?

1. **Gradual Migration:** Update application code incrementally
2. **Zero Downtime:** No breaking changes
3. **Rollback Safety:** Can revert if needed

### Migration Path

```
Phase 1: Add role_id (DONE ✅)
    ↓
Phase 2: Update application code to use role_id
    ↓
Phase 3: Test thoroughly
    ↓
Phase 4: Drop old 'role' column
```

---

## Application Code Updates Needed

### Current Code (Using role VARCHAR)

```typescript
// lib/auth-context.tsx
export type UserRole = 'superadmin' | 'staff' | 'teacher' | 'parent';

const { user } = useAuth();
if (user.role === 'superadmin') {
  // ...
}
```

### Future Code (Using role_id FK)

```typescript
// lib/auth-context.tsx
export type UserRole = {
  id: number;
  name: 'superadmin' | 'staff' | 'teacher' | 'parent';
  permissions: Record<string, boolean>;
};

const { user } = useAuth();
if (user.role.name === 'superadmin') {
  // ...
}

// Or check permissions directly
if (user.role.permissions.canManageUsers) {
  // ...
}
```

---

## Testing

### Test FK Constraint

```sql
-- This should FAIL (invalid role_id)
INSERT INTO users (email, password, name, role_id, role)
VALUES ('test@example.com', 'hash', 'Test User', 999, 'invalid');

-- Error: insert or update on table "users" violates foreign key constraint
```

### Test ON DELETE RESTRICT

```sql
-- This should FAIL (can't delete role that's in use)
DELETE FROM roles WHERE id = 1;

-- Error: update or delete on table "roles" violates foreign key constraint
```

### Test Valid Insert

```sql
-- This should SUCCEED
INSERT INTO users (email, password, name, role_id, role)
VALUES ('newuser@example.com', 'hash', 'New User', 4, 'parent');

-- Success!
```

---

## Rollback Instructions

If needed, rollback with:

```sql
-- Drop index
DROP INDEX IF EXISTS idx_users_role_id;

-- Drop FK constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role_id;

-- Drop column
ALTER TABLE users DROP COLUMN IF EXISTS role_id;
```

**Note:** Only rollback if absolutely necessary. Migration is safe and tested.

---

## Files Changed

1. ✅ `db/migration-add-users-roles-fk.sql` - Migration script
2. ✅ `run-migration-users-roles-fk.js` - Migration runner
3. ✅ `check-users-roles-fk.js` - Verification script
4. ✅ `DATABASE_ERD.md` - Updated ERD
5. ✅ `DATABASE_ERD_SIMPLE.md` - Updated simplified ERD
6. ✅ `USERS_ROLES_RELATIONSHIP.md` - Updated documentation
7. ✅ `MIGRATION_USERS_ROLES_FK_SUMMARY.md` - This file

---

## Next Steps

### Immediate (Done ✅)
- [x] Run migration
- [x] Verify FK constraint
- [x] Update ERD documentation
- [x] Test data integrity

### Short-term (TODO)
- [ ] Update application code to use `role_id`
- [ ] Update API responses to include role object
- [ ] Update frontend to use role object
- [ ] Add tests for FK constraint

### Long-term (TODO)
- [ ] Fully migrate all code to use `role_id`
- [ ] Remove all references to `role` VARCHAR
- [ ] Drop `users.role` column
- [ ] Update all documentation

---

## Summary

✅ **Migration Successful!**

**What we achieved:**
- ✅ Added `users.role_id` column
- ✅ Created FK constraint to `roles.id`
- ✅ Populated all existing data
- ✅ Verified data integrity
- ✅ Maintained backward compatibility
- ✅ Updated documentation

**Database now has:**
- ✅ Proper FK relationship
- ✅ Referential integrity
- ✅ Better data consistency
- ✅ Industry best practice

**Next:** Update application code to use `role_id` instead of `role` VARCHAR.

🎉 **users ↔ roles now have proper Foreign Key relationship!**
