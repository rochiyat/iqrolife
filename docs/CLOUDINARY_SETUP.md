# Cloudinary Integration Setup

## 📋 Overview
Integrasi Cloudinary untuk upload dan manajemen gambar bukti transfer pendaftaran.

## 🔧 Setup Instructions

### 1. Install Cloudinary Package
```bash
npm install cloudinary
```

### 2. Get Cloudinary Credentials
1. Buat akun di [Cloudinary](https://cloudinary.com/)
2. Login ke dashboard
3. Copy credentials dari dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 3. Configure Environment Variables
Tambahkan ke file `.env`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 📁 File Structure
```
lib/
  └── cloudinary.ts          # Cloudinary utility functions
app/api/
  ├── program/school/registration/
  │   └── route.ts          # Registration API with Cloudinary
  └── dashboard/calon-murid/
      └── route.ts          # Dashboard CRUD API with Cloudinary
```

## 🚀 Usage

### Upload Image
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

const result = await uploadToCloudinary(buffer, 'folder-name', {
  public_id: 'unique-id',
  resource_type: 'auto'
});
```

### Delete Image
```typescript
import { deleteFromCloudinary } from '@/lib/cloudinary';

await deleteFromCloudinary('public-id');
```

## 📂 Folder Organization
- `iqrolife/registrations/` - Bukti transfer pendaftaran publik
- `iqrolife/calon-murid/` - Bukti transfer dari dashboard admin

## ✅ Features
- ✨ Auto upload to Cloudinary
- 🗑️ Auto delete old images on update
- 📏 File size validation (max 5MB)
- 🔒 Secure URL generation
- 🎨 Image optimization support
