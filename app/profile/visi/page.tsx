'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';

export default function VisiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Visi Iqrolife
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
              <blockquote className="text-xl text-gray-700 text-center italic leading-relaxed mb-6">
                "Terwujudnya sekolah berprestasi berbasis lingkungan yang ramah
                anak dan mengedepankan pencapaian akhlak islami serta nilai
                kepemimpinan setiap siswa."
              </blockquote>

              <div className="space-y-6 mt-8">
                <h2 className="text-xl font-semibold text-blue-800">
                  Penjelasan Visi:
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Sekolah Berprestasi
                      </h3>
                      <p className="text-gray-700">
                        Mengembangkan potensi akademik dan non-akademik setiap
                        siswa untuk mencapai prestasi optimal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Berbasis Lingkungan
                      </h3>
                      <p className="text-gray-700">
                        Menciptakan lingkungan pembelajaran yang mendukung
                        tumbuh kembang anak dan kesadaran lingkungan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Ramah Anak</h3>
                      <p className="text-gray-700">
                        Menyediakan suasana belajar yang aman, nyaman, dan
                        menyenangkan bagi setiap anak.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🕌</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Akhlak Islami
                      </h3>
                      <p className="text-gray-700">
                        Membentuk karakter dan kepribadian siswa berdasarkan
                        nilai-nilai Islam.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Nilai Kepemimpinan
                      </h3>
                      <p className="text-gray-700">
                        Mengembangkan jiwa kepemimpinan dan tanggung jawab dalam
                        diri setiap siswa.
                      </p>
                    </div>
                  </div>
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
