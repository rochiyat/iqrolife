import { schoolData } from './school';
import { kelasEksplorasiData } from './kelas-eksplorasi';
import { kelasAqilBalighData } from './kelas-aqil-baligh';
import { kelasBelajarOrangTuaData } from './kelas-belajar-orang-tua';
import { mentoringAyahData } from './mentoring-ayah';
import { familyTalentDiscoveryData } from './family-talent-discovery';

export const programsHomeData = [
  {
    id: 'school',
    title: 'Kelas Siap Sekolah',
    desc: 'Pendidikan sekolah yang mencakup pendidikan iman, ego/individualitas, emosi dan sensori-motorik guna mempersiapkan anak untuk menuju jenjang pendidikan berikutnya.',
    icon: 'book',
    color: 'brand-emerald',
    borderColor: 'brand-emerald',
    age: '3-6 tahun',
    type: 'program',
    href: '/program/school',
  },
  {
    id: 'kelas-eksplorasi',
    title: 'Kelas Eksplorasi',
    desc: 'Program pendidikan dimana teman Iqrolife akan dipaparkan dengan berbagai hal tentang bagaimana dunia bekerja dan dikenalkan dengan berbagai tokoh dan profesi yang ada di dunia.',
    icon: 'globe',
    color: 'brand-cyan',
    borderColor: 'brand-cyan',
    age: '7-10 tahun',
    type: 'program',
    href: '/program/kelas-eksplorasi',
  },
  {
    id: 'kelas-aqil-baligh',
    title: 'Kelas Aqil Baligh',
    desc: 'Program pendidikan guna mempersiapkan teman iqrolife menuju tahapan aqil balighnya dengan pendalaman bidang keahlian, menguatkan kesadaran tanggung jawab & kedewasaan, serta keterlibatan pada kegiatan sosial dan amal kebaikan di tengah masyarakat.',
    icon: 'badge',
    color: 'brand-lime',
    borderColor: 'brand-lime',
    age: '11-15 tahun',
    type: 'program',
    href: '/program/kelas-aqil-baligh',
  },
  {
    id: 'kelas-belajar-orang-tua',
    title: 'Kelas Belajar Orang Tua',
    desc: 'Program pendidikan dimana orang tua akan belajar tentang berbagai topik seputar pengasuhan, keayahan, pendidikan holistik, pendidikan berbasis fitrah dll, guna memastikan keselarasan pendidikan di rumah dan di komunitas.',
    icon: 'users',
    color: 'brand-warm-brown',
    borderColor: 'brand-warm-brown',
    age: 'Dewasa',
    type: 'program',
    href: '/program/kelas-belajar-orang-tua',
  },
  {
    id: 'mentoring-ayah',
    title: 'Mentoring Ayah',
    desc: 'Program pendampingan intensif dan berkelanjutan untuk Ayah Iqrolife guna memastikan keterlibatan dan keselarasan peran Ayah pada proses pengasuhan dan pendidikan anak.',
    icon: 'user',
    color: 'brand-coral',
    borderColor: 'brand-coral',
    age: 'Dewasa',
    type: 'community',
    href: '/program/mentoring-ayah',
  },
  {
    id: 'mentoring-ibu',
    title: 'Mentoring Ibu',
    desc: 'Program pendampingan intensif dan berkelanjutan untuk Ibu Iqrolife guna memastikan kesiapan dan keselarasan Ibu dalam mendampingi tumbuh kembang anak yang selaras fitrah.',
    icon: 'heart',
    color: 'from-brand-emerald to-brand-cyan',
    borderColor: 'brand-emerald',
    age: 'Dewasa',
    type: 'community',
    href: '/program/mentoring-ibu',
  },
  {
    id: 'family-talent-discovery',
    title: 'Family Talent Discovery',
    desc: 'Program mengenal lebih jauh bakat diri, pasangan, dan anak-anak guna menemukan potensi kekuatan diri, pasangan dan anak-anak dalam upaya menemukan misi hidup dan keluarga.',
    icon: 'star',
    color: 'from-brand-cyan to-brand-lime',
    borderColor: 'brand-cyan',
    age: 'Semua usia',
    type: 'service',
    href: '/program/family-talent-discovery',
    fullWidth: true,
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
