# Quick Setup: Email Notifications

## Tambahkan ke .env

```env
# Email SMTP Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Staff Email(s) untuk notifikasi formulir
# Format: comma-separated untuk multiple emails
STAFF_EMAIL=admin@iqrolife.com,teacher@iqrolife.com
```

## Cara Menulis Multiple Emails

### ✅ Benar:

```env
STAFF_EMAIL=email1@example.com,email2@example.com,email3@example.com
```

Atau dengan spasi (untuk readability):

```env
STAFF_EMAIL=email1@example.com, email2@example.com, email3@example.com
```

### ❌ Salah:

```env
# Jangan gunakan semicolon
STAFF_EMAIL=email1@example.com;email2@example.com

# Jangan gunakan quotes untuk setiap email
STAFF_EMAIL="email1@example.com","email2@example.com"
```

## Cara Kerja

1. User submit formulir di `dashboard/formulir`
2. Formulir tersimpan ke database
3. Email otomatis terkirim ke **SEMUA email** di `STAFF_EMAIL`
4. Email berisi:
   - Data calon murid (nama, tanggal lahir, program)
   - Data orang tua
   - Link ke dashboard untuk melihat detail

## Testing

1. Set STAFF_EMAIL ke email Anda sendiri
2. Submit formulir test
3. Check inbox (dan spam folder)
4. Jika tidak ada email, check console untuk error

## Gmail App Password

Jika pakai Gmail, jangan pakai password biasa. Generate App Password:

1. [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. App passwords → Mail → Generate
4. Copy 16-digit code ke `EMAIL_PASS`

## Lihat Detail

Baca file `docs/EMAIL-CONFIGURATION.md` untuk dokumentasi lengkap.
