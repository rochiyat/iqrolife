# Email Configuration Guide

## Environment Variables untuk Email

Tambahkan environment variables berikut di file `.env`:

```env
# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Staff Email for Notifications
# Multiple emails separated by comma
STAFF_EMAIL=staff1@example.com,staff2@example.com,staff3@example.com

# Optional: Base URL for links in email
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Setup Email untuk Notifikasi Staff

### 1. Single Email

Jika hanya ada 1 email staff:

```env
STAFF_EMAIL=admin@iqrolife.com
```

### 2. Multiple Emails (Recommended)

Untuk mengirim ke beberapa email staff sekaligus, pisahkan dengan **koma (,)**:

```env
STAFF_EMAIL=admin@iqrolife.com,teacher1@iqrolife.com,teacher2@iqrolife.com
```

**Tips:**

- Jangan ada spasi sebelum/sesudah email (kecuali setelah koma)
- Bisa juga dengan spasi untuk readability:
  ```env
  STAFF_EMAIL=admin@iqrolife.com, teacher1@iqrolife.com, teacher2@iqrolife.com
  ```
- System akan otomatis trim() spasi

### 3. Contoh Format Lain (Alternative)

**Dengan line break** (untuk readability di .env):

```env
STAFF_EMAIL="admin@iqrolife.com,\
teacher1@iqrolife.com,\
teacher2@iqrolife.com"
```

## Cara Kerja System Email

### Formulir Pendaftaran Submit

Ketika orang tua/admin submit formulir di `dashboard/formulir`:

1. **Formulir disimpan** ke database (`formulir_pendaftaran` table)
2. **Email otomatis terkirim** ke semua staff di `STAFF_EMAIL`
3. **Email berisi**:
   - Data calon murid (nama, tanggal lahir, jenis kelamin, program)
   - Data orang tua (nama ayah, ibu, telepon, alamat)
   - Link untuk melihat detail formulir di dashboard

### Email Content

Template email yang dikirim:

- ✅ Professional design dengan gradient header
- ✅ Informasi lengkap calon murid
- ✅ Button "Lihat Detail Formulir" yang link ke dashboard
- ✅ Footer dengan disclaimer

### Non-Blocking Email

Email dikirim secara **non-blocking** (asynchronous):

- Jika email gagal → formulir tetap tersimpan
- Error hanya di-log ke console
- User tetap mendapat respon success

## Testing Email

### 1. Test dengan Gmail

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-app-password  # Bukan password Gmail biasa!
```

**Cara generate App Password di Gmail:**

1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Buka "App passwords"
4. Generate password untuk "Mail" → "Other"
5. Copy 16-digit password ke EMAIL_PASS

### 2. Test dengan Mail Server Lain

**Mailtrap (untuk development):**

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
STAFF_EMAIL=test@example.com
```

**SendGrid:**

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## Troubleshooting

### Email tidak terkirim?

1. **Check Console/Logs**

   ```
   ⚠️ Email notification failed: [error message]
   ```

2. **Verifikasi SMTP Credentials**

   - Pastikan EMAIL_USER dan EMAIL_PASS benar
   - Jika pakai Gmail, pastikan menggunakan App Password

3. **Check STAFF_EMAIL format**

   - Pastikan email valid
   - Cek tidak ada typo
   - Test dengan 1 email dulu

4. **Firewall/Network**
   - Pastikan port 587 tidak diblok
   - Try port 465 (secure) atau 25

### Email masuk Spam?

Solusi:

- Setup SPF, DKIM, DMARC di domain
- Gunakan professional email service (SendGrid, Mailgun, etc)
- Hindari penggunaan Gmail untuk production

## API Endpoints yang Mengirim Email

### 1. `/api/dashboard/formulir-pendaftaran` (POST)

**Trigger:** Submit formulir pendaftaran baru atau update
**Recipients:** Semua email di `STAFF_EMAIL`
**Subject:**

- "📝 Formulir Pendaftaran Baru - Iqrolife" (insert)
- "📝 Formulir Pendaftaran Diperbarui - Iqrolife" (update)

### 2. `/api/dashboard/formulir-pendaftaran/review` (POST)

**Trigger:** Admin request edit formulir
**Recipients:** Parent email dari formulir
**Subject:** Varies based on request type

## Best Practices

1. **Production Environment:**

   ```env
   # Use professional email service
   EMAIL_HOST=smtp.sendgrid.net
   STAFF_EMAIL=admin@yourdomain.com,registrar@yourdomain.com
   ```

2. **Development Environment:**

   ```env
   # Use test service
   EMAIL_HOST=smtp.mailtrap.io
   STAFF_EMAIL=dev@example.com
   ```

3. **Security:**

   - Never commit `.env` file to git
   - Use environment-specific .env files
   - Rotate email passwords regularly

4. **Multiple Recipients:**
   - Limit to essential staff only (max 5-10 emails)
   - Too many recipients might trigger spam filters
   - Consider using mailing list/group email instead

## Example Complete .env

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=notification@iqrolife.com
EMAIL_PASS=abcd efgh ijkl mnop  # App Password

# Staff Notifications
STAFF_EMAIL=admin@iqrolife.com,registrar@iqrolife.com,headmaster@iqrolife.com

# Application
NEXT_PUBLIC_BASE_URL=https://iqrolife.com
```

## Support

Jika ada pertanyaan atau masalah terkait email configuration, check:

1. Console logs untuk error messages
2. SMTP server documentation
3. Email service provider support
