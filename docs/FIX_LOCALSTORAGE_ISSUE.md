# Fix LocalStorage Issue - Step by Step

## 🔴 Problem
LocalStorage tidak terisi setelah login (tidak ada `accessible-menus` dan `menus-role`)

## ✅ Solution

### Step 1: Hard Refresh Browser (PENTING!)

**Kenapa?** Browser mungkin masih pakai JavaScript lama yang belum ada kode localStorage.

**Cara:**
- **Windows:** `Ctrl + Shift + R` atau `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`
- **Atau:** Buka DevTools (F12) → klik kanan tombol refresh → pilih "Empty Cache and Hard Reload"

---

### Step 2: Restart Development Server

```bash
# Stop server (Ctrl+C)
# Then start again
npm run dev
# or
yarn dev
```

---

### Step 3: Clear Everything & Test

1. **Clear Browser Cache & LocalStorage**
   ```javascript
   // Di Console (F12)
   localStorage.clear()
   sessionStorage.clear()
   ```

2. **Logout** (jika sudah login)

3. **Close all browser tabs** untuk localhost:3000

4. **Open new tab** → http://localhost:3000/dashboard/login

5. **Open DevTools (F12)** → Tab "Console"

6. **Login**

7. **Watch Console** - harus muncul:
   ```
   🔍 Fetching menus for role: staff
   📡 Menu API response status: 200
   📋 Menu data received: {success: true, data: [...]}
   ✅ Menus saved to localStorage
      - accessible-menus: 5 items
      - menus-role: staff
   ```

8. **Check LocalStorage**
   - Tab "Application" → "Local Storage" → http://localhost:3000
   - Harus ada 2 keys: `accessible-menus` dan `menus-role`

---

### Step 4: Verify Code is Running

Jika console log tidak muncul sama sekali, berarti kode tidak dijalankan.

**Test di Console:**
```javascript
// Cek apakah fungsi ada
console.log(typeof localStorage)  // Should be "object"

// Test manual
localStorage.setItem('test', 'hello')
localStorage.getItem('test')  // Should return "hello"
localStorage.removeItem('test')
```

---

## 🐛 Troubleshooting

### Issue 1: Console Log Tidak Muncul

**Kemungkinan:**
- Browser belum reload kode baru
- Development server belum restart
- File belum ter-compile

**Solusi:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Restart dev server
3. Check terminal - ada error compile?

---

### Issue 2: Console Log Muncul Tapi LocalStorage Kosong

**Kemungkinan:**
- Error di try-catch
- API call gagal
- menuData.data undefined

**Debug:**
```javascript
// Di Console, setelah login
// Cek manual
fetch('/api/dashboard/menu?role=staff')
  .then(r => r.json())
  .then(d => {
    console.log('API Response:', d)
    localStorage.setItem('accessible-menus', JSON.stringify(d.data))
    localStorage.setItem('menus-role', 'staff')
    console.log('Manual save done!')
  })
```

---

### Issue 3: API Call Gagal

**Check Network Tab:**
1. Open DevTools → Network tab
2. Login
3. Look for `/api/dashboard/menu?role=...` request
4. Check status code (should be 200)
5. Check response data

**If 404 or 500:**
- Check server logs
- Verify API endpoint exists
- Run: `node test-menu-localstorage.js`

---

## 🎯 Expected Behavior

### After Login:

**Console Output:**
```
🔍 Fetching menus for role: staff
📡 Menu API response status: 200
📋 Menu data received: {success: true, data: Array(5), total: 5}
✅ Menus saved to localStorage
   - accessible-menus: 5 items
   - menus-role: staff
```

**LocalStorage:**
```javascript
// Key: accessible-menus
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
  // ... 4 more items for staff
]

// Key: menus-role
"staff"
```

**Network Tab:**
- Should see: `GET /api/dashboard/menu?role=staff` with status 200

---

## 🔧 Manual Fix (If Still Not Working)

If automatic save doesn't work, you can manually set localStorage:

```javascript
// In Console (F12)
// After login, run this:

fetch('/api/dashboard/menu?role=staff')
  .then(r => r.json())
  .then(data => {
    console.log('Fetched:', data)
    localStorage.setItem('accessible-menus', JSON.stringify(data.data))
    localStorage.setItem('menus-role', 'staff')
    console.log('✅ Manually saved to localStorage')
    location.reload()  // Reload page
  })
```

---

## 📋 Checklist

Before reporting issue, verify:

- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Restarted dev server
- [ ] Cleared localStorage
- [ ] Logged out and in again
- [ ] Opened DevTools Console before login
- [ ] Watched for console logs (🔍 📡 📋 ✅)
- [ ] Checked Network tab for API call
- [ ] Verified API works (run test script)
- [ ] Checked Application tab for localStorage keys

---

## 🎬 Video Steps

1. **Prepare:**
   - Stop dev server
   - Start dev server: `npm run dev`
   - Close all browser tabs

2. **Open Fresh:**
   - New browser tab
   - http://localhost:3000/dashboard/login
   - Open DevTools (F12)
   - Go to Console tab

3. **Clear:**
   - Run: `localStorage.clear()`
   - Logout if logged in

4. **Login:**
   - Enter credentials
   - Click login
   - **WATCH CONSOLE** for logs

5. **Verify:**
   - Console should show 🔍 📡 📋 ✅
   - Application tab → Local Storage → should have 2 keys
   - Network tab → should have /api/dashboard/menu call

---

## 📞 Still Not Working?

Share screenshot of:
1. **Console tab** (after login)
2. **Network tab** (filter: menu)
3. **Application tab** → Local Storage
4. **Terminal** (dev server logs)

---

*Last Updated: November 29, 2024*
