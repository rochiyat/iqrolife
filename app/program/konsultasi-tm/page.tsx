'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';

export default function KonsultasiTMPage() {
  const services = [
    {
      title: 'Konsultasi Pendidikan',
      description: 'Bimbingan mengenai pendidikan dan pembelajaran anak.',
      icon: '📚',
      topics: [
        'Pemilihan jalur pendidikan',
        'Kesulitan belajar',
        'Pengembangan potensi',
      ],
    },
    {
      title: 'Konsultasi Keluarga',
      description: 'Penanganan masalah dalam hubungan keluarga.',
      icon: '👨‍👩‍👧‍👦',
      topics: [
        'Komunikasi keluarga',
        'Konflik orangtua-anak',
        'Harmonisasi keluarga',
      ],
    },
    {
      title: 'Konsultasi Perkembangan',
      description: 'Pemahaman tentang tahap perkembangan anak.',
      icon: '🌱',
      topics: [
        'Perkembangan fisik',
        'Perkembangan mental',
        'Perkembangan sosial',
      ],
    },
    {
      title: 'Konsultasi Islami',
      description: 'Bimbingan sesuai dengan nilai-nilai Islam.',
      icon: '🕌',
      topics: ['Pendidikan agama', 'Pembentukan akhlak', 'Adab dalam keluarga'],
    },
  ];

  const consultants = [
    {
      name: 'Ustadz Ahmad Firdaus, M.Pd.I',
      expertise: 'Pendidikan Islam',
      experience: '15 tahun pengalaman',
      image: '/placeholder-user.jpg',
    },
    {
      name: 'Dr. Siti Aminah, M.Psi',
      expertise: 'Psikologi Anak & Keluarga',
      experience: '12 tahun pengalaman',
      image: '/placeholder-user.jpg',
    },
    {
      name: 'Ustadz Muhammad Rizki, Lc',
      expertise: 'Konseling Islami',
      experience: '10 tahun pengalaman',
      image: '/placeholder-user.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Konsultasi TM
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Layanan konsultasi profesional untuk membantu keluarga dalam
            mengatasi berbagai tantangan pendidikan dan pengasuhan anak sesuai
            dengan nilai-nilai islami.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-sky-800">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sky-700">
                      Cakupan Konsultasi:
                    </h4>
                    <ul className="space-y-2">
                      {service.topics.map((topic, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
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
          className="mt-16 max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-sky-800">
            Tim Konsultan Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {consultants.map((consultant, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                      <Image
                        src={consultant.image}
                        alt={consultant.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-sky-800">
                      {consultant.name}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-1">
                      {consultant.expertise}
                    </p>
                    <p className="text-sm text-gray-600">
                      {consultant.experience}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-indigo-800">
                Informasi Konsultasi
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-indigo-700 mb-3">
                      Jadwal Konsultasi:
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Senin - Jumat: 09.00 - 15.00
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Sabtu: 09.00 - 12.00
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-700 mb-3">
                      Metode Konsultasi:
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Tatap muka langsung
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Konsultasi online
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-lg">
                  <h3 className="font-semibold text-sky-800 mb-2">
                    Cara Mendaftar:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Hubungi nomor WhatsApp admin</li>
                    <li>Pilih jadwal dan konsultan</li>
                    <li>Lakukan pembayaran</li>
                    <li>Dapatkan konfirmasi jadwal</li>
                  </ol>
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
