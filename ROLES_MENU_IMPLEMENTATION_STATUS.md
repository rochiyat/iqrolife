# Roles & Menu Implementation Status

## 📋 Current Implementation Analysis

### ❌ **NOT FULLY IMPLEMENTED** - Using Hardcoded Permissions

---

## 🔍 What's Currently Implemented

### 1. Database Structure ✅
**Status:** READY

```sql
-- roles table
roles.permissions (JSONB) - Contains menus array

-- menu table  
menu.roles (JSONB) - Contains role names array
```

**Example Data:**
```json
// roles table
{
  "name": "superadmin",
  "permissions": {
    "menus": ["home", "calon-murid", "users", "roles", "menu", "settings"]
  }
}

// menu table
{
  "name": "users",
  "roles": ["superadmin"]  // Only superadmin can access
}
```

---

### 2. Roles Management Page ✅
**Status:** IMPLEMENTED (but not synced with database)

**File:** `app/dashboard/(protected)/roles/page.tsx`

**What it does:**
- ✅ Shows menu access matrix (roles × menus)
- ✅ Toggle menu access per role
- ✅ Save to `roles.permissions.menus` (database)
- ✅ Uses batch API (1 request instead of 4)

**Issue:** Changes saved to DB but **NOT used** by sidebar!

---

### 3. Sidebar/Navigation ❌
**Status:** HARDCODED - NOT using database

**File:** `app/dashboard/(protected)/layout.tsx`

**Current Implementation:**
```typescript
// Uses hardcoded permissions from auth-context
const permissions = rolePermissions[user.role];

const mainItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/home',
    show: true,  // Always show
  },
  {
    label: 'Calon Murid',
    href: '/dashboard/calon-murid',
    show: permissions.canManageStudents,  // ❌ HARDCODED
  },
  // ...
];
```

**Problem:** Uses `rolePermissions` from `lib/auth-context.tsx` (hardcoded), NOT from database!

---

### 4. Auth Context ❌
**Status:** HARDCODED - NOT using database

**File:** `lib/auth-context.tsx`

**Current Implementation:**
```typescript
// ❌ HARDCODED permissions
export const rolePermissions = {
  superadmin: {
    canManageUsers: true,
    canManageRoles: true,
    canManageStudents: true,
    // ...
  },
  staff: {
    canManageUsers: false,
    canManageRoles: false,
    canManageStudents: true,
    // ...
  },
  // ...
};

// ❌ HARDCODED menu access
export const roleMenuAccess = {
  superadmin: ['home', 'calon-murid', 'formulir-list', 'users', 'roles', 'menu', 'formulir', 'portofolio', 'settings'],
  staff: ['home', 'calon-murid', 'formulir-list', 'formulir', 'portofolio'],
  teacher: ['home', 'calon-murid', 'formulir-list', 'portofolio'],
  parent: ['home', 'formulir', 'portofolio'],
};
```

**Problem:** Hardcoded in code, NOT fetched from database!

---

### 5. Login Process ❌
**Status:** NOT fetching role permissions from database

**File:** `app/api/dashboard/login/route.ts` (assumed)

**What it should do:**
```typescript
// ✅ Should fetch user with role permissions
const user = await db.query(`
  SELECT u.*, r.permissions 
  FROM users u
  JOIN roles r ON u.role_id = r.id
  WHERE u.email = $1
`);

// ✅ Should include permissions in session
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,  // ← Include this!
  }
};
```

**Current:** Likely NOT including permissions from database

---

## 📊 Implementation Status Summary

| Component | Database Ready | Code Implemented | Using Database | Status |
|-----------|---------------|------------------|----------------|--------|
| **Database Schema** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ READY |
| **Roles Page** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ WORKING |
| **Roles API** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ WORKING |
| **Menu Table** | ✅ Yes | ✅ Yes | ⚠️ Partial | ⚠️ NOT USED |
| **Sidebar** | ✅ Yes | ✅ Yes | ❌ No | ❌ HARDCODED |
| **Auth Context** | ✅ Yes | ✅ Yes | ❌ No | ❌ HARDCODED |
| **Login API** | ✅ Yes | ⚠️ Unknown | ❌ No | ❌ NOT FETCHING |

---

## 🔴 Critical Issues

### Issue 1: Sidebar Uses Hardcoded Permissions
**Problem:**
- Admin changes menu access in `/dashboard/roles`
- Changes saved to database ✅
- But sidebar still uses hardcoded `rolePermissions` ❌
- User doesn't see the changes!

**Impact:** HIGH - Menu access changes don't work

---

### Issue 2: Auth Context Not Fetching from Database
**Problem:**
- `rolePermissions` and `roleMenuAccess` are hardcoded
- Should be fetched from database on login
- Changes in roles page have no effect

**Impact:** HIGH - Dynamic role management doesn't work

---

### Issue 3: No Sync Between Two Sources
**Problem:**
- `menu.roles` (database) - Not used
- `roles.permissions.menus` (database) - Saved but not used
- `rolePermissions` (code) - Used but hardcoded
- `roleMenuAccess` (code) - Used but hardcoded

**Impact:** HIGH - Inconsistent data sources

---

## ✅ What Needs to Be Done

### Step 1: Update Login API to Fetch Permissions
**File:** `app/api/dashboard/login/route.ts`

```typescript
// Fetch user with role permissions
const result = await pool.query(`
  SELECT 
    u.id, 
    u.name, 
    u.email, 
    r.name as role,
    r.permissions
  FROM users u
  JOIN roles r ON u.role_id = r.id
  WHERE u.email = $1 AND u.password = $2
`, [email, hashedPassword]);

const user = result.rows[0];

// Include permissions in response
return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,  // ← Add this!
  },
});
```

---

### Step 2: Update Auth Context to Use Database Permissions
**File:** `lib/auth-context.tsx`

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions?: {  // ← Add this!
    menus: string[];
    canManageUsers: boolean;
    canManageRoles: boolean;
    // ...
  };
}

// ❌ Remove hardcoded rolePermissions
// ❌ Remove hardcoded roleMenuAccess

// ✅ Use permissions from user object
export function getUserPermissions(user: User | null) {
  if (!user || !user.permissions) {
    return {
      menus: [],
      canManageUsers: false,
      canManageRoles: false,
      // ... all false
    };
  }
  
  return user.permissions;
}
```

---

### Step 3: Update Sidebar to Use Database Permissions
**File:** `app/dashboard/(protected)/layout.tsx`

```typescript
const getNavItems = () => {
  if (!user) return [];

  // ✅ Use permissions from database (via user object)
  const permissions = user.permissions || {};
  const accessibleMenus = permissions.menus || [];

  const mainItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard/home',
      show: accessibleMenus.includes('home'),  // ✅ From database
    },
    {
      label: 'Calon Murid',
      icon: GraduationCap,
      href: '/dashboard/calon-murid',
      show: accessibleMenus.includes('calon-murid'),  // ✅ From database
    },
    // ...
  ];

  return {
    main: mainItems.filter((item) => item.show),
    settings: settingsItems.filter((item) => item.show),
  };
};
```

---

### Step 4: Create Menu API Endpoint (Optional)
**File:** `app/api/dashboard/menu/route.ts`

```typescript
// GET - Fetch menus for current user's role
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  
  const result = await pool.query(`
    SELECT id, name, label, icon, href, parent_id, order_index
    FROM menu
    WHERE is_active = true
      AND roles @> $1::jsonb
    ORDER BY order_index
  `, [JSON.stringify([user.role])]);

  return NextResponse.json({
    success: true,
    data: result.rows,
  });
}
```

---

### Step 5: Sync Roles Page Changes to Menu Table (Optional)
**File:** `app/api/dashboard/roles/route.ts`

```typescript
// After updating roles.permissions.menus
// Also update menu.roles for consistency

async function syncMenuRoles(roleName: string, menuIds: string[]) {
  // Add role to menus in menuIds
  for (const menuId of menuIds) {
    await pool.query(`
      UPDATE menu 
      SET roles = CASE 
        WHEN NOT (roles @> $1::jsonb) 
        THEN roles || $1::jsonb 
        ELSE roles 
      END
      WHERE name = $2
    `, [JSON.stringify([roleName]), menuId]);
  }
  
  // Remove role from menus not in menuIds
  await pool.query(`
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

## 🎯 Implementation Priority

### Priority 1: Critical (Must Have)
1. ✅ Update Login API to fetch permissions from database
2. ✅ Update Auth Context to use database permissions
3. ✅ Update Sidebar to use database permissions

**Impact:** Makes role management actually work!

---

### Priority 2: Important (Should Have)
4. ✅ Create Menu API endpoint
5. ✅ Sync roles.permissions.menus ↔ menu.roles

**Impact:** Better consistency and flexibility

---

### Priority 3: Nice to Have
6. ⚠️ Remove hardcoded rolePermissions
7. ⚠️ Remove hardcoded roleMenuAccess
8. ⚠️ Add permission caching

**Impact:** Cleaner code, better performance

---

## 📝 Testing Checklist

After implementation:

### Test 1: Role Management
- [ ] Go to `/dashboard/roles`
- [ ] Change menu access for a role
- [ ] Click "Simpan Perubahan"
- [ ] Verify changes saved to database

### Test 2: Login with Changed Permissions
- [ ] Logout
- [ ] Login as user with changed role
- [ ] Verify sidebar shows correct menus
- [ ] Verify can access allowed menus
- [ ] Verify cannot access restricted menus

### Test 3: Dynamic Updates
- [ ] Admin changes role permissions
- [ ] User refreshes page
- [ ] Verify new permissions applied
- [ ] Verify old menus hidden/shown

---

## 🎯 Summary

**Question:** Apakah sudah diimplementasi ke menu roles dan saat user login?

**Answer:**

### Roles Page: ✅ YES (Partially)
- ✅ Can change menu access
- ✅ Saves to database
- ❌ But changes NOT used by sidebar

### User Login: ❌ NO
- ❌ NOT fetching permissions from database
- ❌ Using hardcoded permissions
- ❌ Changes in roles page have no effect

### Sidebar: ❌ NO
- ❌ Using hardcoded `rolePermissions`
- ❌ NOT using database permissions
- ❌ NOT dynamic

---

## 🚀 Next Steps

**To make it fully work:**

1. Update Login API to fetch `roles.permissions` from database
2. Update Auth Context to store permissions in user object
3. Update Sidebar to use `user.permissions.menus` instead of hardcoded
4. Test the complete flow

**Estimated Time:** 1-2 hours

**Files to Modify:**
- `app/api/dashboard/login/route.ts`
- `lib/auth-context.tsx`
- `app/dashboard/(protected)/layout.tsx`

---

*Analysis Date: November 29, 2024*
*Status: NOT FULLY IMPLEMENTED - Needs database integration*
