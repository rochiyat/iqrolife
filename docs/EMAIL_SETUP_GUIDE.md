# Email Setup Guide - IqroLife

Panduan lengkap untuk setup email notification system menggunakan Gmail SMTP.

## 📧 Fitur Email

1. **Welcome Email** - Email otomatis saat user baru dibuat
   - Berisi informasi login (email & password sementara)
   - Template profesional dengan branding IqroLife
   - Instruksi untuk ganti password

2. **Reset Password Email** - Email untuk reset password
   - Link reset password dengan token unik
   - Token berlaku 1 jam
   - Template keamanan dengan warning

## 🔧 Setup Gmail SMTP

### 1. Persiapan Gmail Account

1. Login ke Gmail account: **iqrolife@gmail.com**
2. Aktifkan 2-Factor Authentication (2FA):
   - Buka: https://myaccount.google.com/security
   - Pilih "2-Step Verification"
   - Ikuti instruksi untuk mengaktifkan

### 2. Generate App Password

1. Setelah 2FA aktif, buka: https://myaccount.google.com/apppasswords
2. Pilih "Select app" → "Mail"
3. Pilih "Select device" → "Other (Custom name)"
4. Ketik: "IqroLife Dashboard"
5. Klik "Generate"
6. **Copy password 16 karakter** yang muncul (contoh: `abcd efgh ijkl mnop`)

### 3. Update Environment Variables

Edit file `.env` dan tambahkan:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="iqrolife@gmail.com"
EMAIL_PASSWORD="abcd efgh ijkl mnop"  # Ganti dengan App Password yang di-generate
EMAIL_FROM="IqroLife <iqrolife@gmail.com>"
```

**⚠️ PENTING:**
- Jangan commit file `.env` ke Git
- Gunakan App Password, bukan password Gmail biasa
- Hapus spasi dari App Password (atau biarkan dengan spasi, keduanya work)

## 🗄️ Database Migration

Jalankan migration untuk membuat tabel `password_reset_tokens`:

```bash
node db/migrate-reset-password.js
```

Tabel ini menyimpan:
- Token reset password
- Expiry time (1 jam)
- Status penggunaan token

## 📝 Cara Menggunakan

### 1. Create User dengan Email Notification

**Endpoint:** `POST /api/dashboard/users`

```json
{
  "name": "Ibu Siti",
  "email": "parent@example.com",
  "phone": "081234567890",
  "role": "parent"
}
```

**Response:**
```json
{
  "message": "User berhasil dibuat dan email verifikasi telah dikirim",
  "user": {
    "id": 1,
    "email": "parent@example.com",
    "name": "Ibu Siti",
    "role": "parent"
  },
  "emailSent": true
}
```

**Email yang dikirim:**
- Subject: "Selamat Datang di IqroLife - Informasi Akun Anda"
- Berisi: Email, Password sementara, Link login
- Template: Professional dengan gradient purple

### 2. Request Reset Password

**Endpoint:** `POST /api/dashboard/reset-password`

```json
{
  "email": "parent@example.com"
}
```

**Response:**
```json
{
  "message": "Link reset password telah dikirim ke email Anda"
}
```

**Email yang dikirim:**
- Subject: "Reset Password - IqroLife"
- Berisi: Link reset dengan token
- Token berlaku: 1 jam

### 3. Reset Password dengan Token

**Endpoint:** `PUT /api/dashboard/reset-password`

```json
{
  "token": "abc123...",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password berhasil direset. Silakan login dengan password baru Anda"
}
```

## 🎨 Template Email

### Welcome Email Features:
- ✅ Gradient header (purple)
- ✅ Informasi login dalam box
- ✅ Warning untuk ganti password
- ✅ Button CTA "Login Sekarang"
- ✅ Footer dengan copyright
- ✅ Responsive design

### Reset Password Email Features:
- ✅ Gradient header (purple)
- ✅ Button CTA "Reset Password"
- ✅ Link alternatif (copy-paste)
- ✅ Warning box (token 1 jam, keamanan)
- ✅ Footer dengan copyright
- ✅ Responsive design

## 🔒 Keamanan

1. **Password Sementara:**
   - 8 karakter random (hex)
   - Harus diganti setelah login pertama
   - Di-hash dengan bcrypt (10 rounds)

2. **Reset Token:**
   - 32 bytes random (hex)
   - Berlaku 1 jam
   - One-time use (tidak bisa dipakai lagi)
   - Disimpan di database dengan expiry

3. **Email Security:**
   - Menggunakan TLS (port 587)
   - App Password (bukan password Gmail)
   - Rate limiting (recommended untuk production)

## 🧪 Testing

### Test Email Configuration:

```javascript
// Test file: test-email.js
const { sendEmail, getWelcomeEmailTemplate } = require('./lib/email');

async function test() {
  const html = getWelcomeEmailTemplate('Test User', 'test@example.com', 'temp123');
  
  const result = await sendEmail({
    to: 'your-email@example.com',
    subject: 'Test Email - IqroLife',
    html: html,
  });
  
  console.log('Result:', result);
}

test();
```

### Test dari Dashboard:

1. Buka: http://localhost:3000/dashboard/home
2. Navigasi ke "Users Management"
3. Klik "Tambah User"
4. Isi form dan submit
5. Cek email yang didaftarkan

## 🐛 Troubleshooting

### Email tidak terkirim:

1. **Cek App Password:**
   ```bash
   # Pastikan tidak ada spasi atau karakter aneh
   echo $EMAIL_PASSWORD
   ```

2. **Cek koneksi SMTP:**
   ```bash
   # Test koneksi ke Gmail SMTP
   telnet smtp.gmail.com 587
   ```

3. **Cek logs:**
   ```bash
   # Lihat error di console
   npm run dev
   ```

4. **Common Issues:**
   - ❌ "Invalid login" → App Password salah
   - ❌ "Connection timeout" → Firewall/network issue
   - ❌ "Authentication failed" → 2FA belum aktif
   - ❌ "Daily limit exceeded" → Gmail limit (500 email/day)

### Token expired:

- Token reset password berlaku 1 jam
- Request token baru jika sudah expired
- Cek timezone server vs database

## 📊 Monitoring

### Check email logs:

```sql
-- Lihat activity logs untuk email
SELECT * FROM activity_logs 
WHERE action = 'CREATE_USER' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check reset tokens:

```sql
-- Lihat token yang aktif
SELECT * FROM password_reset_tokens 
WHERE used = false AND expires_at > NOW()
ORDER BY created_at DESC;
```

### Check expired tokens:

```sql
-- Cleanup expired tokens (optional)
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() - INTERVAL '7 days';
```

## 🚀 Production Checklist

- [ ] Setup Gmail App Password
- [ ] Update `.env` dengan credentials yang benar
- [ ] Run migration: `node db/migrate-reset-password.js`
- [ ] Test email sending
- [ ] Setup rate limiting untuk API
- [ ] Monitor email delivery
- [ ] Setup email bounce handling
- [ ] Configure SPF/DKIM records (optional, untuk deliverability)
- [ ] Setup email queue (optional, untuk high volume)

## 📚 Resources

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Email Template Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)

## 💡 Tips

1. **Development:**
   - Gunakan email testing service seperti Mailtrap
   - Atau gunakan email pribadi untuk testing

2. **Production:**
   - Monitor Gmail sending limits (500/day)
   - Consider using dedicated email service (SendGrid, AWS SES)
   - Setup email queue untuk reliability

3. **Template:**
   - Customize template di `lib/email.ts`
   - Test di berbagai email clients
   - Pastikan responsive di mobile

---

**Last Updated:** November 2024
**Version:** 1.0.0
