import { NextResponse } from 'next/server';

export async function GET() {
  const cta = {
    title: 'Siap tumbuh bersama keluarga besar Iqrolife?',
    description:
      'Bergabunglah dengan kami dalam membangun generasi yang berakhlak dan berprestasi',
    buttons: [
      {
        label: 'Daftar PPDB',
        href: '/school/ppdb',
        variant: 'primary',
      },
      {
        label: 'Jelajahi Sekolah',
        href: '/school',
        variant: 'secondary',
      },
    ],
  };

  return NextResponse.json(cta);
}
