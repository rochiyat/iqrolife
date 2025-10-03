import { NextResponse } from 'next/server';

export async function GET() {
  const programs = [
    {
      title: 'Sekolah Iqrolife',
      desc: 'KB-TK',
      icon: '🏫',
      color: 'from-fun-blue to-fun-purple',
    },
    {
      title: 'Parenting & Keluarga',
      desc: 'Kelas parenting, konseling keluarga, dan komunitas',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-fun-orange to-fun-pink',
    },
    {
      title: 'Pemberdayaan Masyarakat',
      desc: 'Beasiswa, pelatihan guru, dan program sosial',
      icon: '🤝',
      color: 'from-fun-yellow to-fun-orange',
    },
  ];

  return NextResponse.json(programs);
}
