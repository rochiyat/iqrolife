# users ↔ roles Relationship

## Current Implementation

### No Foreign Key Constraint

**users table:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'parent',  -- ⚠️ VARCHAR, not FK!
  ...
);
```

**roles table:**
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,  -- superadmin, staff, teacher, parent
  display_name VARCHAR(255) NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}',
  ...
);
```

### Implicit Relationship

**Relationship:** `users.role` (string) matches `roles.name` (string)

```sql
-- Get user with permissions
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  r.display_name as role_display_name,
  r.permissions
FROM users u
LEFT JOIN roles r ON u.role = r.name
WHERE u.id = 1;
```

---

## Why No Foreign Key?

### Pros ✅

1. **Flexibility**
   - Can create users without role definition in `roles` table
   - Default roles hardcoded in application
   - No need to seed `roles` table first

2. **Simplicity**
   - Direct string comparison
   - No FK constraint management
   - Easy to understand

3. **Application-Level Control**
   - Role validation in application code
   - Can use enums/constants
   - Type-safe in TypeScript

### Cons ⚠️

1. **No Referential Integrity**
   - Can insert invalid role names
   - Typo in role = no permissions
   - No DB-level validation

2. **Data Inconsistency Risk**
   ```sql
   -- This is allowed but wrong!
   INSERT INTO users (email, password, name, role)
   VALUES ('user@example.com', 'hash', 'User', 'invalid_role');
   ```

3. **Maintenance**
   - Need to keep role names in sync
   - Application code must validate
   - Can't rely on DB constraints

---

## Current Role System

### Hardcoded Roles

**In Application:**
```typescript
// lib/auth-context.tsx
export type UserRole = 'superadmin' | 'staff' | 'teacher' | 'parent';

export const rolePermissions = {
  superadmin: {
    canAccessAll: true,
    canManageUsers: true,
    canManageRoles: true,
    // ...
  },
  staff: {
    canAccessAll: false,
    canManageUsers: false,
    // ...
  },
  // ...
};
```

**In Database:**
```sql
-- db/seed-complete.sql
INSERT INTO roles (name, display_name, description, permissions) VALUES
('superadmin', 'Super Admin', 'Full access', '{"canAccessAll": true, ...}'::jsonb),
('staff', 'Staff', 'Limited access', '{"canManageStudents": true, ...}'::jsonb),
('teacher', 'Teacher', 'View only', '{"canViewStudents": true, ...}'::jsonb),
('parent', 'Parent', 'Own children', '{"canViewOwnChildren": true, ...}'::jsonb);
```

### Role Validation

**Application Level:**
```typescript
// Validate role before insert
const validRoles = ['superadmin', 'staff', 'teacher', 'parent'];
if (!validRoles.includes(role)) {
  throw new Error('Invalid role');
}
```

**Database Level:**
```sql
-- Could add CHECK constraint
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('superadmin', 'staff', 'teacher', 'parent'));
```

---

## Alternative Approaches

### Option 1: Add Foreign Key (Recommended)

**Change `users.role` to `users.role_id`:**

```sql
-- Migration
ALTER TABLE users ADD COLUMN role_id INTEGER;

-- Update existing data
UPDATE users u
SET role_id = r.id
FROM roles r
WHERE u.role = r.name;

-- Add FK constraint
ALTER TABLE users 
ADD CONSTRAINT fk_users_role_id 
FOREIGN KEY (role_id) REFERENCES roles(id);

-- Drop old column
ALTER TABLE users DROP COLUMN role;
```

**Pros:**
- ✅ Referential integrity
- ✅ Can't insert invalid roles
- ✅ Cascade updates/deletes
- ✅ Better data consistency

**Cons:**
- ⚠️ Breaking change
- ⚠️ Need migration
- ⚠️ More complex queries

### Option 2: Keep String + Add CHECK Constraint

**Add validation at DB level:**

```sql
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('superadmin', 'staff', 'teacher', 'parent'));
```

**Pros:**
- ✅ Simple migration
- ✅ DB-level validation
- ✅ No breaking changes

**Cons:**
- ⚠️ Still no FK relationship
- ⚠️ Need to update constraint when adding roles
- ⚠️ Can't cascade changes

### Option 3: Keep Current (Status Quo)

**No changes, rely on application validation:**

**Pros:**
- ✅ No migration needed
- ✅ Works as-is
- ✅ Simple

**Cons:**
- ⚠️ No DB-level protection
- ⚠️ Risk of data inconsistency
- ⚠️ Manual sync required

---

## Recommendation

### For Production: Option 1 (Add FK)

**Why:**
- Better data integrity
- Prevents invalid data
- Industry best practice
- Easier to maintain

**Migration Plan:**
1. Add `role_id` column
2. Populate from existing `role` values
3. Add FK constraint
4. Update application code
5. Drop old `role` column

### For Development: Option 2 (Add CHECK)

**Why:**
- Quick fix
- No breaking changes
- Better than nothing

**Implementation:**
```sql
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('superadmin', 'staff', 'teacher', 'parent'));
```

---

## Current Usage in Codebase

### 1. Role-Based Access Control

```typescript
// lib/auth-context.tsx
const { user } = useAuth();

if (user.role === 'parent') {
  // Show parent view
} else if (user.role === 'admin') {
  // Show admin view
}
```

### 2. API Filtering

```typescript
// app/api/dashboard/calon-murid/route.ts
if (user.role === 'parent') {
  query += ' WHERE user_id = $1';
  params.push(user.id);
}
```

### 3. Menu Access

```typescript
// components/dashboard/layout.tsx
const permissions = rolePermissions[user.role];

if (permissions.canManageUsers) {
  // Show users menu
}
```

### 4. Permission Check

```typescript
// lib/auth-context.tsx
export const rolePermissions = {
  superadmin: { canAccessAll: true, ... },
  staff: { canManageStudents: true, ... },
  teacher: { canViewStudents: true, ... },
  parent: { canViewOwnChildren: true, ... },
};
```

---

## Testing

### Check Current Roles

```sql
-- Get all roles
SELECT * FROM roles ORDER BY name;

-- Get users with roles
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  r.display_name,
  r.permissions
FROM users u
LEFT JOIN roles r ON u.role = r.name;

-- Find users with invalid roles
SELECT u.*
FROM users u
LEFT JOIN roles r ON u.role = r.name
WHERE r.id IS NULL;
```

### Validate Role Names

```sql
-- Check if all user roles exist in roles table
SELECT DISTINCT u.role
FROM users u
WHERE u.role NOT IN (SELECT name FROM roles);
```

---

## Summary

### Current State
- ❌ No FK constraint between `users` and `roles`
- ✅ Implicit relationship via name matching
- ✅ Works but not ideal
- ⚠️ Risk of data inconsistency

### Recommendation
- 🎯 **Short-term:** Add CHECK constraint
- 🎯 **Long-term:** Migrate to FK relationship

### Action Items
1. [ ] Add CHECK constraint for immediate protection
2. [ ] Plan migration to FK relationship
3. [ ] Update documentation
4. [ ] Add tests for role validation

---

## Related Files

- `db/schema-complete.sql` - Database schema
- `lib/auth-context.tsx` - Role definitions and permissions
- `app/api/dashboard/roles/route.ts` - Roles API
- `db/seed-complete.sql` - Role seed data

---

## Conclusion

While the current implementation works, **adding a foreign key relationship** would provide better data integrity and follow database best practices. For now, the system relies on application-level validation, which is acceptable but not ideal for production systems.

**Next Steps:**
1. Add CHECK constraint as quick fix
2. Plan proper FK migration
3. Update all role references in code
4. Add comprehensive tests
