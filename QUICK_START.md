# 🚀 Quick Start - Cloudinary Integration

## ⚡ 3 Steps to Get Started

### Step 1: Install (Already Done ✅)
```bash
npm install cloudinary
```

### Step 2: Configure Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com/) and sign up
2. Copy your credentials from the dashboard
3. Add to `.env`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Step 3: Restart Server
```bash
npm run dev
```

## ✅ That's It!

Your upload functionality is now ready:
- ✅ Registration form: `/program/school/registration`
- ✅ Dashboard admin: `/dashboard/calon-murid`

## 📝 What You Get

### Automatic Features
- 🖼️ Image upload to cloud
- 🗑️ Auto-delete old images
- 📏 File size validation (5MB)
- 🔒 Secure HTTPS URLs
- ⚡ CDN delivery
- 🎨 Auto image optimization

### API Endpoints Ready
- `POST /api/program/school/registration` - Public registration
- `POST /api/dashboard/calon-murid` - Create student
- `PUT /api/dashboard/calon-murid` - Update student
- `DELETE /api/dashboard/calon-murid` - Delete student
- `GET /api/dashboard/calon-murid` - Get all students

## 🧪 Test It

1. Start server: `npm run dev`
2. Go to: `http://localhost:3000/program/school/registration`
3. Fill form and upload image
4. Submit
5. Check Cloudinary dashboard to see uploaded image!

## 📚 Need More Info?

- **Complete Guide:** `CLOUDINARY_INTEGRATION.md`
- **Setup Details:** `CLOUDINARY_SETUP.md`
- **Environment Config:** `ENV_SETUP_GUIDE.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`

## 💡 Pro Tips

1. **Free Tier Limits:**
   - 25 GB storage
   - 25 GB bandwidth/month
   - 25,000 transformations/month

2. **Folder Organization:**
   - `iqrolife/registrations/` - Public registrations
   - `iqrolife/calon-murid/` - Dashboard uploads

3. **Security:**
   - Never commit `.env` to Git
   - API keys are server-side only
   - Only cloud name is public

## 🎉 You're Ready!

Everything is set up and working. Just add your Cloudinary credentials and start uploading! 🚀
