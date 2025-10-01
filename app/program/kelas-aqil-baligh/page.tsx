'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';

export default function KelasAqilBalighPage() {
  const programs = [
    {
      title: 'Pemahaman Fiqih',
      description: 'Pembelajaran mendalam tentang fiqih ibadah dan muamalah.',
      icon: '🕌',
      details: [
        'Fiqih thaharah dan shalat',
        'Adab pergaulan islami',
        'Hukum-hukum dasar islam',
      ],
      color: 'green',
    },
    {
      title: 'Pembinaan Karakter',
      description: 'Membentuk kepribadian remaja yang berakhlak mulia.',
      icon: '⭐',
      details: [
        'Penguatan aqidah',
        'Pembentukan akhlak',
        'Pengembangan kepemimpinan',
      ],
      color: 'blue',
    },
    {
      title: 'Pendidikan Kesehatan',
      description: 'Pemahaman tentang kesehatan fisik dan mental remaja.',
      icon: '🏥',
      details: [
        'Pendidikan kesehatan reproduksi',
        'Manajemen emosi',
        'Pola hidup sehat',
      ],
      color: 'red',
    },
    {
      title: 'Keterampilan Sosial',
      description: 'Pengembangan kemampuan berinteraksi dan berkomunikasi.',
      icon: '👥',
      details: ['Public speaking', 'Manajemen konflik', 'Kerjasama tim'],
      color: 'purple',
    },
  ];

  const schedule = {
    regular: [
      { day: 'Sabtu', time: '09.00 - 11.30', type: 'Kelas Putra' },
      { day: 'Minggu', time: '09.00 - 11.30', type: 'Kelas Putri' },
    ],
    special: ['Camp Ramadhan', 'Outbound Leadership', 'Seminar Parenting'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Kelas Aqil Baligh
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Program pembinaan remaja menuju kedewasaan yang dilandasi
            nilai-nilai islami, mempersiapkan generasi yang berakhlak mulia dan
            siap menghadapi tantangan zaman.
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
                    <div
                      className={`w-12 h-12 rounded-full bg-${program.color}-100 flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-2xl">{program.icon}</span>
                    </div>
                    <h3
                      className={`text-xl font-semibold text-${program.color}-800`}
                    >
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
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-${program.color}-400`}
                        />
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
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
                Jadwal Program
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-blue-700">
                    Kelas Reguler
                  </h3>
                  <div className="grid gap-4">
                    {schedule.regular.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-blue-50/50"
                      >
                        <div className="font-medium text-blue-900">
                          {item.day}
                        </div>
                        <div className="text-gray-600">{item.time}</div>
                        <div className="text-sm text-blue-600">{item.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-green-700">
                    Program Khusus
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {schedule.special.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-green-50/50 text-center"
                      >
                        <span className="text-green-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Persyaratan Peserta:
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Usia 10-15 tahun
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Memiliki semangat belajar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Izin orang tua
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Komitmen mengikuti program
                    </li>
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
