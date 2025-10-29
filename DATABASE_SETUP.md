# Database Setup - Iqrolife

## Overview
This project uses PostgreSQL (Aiven) with Prisma ORM for database management. The setup includes user authentication, student registration management, and full auth flow.

## Database Connection
- **Provider**: Aiven PostgreSQL
- **Host**: pg-18928b1b-houseofbaituna.l.aivencloud.com
- **Port**: 16855
- **Database**: defaultdb
- **SSL**: Required

## Environment Variables
Add these to your `.env` file (already configured):
```env
DATABASE_URL="postgres://avnadmin:AVNS_BEzKY3t2ydzg2y1jZyV@pg-18928b1b-houseofbaituna.l.aivencloud.com:16855/defaultdb?sslmode=require"
JWT_SECRET="your-jwt-secret-change-this-in-production"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

### Users Table
Stores admin/staff users for dashboard access.
```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String
  password          String    // bcrypt hashed
  role              String    @default("admin")
  resetToken        String?
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### Prospective Students Table
Stores student registration data from the school registration form.
```prisma
model ProspectiveStudent {
  id                String    @id @default(cuid())
  namaLengkap       String
  tanggalLahir      String
  jenisKelamin      String
  asalSekolah       String?
  namaOrangTua      String
  noTelepon         String
  email             String
  alamat            String
  catatan           String?
  buktiTransferPath String?
  status            String    @default("pending")
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

## Prisma Commands

### Generate Prisma Client
```bash
npm run db:generate
# or
npx prisma generate
```

### Create Migration
```bash
npm run db:migrate
# or
npx prisma migrate dev --name migration_name
```

### Seed Database
```bash
npm run db:seed
```

### Push Schema Changes (Development)
```bash
npm run db:push
# or
npx prisma db push
```

### Open Prisma Studio
```bash
npm run db:studio
# or
npx prisma studio
```

## Seeded Data
The database is pre-seeded with:

1. **Admin User**
   - Email: `admin@iqrolife.com`
   - Password: `admin123`
   - Role: admin

2. **Test User**
   - Email: `test@iqrolife.com`
   - Password: `test123`
   - Role: staff

## Dashboard Features

### Pages
1. **Dashboard Home** (`/dashboard`)
   - Statistics cards (total, pending, approved, rejected)
   - Recent activity
   - Quick actions

2. **Calon Murid** (`/dashboard/calon-murid`)
   - List all prospective students
   - Filter by status (pending/approved/rejected)
   - Search functionality
   - View student details
   - Approve/Reject with auto user creation
   - Delete student

3. **Users Management** (`/dashboard/users`)
   - List all users
   - Filter by role
   - Create new user (auto-generate password)
   - Edit user
   - Delete user
   - Password management

4. **Roles & Permissions** (`/dashboard/roles`)
   - View role descriptions
   - Permissions matrix
   - Menu access per role

### User Roles
- **Admin**: Full access to all features
- **Teacher**: Dashboard + limited student data access
- **Staff**: Dashboard + student registration management
- **Parent**: Dashboard only (view their child's info)

## API Endpoints

### Dashboard Statistics
```
GET /api/dashboard/statistics
Response: { total, pending, approved, rejected }
```

### Student Management
```
GET /api/dashboard/students?status={status}&search={query}
Response: { students: [...] }

POST /api/dashboard/students
Body: { studentId, action: "approve"|"reject", createUser: boolean }
Response: { success, message, student, user? }

DELETE /api/dashboard/students?id={studentId}
Response: { success, message }
```

### User Management
```
GET /api/dashboard/users?role={role}&search={query}
Response: { users: [...] }

POST /api/dashboard/users
Body: { email, name, role, password? }
Response: { success, message, user, password }

PUT /api/dashboard/users
Body: { userId, email?, name?, role?, password? }
Response: { success, message, user }

DELETE /api/dashboard/users?id={userId}
Response: { success, message }
```

### Authentication

#### Login
```
POST /api/dashboard/login
Body: { email: string, password: string }
Response: { success: boolean, user: {...}, message: string }
```

#### Logout
```
POST /api/dashboard/logout
Response: { success: boolean, message: string }
```

#### Check Auth Status
```
GET /api/dashboard/login
Response: { authenticated: boolean, user?: {...} }
```

#### Forgot Password
```
POST /api/dashboard/forgot-password
Body: { email: string }
Response: { success: boolean, message: string }
```

#### Verify Reset Token
```
GET /api/dashboard/forgot-password?token={token}
Response: { valid: boolean, email?: string }
```

#### Reset Password
```
POST /api/dashboard/reset-password
Body: { token: string, password: string }
Response: { success: boolean, message: string }
```

### Student Registration

#### Create Registration
```
POST /api/program/school/registration
Body: FormData with student and parent info + file upload
Response: { success: boolean, registrationId: string }
```

## Authentication Flow

### Login Flow
1. User submits email + password
2. API finds user in database
3. Verify password with bcrypt
4. Generate JWT token
5. Set HTTP-only cookie with token
6. Return user data

### Forgot Password Flow
1. User submits email
2. API checks if email exists
3. Generate secure reset token (32 bytes)
4. Store token + expiry (1 hour) in database
5. Send email with reset link (TODO: implement email service)
6. Return success message

### Reset Password Flow
1. User clicks reset link with token
2. Frontend validates token via GET request
3. User submits new password
4. API verifies token and expiry
5. Hash new password with bcrypt
6. Update user password and clear reset token
7. Redirect to login

### Logout Flow
1. User clicks logout
2. API clears auth-token cookie
3. Redirect to login page

## Security Features

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Tokens**: Signed with secret, 7-day expiry
3. **HTTP-Only Cookies**: Prevent XSS attacks
4. **Secure Cookies**: Only over HTTPS in production
5. **Email Enumeration Prevention**: Always return success
6. **Reset Token Expiry**: 1 hour validity
7. **Token Validation**: Verify expiry and existence

## File Uploads

### Configuration
- **Path**: `public/uploads/registrations/`
- **Max Size**: 5MB
- **Accepted**: Images (JPG, PNG) and PDF
- **Naming**: `{timestamp}_{sanitized_filename}`

## Protected Routes

Dashboard routes are protected by middleware. Users must be authenticated to access:
- `/dashboard/*` (except login, forgot-password, reset-password)

Middleware checks JWT token from HTTP-only cookie and redirects to login if invalid.

## Auto User Creation Feature

When approving a prospective student, you can automatically create a user account:
1. Click "Approve & Create User" button
2. System creates user with:
   - Email: parent's email from registration
   - Password: auto-generated (8 characters)
   - Role: "parent"
3. Password is displayed to admin (should be sent via email)

## Deployment to Vercel

### Environment Variables
Add these to Vercel project settings:
```
DATABASE_URL=postgres://avnadmin:xxx@host:port/db?sslmode=require
JWT_SECRET=your-production-secret-change-this
NEXTAUTH_SECRET=your-production-secret-change-this
NEXTAUTH_URL=https://yourdomain.com
```

### Build Configuration
The project is already configured for Vercel deployment:
- Prisma client is generated during build
- Database migrations run automatically
- Serverless functions handle API routes

### Post-Deployment
1. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. Seed database:
   ```bash
   npm run db:seed
   ```

## TODO for Production

### Email Service
Implement email sending for:
- Forgot password reset links
- Registration confirmation emails
- Admin notifications

Recommended services:
- SendGrid
- AWS SES
- Resend
- Nodemailer + SMTP

### Rate Limiting
Implement rate limiting for:
- Login attempts
- Forgot password requests
- Registration submissions

### Additional Features
- [ ] 2FA authentication
- [ ] Email verification on registration
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Session management UI
- [ ] Admin dashboard for viewing registrations
- [ ] Export registrations to CSV/Excel
- [ ] Email templates

## Troubleshooting

### "PrismaClient is unable to run in the browser"
Make sure you're only importing `@/lib/prisma` in server-side code (API routes, not client components).

### "Error: P2002: Unique constraint failed"
This usually means you're trying to insert duplicate data. Check unique fields like email.

### "Connection timeout"
Check if database is accessible and environment variables are correct.

### "Module not found: Can't resolve '@prisma/client'"
Run `npx prisma generate` to generate the Prisma client.

## Support
For issues related to:
- Database: Check Aiven console
- Prisma: See [Prisma Docs](https://www.prisma.io/docs)
- NextJS: See [Next.js Docs](https://nextjs.org/docs)
