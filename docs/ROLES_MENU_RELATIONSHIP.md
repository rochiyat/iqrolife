# Roles & Menu Relationship

## 🔗 Relationship Overview

Ada **2 cara** relasi antara `roles` dan `menu` tables:

### 1. Menu → Roles (menu.roles)
**Direction:** Menu menentukan role mana yang bisa akses

**Structure:**
```sql
menu table:
- id: integer
- name: varchar
- label: varchar
- roles: jsonb  ← Array of role names
```

**Example:**
```json
{
  "id": 1,
  "name": "home",
  "label": "Dashboard",
  "roles": ["superadmin", "staff", "teacher", "parent"]
}

{
  "id": 4,
  "name": "users",
  "label": "Users",
  "roles": ["superadmin"]  // Only superadmin can access
}
```

**Usage:**
```sql
-- Get menus accessible by 'staff' role
SELECT * FROM menu 
WHERE roles @> '["staff"]'::jsonb;

-- Check if menu is accessible by role
SELECT * FROM menu 
WHERE name = 'users' 
  AND roles @> '["staff"]'::jsonb;
```

---

### 2. Roles → Menu (roles.permissions.menus)
**Direction:** Role menentukan menu mana yang bisa diakses

**Structure:**
```sql
roles table:
- id: integer
- name: varchar
- display_name: varchar
- permissions: jsonb  ← Contains menus array
```

**Example:**
```json
{
  "id": 1,
  "name": "superadmin",
  "display_name": "Super Admin",
  "permissions": {
    "menus": ["home", "calon-murid", "users", "roles", "menu", "settings"],
    "canManageUsers": true,
    "canManageRoles": true,
    ...
  }
}

{
  "id": 4,
  "name": "parent",
  "display_name": "Parent",
  "permissions": {
    "menus": ["home", "formulir"],  // Only home and formulir
    "canManageForms": true,
    ...
  }
}
```

**Usage:**
```sql
-- Get menus accessible by role
SELECT permissions->'menus' as accessible_menus
FROM roles 
WHERE name = 'staff';

-- Check if role can access specific menu
SELECT * FROM roles 
WHERE name = 'staff' 
  AND permissions->'menus' @> '["users"]'::jsonb;
```

---

## 📊 Comparison

| Aspect | menu.roles | roles.permissions.menus |
|--------|-----------|------------------------|
| **Direction** | Menu → Roles | Roles → Menu |
| **Perspective** | "Which roles can access this menu?" | "Which menus can this role access?" |
| **Storage** | Array in menu table | Array in roles table |
| **Query** | Filter menus by role | Filter roles by menu |
| **Use Case** | Menu management page | Role management page |
| **Current Usage** | ✅ Used in menu table | ✅ Used in roles page |

---

## 🎯 Which One to Use?

### Both are Valid! They serve different purposes:

### Use `menu.roles` when:
- Building navigation menu for a user
- Filtering menus based on user's role
- Menu management (admin sets which roles can access)
- **Example:** Sidebar component

```typescript
// Get menus for current user's role
const menus = await db.query(`
  SELECT * FROM menu 
  WHERE roles @> $1::jsonb
  ORDER BY order_index
`, [JSON.stringify([userRole])]);
```

### Use `roles.permissions.menus` when:
- Managing role permissions (admin page)
- Bulk updating menu access for a role
- Role-based access control (RBAC) configuration
- **Example:** Roles management page (current implementation)

```typescript
// Update menu access for a role
await db.query(`
  UPDATE roles 
  SET permissions = jsonb_set(permissions, '{menus}', $1::jsonb)
  WHERE name = $2
`, [JSON.stringify(menuIds), roleName]);
```

---

## 🔄 Synchronization

**Important:** These two approaches should be **synchronized**!

### Current State:
- ✅ `menu.roles` - Defined in menu table
- ✅ `roles.permissions.menus` - Defined in roles table
- ⚠️ **Not automatically synchronized**

### Recommendation:

#### Option 1: Use menu.roles as Source of Truth (Recommended)
**Pros:**
- Centralized menu access control
- Easier to manage (one place to update)
- Better for dynamic menu systems

**Implementation:**
```sql
-- When querying menus for a user
SELECT m.* 
FROM menu m
WHERE m.roles @> $1::jsonb  -- User's role
  AND m.is_active = true
ORDER BY m.order_index;
```

#### Option 2: Use roles.permissions.menus as Source of Truth
**Pros:**
- Better for complex permission systems
- More flexible (can add other permissions)
- Current implementation in roles page

**Implementation:**
```sql
-- When checking if user can access menu
SELECT r.permissions->'menus' 
FROM roles r
WHERE r.name = $1  -- User's role
  AND r.permissions->'menus' @> $2::jsonb;  -- Menu name
```

#### Option 3: Hybrid (Current Implementation)
**Use both:**
- `menu.roles` for menu filtering (sidebar)
- `roles.permissions.menus` for role management (admin page)

**Sync Strategy:**
```typescript
// When updating role permissions
async function updateRoleMenuAccess(roleName: string, menuIds: string[]) {
  // 1. Update roles.permissions.menus
  await db.query(`
    UPDATE roles 
    SET permissions = jsonb_set(permissions, '{menus}', $1::jsonb)
    WHERE name = $2
  `, [JSON.stringify(menuIds), roleName]);
  
  // 2. Update menu.roles for each menu
  // Add role to menus in menuIds
  for (const menuId of menuIds) {
    await db.query(`
      UPDATE menu 
      SET roles = CASE 
        WHEN NOT (roles @> $1::jsonb) 
        THEN roles || $1::jsonb 
        ELSE roles 
      END
      WHERE name = $2
    `, [JSON.stringify([roleName]), menuId]);
  }
  
  // 3. Remove role from menus not in menuIds
  await db.query(`
    UPDATE menu 
    SET roles = (
      SELECT jsonb_agg(elem)
      FROM jsonb_array_elements(roles) elem
      WHERE elem::text != $1
    )
    WHERE name != ALL($2::text[])
      AND roles @> $1::jsonb
  `, [JSON.stringify(roleName), menuIds]);
}
```

---

## 🏗️ Database Schema

### Current Schema:

```sql
-- roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',  -- Contains menus array
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- menu table
CREATE TABLE menu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  href VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES menu(id),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  roles JSONB NOT NULL DEFAULT '[]',  -- Array of role names
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### No Direct Foreign Key
**Why?** Flexible JSONB design allows:
- Dynamic role assignment
- No cascade delete issues
- Easy to add/remove roles
- Better for evolving requirements

---

## 📝 Current Implementation

### Roles Page (`/dashboard/roles`)
**Uses:** `roles.permissions.menus`

```typescript
// Save menu access
const rolesToUpdate = roles.map((role) => ({
  id: role.id,
  permissions: { 
    ...role.permissions, 
    menus: menuAccess[role.name] || [] 
  },
}));

await fetch('/api/dashboard/roles', {
  method: 'PUT',
  body: JSON.stringify(rolesToUpdate),
});
```

### Menu Page (if exists)
**Should use:** `menu.roles`

```typescript
// Save role access for menu
await fetch('/api/dashboard/menu', {
  method: 'PUT',
  body: JSON.stringify({
    id: menuId,
    roles: selectedRoles,  // Array of role names
  }),
});
```

### Sidebar Component
**Should query:** `menu.roles`

```typescript
// Get menus for current user
const menus = await fetch(
  `/api/dashboard/menu?role=${userRole}`
);
```

---

## 🎯 Recommendations

### 1. Choose Primary Source of Truth
**Recommendation:** Use `menu.roles` as primary

**Reasons:**
- Menu-centric approach is more intuitive
- Easier to manage in menu management page
- Better for dynamic menu systems
- Aligns with common RBAC patterns

### 2. Keep roles.permissions.menus for Backward Compatibility
- Don't remove it (breaking change)
- Use it in roles management page
- Sync it with menu.roles

### 3. Create Sync Function
```sql
-- Function to sync roles.permissions.menus from menu.roles
CREATE OR REPLACE FUNCTION sync_role_menus()
RETURNS void AS $$
DECLARE
  role_record RECORD;
  menu_list TEXT[];
BEGIN
  FOR role_record IN SELECT name FROM roles LOOP
    -- Get all menus accessible by this role
    SELECT ARRAY_AGG(name) INTO menu_list
    FROM menu
    WHERE roles @> jsonb_build_array(role_record.name);
    
    -- Update role's permissions.menus
    UPDATE roles
    SET permissions = jsonb_set(
      permissions, 
      '{menus}', 
      to_jsonb(menu_list)
    )
    WHERE name = role_record.name;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 4. Add Indexes for Performance
```sql
-- Index for menu.roles queries
CREATE INDEX idx_menu_roles ON menu USING GIN (roles);

-- Index for roles.permissions queries
CREATE INDEX idx_roles_permissions ON roles USING GIN (permissions);
```

---

## 📚 Summary

**Question:** Apakah role dan menu ada relasinya?

**Answer:** **YA, ada 2 cara relasi:**

1. **menu.roles** (JSONB array) - Menu menyimpan role mana yang bisa akses
2. **roles.permissions.menus** (JSONB array) - Role menyimpan menu mana yang bisa diakses

**Relationship Type:** 
- Many-to-Many (flexible, no FK)
- Stored in JSONB columns
- No direct foreign key constraint

**Current Usage:**
- ✅ Roles page uses `roles.permissions.menus`
- ✅ Menu table has `menu.roles`
- ⚠️ Need synchronization strategy

**Recommendation:**
- Use `menu.roles` as primary source
- Keep `roles.permissions.menus` for backward compatibility
- Implement sync function
- Add indexes for performance

---

*Documented on: November 29, 2024*
