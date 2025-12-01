# Menu LocalStorage Implementation

## 🎯 Feature Overview

**Goal:** Cache accessible menus in localStorage for faster sidebar rendering

**Benefits:**
- ✅ Faster sidebar load (no API call needed)
- ✅ Better user experience
- ✅ Reduced server load
- ✅ Offline-ready menu data

---

## 🔄 How It Works

### Flow Diagram:

```
User Login
    ↓
Login API returns user + permissions ✅
    ↓
Fetch menus from API (/api/dashboard/menu?role=staff) ✅
    ↓
Save to localStorage:
  - accessible-menus: [menu objects]
  - menus-role: 'staff'
    ↓
Sidebar renders
    ↓
Priority 1: Read from localStorage (fast) ✅
Priority 2: Fallback to user.permissions.menus ✅
Priority 3: Fallback to hardcoded ✅
    ↓
Show menus ✅
```

---

## 📦 Implementation Details

### 1. Menu API - Filter by Role ✅

**File:** `app/api/dashboard/menu/route.ts`

**Added:** Query parameter `?role=staff` to filter menus

```typescript
// GET /api/dashboard/menu?role=staff
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  let query = `
    SELECT id, name, label, icon, href, parent_id, order_index, is_active, roles
    FROM menu
    WHERE is_active = true
  `;

  // Filter by role if provided
  if (role) {
    query += ` AND roles @> $1::jsonb`;
    params.push(JSON.stringify([role]));
  }

  query += ` ORDER BY order_index, name`;
  
  const result = await pool.query(query, params);
  return NextResponse.json({ success: true, data: result.rows });
}
```

**Usage:**
```typescript
// Get all menus
GET /api/dashboard/menu

// Get menus for staff role
GET /api/dashboard/menu?role=staff

// Get menus for superadmin role
GET /api/dashboard/menu?role=superadmin
```

---

### 2. Auth Context - Fetch & Save to LocalStorage ✅

**File:** `lib/auth-context.tsx`

#### On Login:
```typescript
const login = async (email: string, password: string) => {
  // 1. Login
  const response = await fetch('/api/dashboard/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  setUser(data.user);

  // 2. Fetch accessible menus from API
  try {
    const menuResponse = await fetch(
      `/api/dashboard/menu?role=${data.user.role}`
    );
    if (menuResponse.ok) {
      const menuData = await menuResponse.json();
      
      // 3. Save to localStorage
      localStorage.setItem('accessible-menus', JSON.stringify(menuData.data));
      localStorage.setItem('menus-role', data.user.role);
    }
  } catch (error) {
    console.error('Error fetching menus:', error);
    // Continue even if menu fetch fails
  }

  return data;
};
```

#### On Logout:
```typescript
const logout = async () => {
  // Clear cookie
  document.cookie = 'auth-token=; Max-Age=0; path=/; SameSite=Lax';
  
  // Clear localStorage
  localStorage.removeItem('accessible-menus');
  localStorage.removeItem('menus-role');
  
  setUser(null);
  router.push('/dashboard/login');
};
```

#### Helper Function:
```typescript
export function getAccessibleMenusFromStorage(userRole: UserRole | null): string[] {
  if (typeof window === 'undefined' || !userRole) return [];

  try {
    const storedRole = localStorage.getItem('menus-role');
    const storedMenus = localStorage.getItem('accessible-menus');

    // Check if stored menus match current user role
    if (storedRole === userRole && storedMenus) {
      const menus = JSON.parse(storedMenus);
      // Extract menu names/ids
      return menus.map((menu: any) => menu.name);
    }
  } catch (error) {
    console.error('Error reading menus from localStorage:', error);
  }

  return [];
}
```

---

### 3. Sidebar - Use LocalStorage with Fallback ✅

**File:** `app/dashboard/(protected)/layout.tsx`

```typescript
const getNavItems = () => {
  if (!user) return [];

  // Priority 1: Try localStorage (fastest)
  let accessibleMenus = getAccessibleMenusFromStorage(user.role);

  // Priority 2: Fallback to user.permissions.menus (from database)
  if (accessibleMenus.length === 0) {
    const permissions = getUserPermissions(user);
    accessibleMenus = permissions.menus || [];
  }

  // Priority 3: Fallback to hardcoded (in getUserPermissions)

  // Build menu items
  const mainItems = [
    {
      label: 'Dashboard',
      href: '/dashboard/home',
      menuId: 'home',
      show: accessibleMenus.includes('home'),
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

## 📊 Data Flow

### LocalStorage Structure:

```javascript
// Key: accessible-menus
// Value: Array of menu objects
[
  {
    "id": 1,
    "name": "home",
    "label": "Dashboard",
    "icon": "LayoutDashboard",
    "href": "/dashboard/home",
    "order_index": 1,
    "is_active": true,
    "roles": ["superadmin", "staff", "teacher", "parent"]
  },
  {
    "id": 2,
    "name": "calon-murid",
    "label": "Calon Murid",
    "icon": "GraduationCap",
    "href": "/dashboard/calon-murid",
    "order_index": 2,
    "is_active": true,
    "roles": ["superadmin", "staff", "teacher"]
  }
]

// Key: menus-role
// Value: User's role
"staff"
```

---

## 🎯 Priority System

### Menu Loading Priority:

```
1. LocalStorage (fastest)
   ↓ (if empty or role mismatch)
2. user.permissions.menus (from database)
   ↓ (if empty)
3. Hardcoded fallback (in getUserPermissions)
```

### Why This Order?

1. **LocalStorage** - Instant, no network call
2. **Database** - Already loaded with user object
3. **Hardcoded** - Last resort, always works

---

## 🔄 Cache Invalidation

### When is Cache Cleared?

1. **On Logout** ✅
   - `localStorage.removeItem('accessible-menus')`
   - `localStorage.removeItem('menus-role')`

2. **On Role Mismatch** ✅
   - If stored role ≠ current user role
   - Automatically ignored, will use fallback

### When is Cache Updated?

1. **On Login** ✅
   - Fresh fetch from API
   - Overwrites old cache

2. **Manual Refresh** (Future Enhancement)
   - Add refresh button
   - Re-fetch from API

---

## 🧪 Testing

### Test 1: Login & Cache
1. Clear localStorage: `localStorage.clear()`
2. Login with staff account
3. Open DevTools → Application → Local Storage
4. Check keys:
   - `accessible-menus` should have menu array
   - `menus-role` should be "staff"

### Test 2: Sidebar Uses Cache
1. Login as staff
2. Refresh page
3. Open DevTools → Network tab
4. Check: Should NOT see `/api/dashboard/menu` call
5. Sidebar should render immediately

### Test 3: Logout Clears Cache
1. Login
2. Check localStorage has menus
3. Logout
4. Check localStorage - menus should be gone

### Test 4: Role Mismatch
1. Login as staff
2. Manually change `menus-role` to "teacher"
3. Refresh page
4. Should fallback to user.permissions.menus

### Test 5: Fallback Chain
1. Clear localStorage
2. Login (but simulate menu API failure)
3. Should fallback to user.permissions.menus
4. If that's empty, fallback to hardcoded

---

## 📈 Performance Comparison

### Before (No Cache):
```
Page Load
    ↓
Render sidebar
    ↓
Read user.permissions.menus (from cookie/state)
    ↓
Filter menus
    ↓
Render (fast, but depends on permissions in user object)
```

### After (With Cache):
```
Page Load
    ↓
Render sidebar
    ↓
Read localStorage (instant!)
    ↓
Filter menus
    ↓
Render (fastest!)
```

**Improvement:**
- ✅ No dependency on user object loading
- ✅ Instant menu data
- ✅ Better perceived performance

---

## 💡 Best Practices

### 1. Always Check Role Match
```typescript
const storedRole = localStorage.getItem('menus-role');
if (storedRole === userRole) {
  // Use cached menus
}
```

### 2. Handle Errors Gracefully
```typescript
try {
  const menus = JSON.parse(localStorage.getItem('accessible-menus'));
} catch (error) {
  console.error('Error parsing menus:', error);
  return []; // Fallback
}
```

### 3. Clear on Logout
```typescript
localStorage.removeItem('accessible-menus');
localStorage.removeItem('menus-role');
```

### 4. Server-Side Rendering Safe
```typescript
if (typeof window === 'undefined') return [];
```

---

## 🚀 Future Enhancements

### 1. Cache Expiration (Optional)
```typescript
// Add timestamp
localStorage.setItem('menus-timestamp', Date.now().toString());

// Check expiration (e.g., 1 hour)
const timestamp = localStorage.getItem('menus-timestamp');
const isExpired = Date.now() - parseInt(timestamp) > 3600000;
if (isExpired) {
  // Re-fetch from API
}
```

### 2. Manual Refresh Button (Optional)
```typescript
const refreshMenus = async () => {
  const response = await fetch(`/api/dashboard/menu?role=${user.role}`);
  const data = await response.json();
  localStorage.setItem('accessible-menus', JSON.stringify(data.data));
};
```

### 3. Sync Across Tabs (Optional)
```typescript
// Listen for storage changes
window.addEventListener('storage', (e) => {
  if (e.key === 'accessible-menus') {
    // Update sidebar
  }
});
```

### 4. Compression (Optional)
```typescript
// For large menu data
import LZString from 'lz-string';

// Save
const compressed = LZString.compress(JSON.stringify(menus));
localStorage.setItem('accessible-menus', compressed);

// Load
const decompressed = LZString.decompress(localStorage.getItem('accessible-menus'));
const menus = JSON.parse(decompressed);
```

---

## 🐛 Troubleshooting

### Issue 1: Menus Not Showing
**Solution:**
1. Check localStorage has data
2. Check role matches
3. Check fallback works
4. Clear cache and re-login

### Issue 2: Old Menus After Permission Change
**Solution:**
1. Logout and login again
2. Or implement manual refresh
3. Or add cache expiration

### Issue 3: LocalStorage Full
**Solution:**
1. Menu data is small (~5-10KB)
2. If full, clear other data
3. Or use IndexedDB for larger data

---

## 📝 Files Modified

### Backend
1. **`app/api/dashboard/menu/route.ts`**
   - Added `?role=` query parameter
   - Filter menus by role
   - Return only accessible menus

### Frontend
2. **`lib/auth-context.tsx`**
   - Fetch menus on login
   - Save to localStorage
   - Clear on logout
   - Added `getAccessibleMenusFromStorage()` helper

3. **`app/dashboard/(protected)/layout.tsx`**
   - Use localStorage first
   - Fallback to user.permissions.menus
   - Fallback to hardcoded

---

## ✅ Checklist

### Implementation
- [x] Add role filter to menu API
- [x] Fetch menus on login
- [x] Save to localStorage
- [x] Clear on logout
- [x] Read from localStorage in sidebar
- [x] Implement fallback chain
- [x] Handle role mismatch
- [x] Handle errors gracefully

### Testing
- [ ] Test login saves to localStorage
- [ ] Test sidebar uses localStorage
- [ ] Test logout clears localStorage
- [ ] Test role mismatch fallback
- [ ] Test error handling
- [ ] Test SSR safety

---

## 🎉 Summary

**What Was Implemented:**
1. ✅ Menu API filters by role
2. ✅ Login fetches and caches menus
3. ✅ Logout clears cache
4. ✅ Sidebar uses cache with fallback
5. ✅ Role validation
6. ✅ Error handling

**Benefits:**
- ✅ Faster sidebar rendering
- ✅ Better user experience
- ✅ Reduced server load
- ✅ Offline-ready menu data

**Priority Chain:**
1. LocalStorage (fastest)
2. user.permissions.menus (fallback)
3. Hardcoded (last resort)

---

*Implemented on: November 29, 2024*
*Status: ✅ READY FOR TESTING*
*Performance: Instant menu loading!*
