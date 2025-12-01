# Quick Reference - Dashboard Integration

## 🚀 Quick Start

### 1. Check Database
```bash
node db/sync-database.js
```

### 2. Test Integration
```bash
node test-api-integration.js
```

### 3. Start Server
```bash
npm run dev
```

### 4. Login
```
URL: http://localhost:3000/dashboard/login
Email: admin@iqrolife.com
Password: password123
```

---

## 📊 Database Info

### Connection
```env
DATABASE_URL="postgres://avnadmin:***@pg-iqrolife-iqrolife-dashboard.c.aivencloud.com:14221/defaultdb"
```

### Tables & Records
```
users           : 4 records
roles           : 4 records
calon_murid     : 5 records
formulir        : 2 records
menu            : 9 records
portofolio      : 3 records
settings        : 11 records
activity_logs   : 5 records
```

---

## 🔌 API Endpoints

### Calon Murid
```
GET    /api/dashboard/calon-murid
POST   /api/dashboard/calon-murid
PUT    /api/dashboard/calon-murid
DELETE /api/dashboard/calon-murid?id={id}
```

### Formulir List
```
GET    /api/dashboard/formulir-list
PUT    /api/dashboard/formulir-list
DELETE /api/dashboard/formulir-list?id={id}
```

### Users
```
GET    /api/dashboard/users
POST   /api/dashboard/users
PUT    /api/dashboard/users
DELETE /api/dashboard/users?id={id}
```

---

## 🎨 Dashboard Pages

### Integrated Pages
```
✅ /dashboard/calon-murid     - Student management
✅ /dashboard/formulir-list   - Form submissions
✅ /dashboard/users           - User management
```

### Features
- ✅ Real-time data from database
- ✅ Pagination (5, 10, 15, 20, All)
- ✅ Search functionality
- ✅ Summary cards
- ✅ CRUD operations
- ✅ Loading states

---

## 🔐 Login Credentials

```
Superadmin: admin@iqrolife.com / password123
Staff:      staff@iqrolife.com / password123
Teacher:    teacher@iqrolife.com / password123
Parent:     parent@iqrolife.com / password123
```

---

## 📝 Common Tasks

### Add New Student
1. Go to `/dashboard/calon-murid`
2. Click "Tambah Calon Murid"
3. Fill form & upload bukti transfer
4. Click "Simpan Data"

### View Form Submissions
1. Go to `/dashboard/formulir-list`
2. Click eye icon to view details
3. Use search to filter

### Manage Users
1. Go to `/dashboard/users`
2. Click "Tambah User"
3. Fill form (email will be sent)
4. Click "Buat & Kirim Email"

---

## 🧪 Testing

### Test Database Connection
```bash
node db/sync-database.js
```

### Test API Integration
```bash
node test-api-integration.js
```

### Manual API Test
```bash
# Get all students
curl http://localhost:3000/api/dashboard/calon-murid

# Get all forms
curl http://localhost:3000/api/dashboard/formulir-list

# Get all users
curl http://localhost:3000/api/dashboard/users
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check .env file
cat .env | grep DATABASE_URL

# Test connection
node db/sync-database.js
```

### API Not Working
```bash
# Check if server is running
curl http://localhost:3000/api/dashboard/calon-murid

# Check logs
npm run dev
```

### No Data Showing
```bash
# Check database has data
node db/sync-database.js

# Check API response
curl http://localhost:3000/api/dashboard/calon-murid
```

---

## 📚 File Locations

### API Routes
```
app/api/dashboard/calon-murid/route.ts
app/api/dashboard/formulir-list/route.ts
app/api/dashboard/users/route.ts
```

### Frontend Pages
```
app/dashboard/(protected)/calon-murid/page.tsx
app/dashboard/(protected)/formulir-list/page.tsx
app/dashboard/(protected)/users/page.tsx
```

### Database Scripts
```
db/sync-database.js
db/migrate-complete.js
test-api-integration.js
```

---

## ✅ Status Checklist

- [x] Database connected
- [x] Tables created
- [x] Sample data loaded
- [x] API routes integrated
- [x] Frontend pages integrated
- [x] Pagination implemented
- [x] Search functionality
- [x] Loading states
- [x] CRUD operations
- [x] Activity logging
- [x] Email notifications

---

## 🎯 Quick Commands

```bash
# Check database
node db/sync-database.js

# Test APIs
node test-api-integration.js

# Start dev server
npm run dev

# Install dependencies
npm install

# Build for production
npm run build
```

---

**Last Updated:** 27 November 2024
**Status:** ✅ FULLY INTEGRATED
