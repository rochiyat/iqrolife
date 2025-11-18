# 🔐 Environment Variables Setup Guide

## Cloudinary Configuration

### Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up" (Free tier available)
3. Complete registration

### Step 2: Get Your Credentials
1. Login to Cloudinary Dashboard
2. You'll see your credentials on the main dashboard:
   ```
   Cloud name: dxxxxx
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```

### Step 3: Update .env File
Open your `.env` file and add these lines:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxxxxx"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
```

**Replace with your actual credentials!**

### Step 4: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Complete .env File Example

```env
# Aiven PostgreSQL Database URL
DATABASE_URL="postgres://username:password@host:port/database?sslmode=require"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# JWT Secret for custom auth
JWT_SECRET="your-jwt-secret-change-this-in-production"

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dxxxxx"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
```

## ⚠️ Important Notes

1. **Never commit .env to Git** - It's already in .gitignore
2. **NEXT_PUBLIC_* variables** are exposed to the browser
3. **Other variables** are server-side only
4. **Restart server** after changing .env

## ✅ Verify Setup

After setup, test the upload:
1. Go to registration page: `/program/school/registration`
2. Fill the form and upload an image
3. Submit the form
4. Check Cloudinary dashboard to see the uploaded image

## 🆓 Cloudinary Free Tier Limits

- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month
- More than enough for most projects!

## 🔗 Useful Links

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
