import { preSchoolData } from './pre-school';
import { kelasEksplorasiData } from './kelas-eksplorasi';
import { kelasAqilBalighData } from './kelas-aqil-baligh';
import { kelasBelajarOrangTuaData } from './kelas-belajar-orang-tua';
import { komunitasAyahData } from './komunitas-ayah';
import { konsultasiTMData } from './konsultasi-tm';

export const programsHomeData = [
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

export const programsHomeStats = {
  total: programsHomeData.length,
  categories: {
    school: programsHomeData.filter((p) => p.type === 'school').length,
    program: programsHomeData.filter((p) => p.type === 'program').length,
    community: programsHomeData.filter((p) => p.type === 'community').length,
    service: programsHomeData.filter((p) => p.type === 'service').length,
  },
};
