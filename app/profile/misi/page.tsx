'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function MisiPage() {
  const [misiData, setMisiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisiData = async () => {
      try {
        const response = await fetch('/api/profile/misi');
        const data = await response.json();
        setMisiData(data);
      } catch (error) {
        console.error('Error fetching misi data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-off-white via-white to-brand-sky/10">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              {/* Diagram Skeleton */}
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
                  <Skeleton className="w-full h-96" />
                </div>
              </div>

              {/* Legend Skeleton */}
              <div className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-12 h-0.5" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!misiData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-off-white via-white to-brand-sky/10">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Error loading page
            </h1>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-off-white via-white to-brand-sky/10">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent">
            Mission - Ekosistem Iqrolife Community
          </h1>
        </AnimatedSection>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Diagram Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Iqrolife Community Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-brand-lime/20">
                <img
                  src="/diagram-misi-iqrolife.jpg"
                  alt="Diagram Ekosistem Iqrolife Community - Alur Program dari KBTK, Kelas Eksplorasi, Kelas Aqil Baligh, Kelas Belajar Orang Tua menuju Sesi Refleksi dan Mentoring Ibu & Ayah untuk Pembinaan dan Kaderisasi berbasis Keluarga"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-green-700"></div>
                <span className="text-gray-600">KBTK Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-orange-500"></div>
                <span className="text-gray-600">Program Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-red-500"></div>
                <span className="text-gray-600">Refleksi Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gray-400"></div>
                <span className="text-gray-600">Feedback Loop</span>
              </div>
            </div>
          </div>

          {/* Tahap Pembinaan dan Kaderisasi Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-cyan to-brand-sky text-white py-6 px-8">
                <h2 className="text-2xl font-bold text-center">
                  Tahap Pembinaan dan Kaderisasi
                </h2>
              </div>

              {/* Content */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8">
                <ol className="space-y-6">
                  {/* Step 1 */}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        Building awareness awal pada program-program Iqrolife
                        Community
                      </p>
                    </div>
                  </motion.li>

                  {/* Step 2 */}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        Building awareness lanjutan pada sesi refleksi orang tua
                        → membangun minat mengikuti mentoring
                      </p>
                    </div>
                  </motion.li>

                  {/* Step 3 */}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        Mentoring Ibu dan Ayah sebagai program yang komprehensif
                        dan terstruktur meliputi materi iman, islam, parenting,{' '}
                        <span className="line-through text-gray-500">
                          keayahan
                        </span>
                        , tumbuh kembang anak, tahsin, dll
                      </p>
                    </div>
                  </motion.li>

                  {/* Step 4 */}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        Output dari Mentoring Ayah dan Ibu berupa Ayah, Ibu dan
                        Keluarga yang secara volunteer menjadi bagian dari
                        agenda-agenda kebaikan Iqrolife dan umum, menjadi
                        changemaker berbasis keluarga.
                      </p>
                    </div>
                  </motion.li>
                </ol>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <FoundationFooter />
    </div>
  );
}
