# 🎓 Iqrolife - Islamic Education Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A comprehensive web-based management system for Islamic educational institutions, built with modern technologies and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Iqrolife is a modern, full-stack web application designed to streamline the management of Islamic educational institutions. It provides comprehensive tools for student registration, form management, portfolio showcase, and administrative tasks.

### Key Highlights

- 🎯 **Role-Based Access Control** - Superadmin, Staff, Teacher, and Parent roles
- 📝 **Student Registration System** - Complete workflow from form submission to enrollment
- 🖼️ **Portfolio Management** - Showcase school activities and achievements
- 📊 **Dashboard Analytics** - Real-time insights and statistics
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- ☁️ **Cloud Storage** - Cloudinary integration for image management
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS

## ✨ Features

### Public Website
- 🏠 Landing page with school information
- 📖 About Us section (Vision, Mission, History)
- 🎓 Program showcase (KBTK, Kelas Eksplorasi, etc.)
- 📸 Gallery and portfolio
- 📞 Contact information
- 📝 Online registration form

### Dashboard (Protected)
- 👥 **User Management** - CRUD operations for users
- 🎓 **Student Candidates** - Manage prospective students
- 📋 **Form Submissions** - Review and process registration forms
- 🗂️ **Menu Management** - Dynamic navigation configuration
- 🎨 **Portfolio Management** - Create and manage gallery items
- ⚙️ **Settings** - Application configuration
- 📊 **Activity Logs** - Track user actions and changes

### Role-Based Features

| Feature | Superadmin | Staff | Teacher | Parent |
|---------|------------|-------|---------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ | ❌ |
| Student Candidates | ✅ | ✅ | ✅ | ❌ |
| Form List | ✅ | ✅ | ✅ | ❌ |
| Submit Forms | ✅ | ✅ | ❌ | ✅ |
| Portfolio | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ | ❌ |

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL (Aiven Cloud)
- **ORM:** Raw SQL with pg driver
- **Authentication:** JWT + bcrypt
- **File Upload:** Cloudinary

### DevOps
- **Hosting:** Vercel
- **Database:** Aiven PostgreSQL
- **CDN:** Cloudinary
- **Version Control:** Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/iqrolife.git
cd iqrolife
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **Run database migrations**
```bash
npm install pg dotenv bcrypt
node db/migrate-complete.js
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 🗄️ Database Setup

### Quick Setup

Run the complete migration script:
```bash
node db/migrate-complete.js
```

This will create:
- 8 database tables
- Indexes for performance
- Auto-update triggers
- 43 seed records

### Default Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@iqrolife.com | password123 | superadmin |
| staff@iqrolife.com | password123 | staff |
| teacher@iqrolife.com | password123 | teacher |
| parent@iqrolife.com | password123 | parent |

⚠️ **Change these passwords in production!**

### Database Schema

```
users (4)           - User accounts
roles (4)           - Role definitions
calon_murid (6)     - Student candidates
formulir (4)        - Form submissions
menu (9)            - Navigation items
portofolio (3)      - Gallery items
settings (11)       - App configuration
activity_logs (5)   - Activity tracking
```

For detailed schema information, see [DATABASE_COMPLETE_SETUP.md](DATABASE_COMPLETE_SETUP.md)

## 📁 Project Structure

```
iqrolife/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages
│   │   ├── page.tsx             # Landing page
│   │   ├── tentang-kami/        # About pages
│   │   └── program/             # Program pages
│   ├── dashboard/               # Dashboard
│   │   ├── (protected)/         # Protected routes
│   │   │   ├── calon-murid/    # Student management
│   │   │   ├── formulir-list/  # Form list
│   │   │   ├── users/          # User management
│   │   │   ├── roles/          # Role management
│   │   │   ├── menu/           # Menu management
│   │   │   ├── portofolio/     # Portfolio
│   │   │   └── settings/       # Settings
│   │   └── login/              # Login page
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # UI components
│   └── ...                      # Feature components
├── lib/                         # Utilities
│   ├── auth-context.tsx        # Auth context
│   ├── cloudinary.ts           # Cloudinary utils
│   └── ...
├── db/                          # Database
│   ├── schema-complete.sql     # Complete schema
│   ├── seed-complete.sql       # Seed data
│   ├── migrate-complete.js     # Migration script
│   └── rollback.sql            # Rollback script
├── public/                      # Static files
└── docs/                        # Documentation
```

## 🔐 Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgres://user:pass@host:port/db?sslmode=require"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

See [.env.example](.env.example) for complete list.

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting (recommended)
- Conventional commits

### Database Commands

```bash
# Run migration
node db/migrate-complete.js

# Rollback
psql $DATABASE_URL -f db/rollback.sql

# Verify
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

### Database Migration

Run migration on production database:
```bash
DATABASE_URL="production-url" node db/migrate-complete.js
```

## 📚 Documentation

- [Database Setup Guide](DATABASE_COMPLETE_SETUP.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Database Relationships](DATABASE_RELATIONSHIPS.md)
- [Cloudinary Integration](CLOUDINARY_INTEGRATION.md)
- [Menu Formulir List](MENU_FORMULIR_LIST.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** [Your Name]
- **Organization:** Iqrolife Foundation

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Aiven for PostgreSQL hosting
- Cloudinary for image management
- All contributors and supporters

## 📞 Support

For support, email info@iqrolife.com or open an issue on GitHub.

---

**Made with ❤️ for Fitrah Based Education**

*Last updated: November 2025*
