# 📋 Menu Formulir List - Documentation

## 🎯 Overview

Menu baru "Formulir List" untuk menampilkan daftar formulir pendaftaran yang telah dikirim oleh calon murid/orang tua.

## ✨ Features

### 1. **List View**
- Tabel daftar formulir yang sudah dikirim
- Search berdasarkan nama anak atau orang tua
- Informasi: Nama, Usia, Orang Tua, Kontak, Tanggal Daftar
- Button "Lihat Detail" untuk setiap formulir

### 2. **Detail View**
Modal detail yang menampilkan:
- **Data Anak**: Nama, Jenis Kelamin, Tanggal Lahir, Usia, Asal Sekolah
- **Data Orang Tua**: Nama, Telepon, Email, Alamat
- **Info Pendaftaran**: Tanggal, Catatan
- **Bukti Transfer**: Preview gambar dengan link full size

### 3. **Statistics Cards**
- Total Formulir
- Formulir Bulan Ini
- Formulir Hari Ini

### 4. **Quick Actions**
- Button "Tambah Formulir" → Link ke `/dashboard/formulir`
- Empty state dengan CTA untuk tambah formulir pertama

## 🔐 Permissions & Roles

### Role Access

| Role | Can View | Can Add |
|------|----------|---------|
| Superadmin | ✅ | ✅ |
| Staff | ✅ | ✅ |
| Teacher | ✅ | ✅ |
| Parent | ❌ | ✅ |

### Permission: `canManageFormsList`
- **superadmin**: ✅ true
- **staff**: ✅ true
- **teacher**: ✅ true
- **parent**: ❌ false

## 📁 Files Created/Modified

### New Files
```
app/dashboard/(protected)/formulir-list/
└── page.tsx                    # Main page component
```

### Modified Files
```
lib/auth-context.tsx            # Added canManageFormsList permission
app/dashboard/(protected)/layout.tsx  # Added menu item
```

## 🎨 UI Components

### Main Page
- Header dengan title dan button "Tambah Formulir"
- Search bar
- Table dengan data formulir
- Statistics cards
- Detail modal

### Empty State
Ditampilkan saat belum ada formulir:
- Icon FileImage
- Message "Belum Ada Formulir"
- CTA button "Tambah Formulir Pertama"

## 🔗 Navigation

### Menu Location
Sidebar menu, posisi setelah "Calon Murid":
```
Dashboard
Calon Murid
Formulir List  ← NEW
Users
Roles
...
```

### Routes
- List: `/dashboard/formulir-list`
- Add Form: `/dashboard/formulir`

## 📊 Data Structure

```typescript
interface FormSubmission {
  id: string;
  name: string;
  birthDate: string;
  age: number;
  gender: string;
  parent: string;
  phone: string;
  email: string;
  address: string;
  previousSchool?: string;
  registrationDate: string;
  notes?: string;
  paymentProof?: string;
}
```

## 🔄 Integration Points

### TODO: API Integration
```typescript
// Fetch submissions from API
const response = await fetch('/api/dashboard/formulir-list');
const data = await response.json();
setSubmissions(data.submissions);
```

### Database Query
```sql
SELECT * FROM calon_murid 
WHERE status = 'pending' 
ORDER BY registration_date DESC;
```

## 🎯 User Flow

1. User clicks "Formulir List" di sidebar
2. Page loads dengan list formulir (atau empty state)
3. User dapat:
   - Search formulir
   - View detail formulir
   - Click "Tambah Formulir" → redirect ke form page

## 🎨 Styling

### Colors
- Primary: `brand-emerald` (green)
- Secondary: `blue-600` (info)
- Accent: `purple-600` (stats)

### Hover Effects
- Buttons: `hover:bg-emerald-600`
- Table rows: `hover:bg-gray-50`
- Links: `hover:text-emerald-700`

## 📱 Responsive Design

- Mobile: Stack cards vertically
- Tablet: 2 columns for stats
- Desktop: 3 columns for stats
- Table: Horizontal scroll on mobile

## ✅ Testing Checklist

- [ ] Menu appears for correct roles
- [ ] Search functionality works
- [ ] Detail modal opens/closes
- [ ] Empty state displays correctly
- [ ] Statistics calculate correctly
- [ ] "Tambah Formulir" button links correctly
- [ ] Responsive on mobile/tablet/desktop

## 🚀 Deployment Notes

1. Run database migration first
2. Deploy code changes
3. Verify menu permissions
4. Test with different user roles

## 📝 Future Enhancements

- [ ] Export to Excel/PDF
- [ ] Bulk actions (approve/reject)
- [ ] Email notifications
- [ ] Status filter
- [ ] Date range filter
- [ ] Pagination
- [ ] Sort by columns

## 🆘 Troubleshooting

### Menu tidak muncul
- Check user role
- Verify `canManageFormsList` permission
- Clear browser cache

### Empty state terus muncul
- Check API connection
- Verify database has data
- Check fetch logic

### Detail modal tidak buka
- Check state management
- Verify dialog component
- Check console for errors
