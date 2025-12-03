# Reset Password Feature - IqroLife Dashboard

## 📋 Overview

Fitur reset password memungkinkan user untuk mereset password mereka melalui email verification.

## 🔄 Flow Reset Password

```
1. User klik "Lupa Password" di halaman login
   ↓
2. User masukkan email
   ↓
3. System generate token & kirim email
   ↓
4. User klik link di email
   ↓
5. User masukkan password baru
   ↓
6. Password berhasil direset
   ↓
7. User redirect ke login page
```

## 📁 File Structure

```
app/
├── dashboard/
│   ├── forgot-password/          # Halaman request reset
│   └── reset-password/            # Halaman reset dengan token
│       └── page.tsx               ✅ BARU
├── api/
│   └── dashboard/
│       └── reset-password/
│           └── route.ts           ✅ BARU
lib/
└── email.ts                       ✅ BARU (email utilities)
db/
├── schema-reset-password.sql      ✅ BARU
└── migrate-reset-password.js      ✅ BARU
```

## 🗄️ Database Schema

### Tabel: `password_reset_tokens`

```sql
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### 1. Request Reset Password

**POST** `/api/dashboard/reset-password`

Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "Link reset password telah dikirim ke email Anda"
}
```

### 2. Reset Password dengan Token

**PUT** `/api/dashboard/reset-password`

Request body:
```json
{
  "token": "abc123...",
  "newPassword": "newpassword123"
}
```

Response:
```json
{
  "message": "Password berhasil direset. Silakan login dengan password baru Anda"
}
```

## 🎨 UI Pages

### 1. Forgot Password Page
- Path: `/dashboard/forgot-password`
- Input: Email
- Action: Kirim email reset

### 2. Reset Password Page
- Path: `/dashboard/reset-password?token=xxx`
- Input: Password baru, Konfirmasi password
- Validasi: Min 6 karakter, password match
- Action: Reset password

## 🔒 Security Features

1. **Token Security:**
   - Random 32 bytes (hex)
   - Unique per request
   - Expires in 1 hour
   - One-time use only

2. **Password Security:**
   - Minimum 6 characters
   - Hashed with bcrypt (10 rounds)
   - Confirmation required

3. **Email Security:**
   - No user enumeration (same response for valid/invalid email)
   - Rate limiting recommended
   - Secure token in URL

## 📧 Email Template

Subject: **Reset Password - IqroLife**

Features:
- Professional gradient header
- Clear CTA button
- Alternative link (copy-paste)
- Security warnings
- Expiry information (1 hour)

## 🚀 Setup Instructions

### 1. Run Migration

```bash
node db/migrate-reset-password.js
```

### 2. Configure Email

Edit `.env`:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="iqrolife@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="IqroLife <iqrolife@gmail.com>"
```

### 3. Test Feature

1. Go to: http://localhost:3000/dashboard/forgot-password
2. Enter email
3. Check email inbox
4. Click reset link
5. Enter new password
6. Login with new password

## 🧪 Testing Checklist

- [ ] Request reset dengan email valid
- [ ] Request reset dengan email invalid (no error leak)
- [ ] Email diterima dengan benar
- [ ] Link reset berfungsi
- [ ] Token expired setelah 1 jam
- [ ] Token tidak bisa dipakai 2x
- [ ] Password validation (min 6 char)
- [ ] Password confirmation match
- [ ] Redirect ke login setelah success
- [ ] Error handling untuk semua edge cases

## 🐛 Common Issues

### Email tidak diterima:
- Cek spam folder
- Verify email configuration
- Check Gmail App Password
- Test SMTP connection

### Token invalid:
- Token sudah expired (>1 jam)
- Token sudah digunakan
- Token tidak ada di database

### Password tidak berubah:
- Check database connection
- Verify bcrypt hashing
- Check user_id reference

## 📊 Monitoring

### Check active tokens:
```sql
SELECT u.email, prt.token, prt.expires_at, prt.used
FROM password_reset_tokens prt
JOIN users u ON prt.user_id = u.id
WHERE prt.used = false
ORDER BY prt.created_at DESC;
```

### Cleanup old tokens:
```sql
DELETE FROM password_reset_tokens
WHERE expires_at < NOW() - INTERVAL '7 days';
```

## 🔄 Integration dengan Forgot Password Page

Update link di login page:

```tsx
<Button
  type="button"
  variant="link"
  onClick={() => router.push('/dashboard/forgot-password')}
>
  Lupa Password?
</Button>
```

## 💡 Future Improvements

1. **Rate Limiting:**
   - Limit request per IP
   - Limit request per email
   - Prevent brute force

2. **Email Queue:**
   - Async email sending
   - Retry mechanism
   - Better error handling

3. **Notification:**
   - Email notification saat password berhasil direset
   - SMS notification (optional)

4. **Analytics:**
   - Track reset password usage
   - Monitor success rate
   - Alert for suspicious activity

---

**Status:** ✅ Implemented
**Last Updated:** November 2024
