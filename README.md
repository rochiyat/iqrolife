# Iqrolife Community Website

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> Platform digital untuk Komunitas Iqrolife - Pendidikan berbasis fitrah dengan pendekatan holistik untuk mengembangkan manusia paripurna.

## 🌟 Tentang Iqrolife

Iqrolife adalah komunitas pendidikan berbasis fitrah yang menghadirkan 7 dimensi pendidikan holistik untuk mengembangkan manusia paripurna dari 3 aspek: jiwa, fisik, dan akal. Kami menyediakan ekosistem pendidikan lengkap untuk seluruh komponen keluarga: Ayah, Ibu, dan Anak.

## ✨ Fitur Utama

- 🎓 **Program Pendidikan Lengkap** - Kelas Siap Sekolah, Kelas Eksplorasi, Kelas Aqil Baligh
- 👨‍👩‍👧 **Program Keluarga** - Family Camp, Family Talent Discovery, Mentoring Ayah & Ibu
- 📚 **7 Dimensi Pendidikan Holistik** - Pendekatan komprehensif untuk perkembangan anak
- 🖼️ **Galeri Kegiatan** - Dokumentasi momen berharga komunitas
- 💬 **Testimoni** - Pengalaman nyata dari orang tua dan alumni
- 📞 **Kontak & Pendaftaran** - Sistem pendaftaran online yang mudah

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Shadcn/ui
- **Animation:** Framer Motion
- **Database:** PostgreSQL (Aiven)
- **Deployment:** Vercel
- **Image Storage:** Cloudinary

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/iqrolife/iqrolife.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🔧 Environment Variables

Buat file `.env.local` dengan variabel berikut:

```env
# Database
DATABASE_URL=your_database_url

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 Struktur Project

```
iqrolife/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── program/           # Program pages
│   ├── profile/           # Profile pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                   # Utilities & helpers
│   ├── data/             # Static data
│   └── utils/            # Utility functions
├── public/               # Static assets
│   ├── gallery/          # Gallery images
│   └── program/          # Program images
└── .github/              # GitHub workflows
```

## 🎨 Design System

Website ini menggunakan design system yang konsisten dengan:
- **Color Palette:** Brand colors (Emerald, Cyan, Lime, Coral, Warm Brown)
- **Typography:** Inter & Poppins fonts
- **Components:** Reusable UI components dengan Radix UI
- **Animations:** Smooth transitions dengan Framer Motion

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk diskusi.

## 📄 License

This project is licensed under the MIT License.

## 📞 Kontak

- **Website:** [iqrolife.id](https://iqrolife.id)
- **Email:** iqrolife@gmail.com
- **WhatsApp:** +62 813-1522-5557

---

**Dibuat dengan ❤️ oleh Tim Iqrolife**
