'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function VisiPage() {
  const [visiData, setVisiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisiData = async () => {
      try {
        const response = await fetch('/api/profile/visi');
        const data = await response.json();
        setVisiData(data);
      } catch (error) {
        console.error('Error fetching visi data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisiData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Vision Header Skeleton */}
            <Skeleton className="h-24 w-full rounded-t-lg mb-0 bg-gradient-to-r from-orange-300 to-amber-300" />

            {/* Vision Statement Skeleton */}
            <div className="bg-white/70 backdrop-blur-sm py-8 px-8 border-x-2 border-orange-200">
              <Skeleton className="h-6 w-3/4 mx-auto mb-3 bg-gradient-to-r from-orange-200 to-amber-200" />
              <Skeleton className="h-6 w-2/3 mx-auto bg-gradient-to-r from-amber-200 to-yellow-200" />
            </div>

            {/* Three Pillars Skeleton */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <Skeleton className="h-16 w-full bg-gradient-to-r from-orange-300 to-amber-300" />
                  <div className="p-6">
                    <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                    <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                    <Skeleton className="h-4 w-5/6 mb-2 bg-gray-200" />
                    <Skeleton className="h-4 w-4/5 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pilar Strategi Skeleton */}
            <Skeleton className="h-20 w-full rounded-lg mt-12 bg-gradient-to-r from-orange-200 to-amber-200" />
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!visiData) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto">
            {/* Vision Header */}
            <div className="bg-gradient-to-r from-[#4caade] to-[#3a8fc7] text-white py-6 px-8 rounded-t-lg text-center shadow-lg">
              <h1 className="text-4xl font-bold">Vision</h1>
            </div>

            {/* Vision Statement */}
            <div className="bg-gray-50 py-8 px-8 border-x-2 border-b-2 border-gray-200 rounded-b-lg shadow-lg">
              <p className="text-center text-gray-800 text-lg leading-relaxed">
                Terbentuknya ekosistem pendidikan berbasis komunitas
                <br />
                dan selaras fitrah pada Tahun 2035
              </p>
            </div>

            {/* Arrow Divider - Triangle pointing up */}
            <div className="flex justify-center mt-8 mb-8 relative z-10">
              <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[30px] border-b-amber-700"></div>
            </div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Sekolah */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white border-2 border-gray-200 shadow-lg h-full">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4 px-6 text-center">
                      <h2 className="text-2xl font-bold">Sekolah</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 leading-relaxed">
                        Mengembangkan pendekatan pendidikan selaras fitrah
                        berupa 7 Pendidikan Holistik yang terstruktur dan teruji
                        sesuai dengan fase dan kebutuhan tumbuh kembang
                        anak-anak hingga menuju usia 15 Tahun.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Keluarga */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white border-2 border-gray-200 shadow-lg h-full">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4 px-6 text-center">
                      <h2 className="text-2xl font-bold">Keluarga</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 leading-relaxed">
                        Menghadirkan program pembelajaran dan meningkatkan
                        keterlibatan orang tua (Ayah & Ibu) yang terintegrasi
                        dengan tahapan pembelajaran dan tumbuh kembang anak.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Masyarakat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white border-2 border-gray-200 shadow-lg h-full">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-4 px-6 text-center">
                      <h2 className="text-2xl font-bold">Masyarakat</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 leading-relaxed">
                        Mengintegrasikan program pembelajaran dan keterikatan
                        orang tua dan anak dengan situasi, kondisi dan
                        permasalahan yang terjadi pada masyarakat sehingga
                        dihasilkan pembelajaran yang berdampak
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Pilar Strategi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12"
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-8 rounded-lg text-center shadow-lg">
                <h2 className="text-3xl font-bold">Pilar Strategi</h2>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
      <FoundationFooter />
    </div>
  );
}
