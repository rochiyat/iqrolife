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
          href: '/program/school',
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
          title: 'Mentoring Ayah',
          href: '/program/mentoring-ayah',
        },
        {
          title: 'Mentoring Ibu',
          href: '/program/mentoring-ibu',
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
          title: 'Kelas Siap Sekolah',
          href: '/program/school',
        },
      ],
    },
    contact: {
      title: 'Kontak',
      address:
        'Gg. Haji Soleh No. 1A RT 01/06 Kel. Kedung Waringin Kec. Tanah Sareal, Kota Bogor 16163',
      phone: '+62813-1522-5557',
      email: 'iqrolife@gmail.com',
      social: {
        instagram: 'https://instagram.com/iqrolife.id',
        youtube: 'https://youtube.com/@KELUARGAIQROLIFE',
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
