import { NextResponse } from 'next/server';

export async function GET() {
  const footer = {
    about: {
      title: 'Tentang Iqrolife Community',
      description:
        'Komunitas pendidikan berbasis fitrah dengan 7 pendekatan pendidikan yang holistik guna mengembangkan manusia yang paripurna dari 3 aspek: jiwa, fisik dan akal. Iqrolife hadir dengan ekosistem pendidikan untuk semua komponen keluarga: Ayah, Ibu dan Anak dengan program-program yang terstruktur dan terukur.',
      logo: '/logo-iqrolife.png',
    },
    quickLinks: {
      title: 'Links',
      items: [
        {
          title: 'Beranda',
          href: '/',
        },
        {
          title: 'Tentang Kami',
          href: '/tentang-kami',
        },
        {
          title: 'Program',
          href: '/program',
        },
        {
          title: 'Sekolah',
          href: '/school',
        },
        {
          title: 'Kontak',
          href: '/kontak',
        },
      ],
    },
    programs: {
      title: 'Program',
      items: [
        {
          title: 'Kelas Siap Sekolah',
          href: '/program/school',
        },
        {
          title: 'Kelas Eksplorasi',
          href: '/program/kelas-eksplorasi',
        },
        {
          title: 'Kelas Aqil Baligh',
          href: '/program/kelas-aqil-baligh',
        },
        {
          title: 'Kelas Belajar Orang Tua',
          href: '/program/kelas-belajar-orang-tua',
        },
        {
          title: 'Komunitas Ayah',
          href: '/program/komunitas-ayah',
        },
        {
          title: 'Family Talent Discovery',
          href: '/program/family-talent-discovery',
        },
      ],
    },
    schools: {
      title: 'Sekolah',
      items: [
        {
          title: 'KB-TK Iqrolife',
          href: '/school/kbtk',
        },
      ],
    },
    contact: {
      title: 'Kontak',
      address: 'Jl. Raya Bogor No. 123, Kota Bogor',
      phone: '+62 812-3456-7890',
      email: 'info@iqrolife.org',
      social: {
        facebook: 'https://facebook.com/iqrolife',
        instagram: 'https://instagram.com/iqrolife',
        youtube: 'https://youtube.com/@iqrolife',
        twitter: 'https://twitter.com/iqrolife',
      },
    },
    copyright: {
      text: '© 2025 Iqrolife. Hak Cipta Dilindungi.',
      links: [
        {
          title: 'Kebijakan Privasi',
          href: '/privacy-policy',
        },
        {
          title: 'Syarat & Ketentuan',
          href: '/terms',
        },
      ],
    },
  };

  return NextResponse.json(footer);
}
