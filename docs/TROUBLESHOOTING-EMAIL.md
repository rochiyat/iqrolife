# Troubleshooting: "Missing credentials for 'PLAIN'" Error

## ❌ Error Message

```
Error: Missing credentials for "PLAIN"
code: 'EAUTH'
```

## ✅ Solusi

### 1. **Periksa File .env**

Pastikan file `.env` ada di **root directory** project (bukan di subfolder):

```
iqrolife/
├── .env          ← File .env harus di sini!
├── app/
├── components/
├── lib/
├── package.json
└── ...
```

### 2. **Isi .env dengan Benar**

```env
# Jangan ada quotes kecuali nilai mengandung spasi
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# Multiple emails dipisah koma
STAFF_EMAIL=admin@example.com,teacher@example.com
```

**❌ SALAH:**

```env
EMAIL_USER="youremail@gmail.com"  ← Jangan pakai quotes
EMAIL_PASS='your-password'        ← Jangan pakai quotes
```

**✅ BENAR:**

```env
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-app-password
```

### 3. **Restart Development Server**

**PENTING:** Next.js hanya membaca `.env` saat startup!

```bash
# Stop server (tekan Ctrl+C)

# Kemudian restart
npm run dev
```

### 4. **Verifikasi Environment Variables Terbaca**

Tambahkan temporary logging di `route.ts`:

```typescript
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "***SET***" : "MISSING");
```

Kemudian:

1. Restart server
2. Trigger API (submit formulir)
3. Check terminal/console

**Expected output:**

```
EMAIL_USER: youremail@gmail.com
EMAIL_PASS: ***SET***
```

**If you see:**

```
EMAIL_USER: undefined
EMAIL_PASS: MISSING
```

→ `.env` file tidak terbaca!

### 5. **Setup Gmail App Password**

Jika pakai Gmail, **JANGAN pakai password biasa Gmail!**

**Cara buat App Password:**

1. Buka: https://myaccount.google.com/security
2. **Enable 2-Step Verification** (wajib!)
3. Buka **"App passwords"**
4. Pilih:
   - App: **Mail**
   - Device: **Other (Custom name)** → ketik "Iqrolife"
5. Klik **Generate**
6. Copy **16-digit code** (contoh: `abcd efgh ijkl mnop`)
7. Paste ke `.env`:
   ```env
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

### 6. **Alternative: Gunakan Mailtrap untuk Testing**

Untuk development, gunakan Mailtrap (lebih mudah):

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
STAFF_EMAIL=test@example.com
```

Daftar gratis di: https://mailtrap.io

## 🔍 Quick Check

Jalankan checklist ini:

- [ ] File `.env` ada di root directory
- [ ] Tidak ada quotes di sekitar EMAIL_USER dan EMAIL_PASS
- [ ] Sudah restart dev server setelah edit .env
- [ ] Jika Gmail: sudah pakai App Password (bukan password biasa)
- [ ] Check console untuk warning: "⚠️ Email credentials not configured"

## 📝 Console Messages

Setelah fix, Anda akan lihat:

**✅ Jika credentials OK:**

```
(tidak ada warning)
Email sent successfully to: admin@example.com
```

**⚠️ Jika credentials missing:**

```
⚠️ Email credentials not configured. EMAIL_USER or EMAIL_PASS is missing.
⚠️ Email not sent: Email credentials not configured
```

## 💡 Tips

1. **Production:** Gunakan email service seperti SendGrid, Mailgun
2. **Development:** Gunakan Mailtrap untuk testing
3. **Gmail:** Max 500 emails/day, tidak recommended untuk production
4. **Security:** Never commit `.env` to git (sudah ada di `.gitignore`)

## 🆘 Masih Error?

Check lagi:

1. Typo di nama env variables (EMAIL_USER bukan SMTP_USER)
2. File `.env` di folder yang benar
3. Restart server setelah edit
4. Gmail: 2-Factor Authentication harus ON
5. Network/Firewall tidak block port 587

## Example Working .env

```env
# Database
DATABASE_URL=postgresql://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=notification@iqrolife.com
EMAIL_PASS=abcd efgh ijkl mnop
STAFF_EMAIL=admin@iqrolife.com,teacher@iqrolife.com

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Setelah fix, formulir submit akan berhasil dan email akan terkirim! 📧✅
