'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';

export default function KomunitasAyahPage() {
  const activities = [
    {
      title: 'Kajian Rutin',
      description:
        'Diskusi dan pembelajaran tentang peran ayah dalam keluarga.',
      icon: '📚',
      schedule: 'Setiap Minggu ke-1',
      topics: [
        'Tanggung jawab sebagai kepala keluarga',
        'Pendidikan anak dalam Islam',
        'Manajemen keluarga',
      ],
    },
    {
      title: 'Olahraga Bersama',
      description: 'Aktivitas fisik untuk membangun kebersamaan dan kesehatan.',
      icon: '⚽',
      schedule: 'Setiap Minggu ke-2',
      topics: ['Futsal', 'Badminton', 'Jogging bersama'],
    },
    {
      title: 'Workshop Keterampilan',
      description: 'Pengembangan skill praktis untuk kehidupan sehari-hari.',
      icon: '🛠️',
      schedule: 'Setiap Minggu ke-3',
      topics: [
        'Perbaikan rumah',
        'Basic survival skills',
        'Keselamatan keluarga',
      ],
    },
    {
      title: 'Family Day',
      description: 'Kegiatan bersama keluarga untuk mempererat hubungan.',
      icon: '👨‍👩‍👧‍👦',
      schedule: 'Setiap Minggu ke-4',
      topics: ['Outbound keluarga', 'Piknik bersama', 'Games & kompetisi'],
    },
  ];

  const benefits = [
    {
      title: 'Penguatan Peran Ayah',
      points: [
        'Pemahaman tanggung jawab',
        'Pengembangan leadership',
        'Peningkatan parenting skill',
      ],
    },
    {
      title: 'Jaringan Sosial',
      points: ['Pertemanan sesama ayah', 'Support group', 'Kolaborasi bisnis'],
    },
    {
      title: 'Pengembangan Diri',
      points: [
        'Workshop keterampilan',
        'Sharing pengalaman',
        'Konsultasi ahli',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Komunitas Ayah
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Wadah untuk para ayah dalam mengembangkan diri dan berbagi
            pengalaman dalam menjalankan peran sebagai pemimpin keluarga yang
            bertanggung jawab.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{activity.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-emerald-600">
                        {activity.schedule}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-700">Kegiatan:</h4>
                    <ul className="space-y-2">
                      {activity.topics.map((topic, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-emerald-800">
                Manfaat Bergabung
              </h2>
              <div className="grid gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-lg mb-4 text-emerald-700">
                      {benefit.title}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {benefit.points.map((point, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-emerald-50/50 text-center"
                        >
                          <span className="text-emerald-800 text-sm">
                            {point}
                          </span>
                        </div>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Cara Bergabung:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Isi formulir pendaftaran online</li>
                  <li>Ikuti orientasi anggota baru</li>
                  <li>Bergabung dalam grup WhatsApp komunitas</li>
                  <li>Mulai berpartisipasi dalam kegiatan</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <FoundationFooter />
    </div>
  );
}
