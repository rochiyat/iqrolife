export const schoolPPDBData = {
  hero: {
    badge: 'Kelas Siap Sekolah (KSS) 2026/2027',
    title: '🎒 Penerimaan Kelas Siap Sekolah 🎒',
    description:
      'Bergabunglah dengan Sekolah Iqrolife dan wujudkan masa depan gemilang putra-putri Anda bersama kami! ✨',
    buttonText: '🚀 Daftar Sekarang 🚀',
  },
  programs: {
    title: '📚 Program & Biaya Pendidikan 📚',
    description:
      'Pilih program pendidikan yang sesuai untuk putra-putri tercinta Anda',
    items: [
      {
        level: 'KBTK Iqrolife',
        age: '3-6 tahun',
        fee: 'Rp 15.000.000',
        color: 'bg-blue-100 text-blue-800',
        note: '*Biaya per tahun',
        buttonText: '💡 Info Detail',
      },
    ],
  },
  requirements: {
    title: '📋 Persyaratan Pendaftaran 📋',
    items: [
      'Fotokopi Akta Kelahiran',
      'Fotokopi Kartu Keluarga',
      'Pas Foto 3x4 (4 lembar)',
      'Fotokopi Ijazah/SKHUN (untuk SD & SMP)',
      'Surat Keterangan Sehat dari Dokter',
      'Formulir Pendaftaran yang telah diisi',
    ],
  },
  timeline: {
    title: '📅 Timeline KKS 📅',
    items: [
      {
        phase: 'Pendaftaran',
        date: 'Januari - Maret 2025',
        description: 'Pengisian formulir dan pengumpulan berkas',
      },
      {
        phase: 'Tes Masuk',
        date: 'April 2025',
        description: 'Tes akademik dan wawancara',
      },
      {
        phase: 'Pengumuman',
        date: 'Mei 2025',
        description: 'Pengumuman hasil seleksi',
      },
      {
        phase: 'Daftar Ulang',
        date: 'Juni 2025',
        description: 'Pembayaran dan daftar ulang',
      },
    ],
  },
  gallery: {
    title: '😊 Anak-Anak Bahagia di Iqrolife 😊',
    description:
      'Lihat kegembiraan anak-anak yang sudah bergabung dengan keluarga besar Iqrolife',
    items: [
      {
        title: '📖 Belajar Membaca',
        description: 'Metode pembelajaran yang menyenangkan',
        image:
          'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=400&h=300&fit=crop',
        imageAlt: 'Anak-anak KBTK sedang belajar membaca dengan gembira',
      },
      {
        title: '🤝 Bermain Bersama',
        description: 'Mengembangkan kemampuan sosial anak',
        image:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        imageAlt: 'Anak-anak KBTK bermain dan belajar bersama',
      },
      {
        title: '🎨 Aktivitas Kreatif',
        description: 'Mengasah kreativitas dan imajinasi',
        image:
          'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
        imageAlt: 'Anak-anak KBTK dalam kegiatan pembelajaran kreatif',
      },
    ],
  },
  cta: {
    title: '🎉 Siap Bergabung dengan Sekolah Iqrolife? 🎉',
    description:
      'Hubungi kami untuk informasi lebih lanjut atau langsung daftar online untuk masa depan cerah anak Anda!',
    buttons: [
      {
        text: '🚀 Daftar Online',
        variant: 'primary' as const,
      },
      {
        text: '💬 Hubungi via WhatsApp',
        variant: 'outline' as const,
        href: 'https://wa.me/6281315225557',
      },
    ],
  },
};
