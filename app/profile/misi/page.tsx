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
              {/* Top Section Skeleton */}
              <div className="bg-gray-100 rounded-xl p-6 mb-8">
                <Skeleton className="h-8 w-64 mx-auto mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Middle Section Skeleton */}
              <div className="flex justify-start mb-8 ml-0 md:ml-12">
                <Skeleton className="h-20 w-48 rounded-lg" />
              </div>

              {/* Bottom Section Skeleton */}
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <Skeleton className="h-16 w-64 mx-auto rounded-lg" />
                  <Skeleton className="h-16 w-64 mx-auto rounded-lg" />
                </div>
                <Skeleton className="h-8 w-96 mx-auto mt-6" />
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
            {/* Top Section - Iqrolife Community */}
            <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-6 mb-8">
              <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
                Iqrolife Community
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* KBTK Iqrolife */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold">
                    KBTK Iqrolife
                  </div>
                  {/* Arrow down */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-green-700"></div>
                </motion.div>

                {/* Kelas Eksplorasi */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold">
                    Kelas Eksplorasi
                  </div>
                  {/* Arrow down */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-orange-500"></div>
                </motion.div>

                {/* Kelas Aqil Baligh */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold">
                    Kelas Aqil Baligh
                  </div>
                  {/* Arrow down */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-orange-500"></div>
                </motion.div>

                {/* Kelas Belajar Orang Tua */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold">
                    Kelas Belajar
                    <br />
                    Orang Tua
                  </div>
                  {/* Arrow down */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full h-12 w-0.5 bg-orange-500"></div>
                </motion.div>
              </div>
            </div>

            {/* Middle Section - Sesi Refleksi */}
            <div className="flex justify-start mb-8 ml-0 md:ml-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold w-48">
                  Sesi Refleksi
                  <br />
                  Orang Tua
                </div>
                {/* Arrow down */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full h-24 w-0.5 bg-red-500"></div>
              </motion.div>
            </div>

            {/* Connecting Lines - Hidden on mobile */}
            <div className="hidden md:block relative h-32 mb-8">
              {/* Horizontal line from Sesi Refleksi */}
              <div className="absolute left-12 top-0 w-[calc(50%-3rem)] h-0.5 bg-red-500"></div>

              {/* Horizontal lines from top boxes */}
              <div className="absolute left-[calc(25%-1rem)] top-0 w-[calc(50%+2rem)] h-0.5 bg-orange-500"></div>

              {/* Vertical lines down to mentoring */}
              <div className="absolute left-[calc(50%-8rem)] top-0 h-32 w-0.5 bg-orange-500"></div>
              <div className="absolute left-[calc(50%+8rem)] top-0 h-32 w-0.5 bg-orange-500"></div>

              {/* Arrow from right side */}
              <div className="absolute right-0 top-16 w-[calc(25%)] h-0.5 bg-gray-400"></div>
              <div className="absolute right-0 top-16 h-16 w-0.5 bg-gray-400"></div>
            </div>

            {/* Bottom Section - Mentoring */}
            <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* Mentoring Ibu */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center"
                >
                  <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold w-64">
                    Mentoring Ibu
                  </div>
                </motion.div>

                {/* Mentoring Ayah */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex justify-center"
                >
                  <div className="bg-gradient-to-br from-green-700 to-green-800 text-white p-4 rounded-lg shadow-lg text-center font-semibold w-64">
                    Mentoring Ayah
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center mt-6"
              >
                <p className="text-lg font-bold text-gray-800">
                  Pembinaan dan Kaderisasi berbasis Keluarga
                </p>
              </motion.div>
            </div>

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
