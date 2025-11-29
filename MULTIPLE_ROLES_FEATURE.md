## Multiple Roles Feature - Implementation Summary

## Overview

✅ **Users can now have multiple roles!**

Implemented **Many-to-Many relationship** between `users` and `roles` using junction table `user_roles`.

---

## Database Changes

### New Table: user_roles

```sql
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES users(id),
  is_primary BOOLEAN DEFAULT false,
  
  CONSTRAINT unique_user_role UNIQUE (user_id, role_id)
);
```

**Purpose:** Junction table for many-to-many relationship

**Key Features:**
- ✅ One user can have multiple roles
- ✅ One role can be assigned to multiple users
- ✅ Tracks when role was assigned
- ✅ Tracks who assigned the role
- ✅ Marks primary role for backward compatibility

---

## Relationship Diagram

### Before (One-to-Many)
```
users.role_id → roles.id
(one user, one role)
```

### After (Many-to-Many)
```
users ←→ user_roles ←→ roles
(one user, multiple roles)
```

---

## Migration Results

### Execution Output

```
✅ Migration completed successfully!
✅ Table created: user_roles
✅ Foreign key constraints added
📈 Data Statistics:
   Total role assignments: 4
   Users with roles: 4
   Primary roles: 4
```

### Test Results

```
✅ Multiple roles per user: WORKING
✅ Primary role tracking: WORKING
✅ Helper functions: WORKING
✅ Permission aggregation: WORKING

Example:
  👤 Admin Iqrolife (rochiyat@gmail.com)
     ⭐ PRIMARY - superadmin
        secondary - staff
  
  👤 Orang Tua (parent@iqrolife.com)
     ⭐ PRIMARY - parent
        secondary - teacher
```

---

## Helper Functions

### 1. get_user_roles(user_id)

Get all roles for a user:

```sql
SELECT * FROM get_user_roles(1);
```

**Returns:**
```
role_id | role_name  | display_name | is_primary | permissions
--------+------------+--------------+------------+-------------
1       | superadmin | Super Admin  | true       | {...}
2       | staff      | Staff        | false      | {...}
```

### 2. get_primary_role(user_id)

Get primary role for a user:

```sql
SELECT * FROM get_primary_role(1);
```

**Returns:**
```
role_id | role_name  | display_name | permissions
--------+------------+--------------+-------------
1       | superadmin | Super Admin  | {...}
```

---

## Usage Examples

### Add Role to User

```sql
-- Add staff role to user 1 (as secondary role)
INSERT INTO user_roles (user_id, role_id, is_primary, assigned_by)
VALUES (1, 2, false, 1);
```

### Remove Role from User

```sql
-- Remove staff role from user 1
DELETE FROM user_roles
WHERE user_id = 1 AND role_id = 2;
```

### Get Users with Specific Role

```sql
-- Get all users with 'teacher' role
SELECT u.*
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'teacher';
```

### Get Users with Multiple Roles

```sql
-- Find users with more than one role
SELECT 
  u.id,
  u.email,
  u.name,
  COUNT(ur.role_id) as role_count,
  STRING_AGG(r.name, ', ' ORDER BY ur.is_primary DESC) as roles
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.name
HAVING COUNT(ur.role_id) > 1;
```

### Change Primary Role

```sql
-- Make 'staff' the primary role for user 1
BEGIN;
  -- Remove primary flag from all roles
  UPDATE user_roles SET is_primary = false WHERE user_id = 1;
  -- Set new primary role
  UPDATE user_roles SET is_primary = true 
  WHERE user_id = 1 AND role_id = 2;
COMMIT;
```

### Get Aggregated Permissions

```sql
-- Get all permissions from all roles
SELECT 
  u.id,
  u.email,
  JSONB_AGG(r.permissions) as all_permissions
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.id = 1
GROUP BY u.id, u.email;
```

---

## API Integration

### Get User with Roles

```typescript
// API endpoint example
async function getUserWithRoles(userId: number) {
  const result = await pool.query(`
    SELECT 
      u.id,
      u.email,
      u.name,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', r.id,
          'name', r.name,
          'display_name', r.display_name,
          'is_primary', ur.is_primary,
          'permissions', r.permissions
        ) ORDER BY ur.is_primary DESC
      ) as roles
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE u.id = $1
    GROUP BY u.id, u.email, u.name
  `, [userId]);
  
  return result.rows[0];
}
```

**Response:**
```json
{
  "id": 1,
  "email": "rochiyat@gmail.com",
  "name": "Admin Iqrolife",
  "roles": [
    {
      "id": 1,
      "name": "superadmin",
      "display_name": "Super Admin",
      "is_primary": true,
      "permissions": {
        "canAccessAll": true,
        "canManageUsers": true,
        ...
      }
    },
    {
      "id": 2,
      "name": "staff",
      "display_name": "Staff",
      "is_primary": false,
      "permissions": {
        "canManageStudents": true,
        ...
      }
    }
  ]
}
```

---

## Permission Handling

### Strategy 1: Union (Any Permission)

User has permission if **ANY** of their roles has it:

```typescript
function hasPermission(user, permission) {
  return user.roles.some(role => 
    role.permissions[permission] === true
  );
}
```

### Strategy 2: Primary Role Only

Use only primary role permissions:

```typescript
function hasPermission(user, permission) {
  const primaryRole = user.roles.find(r => r.is_primary);
  return primaryRole?.permissions[permission] === true;
}
```

### Strategy 3: Intersection (All Permissions)

User has permission only if **ALL** roles have it:

```typescript
function hasPermission(user, permission) {
  return user.roles.every(role => 
    role.permissions[permission] === true
  );
}
```

**Recommended:** Strategy 1 (Union) - Most flexible and user-friendly

---

## Use Cases

### 1. Parent who is also a Teacher

```sql
-- User 4: parent (primary) + teacher (secondary)
INSERT INTO user_roles (user_id, role_id, is_primary)
VALUES 
  (4, 4, true),   -- parent (primary)
  (4, 3, false);  -- teacher (secondary)
```

**Benefits:**
- Can view own children (parent permission)
- Can view assigned students (teacher permission)
- Primary role determines default dashboard view

### 2. Staff with Admin Access

```sql
-- User 2: staff (primary) + superadmin (secondary)
INSERT INTO user_roles (user_id, role_id, is_primary)
VALUES 
  (2, 2, true),   -- staff (primary)
  (2, 1, false);  -- superadmin (secondary)
```

**Benefits:**
- Normal staff duties (primary)
- Admin access when needed (secondary)
- Audit trail of who has admin access

### 3. Temporary Role Assignment

```sql
-- Temporarily give parent user staff access
INSERT INTO user_roles (user_id, role_id, is_primary, assigned_by)
VALUES (4, 2, false, 1);

-- Later, remove temporary access
DELETE FROM user_roles 
WHERE user_id = 4 AND role_id = 2;
```

---

## Backward Compatibility

### Old System (Still Works)

```sql
-- users.role_id still exists
SELECT u.*, r.name as role_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.id;
```

### New System (Preferred)

```sql
-- user_roles for multiple roles
SELECT * FROM get_user_roles(1);
```

### Migration Path

```
Phase 1: Add user_roles table (DONE ✅)
    ↓
Phase 2: Migrate existing data (DONE ✅)
    ↓
Phase 3: Update application code
    ↓
Phase 4: Deprecate users.role_id
    ↓
Phase 5: Drop old columns
```

---

## Testing

### Test Script

```bash
node test-multiple-roles.js
```

**Tests:**
1. ✅ Add secondary role to user
2. ✅ Get all roles for user
3. ✅ Get primary role
4. ✅ Find users with multiple roles
5. ✅ Aggregate permissions
6. ✅ Helper functions

---

## Files Changed

1. ✅ `db/migration-add-multiple-roles.sql` - Migration script
2. ✅ `run-migration-multiple-roles.js` - Execution script
3. ✅ `test-multiple-roles.js` - Test script
4. ✅ `DATABASE_ERD.md` - Updated ERD
5. ✅ `DATABASE_ERD_SIMPLE.md` - Updated simplified ERD
6. ✅ `MULTIPLE_ROLES_FEATURE.md` - This documentation

---

## Summary

✅ **Feature Complete!**

**What we achieved:**
- ✅ Created `user_roles` junction table
- ✅ Implemented many-to-many relationship
- ✅ Added helper functions
- ✅ Migrated existing data
- ✅ Tested with real data
- ✅ Updated documentation

**Current Status:**
- ✅ User 1 (rochiyat@gmail.com): superadmin + staff
- ✅ User 4 (parent@iqrolife.com): parent + teacher
- ✅ All helper functions working
- ✅ Permission aggregation working

**Next Steps:**
- [ ] Update application code to support multiple roles
- [ ] Update API responses
- [ ] Update frontend UI
- [ ] Add role management interface

🎉 **Users can now have multiple roles!**
