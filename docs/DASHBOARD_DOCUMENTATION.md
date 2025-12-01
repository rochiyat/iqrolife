# Dashboard Iqrolife - Documentation

## 📋 Overview

Dashboard lengkap dengan sistem autentikasi berbasis role untuk mengelola sistem Iqrolife. Sistem ini mendukung 4 role berbeda dengan hak akses yang disesuaikan untuk masing-masing role.

## 🔐 Authentication System

### Roles & Credentials

Sistem menggunakan 4 role dengan akses yang berbeda:

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| **Super Admin** | superadmin@iqrolife.com | superadmin123 | Akses penuh ke semua fitur |
| **Staff** | staff@iqrolife.com | staff123 | Kelola siswa, formulir |
| **Teacher** | teacher@iqrolife.com | teacher123 | Kelola siswa |
| **Parent** | parent@iqrolife.com | parent123 | Lihat formulir |

### Role Permissions

#### Super Admin 👑
- ✅ Akses semua fitur
- ✅ Kelola Users
- ✅ Kelola Roles
- ✅ Kelola Calon Murid
- ✅ Kelola Formulir
- ✅ Kelola Settings

#### Staff 💼
- ✅ Akses Dashboard
- ✅ Kelola Calon Murid
- ✅ Kelola Formulir
- ❌ Tidak bisa kelola Users
- ❌ Tidak bisa kelola Roles
- ❌ Tidak bisa kelola Settings

#### Teacher 📚
- ✅ Akses Dashboard
- ✅ Kelola Calon Murid
- ❌ Tidak bisa kelola Users
- ❌ Tidak bisa kelola Roles
- ❌ Tidak bisa kelola Formulir
- ❌ Tidak bisa kelola Settings

#### Parent 👨‍👩‍👧
- ✅ Akses Dashboard
- ✅ Kelola Formulir (isi formulir)
- ❌ Tidak bisa kelola Users
- ❌ Tidak bisa kelola Roles
- ❌ Tidak bisa kelola Calon Murid
- ❌ Tidak bisa kelola Settings

## 📁 File Structure

```
app/
├── dashboard/
│   ├── (protected)/              # Protected routes
│   │   ├── layout.tsx           # Dashboard layout dengan sidebar & auth check
│   │   ├── home/
│   │   │   └── page.tsx         # Dashboard home dengan statistik
│   │   ├── calon-murid/
│   │   │   └── page.tsx         # Manajemen calon murid
│   │   ├── users/
│   │   │   └── page.tsx         # Manajemen users
│   │   ├── roles/
│   │   │   └── page.tsx         # Manajemen roles & permissions
│   │   ├── formulir/
│   │   │   └── page.tsx         # Manajemen formulir
│   │   └── settings/
│   │       └── page.tsx         # Settings sistem
│   ├── login/
│   │   └── page.tsx             # Login page dengan demo credentials
│   └── forgot-password/
│       └── page.tsx             # Forgot password page
│
├── api/
│   └── dashboard/
│       ├── login/
│       │   └── route.ts         # API login dengan 4 dummy users
│       └── logout/
│           └── route.ts         # API logout
│
lib/
└── auth-context.tsx             # Authentication context & permissions
```

## 🎨 Features

### 1. Dashboard Home (`/dashboard/home`)
- Overview statistik (Total Calon Murid, Users, Formulir)
- Recent activities
- Quick actions
- Role indicator

### 2. Calon Murid (`/dashboard/calon-murid`)
- List semua calon murid dengan data lengkap
- Search & filter functionality
- CRUD operations (Create, Read, Update, Delete)
- Status tracking (Pending, Approved, Rejected)
- Statistics cards

### 3. Users Management (`/dashboard/users`)
- Card-based user display
- User creation dengan role assignment
- Edit & delete users
- Statistics by role

### 4. Roles Management (`/dashboard/roles`)
- Visual role cards dengan emoji
- Permission matrix table
- Clear visualization of role permissions
- Info card explaining RBAC

### 5. Formulir (`/dashboard/formulir`)
- List semua formulir dengan status
- Filter by status (Pending, Approved, Rejected)
- View & download formulir
- Create new form
- Statistics cards

### 6. Settings (`/dashboard/settings`)
- Organization information
- Email settings (SMTP configuration)
- Notification preferences
- Security settings (2FA, strong password, session timeout)
- Appearance settings (Logo, colors, dark mode)

## 🔒 Security Features

### Authentication
- Session-based authentication dengan HTTP-only cookies
- Role-based access control (RBAC)
- Protected routes dengan automatic redirect ke login
- Automatic auth check on page load

### Authorization
- Permission checking per role
- UI elements hidden based on permissions
- Navigation menu filtered by role

### Data Protection
- Password tidak disimpan dalam response
- Secure cookie settings
- Session timeout configuration

## 🚀 How to Use

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Login Page
Navigate to: `http://localhost:3000/dashboard/login`

### 3. Login dengan Role yang Diinginkan
Pilih salah satu credentials di atas sesuai role yang ingin ditest.

### 4. Explore Dashboard
Setelah login, Anda akan diarahkan ke dashboard home. Navigation sidebar akan menampilkan menu sesuai dengan role yang login.

## 🎯 Testing Guide

### Test Super Admin
1. Login dengan: superadmin@iqrolife.com / superadmin123
2. Verify: Semua menu muncul (Dashboard, Calon Murid, Users, Roles, Formulir, Settings)
3. Test: Akses semua halaman berhasil

### Test Staff
1. Login dengan: staff@iqrolife.com / staff123
2. Verify: Menu yang muncul: Dashboard, Calon Murid, Formulir
3. Verify: Tidak ada menu Users, Roles, Settings

### Test Teacher
1. Login dengan: teacher@iqrolife.com / teacher123
2. Verify: Menu yang muncul: Dashboard, Calon Murid
3. Verify: Tidak ada menu Users, Roles, Formulir, Settings

### Test Parent
1. Login dengan: parent@iqrolife.com / parent123
2. Verify: Menu yang muncul: Dashboard, Formulir
3. Verify: Tidak ada menu Calon Murid, Users, Roles, Settings

## 🔧 Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Authentication**: Cookie-based sessions

## 📝 API Endpoints

### POST `/api/dashboard/login`
Login dengan email dan password, returns user object dengan role.

**Request Body:**
```json
{
  "email": "superadmin@iqrolife.com",
  "password": "superadmin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "1",
    "email": "superadmin@iqrolife.com",
    "name": "Super Admin",
    "role": "superadmin",
    "avatar": "/avatars/superadmin.jpg"
  }
}
```

### GET `/api/dashboard/login`
Check authentication status.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "1",
    "email": "superadmin@iqrolife.com",
    "name": "Super Admin",
    "role": "superadmin"
  }
}
```

### POST `/api/dashboard/logout`
Logout user dan clear session cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

## 🎨 UI/UX Features

- Responsive design (Mobile, Tablet, Desktop)
- Sidebar with toggle on mobile
- Role-based navigation
- Loading states
- Error handling
- Toast notifications (can be enhanced)
- Smooth transitions
- Color-coded status badges
- Icon-based navigation
- Card-based layouts
- Statistics visualization

## 🔮 Future Enhancements

1. **Database Integration**
   - Replace dummy data dengan real database (PostgreSQL, MySQL, etc.)
   - Implement proper ORM (Prisma, Drizzle)

2. **Enhanced Authentication**
   - JWT tokens instead of simple cookies
   - Refresh token mechanism
   - 2FA implementation
   - Password reset functionality

3. **Real-time Updates**
   - WebSocket untuk live notifications
   - Real-time dashboard updates

4. **Advanced Features**
   - File upload untuk formulir
   - Email notifications
   - Export data (PDF, Excel)
   - Advanced filtering & sorting
   - Pagination untuk large datasets

5. **Testing**
   - Unit tests dengan Jest
   - E2E tests dengan Playwright
   - API tests

6. **Monitoring**
   - Error tracking (Sentry)
   - Analytics integration
   - Performance monitoring

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: info@iqrolife.com
- WhatsApp: +62 813 1522 5557

---

**Built with ❤️ for Iqrolife**
