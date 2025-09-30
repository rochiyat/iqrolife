'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AnimatedSection } from './animated-section';

export default function VisionMissionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Visi & Misi Kami
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatedSection delay={0.2}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </motion.div>
                  <motion.h2
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4"
                  >
                    Visi
                  </motion.h2>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-700 text-lg leading-relaxed text-center italic"
                >
                  "Terwujudnya sekolah berprestasi berbasis lingkungan yang
                  ramah anak dan mengedepankan pencapaian akhlak islami serta
                  nilai kepemimpinan setiap siswa."
                </motion.p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                  <motion.h2
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-6"
                  >
                    Misi
                  </motion.h2>
                </div>
                <motion.ul className="space-y-4">
                  {[
                    "Mendidik siswa memiliki kecintaan terhadap Al-Qur'an.",
                    'Mendidik setiap peserta didik menjadi pribadi yang kreatif, produktif, bertanggungjawab dan memiliki semangat berprestasi dalam menghadapi tantangan masa depan.',
                    'Menjadikan sekolah sebagai ruang anak yang menyenangkan.',
                    'Mengenalkan anak akan pentingnya konservasi lingkungan.',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-start group"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-150 transition-transform"
                      />
                      <p className="text-gray-700">{item}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
