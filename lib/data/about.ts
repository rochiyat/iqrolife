export const aboutData = {
  hero: {
    title: 'Tentang Kami',
    description:
      'Yayasan Tumbuh Bersama Iqrolife berkomitmen membangun lingkungan pendidikan yang profesional, hangat, dan kekeluargaan. Kami mendampingi pertumbuhan anak dan keluarga melalui program yang terstruktur dan kolaboratif.',
    image: '/keluarga-belajar.jpg',
    imageAlt: 'Ilustrasi keluarga belajar bersama',
    buttons: [
      {
        text: 'Lihat Program',
        variant: 'default' as const,
        href: '/program',
      },
      {
        text: 'Hubungi Kami',
        variant: 'outline' as const,
        href: '/kontak',
      },
    ],
  },
  values: [
    {
      title: 'Profesional',
      description: 'Standar mutu, proses rapi, dan akuntabel.',
    },
    {
      title: 'Kekeluargaan',
      description: 'Pendekatan hangat yang merangkul orang tua.',
    },
    {
      title: 'Kolaboratif',
      description: 'Bersinergi dengan guru, orang tua, dan komunitas.',
    },
  ],
};
