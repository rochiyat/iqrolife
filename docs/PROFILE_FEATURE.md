# Profile Feature - Dashboard

Fitur profile lengkap di dashboard dengan toggle dropdown menu.

## Fitur yang Tersedia

### 1. Profile Dropdown
- Toggle menu di header dashboard
- Menampilkan nama, email, dan role user
- Avatar dengan inisial nama

### 2. Profile Modal
- Lihat dan edit informasi profile
- Update nama, email, dan nomor telepon
- Avatar dengan inisial nama

### 3. Change Password
- Ganti password langsung dari dashboard
- Validasi password lama
- Password baru minimal 6 karakter
- Toggle show/hide password
- Konfirmasi password baru

### 4. Reset Password via Email
- Kirim link reset password ke email
- Link berlaku 1 jam
- Email template profesional
- Notifikasi jika email tidak masuk

### 5. Logout
- Logout dari sistem
- Hapus session
- Redirect ke halaman login

## Komponen

### Frontend Components
- `components/dashboard/ProfileDropdown.tsx` - Dropdown menu utama
- `components/dashboard/ProfileModal.tsx` - Modal untuk edit profile
- `components/dashboard/ChangePasswordModal.tsx` - Modal ganti password
- `components/dashboard/ResetPasswordModal.tsx` - Modal reset password via email

### API Routes
- `app/api/dashboard/profile/route.ts` - GET & PUT profile
- `app/api/dashboard/change-password/route.ts` - POST ganti password
- `app/api/dashboard/logout/route.ts` - POST logout

### Layout Integration
- `app/dashboard/(protected)/layout.tsx` - Integrasi ProfileDropdown di header

## Cara Menggunakan

### 1. Profile Dropdown
Klik avatar/nama di header dashboard untuk membuka menu dropdown dengan opsi:
- Profile Saya
- Ganti Password
- Reset Password via Email
- Logout

### 2. Edit Profile
1. Klik "Profile Saya" dari dropdown
2. Edit nama, email, atau nomor telepon
3. Klik "Simpan Perubahan"
4. Page akan reload otomatis setelah berhasil

### 3. Ganti Password
1. Klik "Ganti Password" dari dropdown
2. Masukkan password saat ini
3. Masukkan password baru (minimal 6 karakter)
4. Konfirmasi password baru
5. Klik "Ubah Password"

### 4. Reset Password via Email
1. Klik "Reset Password via Email" dari dropdown
2. Konfirmasi email tujuan
3. Klik "Kirim Email Reset"
4. Cek inbox atau folder spam
5. Klik link di email (berlaku 1 jam)
6. Buat password baru

### 5. Logout
1. Klik "Logout" dari dropdown
2. Session akan dihapus
3. Redirect ke halaman login

## Security Features

- Password hashing dengan bcrypt
- Session-based authentication
- Password minimal 6 karakter
- Reset token berlaku 1 jam
- Validasi password lama saat ganti password
- Email verification untuk reset password

## Email Templates

Email menggunakan template HTML profesional dengan:
- Gradient header
- Informasi lengkap
- Call-to-action button
- Warning dan tips
- Footer dengan copyright

## Database Requirements

Tabel yang digunakan:
- `users` - Data user
- `password_reset_tokens` - Token reset password
- `activity_logs` - Log aktivitas user

## Environment Variables

```env
DATABASE_URL=postgresql://...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Your Name <your-email@gmail.com>
NEXTAUTH_URL=http://localhost:3000
```

## Testing

Test email sudah tersedia di `test-email.js`:
```bash
# Test ke email default (rochiyat@gmail.com)
node test-email.js

# Test ke email lain
node test-email.js email@example.com
```

## UI/UX Features

- Responsive design
- Loading states
- Success/error messages
- Smooth transitions
- Icon indicators
- Color-coded alerts
- Password visibility toggle
- Gradient backgrounds
- Shadow effects

## Notes

- Logout button dipindahkan dari sidebar ke dropdown menu
- Profile dropdown menggantikan avatar statis di header
- Semua modal menggunakan shadcn/ui components
- Email template menggunakan inline CSS untuk kompatibilitas
- Reset password menggunakan existing API route
