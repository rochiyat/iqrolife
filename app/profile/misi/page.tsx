'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';

export default function MisiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Misi Iqrolife
          </h1>
        </AnimatedSection>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  Langkah-langkah Pencapaian Visi:
                </h2>

                {[
                  {
                    icon: '📖',
                    title: "Mendidik Kecintaan Al-Qur'an",
                    description:
                      "Mengembangkan program tahfidz dan pembelajaran Al-Qur'an yang menyenangkan untuk menumbuhkan kecintaan pada Al-Qur'an sejak dini.",
                    points: [
                      'Program tahfidz harian',
                      "Metode pembelajaran Al-Qur'an yang interaktif",
                      "Pembiasaan tadabbur Al-Qur'an",
                    ],
                  },
                  {
                    icon: '🎨',
                    title: 'Pengembangan Kreativitas',
                    description:
                      'Mendidik setiap peserta didik menjadi pribadi yang kreatif, produktif, dan bertanggungjawab dalam menghadapi tantangan masa depan.',
                    points: [
                      'Program pengembangan bakat dan minat',
                      'Project-based learning',
                      'Pelatihan soft skills dan leadership',
                    ],
                  },
                  {
                    icon: '🏫',
                    title: 'Lingkungan Belajar Menyenangkan',
                    description:
                      'Menciptakan suasana belajar yang menyenangkan dan kondusif untuk perkembangan optimal setiap siswa.',
                    points: [
                      'Fasilitas pembelajaran modern',
                      'Kegiatan outdoor learning',
                      'Program ekstrakurikuler beragam',
                    ],
                  },
                  {
                    icon: '🌿',
                    title: 'Kesadaran Lingkungan',
                    description:
                      'Mengenalkan dan mengajarkan pentingnya menjaga lingkungan melalui berbagai program dan kegiatan.',
                    points: [
                      'Program go green',
                      'Pengelolaan sampah terpadu',
                      'Pembelajaran berbasis lingkungan',
                    ],
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <ul className="space-y-2">
                        {item.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-gray-600"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <FoundationFooter />
    </div>
  );
}
