import { NextResponse } from 'next/server';

export async function GET() {
  const gallery = {
    title: 'Galeri Kegiatan',
    subtitle: 'Momen-momen berharga dalam perjalanan kami',
    images: [
      {
        src: '/classroom-learning.png',
        alt: 'Suasana Belajar di Kelas',
        caption: 'Pembelajaran Interaktif',
      },
      {
        src: '/school-library-with-books.jpg',
        alt: 'Perpustakaan Sekolah',
        caption: 'Ruang Membaca',
      },
      {
        src: '/happy-kindergarten-children-playing-and-learning-i.jpg',
        alt: 'Anak-anak Bermain dan Belajar',
        caption: 'Bermain Sambil Belajar',
      },
      {
        src: '/parenting-program.jpg',
        alt: 'Program Parenting',
        caption: 'Sesi Parenting',
      },
      {
        src: '/school-principal-or-teacher-with-certificate.jpg',
        alt: 'Sertifikasi Guru',
        caption: 'Pengembangan SDM',
      },
      {
        src: '/science-laboratory.png',
        alt: 'Laboratorium Sains',
        caption: 'Fasilitas Pembelajaran',
      },
    ],
  };

  return NextResponse.json(gallery);
}
