# Menu Versioning System

## 🎯 Purpose
Automatically invalidate and refresh localStorage menu cache when menu structure changes, preventing users from seeing outdated menu data.

## 🔧 Implementation

### Version Constant
```typescript
const MENU_VERSION = '1.1';
```

This version number should be incremented whenever:
- New menus are added to database
- Menu roles are changed
- Menu structure is modified
- Menu order is updated

### How It Works

#### 1. During Login (`lib/auth-context.tsx`)
```typescript
// Save menus with version
localStorage.setItem('accessible-menus', JSON.stringify(menuData.data));
localStorage.setItem('menus-role', data.user.role);
localStorage.setItem('menus-version', MENU_VERSION); // ← Version stamp
```

#### 2. When Reading Menus (`getAccessibleMenusFromStorage()`)
```typescript
const MENU_VERSION = '1.1';
const storedVersion = localStorage.getItem('menus-version');

// Clear old data if version mismatch
if (storedVersion !== MENU_VERSION) {
  console.log('🔄 Menu version mismatch, clearing old data');
  localStorage.removeItem('accessible-menus');
  localStorage.removeItem('menus-role');
  localStorage.removeItem('menus-version');
  return []; // Force fallback to permissions
}
```

## 📝 Usage Guide

### When to Increment Version

**Increment the version** in both places when you:

1. **Add new menu to database**
   ```sql
   INSERT INTO menu (name, label, ...) VALUES ('new-menu', 'New Menu', ...);
   ```
   → Change `MENU_VERSION` from `'1.1'` to `'1.2'`

2. **Update menu roles**
   ```sql
   UPDATE menu SET roles = '["superadmin", "staff"]' WHERE name = 'some-menu';
   ```
   → Increment version

3. **Change menu structure**
   - Reorder menus
   - Change menu labels
   - Add/remove menu items
   → Increment version

### Where to Update

Update `MENU_VERSION` in **TWO places** in `lib/auth-context.tsx`:

1. **In `login()` function** (around line 130)
   ```typescript
   const MENU_VERSION = '1.1'; // ← Update here
   ```

2. **In `getAccessibleMenusFromStorage()` function** (around line 200)
   ```typescript
   const MENU_VERSION = '1.1'; // ← Update here (must match!)
   ```

## ✅ Benefits

### Before (Without Versioning)
- User logs in → Gets old menu from localStorage
- New menu added to database → User doesn't see it
- User must manually clear localStorage or logout/login
- Confusing user experience

### After (With Versioning)
- User logs in → Version check happens automatically
- Old version detected → localStorage cleared automatically
- Fresh menu data fetched from API
- User sees updated menus immediately
- No manual intervention needed

## 🔄 Automatic Cache Invalidation Flow

```
User Login
    ↓
Check localStorage version
    ↓
Version mismatch? ──Yes──→ Clear localStorage
    ↓                           ↓
   No                    Fetch fresh menus from API
    ↓                           ↓
Use cached menus         Save with new version
    ↓                           ↓
Render sidebar          Render sidebar
```

## 🐛 Troubleshooting

### Issue: User still sees old menus after version increment

**Check:**
1. Did you update version in BOTH places?
2. Did you use the same version string in both places?
3. Did user logout and login again?

**Solution:**
```typescript
// Both must match!
// In login():
const MENU_VERSION = '1.2';

// In getAccessibleMenusFromStorage():
const MENU_VERSION = '1.2';
```

### Issue: Menus disappear after login

**Check:**
1. Is menu API working? Check Network tab
2. Are menus in database? Run: `node check-formulir-list-menu.js`
3. Check browser console for errors

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Basic menu system without versioning |
| 1.1 | 2024-11-29 | Added versioning system + formulir-list menu |

## 🎓 Example: Adding New Menu

### Step 1: Add to Database
```sql
INSERT INTO menu (name, label, icon, href, order_index, roles)
VALUES ('reports', 'Reports', 'FileBarChart', '/dashboard/reports', 10, 
        '["superadmin", "staff"]'::jsonb);
```

### Step 2: Increment Version
```typescript
// lib/auth-context.tsx
const MENU_VERSION = '1.2'; // Changed from '1.1'
```

### Step 3: Add to Layout (if needed)
```typescript
// app/dashboard/(protected)/layout.tsx
{
  label: 'Reports',
  icon: FileBarChart,
  href: '/dashboard/reports',
  menuId: 'reports',
  show: accessibleMenus.includes('reports'),
}
```

### Step 4: Test
1. Logout
2. Login again
3. New menu should appear automatically
4. Check console: Should see "🔄 Menu version mismatch, clearing old data"

## 🔐 Security Note

This versioning system is for **cache invalidation only**, not security. Menu access control is still enforced by:
1. Database roles check in API
2. Server-side validation
3. Route protection in Next.js

The version system just ensures users see the correct menus for their role.
