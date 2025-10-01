'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';

export default function PreSchoolPage() {
  const programs = [
    {
      title: 'Program Pembentukan Karakter',
      description:
        'Pembentukan karakter islami dan pengembangan nilai-nilai moral sejak dini.',
      icon: '🌟',
      details: [
        'Pembiasaan adab islami',
        'Pengenalan nilai-nilai moral',
        'Aktivitas pembiasaan mandiri',
      ],
    },
    {
      title: 'Pengembangan Motorik',
      description:
        'Aktivitas yang mendukung perkembangan motorik halus dan kasar.',
      icon: '🎨',
      details: [
        'Kegiatan seni dan kerajinan',
        'Permainan fisik terstruktur',
        'Latihan koordinasi tubuh',
      ],
    },
    {
      title: 'Stimulasi Kognitif',
      description:
        'Program pembelajaran yang merangsang perkembangan kognitif anak.',
      icon: '🧩',
      details: [
        'Pengenalan huruf dan angka',
        'Aktivitas pemecahan masalah',
        'Permainan edukatif',
      ],
    },
    {
      title: 'Pengembangan Sosial',
      description: 'Aktivitas yang membangun kemampuan sosial dan komunikasi.',
      icon: '👥',
      details: [
        'Bermain kelompok',
        'Aktivitas bercerita',
        'Pembelajaran kolaboratif',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
            Pre-School Iqrolife
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Program pre-school yang dirancang khusus untuk mempersiapkan
            anak-anak menuju jenjang pendidikan formal dengan pendekatan yang
            menyenangkan dan islami.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{program.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-yellow-800">
                      {program.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <ul className="space-y-2">
                    {program.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-yellow-800">
                Daftarkan Anak Anda Sekarang
              </h2>
              <p className="text-gray-600 mb-6">
                Berikan kesempatan terbaik untuk perkembangan anak Anda melalui
                program pre-school yang komprehensif dan berkualitas.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Persyaratan:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Usia 3-6 tahun</li>
                    <li>• Fotokopi akte kelahiran</li>
                    <li>• Fotokopi KK</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Waktu Pendaftaran:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Senin - Jumat</li>
                    <li>• 08.00 - 15.00 WIB</li>
                    <li>• Sepanjang tahun</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <FoundationFooter />
    </div>
  );
}
