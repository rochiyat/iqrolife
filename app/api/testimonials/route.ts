import { NextResponse } from 'next/server';

export async function GET() {
  const testimonials = {
    title: 'Testimoni',
    subtitle: 'Apa kata mereka tentang Iqrolife?',
    items: [
      {
        name: 'Faldiena',
        role: 'Orang Tua Siswa',
        avatar: '/testimonial/testimonial-avatar-ibu-affan.jpg',
        content:
          'Awalnya saya mendaftarkan Affan ke kelas bermain Iqrolife supaya ga repot cari aktivitas atau kegiatan untuk Affan. Tapi ternyata saya kaget, di sini ibunya harus mendampingi. Buat saya ga mudah namun akhirnya saya sangat bersyukur karena bisa lebih mengenal anak saya. Affan dipaparkan dengan ragam aktivitas sambil belajar bersosialisasi dengan teman sebayanya. Para ibu juga bisa saling support dengan ilmu parenting & pengalaman uniknya masing-masing. Ini merupakan transisi yang menurut saya diperlukan sebelum anak belajar di sekolah tanpa pendampingan orang tua. Terima kasih Iqrolife ❤',
        rating: 5,
      },
      {
        name: 'Fiki',
        role: 'Orang Tua Siswa',
        avatar:
          'https://ui-avatars.com/api/?name=Fiki&background=10b981&color=fff&size=200',
        content:
          'Sangat senang dan bersyukur atas izin Allah bisa ikut gabung di kelas bermain Iqrolife. 1 tahun yang sangat bermakna dan menyenangkan. Bisa bertemu "kampung" yang aman dan nyaman untuk membersamai anak bermain yang bermakna. Lewat kelas bermain Iqrolife juga dipertemukan dengan teman-teman baru, bukan hanya untuk anak tapi juga keluarga. Kelas bermain Iqrolife juga membantu kesiapan anak untuk jenjang pendidikan selanjutnya, juga memberikan kesempatan orang tua khususnya Ibu untuk menemani anak bermain bersama anak lain dan menyiapkan hati sebelum melepas anak ke sekolah selanjutnya :)',
        rating: 5,
      },
    ],
  };

  return NextResponse.json(testimonials);
}
