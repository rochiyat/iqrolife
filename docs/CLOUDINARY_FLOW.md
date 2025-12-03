# 🔄 Cloudinary Upload Flow

## Registration Form Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User fills registration form                               │
│  /program/school/registration                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  User uploads bukti transfer (image/PDF)                    │
│  - Max 5MB                                                   │
│  - PNG, JPG, PDF                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Submit form → POST /api/program/school/registration        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Server validates:                                           │
│  ✓ Required fields                                          │
│  ✓ File size (< 5MB)                                        │
│  ✓ File type                                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Upload to Cloudinary                                        │
│  - Folder: iqrolife/registrations/                          │
│  - Public ID: registration_nama_timestamp                   │
│  - Returns: secure_url, public_id                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Save to database (TODO)                                     │
│  - Registration data                                         │
│  - Cloudinary URL                                           │
│  - Public ID (for deletion)                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Return success response                                     │
│  - Registration ID                                          │
│  - Bukti transfer URL                                       │
└─────────────────────────────────────────────────────────────┘
```

## Dashboard CRUD Flow

### Create Student
```
Dashboard Form → POST /api/dashboard/calon-murid
                      ↓
                 Validate data
                      ↓
              Upload to Cloudinary
              (iqrolife/calon-murid/)
                      ↓
              Save to database
                      ↓
              Return success
```

### Update Student
```
Dashboard Edit → PUT /api/dashboard/calon-murid
                      ↓
                 Validate data
                      ↓
         Delete old image (if exists)
                      ↓
         Upload new image (if provided)
                      ↓
              Update database
                      ↓
              Return success
```

### Delete Student
```
Dashboard Delete → DELETE /api/dashboard/calon-murid
                        ↓
              Delete from Cloudinary
                        ↓
              Delete from database
                        ↓
                Return success
```

## File Structure

```
📁 Project Root
├── 📁 lib/
│   └── 📄 cloudinary.ts              # Utility functions
│
├── 📁 app/api/
│   ├── 📁 program/school/registration/
│   │   └── 📄 route.ts               # Public registration API
│   │
│   └── 📁 dashboard/calon-murid/
│       └── 📄 route.ts               # Admin CRUD API
│
├── 📁 app/program/school/registration/
│   └── 📄 page.tsx                   # Registration form
│
├── 📁 app/dashboard/(protected)/calon-murid/
│   └── 📄 page.tsx                   # Admin dashboard
│
├── 📄 .env                           # Environment variables
├── 📄 .env.example                   # Template
│
└── 📁 Documentation/
    ├── 📄 QUICK_START.md
    ├── 📄 CLOUDINARY_INTEGRATION.md
    ├── 📄 CLOUDINARY_SETUP.md
    ├── 📄 ENV_SETUP_GUIDE.md
    ├── 📄 IMPLEMENTATION_SUMMARY.md
    └── 📄 CLOUDINARY_FLOW.md (this file)
```

## Cloudinary Folder Structure

```
☁️ Cloudinary
└── 📁 iqrolife/
    ├── 📁 registrations/
    │   ├── 🖼️ registration_ahmad_zaki_1699123456789.jpg
    │   ├── 🖼️ registration_siti_fatimah_1699123456790.jpg
    │   └── 🖼️ registration_muhammad_rizki_1699123456791.jpg
    │
    └── 📁 calon-murid/
        ├── 🖼️ calon_murid_ahmad_zaki_1699123456792.jpg
        ├── 🖼️ calon_murid_siti_fatimah_1699123456793.jpg
        └── 🖼️ calon_murid_muhammad_rizki_1699123456794.jpg
```

## Data Flow

```
┌──────────────┐
│   Browser    │
│  (Frontend)  │
└──────┬───────┘
       │ FormData with file
       ▼
┌──────────────┐
│  Next.js API │
│  (Backend)   │
└──────┬───────┘
       │ Buffer
       ▼
┌──────────────┐
│  Cloudinary  │
│   (Cloud)    │
└──────┬───────┘
       │ secure_url
       ▼
┌──────────────┐
│  Database    │
│   (Store)    │
└──────────────┘
```

## Security Flow

```
🔒 Environment Variables (.env)
    ↓
    ├─→ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (Public)
    │   └─→ Used in browser for display
    │
    └─→ CLOUDINARY_API_KEY + API_SECRET (Private)
        └─→ Used only in server-side API routes
            └─→ Never exposed to browser
```

## Error Handling

```
Upload Request
    ↓
┌───────────────────┐
│ Validate File     │
│ - Size < 5MB?     │
│ - Valid type?     │
└────┬──────────────┘
     │
     ├─→ ❌ Invalid → Return 400 Error
     │
     └─→ ✅ Valid
         ↓
    ┌────────────────┐
    │ Upload to      │
    │ Cloudinary     │
    └────┬───────────┘
         │
         ├─→ ❌ Failed → Return 500 Error
         │
         └─→ ✅ Success
             ↓
        ┌────────────┐
        │ Save to DB │
        └────┬───────┘
             │
             ├─→ ❌ Failed → Delete from Cloudinary
             │              → Return 500 Error
             │
             └─→ ✅ Success → Return 200 OK
```

## Image Optimization

```
Original Upload (2MB JPG)
    ↓
Cloudinary Processing
    ├─→ Auto format (WebP for modern browsers)
    ├─→ Auto quality (optimal compression)
    ├─→ CDN distribution (fast delivery)
    └─→ Responsive sizing (multiple sizes)
    ↓
Optimized Delivery (500KB WebP)
```

## Benefits Visualization

```
❌ Before (Local Storage)
┌─────────────────────────────────┐
│ Server Storage                  │
│ ├─ Limited space                │
│ ├─ Slow delivery                │
│ ├─ Manual optimization          │
│ ├─ No CDN                       │
│ └─ Backup complexity            │
└─────────────────────────────────┘

✅ After (Cloudinary)
┌─────────────────────────────────┐
│ Cloud Storage                   │
│ ├─ 25GB free space              │
│ ├─ Fast CDN delivery            │
│ ├─ Auto optimization            │
│ ├─ Global CDN                   │
│ └─ Auto backup                  │
└─────────────────────────────────┘
```
