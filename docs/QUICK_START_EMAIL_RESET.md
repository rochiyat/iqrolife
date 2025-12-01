# Quick Start - Email & Reset Password Setup

Panduan cepat untuk setup fitur email dan reset password di IqroLife Dashboard.

## 🚀 Quick Setup (5 Menit)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Gmail App Password

1. **Login Gmail:** https://mail.google.com (iqrolife@gmail.com)

2. **Aktifkan 2FA:**
   - Buka: https://myaccount.google.com/security
   - Klik "2-Step Verification"
   - Follow instruksi

3. **Generate App Password:**
   - Buka: https://myaccount.google.com/apppasswords
   - App: "Mail"
   - Device: "Other" → ketik "IqroLife Dashboard"
   - Klik "Generate"
   - **COPY password 16 karakter** (contoh: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Edit file `.env` dan tambahkan di bagian bawah:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="iqrolife@gmail.com"
EMAIL_PASSWORD="abcd efgh ijkl mnop"
EMAIL_FROM="IqroLife <iqrolife@gmail.com>"
```

**⚠️ Ganti `abcd efgh ijkl mnop` dengan App Password yang di-generate!**

### Step 4: Run Database Migration

```bash
node db/migrate-reset-password.js
```

Output yang diharapkan:
```
🚀 Starting password reset migration...
📝 Executing schema...
✅ Password reset table created successfully!
✅ Verification: password_reset_tokens table exists
✨ Migration completed successfully!
```

### Step 5: Start Development Server

```bash
npm run dev
```

## ✅ Test Features

### Test 1: Create User dengan Email
1. Buka: http://localhost:3000/dashboard/login
2. Login dengan akun admin
3. Navigasi ke "Users Management"
4. Klik "Tambah User"
5. Isi form:
   - Nama: Test User
   - Email: your-email@gmail.com (gunakan email Anda)
   - Phone: 081234567890
   - Role: Parent
6. Klik "Buat & Kirim Email"
7. **Cek email Anda** → Harus ada email welcome dengan password sementara

### Test 2: Reset Password
1. Logout dari dashboard
2. Di halaman login, klik "Lupa Password?"
3. Masukkan email yang terdaftar
4. Klik "Kirim Link Reset"
5. **Cek email Anda** → Harus ada email reset password
6. Klik link di email
7. Masukkan password baru (min 6 karakter)
8. Klik "Reset Password"
9. Login dengan password baru

## 🎯 Expected Results

### ✅ Create User Success:
- User tersimpan di database
- Email welcome terkirim
- Email berisi password sementara
- User bisa login dengan password tersebut

### ✅ Reset Password Success:
- Email reset terkirim
- Link reset berfungsi
- Password berhasil direset
- User bisa login dengan password baru

## 🐛 Troubleshooting

### Email tidak terkirim?

**1. Cek App Password:**
```bash
# Windows CMD
echo %EMAIL_PASSWORD%

# Windows PowerShell
$env:EMAIL_PASSWORD
```

**2. Cek Console Logs:**
- Lihat terminal tempat `npm run dev` berjalan
- Cari error message terkait email

**3. Common Errors:**

| Error | Solution |
|-------|----------|
| "Invalid login" | App Password salah, generate ulang |
| "Connection timeout" | Cek koneksi internet / firewall |
| "Authentication failed" | 2FA belum aktif di Gmail |
| "Daily limit exceeded" | Gmail limit 500 email/day |

### Token expired?

Token reset password berlaku **1 jam**. Jika expired:
1. Request reset password lagi
2. Cek email baru
3. Gunakan link yang baru

### Database error?

```bash
# Cek apakah migration sudah jalan
node db/migrate-reset-password.js

# Jika error, cek DATABASE_URL di .env
```

## 📋 Verification Checklist

Setelah setup, pastikan:

- [ ] Dependencies terinstall (`node_modules` ada)
- [ ] `.env` file sudah diupdate dengan EMAIL_* variables
- [ ] Gmail App Password sudah di-generate
- [ ] Migration berhasil (tabel `password_reset_tokens` ada)
- [ ] Development server berjalan tanpa error
- [ ] Test create user berhasil
- [ ] Email welcome diterima
- [ ] Test reset password berhasil
- [ ] Email reset diterima

## 🎉 Success!

Jika semua test berhasil, fitur email dan reset password sudah siap digunakan!

## 📚 Next Steps

1. **Customize Email Templates:**
   - Edit `lib/email.ts`
   - Sesuaikan warna, logo, text

2. **Add Rate Limiting:**
   - Prevent spam/abuse
   - Limit request per IP/email

3. **Monitor Usage:**
   - Check activity logs
   - Monitor email delivery

4. **Production Setup:**
   - Consider dedicated email service
   - Setup email queue
   - Add monitoring/alerts

## 📖 Full Documentation

- **Email Setup:** `EMAIL_SETUP_GUIDE.md`
- **Reset Password:** `RESET_PASSWORD_FEATURE.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY_EMAIL_RESET.md`

## 💡 Tips

1. **Development:**
   - Gunakan email pribadi untuk testing
   - Check spam folder jika email tidak masuk
   - Save App Password di password manager

2. **Production:**
   - Monitor Gmail sending limits (500/day)
   - Setup email queue untuk reliability
   - Consider SendGrid/AWS SES untuk volume tinggi

3. **Security:**
   - Jangan commit `.env` ke Git
   - Rotate App Password secara berkala
   - Monitor suspicious activities

---

**Need Help?** Check full documentation atau hubungi developer.

**Last Updated:** November 2024
