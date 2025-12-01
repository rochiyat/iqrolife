# LocalStorage Debug Guide

## 🔍 Quick Check

### Key Names:
```javascript
// In browser console (F12)
localStorage.getItem('accessible-menus')  // Array of menu objects
localStorage.getItem('menus-role')        // User role string
```

---

## 📋 Step-by-Step Debug

### Step 1: Clear Everything
```javascript
// In browser console
localStorage.clear()
// Then logout and login again
```

### Step 2: Login & Watch Console
After login, you should see these logs:
```
🔍 Fetching menus for role: staff
📡 Menu API response status: 200
📋 Menu data received: {success: true, data: [...], total: 5}
✅ Menus saved to localStorage
   - accessible-menus: 5 items
   - menus-role: staff
```

### Step 3: Check LocalStorage
```javascript
// In browser console
console.log('Role:', localStorage.getItem('menus-role'));
console.log('Menus:', JSON.parse(localStorage.getItem('accessible-menus')));
```

**Expected Output:**
```javascript
Role: "staff"
Menus: [
  {
    id: 1,
    name: "home",
    label: "Dashboard",
    href: "/dashboard/home",
    ...
  },
  ...
]
```

---

## 🐛 Common Issues

### Issue 1: localStorage is empty

**Possible Causes:**
1. Menu API call failed
2. User role is undefined
3. Menu table is empty
4. JavaScript error in login function

**Debug Steps:**
```javascript
// 1. Check if API works
fetch('/api/dashboard/menu?role=staff')
  .then(r => r.json())
  .then(d => console.log('API Response:', d));

// 2. Check user object
// After login, in console:
document.cookie  // Should have auth-token

// 3. Check menu table
// Run: node test-menu-localstorage.js
```

---

### Issue 2: localStorage has wrong data

**Check:**
```javascript
// 1. Check role matches
const storedRole = localStorage.getItem('menus-role');
const currentRole = 'staff'; // Your current role
console.log('Match:', storedRole === currentRole);

// 2. Check menu structure
const menus = JSON.parse(localStorage.getItem('accessible-menus'));
console.log('Menu count:', menus.length);
console.log('First menu:', menus[0]);
```

---

### Issue 3: Sidebar not showing menus

**Debug:**
```javascript
// In browser console
import { getAccessibleMenusFromStorage } from '@/lib/auth-context';

// Check what sidebar sees
const menus = getAccessibleMenusFromStorage('staff');
console.log('Accessible menus:', menus);
```

---

## 🧪 Test Commands

### Test 1: API Endpoint
```bash
# Run test script
node test-menu-localstorage.js
```

### Test 2: Manual API Test
```javascript
// In browser console (after login)
fetch('/api/dashboard/menu?role=staff')
  .then(r => r.json())
  .then(d => {
    console.log('Success:', d.success);
    console.log('Total:', d.total);
    console.log('Menus:', d.data.map(m => m.name));
  });
```

### Test 3: Check Database
```bash
# Run database check
node check-roles-menu-relation.js
```

---

## 📊 Expected Flow

### On Login:
```
1. POST /api/dashboard/login
   ↓
2. Response: { user: { role: 'staff', ... } }
   ↓
3. GET /api/dashboard/menu?role=staff
   ↓
4. Response: { success: true, data: [...] }
   ↓
5. localStorage.setItem('accessible-menus', JSON.stringify(data))
   ↓
6. localStorage.setItem('menus-role', 'staff')
   ↓
7. ✅ Done
```

### On Page Load:
```
1. Sidebar renders
   ↓
2. getAccessibleMenusFromStorage('staff')
   ↓
3. Read localStorage.getItem('accessible-menus')
   ↓
4. Parse JSON
   ↓
5. Extract menu names
   ↓
6. Filter sidebar items
   ↓
7. ✅ Show menus
```

---

## 🔧 Manual Fix

If localStorage is not working, you can manually set it:

```javascript
// In browser console
const menus = [
  {
    id: 1,
    name: "home",
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard/home",
    order_index: 1,
    is_active: true,
    roles: ["superadmin", "staff", "teacher", "parent"]
  },
  {
    id: 2,
    name: "calon-murid",
    label: "Calon Murid",
    icon: "GraduationCap",
    href: "/dashboard/calon-murid",
    order_index: 2,
    is_active: true,
    roles: ["superadmin", "staff", "teacher"]
  },
  // Add more menus...
];

localStorage.setItem('accessible-menus', JSON.stringify(menus));
localStorage.setItem('menus-role', 'staff');

// Then refresh page
location.reload();
```

---

## 📝 Verification Checklist

- [ ] localStorage has 'accessible-menus' key
- [ ] localStorage has 'menus-role' key
- [ ] 'accessible-menus' is valid JSON array
- [ ] 'menus-role' matches current user role
- [ ] Console shows success logs on login
- [ ] Network tab shows /api/dashboard/menu call
- [ ] Sidebar shows correct menus
- [ ] Refresh page loads menus instantly

---

## 🎯 Quick Commands

```javascript
// Check localStorage
localStorage.getItem('accessible-menus')
localStorage.getItem('menus-role')

// Clear localStorage
localStorage.clear()

// Test API
fetch('/api/dashboard/menu?role=staff').then(r => r.json()).then(console.log)

// Check user
document.cookie

// Reload page
location.reload()
```

---

## 📞 Still Not Working?

1. **Check Console Logs**
   - Look for 🔍, 📡, 📋, ✅ or ❌ emojis
   - Check for error messages

2. **Check Network Tab**
   - Look for `/api/dashboard/menu?role=...` call
   - Check response status and data

3. **Check Database**
   - Run: `node check-roles-menu-relation.js`
   - Verify menu table has data
   - Verify roles column has correct values

4. **Check Code**
   - Verify `lib/auth-context.tsx` has localStorage code
   - Verify `app/api/dashboard/menu/route.ts` has role filter
   - Verify `app/dashboard/(protected)/layout.tsx` uses localStorage

---

*Debug Guide Created: November 29, 2024*
