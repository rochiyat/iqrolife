# Login Flow & LocalStorage Implementation

## Overview
Sistem login telah diupdate dengan role-based routing dan localStorage untuk menyimpan authentication data.

## Features

### 1. Role-Based Redirect
Setiap role akan diarahkan ke halaman yang sesuai setelah login:

| Role          | Redirect Route              | Description                    |
|---------------|----------------------------|--------------------------------|
| **Admin**     | `/dashboard`               | Full access to all features    |
| **Staff**     | `/dashboard/calon-murid`   | Direct to student management   |
| **Teacher**   | `/dashboard`               | Limited dashboard access       |
| **Parent**    | `/dashboard`               | View only dashboard            |

### 2. LocalStorage Data
Token dan user data disimpan di localStorage untuk akses client-side:

```javascript
// Data yang disimpan:
localStorage.setItem('auth-token', token);
localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('role', JSON.stringify(roleData));
```

**Structure:**

**auth-token** (String)
```
JWT token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**user** (JSON)
```json
{
  "id": "clxxx...",
  "email": "admin@iqrolife.com",
  "name": "Admin Iqrolife",
  "roleId": "clxxx...",
  "roleName": "admin",
  "role": {
    "id": "clxxx...",
    "name": "admin",
    "displayName": "Administrator"
  }
}
```

**role** (JSON)
```json
{
  "id": "clxxx...",
  "name": "admin",
  "displayName": "Administrator"
}
```

### 3. Redirect Method
Menggunakan `window.location.href` instead of `router.push()` untuk:
- ✅ Full page reload
- ✅ Fresh state dari server
- ✅ Cookie sync properly
- ✅ No caching issues

## Login Flow

### Step-by-Step Process:

```
1. User submit credentials (email + password)
   ↓
2. POST /api/dashboard/login
   ↓
3. API validates user & password
   ↓
4. API generates JWT token
   ↓
5. API returns response:
   {
     success: true,
     token: "jwt-token",
     user: { ...userData }
   }
   ↓
6. Frontend saves to localStorage:
   - auth-token
   - user
   - role
   ↓
7. Determine redirect route based on role
   ↓
8. window.location.href = redirectRoute
   ↓
9. Dashboard loads with fresh data
```

## Logout Flow

```
1. User clicks logout button
   ↓
2. Clear localStorage:
   - Remove 'auth-token'
   - Remove 'user'
   - Remove 'role'
   ↓
3. POST /api/dashboard/logout
   ↓
4. API clears HTTP-only cookie
   ↓
5. window.location.href = '/dashboard/login'
   ↓
6. Redirect to login page
```

## Security Features

### Dual Storage Strategy:
1. **HTTP-Only Cookie**: 
   - Stored by API
   - Secure, not accessible via JavaScript
   - Used for server-side authentication

2. **LocalStorage**:
   - Accessible by client JavaScript
   - Used for client-side API calls
   - Cleared on logout

### Benefits:
- ✅ Cookie for server-side protection (XSS safe)
- ✅ LocalStorage for client-side convenience
- ✅ Auto-clear on logout
- ✅ Token expiry: 7 days

## Testing Credentials

```bash
# Admin (Full Access)
Email: admin@iqrolife.com
Password: admin123
→ Redirect: /dashboard
→ Menu: Dashboard, Calon Murid, Users, Roles

# Staff (Student Management)
Email: test@iqrolife.com
Password: test123
→ Redirect: /dashboard/calon-murid
→ Menu: Dashboard, Calon Murid

# Teacher (View Only)
Email: teacher@iqrolife.com
Password: teacher123
→ Redirect: /dashboard
→ Menu: Dashboard only
```

## Browser DevTools Testing

### Check LocalStorage:
1. Open DevTools: **F12**
2. Go to **Application** tab
3. Select **Local Storage** → http://localhost:3000
4. Verify 3 keys exist:
   - `auth-token`
   - `user`
   - `role`

### Check Console Logs:
```
Login success logs:
- "roleName: admin"
- "Data saved to localStorage: {...}"
- "Redirecting to: /dashboard"
```

## API Endpoints

### POST /api/dashboard/login
**Request:**
```json
{
  "email": "admin@iqrolife.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "admin@iqrolife.com",
    "name": "Admin Iqrolife",
    "roleId": "clxxx...",
    "role": {
      "id": "clxxx...",
      "name": "admin",
      "displayName": "Administrator"
    },
    "roleName": "admin"
  }
}
```

### POST /api/dashboard/logout
**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

## Client-Side Usage

### Get User Data:
```typescript
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

console.log(user.name); // "Admin Iqrolife"
console.log(user.role.displayName); // "Administrator"
```

### Get Token for API Calls:
```typescript
const token = localStorage.getItem('auth-token');

fetch('/api/some-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### Check if User is Logged In:
```typescript
const isLoggedIn = () => {
  const token = localStorage.getItem('auth-token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};
```

## Troubleshooting

### Issue: router.push() tidak redirect
**Solution:** Gunakan `window.location.href` untuk full page reload

### Issue: LocalStorage data tidak tersimpan
**Solution:** Check browser console untuk error, pastikan browser support localStorage

### Issue: Redirect loop
**Solution:** Clear localStorage dan cookies, login ulang

### Issue: Token expired
**Solution:** Token valid 7 hari, setelah itu perlu login ulang

## Files Modified

1. **app/api/dashboard/login/route.ts**
   - Added `token` to response body
   - Include full user object with role relation

2. **app/dashboard/login/page.tsx**
   - Added localStorage save logic
   - Changed from `router.push()` to `window.location.href`
   - Added console logs for debugging

3. **components/dashboard-layout.tsx**
   - Added localStorage clear on logout
   - Changed from `router.push()` to `window.location.href`

4. **app/layout.tsx**
   - Added `suppressHydrationWarning` to body tag
   - Fix Grammarly extension hydration warning

## Production Considerations

### Before Deploy:
- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS only cookies
- [ ] Consider implementing token refresh
- [ ] Add rate limiting on login endpoint
- [ ] Implement login attempt tracking
- [ ] Add 2FA for admin accounts (optional)
- [ ] Monitor localStorage usage

### Security Checklist:
- ✅ HTTP-only cookies for token
- ✅ LocalStorage for convenience
- ✅ Password hashing with bcrypt
- ✅ JWT with expiry
- ✅ Clear data on logout
- ⚠️ Consider token refresh mechanism
- ⚠️ Add CSRF protection
- ⚠️ Implement rate limiting
