'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection } from '@/components/animated-section';
import VisionMissionSection from '@/components/vision-mission-section';
import GallerySection from '@/components/gallery-section';
import TestimonialsSection from '@/components/testimonials-section';
import ContactSection from '@/components/contact-section';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FoundationLanding() {
  return (
    <div className="min-h-screen bg-background">
      <FoundationHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 py-16 lg:py-24"
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <AnimatedSection direction="left" delay={0.2}>
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-semibold text-fun-blue tracking-wide mb-2"
                  >
                    Yayasan
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance bg-gradient-to-r from-fun-blue via-fun-purple to-fun-blue bg-clip-text text-transparent"
                  >
                    Tumbuh Bersama Iqrolife
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-muted-foreground leading-relaxed text-pretty"
                  >
                    Mewujudkan pendidikan berkarakter dalam naungan keluarga
                    yang hangat dan profesional. Kami mendukung sekolah-sekolah
                    Iqrolife serta program pemberdayaan keluarga dan masyarakat
                    untuk masa depan yang lebih cerah.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 flex flex-col sm:flex-row gap-3"
                  >
                    <Link
                      href="/school"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-fun-blue to-fun-purple text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
                    >
                      Masuk ke Sekolah
                    </Link>
                    <a
                      href="#program"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-fun-blue/30 font-semibold hover:bg-fun-blue/10 transition-all duration-300 hover:scale-105"
                    >
                      Lihat Program Yayasan
                    </a>
                  </motion.div>
                </div>
              </AnimatedSection>
              <AnimatedSection direction="right" delay={0.4}>
                <div className="relative">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    src="/keluarga-belajar.jpg"
                    alt="Keluarga Iqrolife belajar bersama"
                    className="rounded-2xl shadow-lg w-full"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -top-4 -right-4 hidden sm:block"
                  >
                    <img
                      src="/logo-iqrolife.png"
                      alt="Logo Iqrolife"
                      className="w-14 h-14 rounded-full ring-4 ring-white shadow-md"
                    />
                  </motion.div>
                </div>
              </AnimatedSection>
            </div>
          </motion.div>
        </section>

        <VisionMissionSection />

        {/* Program Yayasan */}
        <section id="program" className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple bg-clip-text text-transparent">
                  Program Yayasan
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                  Dukungan pendidikan dan keluarga untuk tumbuh bersama dalam
                  nilai islami dan profesionalisme.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Sekolah Iqrolife',
                  desc: 'KB-TK, SD, SMP, Homeschooling',
                  icon: '🏫',
                  color: 'from-fun-blue to-fun-purple',
                },
                {
                  title: 'Parenting & Keluarga',
                  desc: 'Kelas parenting, konseling keluarga, dan komunitas',
                  icon: '👨‍👩‍👧‍👦',
                  color: 'from-fun-orange to-fun-pink',
                },
                {
                  title: 'Pemberdayaan Masyarakat',
                  desc: 'Beasiswa, pelatihan guru, dan program sosial',
                  icon: '🤝',
                  color: 'from-fun-yellow to-fun-orange',
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={0.2 * (i + 1)}>
                  <Card className="border-2 border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center text-2xl bg-gradient-to-r ${item.color} text-white transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground mt-2">{item.desc}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <GallerySection />
        <TestimonialsSection />
        <ContactSection />

        {/* CTA */}
        <section className="relative py-20 bg-gradient-to-r from-fun-yellow/20 to-fun-pink/20 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-30"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-fun-blue/20 to-fun-purple/20" />
          </motion.div>

          <div className="container mx-auto px-4 relative">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/60 shadow-xl">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple bg-clip-text text-transparent mb-2">
                    Siap tumbuh bersama keluarga besar Iqrolife?
                  </h3>
                  <p className="text-muted-foreground">
                    Bergabunglah dengan kami dalam membangun generasi yang
                    berakhlak dan berprestasi
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/school/ppdb"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-fun-blue to-fun-purple text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-105 text-center"
                  >
                    Daftar PPDB
                  </Link>
                  <Link
                    href="/school"
                    className="px-6 py-3 rounded-full border-2 border-fun-blue/30 font-semibold hover:bg-fun-blue/10 transition-all duration-300 hover:scale-105 text-center"
                  >
                    Jelajahi Sekolah
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
