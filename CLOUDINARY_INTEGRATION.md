# 🖼️ Cloudinary Integration - Iqrolife

## Panduan Lengkap Integrasi Cloudinary untuk Upload Bukti Transfer

### 📦 Instalasi

Package Cloudinary sudah terinstall. Jika perlu install ulang:
```bash
npm install cloudinary
```

### 🔑 Konfigurasi

#### 1. Dapatkan Credentials Cloudinary

1. Buat akun gratis di [cloudinary.com](https://cloudinary.com/)
2. Login ke dashboard Cloudinary
3. Di halaman dashboard, Anda akan melihat:
   - **Cloud Name** (contoh: `dxxxxx`)
   - **API Key** (contoh: `123456789012345`)
   - **API Secret** (contoh: `abcdefghijklmnopqrstuvwxyz`)

#### 2. Update File .env

Tambahkan credentials ke file `.env`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Contoh:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxxxxx"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
```

### 📁 Struktur File

```
lib/
  └── cloudinary.ts                    # Utility functions untuk Cloudinary

app/api/
  ├── program/school/registration/
  │   └── route.ts                     # API pendaftaran publik
  └── dashboard/calon-murid/
      └── route.ts                     # API CRUD dashboard admin
```

### 🎯 Fitur yang Sudah Diimplementasi

#### 1. Upload Bukti Transfer (Pendaftaran Publik)
- **Endpoint:** `POST /api/program/school/registration`
- **Folder Cloudinary:** `iqrolife/registrations/`
- **File:** `app/api/program/school/registration/route.ts`

#### 2. CRUD Calon Murid (Dashboard Admin)
- **Endpoint:** `POST /api/dashboard/calon-murid` (Create)
- **Endpoint:** `PUT /api/dashboard/calon-murid` (Update)
- **Endpoint:** `DELETE /api/dashboard/calon-murid` (Delete)
- **Folder Cloudinary:** `iqrolife/calon-murid/`
- **File:** `app/api/dashboard/calon-murid/route.ts`

### 🔧 Fungsi Utility

#### uploadToCloudinary()
Upload file ke Cloudinary
```typescript
const result = await uploadToCloudinary(buffer, 'folder-name', {
  public_id: 'unique-id',
  resource_type: 'auto'
});
```

#### deleteFromCloudinary()
Hapus file dari Cloudinary
```typescript
await deleteFromCloudinary('public-id');
```

#### getOptimizedImageUrl()
Dapatkan URL gambar yang dioptimasi
```typescript
const url = getOptimizedImageUrl('public-id', {
  width: 800,
  quality: 'auto',
  format: 'auto'
});
```

### 📋 Validasi

- ✅ Maksimal ukuran file: **5MB**
- ✅ Format yang didukung: **PNG, JPG, JPEG, PDF**
- ✅ Auto-generate unique public_id
- ✅ Auto-delete old image saat update

### 🗂️ Organisasi Folder di Cloudinary

```
iqrolife/
  ├── registrations/          # Bukti transfer dari form pendaftaran publik
  │   └── registration_nama_timestamp.jpg
  └── calon-murid/           # Bukti transfer dari dashboard admin
      └── calon_murid_nama_timestamp.jpg
```

### 🚀 Cara Menggunakan

#### Di Form Pendaftaran (app/program/school/registration/page.tsx)
Form sudah siap, tinggal submit:
```typescript
const formData = new FormData();
formData.append('namaLengkap', 'Ahmad Zaki');
formData.append('buktiTransfer', file);

const response = await fetch('/api/program/school/registration', {
  method: 'POST',
  body: formData,
});
```

#### Di Dashboard Admin (app/dashboard/(protected)/calon-murid/page.tsx)
```typescript
// Create
const formData = new FormData();
formData.append('namaLengkap', 'Ahmad Zaki');
formData.append('buktiTransfer', file);

await fetch('/api/dashboard/calon-murid', {
  method: 'POST',
  body: formData,
});

// Update
formData.append('id', studentId);
formData.append('oldPublicId', oldPublicId); // untuk hapus gambar lama

await fetch('/api/dashboard/calon-murid', {
  method: 'PUT',
  body: formData,
});

// Delete
await fetch(`/api/dashboard/calon-murid?id=${id}&publicId=${publicId}`, {
  method: 'DELETE',
});
```

### 🔒 Keamanan

- API Key dan Secret **TIDAK** di-expose ke client
- Hanya `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` yang public
- Upload dilakukan di server-side
- Validasi file size dan type di server

### 📊 Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Pendaftaran berhasil diterima",
  "data": {
    "buktiTransferUrl": "https://res.cloudinary.com/..."
  }
}
```

#### Error Response
```json
{
  "error": "Ukuran file maksimal 5MB"
}
```

### 🎨 Optimasi Gambar

Cloudinary otomatis mengoptimasi gambar:
- Format auto (WebP untuk browser yang support)
- Quality auto
- Lazy loading support
- Responsive images

### 📝 TODO: Integrasi Database

Setelah setup Cloudinary, tambahkan ke database:
```typescript
// Simpan URL dan public_id ke database
const student = await db.student.create({
  data: {
    name: namaLengkap,
    paymentProof: cloudinaryResult.secure_url,
    paymentProofPublicId: cloudinaryResult.public_id,
    // ... fields lainnya
  }
});
```

### ❓ Troubleshooting

#### Error: "Missing required parameter - cloud_name"
- Pastikan environment variables sudah di-set dengan benar
- Restart development server setelah update .env

#### Error: "Upload failed"
- Check API credentials
- Pastikan file size < 5MB
- Check internet connection

#### Image tidak muncul
- Pastikan URL dari Cloudinary valid
- Check browser console untuk errors
- Verify public_id di Cloudinary dashboard

### 📞 Support

Jika ada masalah, check:
1. Cloudinary dashboard untuk melihat uploaded files
2. Console logs untuk error messages
3. Network tab untuk API responses
