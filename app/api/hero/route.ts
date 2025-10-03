import { NextResponse } from 'next/server';

export async function GET() {
  const hero = {
    subtitle: 'Komunitas',
    title: 'Tumbuh Bersama Iqrolife',
    description:
      'Mewujudkan pendidikan berkarakter dalam naungan keluarga yang hangat dan profesional. Kami mendukung sekolah-sekolah Iqrolife serta program pemberdayaan keluarga dan masyarakat untuk masa depan yang lebih cerah.',
    buttons: [
      {
        label: 'Masuk ke Sekolah',
        href: '/school',
        variant: 'primary',
      },
      {
        label: 'Lihat Program Komunitas',
        href: '#program',
        variant: 'secondary',
      },
    ],
    image: {
      src: '/keluarga-belajar.jpg',
      alt: 'Keluarga Iqrolife belajar bersama',
      logo: {
        src: '/logo-iqrolife.png',
        alt: 'Logo Iqrolife',
      },
    },
  };

  return NextResponse.json(hero);
}
