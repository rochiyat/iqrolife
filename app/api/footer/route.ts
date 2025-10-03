import { NextResponse } from 'next/server';

export async function GET() {
  const footer = {
    about: {
      title: 'Tentang Iqrolife',
      description:
        'Iqrolife adalah lembaga pendidikan Islam yang berfokus pada pengembangan karakter dan potensi anak melalui pendekatan pembelajaran yang holistik dan Islami.',
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
          title: 'Kelas Eksplorasi',
          href: '/program/kelas-eksplorasi',
        },
        {
          title: 'Kelas Belajar Orang Tua',
          href: '/program/kelas-belajar-orang-tua',
        },
        {
          title: 'Kelas Pra Aqil Baligh',
          href: '/program/kelas-pra-aqil-baligh',
        },
      ],
    },
    schools: {
      title: 'Sekolah',
      items: [
        {
          title: 'KB-TK Islam',
          href: '/school/kbtk',
        },
        {
          title: 'SD Islam',
          href: '/school/sd',
        },
        {
          title: 'SMP Islam',
          href: '/school/smp',
        },
        {
          title: 'Homeschooling',
          href: '/school/homeschooling',
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
      text: '© 2024 Iqrolife. Hak Cipta Dilindungi.',
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
