# Quick Start - Profile Feature

## Setup Cepat

### 1. Install Dependencies (Sudah Selesai)
```bash
npm install --save-dev @types/bcrypt
```

### 2. File yang Dibuat

#### Frontend Components
- ✅ `components/dashboard/ProfileDropdown.tsx`
- ✅ `components/dashboard/ProfileModal.tsx`
- ✅ `components/dashboard/ChangePasswordModal.tsx`
- ✅ `components/dashboard/ResetPasswordModal.tsx`
- ✅ `components/dashboard/index.ts`

#### API Routes
- ✅ `app/api/dashboard/profile/route.ts`
- ✅ `app/api/dashboard/change-password/route.ts`
- ✅ `app/api/dashboard/logout/route.ts`

#### Layout Update
- ✅ `app/dashboard/(protected)/layout.tsx` - Updated

#### Documentation
- ✅ `PROFILE_FEATURE.md`
- ✅ `QUICK_START_PROFILE.md`

### 3. Cara Menggunakan

#### Login ke Dashboard
```
http://localhost:3000/dashboard/login
```

#### Akses Profile Dropdown
1. Setelah login, lihat di header dashboard (kanan atas)
2. Klik avatar/nama user
3. Menu dropdown akan muncul dengan opsi:
   - 👤 Profile Saya
   - 🔒 Ganti Password
   - 📧 Reset Password via Email
   - 🚪 Logout

#### Edit Profile
1. Klik "Profile Saya"
2. Modal akan terbuka
3. Edit nama, email, atau nomor telepon
4. Klik "Simpan Perubahan"

#### Ganti Password
1. Klik "Ganti Password"
2. Masukkan password lama
3. Masukkan password baru (min 6 karakter)
4. Konfirmasi password baru
5. Klik "Ubah Password"

#### Reset Password via Email
1. Klik "Reset Password via Email"
2. Konfirmasi email tujuan
3. Klik "Kirim Email Reset"
4. Cek email (inbox atau spam)
5. Klik link di email
6. Buat password baru

#### Logout
1. Klik "Logout"
2. Otomatis redirect ke login page

## Testing

### Test Email Configuration
```bash
# Test ke email default (rochiyat@gmail.com)
node test-email.js

# Test ke email lain
node test-email.js your-email@example.com
```

### Test di Browser
1. Start development server:
   ```bash
   npm run dev
   ```

2. Buka browser:
   ```
   http://localhost:3000/dashboard/login
   ```

3. Login dengan user yang ada

4. Test semua fitur profile:
   - ✅ Buka dropdown menu
   - ✅ Edit profile
   - ✅ Ganti password
   - ✅ Reset password via email
   - ✅ Logout

## Fitur Utama

### 1. Profile Dropdown ✨
- Toggle menu di header
- Avatar dengan inisial
- Nama dan role user
- 4 menu utama

### 2. Profile Modal 👤
- Edit nama
- Edit email
- Edit nomor telepon
- Avatar display
- Success/error messages

### 3. Change Password 🔒
- Input password lama
- Input password baru
- Konfirmasi password
- Toggle show/hide password
- Validasi minimal 6 karakter

### 4. Reset Password via Email 📧
- Kirim link reset ke email
- Link berlaku 1 jam
- Email template profesional
- Notifikasi lengkap

### 5. Logout 🚪
- Hapus session
- Redirect ke login
- Aman dan cepat

## UI/UX Highlights

- 🎨 Gradient backgrounds
- 💫 Smooth animations
- 📱 Responsive design
- ⚡ Loading states
- ✅ Success messages
- ❌ Error handling
- 👁️ Password visibility toggle
- 🎯 Icon indicators
- 🌈 Color-coded alerts

## Security

- 🔐 Password hashing (bcrypt)
- 🔑 Session-based auth
- ⏰ Token expiration (1 hour)
- ✉️ Email verification
- 🛡️ Input validation
- 📝 Activity logging

## Troubleshooting

### Email tidak terkirim?
1. Cek `.env` file
2. Pastikan EMAIL_* variables sudah benar
3. Test dengan `node test-email.js`
4. Cek folder spam

### Dropdown tidak muncul?
1. Pastikan user sudah login
2. Refresh browser
3. Cek console untuk error

### Password tidak bisa diubah?
1. Pastikan password lama benar
2. Password baru minimal 6 karakter
3. Konfirmasi password harus sama

### Logout tidak bekerja?
1. Clear browser cache
2. Cek network tab di DevTools
3. Pastikan API route `/api/dashboard/logout` accessible

## Next Steps

1. ✅ Test semua fitur
2. ✅ Cek email notifications
3. ✅ Test di berbagai browser
4. ✅ Test responsive design
5. ✅ Deploy ke production

## Support

Jika ada masalah:
1. Cek dokumentasi di `PROFILE_FEATURE.md`
2. Cek console browser untuk error
3. Cek server logs
4. Test email dengan `test-email.js`

---

**Status: ✅ Ready to Use**

Semua fitur sudah siap digunakan. Silakan test dan enjoy! 🎉
