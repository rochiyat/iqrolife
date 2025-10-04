import { NextResponse } from 'next/server';

export async function GET() {
  const testimonials = {
    title: 'Testimoni',
    subtitle: 'Apa kata mereka tentang Iqrolife?',
    items: [
      {
        name: 'Budi Santoso',
        role: 'Orang Tua Siswa',
        avatar: '/placeholder-user.jpg',
        content:
          'Anak saya sangat senang bersekolah di sini. Guru-gurunya ramah dan sangat memperhatikan perkembangan setiap anak.',
        rating: 5,
      },
      {
        name: 'Siti Aminah',
        role: 'Guru',
        avatar: '/placeholder-user.jpg',
        content:
          'Lingkungan kerja yang profesional dan mendukung pengembangan kompetensi guru. Sistem pembelajaran yang terstruktur dengan baik.',
        rating: 5,
      },
      {
        name: 'Ahmad Fajar',
        role: 'Alumni',
        avatar: '/placeholder-user.jpg',
        content:
          'Pengalaman belajar yang tidak hanya fokus pada akademik, tapi juga pembentukan karakter dan nilai-nilai islami.',
        rating: 5,
      },
      {
        name: 'Dewi Lestari',
        role: 'Orang Tua Siswa',
        avatar: '/placeholder-user.jpg',
        content:
          'Program parenting sangat membantu kami dalam mendidik anak di rumah. Komunikasi antara sekolah dan orang tua terjalin dengan baik.',
        rating: 5,
      },
    ],
  };

  return NextResponse.json(testimonials);
}
