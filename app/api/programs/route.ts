import { NextResponse } from 'next/server';
import { preSchoolData } from '@/lib/data/pre-school';
import { kelasEksplorasiData } from '@/lib/data/kelas-eksplorasi';
import { kelasAqilBalighData } from '@/lib/data/kelas-aqil-baligh';
import { kelasBelajarOrangTuaData } from '@/lib/data/kelas-belajar-orang-tua';
import { komunitasAyahData } from '@/lib/data/komunitas-ayah';
import { konsultasiTMData } from '@/lib/data/konsultasi-tm';

export async function GET() {
  const programs = [
    {
      id: 'kbtk',
      title: 'KB-TK Iqrolife',
      desc: 'Program pendidikan anak usia dini dengan pendekatan bermain sambil belajar',
      icon: '🏫',
      color: 'from-fun-blue to-fun-purple',
      age: '3-6 tahun',
      type: 'school',
      href: '/school/kbtk',
    },
    {
      id: 'pre-school',
      title: preSchoolData.title,
      desc: preSchoolData.subtitle,
      icon: '🌟',
      color: 'from-fun-green to-fun-blue',
      age: '3-6 tahun',
      type: 'program',
      href: '/program/pre-school',
    },
    {
      id: 'kelas-eksplorasi',
      title: kelasEksplorasiData.title,
      desc: kelasEksplorasiData.description.substring(0, 60) + '...',
      icon: '🎨',
      color: 'from-fun-yellow to-fun-orange',
      age: '3-6 tahun',
      type: 'program',
      href: '/program/kelas-eksplorasi',
    },
    {
      id: 'kelas-aqil-baligh',
      title: kelasAqilBalighData.title,
      desc: kelasAqilBalighData.subtitle.substring(0, 60) + '...',
      icon: '🕌',
      color: 'from-fun-purple to-fun-pink',
      age: '10-15 tahun',
      type: 'program',
      href: '/program/kelas-aqil-baligh',
    },
    {
      id: 'kelas-belajar-orang-tua',
      title: kelasBelajarOrangTuaData.title,
      desc: kelasBelajarOrangTuaData.description.substring(0, 60) + '...',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-fun-orange to-fun-pink',
      age: 'Dewasa',
      type: 'program',
      href: '/program/kelas-belajar-orang-tua',
    },
    {
      id: 'komunitas-ayah',
      title: komunitasAyahData.title,
      desc: komunitasAyahData.subtitle.substring(0, 60) + '...',
      icon: '🤝',
      color: 'from-fun-blue to-fun-green',
      age: 'Dewasa',
      type: 'community',
      href: '/program/komunitas-ayah',
    },
    {
      id: 'konsultasi-tm',
      title: konsultasiTMData.title,
      desc: konsultasiTMData.subtitle.substring(0, 60) + '...',
      icon: '💬',
      color: 'from-fun-teal to-fun-cyan',
      age: 'Semua usia',
      type: 'service',
      href: '/program/konsultasi-tm',
    },
  ];

  return NextResponse.json({
    programs,
    total: programs.length,
    categories: {
      school: programs.filter((p) => p.type === 'school').length,
      program: programs.filter((p) => p.type === 'program').length,
      community: programs.filter((p) => p.type === 'community').length,
      service: programs.filter((p) => p.type === 'service').length,
    },
  });
}
