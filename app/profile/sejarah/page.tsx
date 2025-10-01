'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';

export default function SejarahPage() {
  const milestones = [
    {
      year: '2018',
      title: 'Awal Mula',
      description:
        'Dimulai dari sebuah komunitas belajar kecil yang fokus pada pendidikan anak dan pembinaan keluarga.',
      image: '/placeholder.jpg',
    },
    {
      year: '2019',
      title: 'Pendirian KB-TK',
      description:
        'Membuka KB-TK Iqrolife sebagai langkah awal pendidikan formal dengan konsep pembelajaran yang menyenangkan.',
      image: '/school-building-exterior.png',
    },
    {
      year: '2020',
      title: 'Pengembangan SD',
      description:
        'Memperluas jenjang pendidikan dengan membuka SD Iqrolife untuk memberikan pendidikan berkelanjutan.',
      image: '/classroom-learning.png',
    },
    {
      year: '2021',
      title: 'Program Homeschooling',
      description:
        'Menghadirkan program homeschooling untuk memenuhi kebutuhan pendidikan yang lebih personal.',
      image: '/keluarga-belajar.jpg',
    },
    {
      year: '2022',
      title: 'Pembukaan SMP',
      description:
        'Melengkapi jenjang pendidikan dasar dengan pembukaan SMP Iqrolife.',
      image: '/science-laboratory.png',
    },
    {
      year: '2023',
      title: 'Pengembangan Program',
      description:
        'Mengembangkan berbagai program pemberdayaan keluarga dan masyarakat.',
      image: '/kelas-parenting-belajar-orang-tua.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sejarah Iqrolife
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Perjalanan kami dalam membangun generasi yang berakhlak mulia,
            berprestasi, dan siap menghadapi tantangan masa depan.
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-64 md:h-full">
                      <Image
                        src={milestone.image}
                        alt={milestone.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r">
                        <div className="absolute bottom-4 left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                          <span className="text-4xl font-bold text-white">
                            {milestone.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-4">
                        {milestone.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <FoundationFooter />
    </div>
  );
}
