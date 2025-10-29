import { NextResponse } from 'next/server';

export async function GET() {
  const gallery = {
    title: 'Galeri Kegiatan',
    subtitle: 'Momen-momen berharga dalam perjalanan kami',
    images: [
      {
        src: '/kelas-bermain.png',
        alt: 'Suasana Kelas Bermain',
        caption: 'Pembelajaran Interaktif',
      },
      {
        src: '/school-library-with-books.jpg',
        alt: 'kelas Eksplorasi',
        caption: 'Eksplor Dunia Kerja dan Kenal dengan Tokoh',
      },
      {
        src: '/happy-kindergarten-children-playing-and-learning-i.jpg',
        alt: 'Kelas Aqil Baligh',
        caption:
          'Pendalaman Bidang Keahlian, Menguatkan Kesadaran Tanggung Jawab & Kedewasaan',
      },
      {
        src: '/parenting-program.jpg',
        alt: 'Kelas Belajar Orang Tua',
        caption:
          'Belajar Seputar Pengasuhan, Keayahan, Pendidikan Holistik, dan Pendidikan Berbasis Fitrah',
      },
      {
        src: '/school-principal-or-teacher-with-certificate.jpg',
        alt: 'Mentoring Ayah',
        caption: 'Pendampingan Intensif dan Berkelanjutan untuk Ayah Iqrolife',
      },
      {
        src: '/science-laboratory.png',
        alt: 'Mentoring Ibu',
        caption: 'Pendampingan Intensif dan Berkelanjutan untuk Ibu Iqrolife',
      },
      {
        src: '/science-laboratory.png',
        alt: 'Family Talent Discovery',
        caption: 'Mengenal Lebih Jauh Bakat Diri, Pasangan, dan Anak-anak',
      },
    ],
  };

  return NextResponse.json(gallery);
}
