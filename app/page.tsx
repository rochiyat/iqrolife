'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection } from '@/components/animated-section';
import VisionMissionSection from '@/components/vision-mission-section';
import GallerySection from '@/components/gallery-section';
import TestimonialsSection from '@/components/testimonials-section';
import ContactSection from '@/components/contact-section';
import { ProgramIcon } from '@/lib/utils/program-icons';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  SkeletonFoundationHero,
  SkeletonFoundationPrograms,
  SkeletonFoundationCTA,
} from '@/components/ui/skeleton-loading';

interface HeroData {
  subtitle: string;
  title: string;
  description: string;
  buttons: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
  image: {
    src: string;
    alt: string;
    logo: {
      src: string;
      alt: string;
    };
  };
}

interface ProgramData {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  borderColor: string;
  age: string;
  type: string;
  href: string;
  fullWidth?: boolean;
}

interface CTAData {
  title: string;
  description: string;
  buttons: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

export default function FoundationLanding() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [cta, setCta] = useState<CTAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [heroRes, programsRes, ctaRes] = await Promise.all([
          fetch('/api/hero'),
          fetch('/api/programs'),
          fetch('/api/cta'),
        ]);

        const [heroData, programsData, ctaData] = await Promise.all([
          heroRes.json(),
          programsRes.json(),
          ctaRes.json(),
        ]);

        setHero(heroData);
        setPrograms(programsData.programs || programsData);
        setCta(ctaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Scroll to top when page loads, unless there's a hash in URL
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Show beautiful skeleton loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FoundationHeader />
        <main>
          <SkeletonFoundationHero />
          <section className="py-16 bg-gradient-to-br from-brand-sky/20 to-brand-lime/10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <div className="w-64 h-10 bg-gradient-to-r from-brand-emerald to-brand-cyan rounded-lg mx-auto mb-4 animate-pulse"></div>
              </div>
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Purpose Skeleton - Full Width */}
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-warm-brown rounded-full mx-auto mb-4 animate-pulse"></div>
                    <div className="w-32 h-8 mx-auto mb-4 bg-gradient-to-r from-brand-warm-brown to-brand-dark-brown rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 mx-auto bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Mission Skeleton - Full Width */}
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-emerald rounded-full mx-auto mb-4 animate-pulse"></div>
                    <div className="w-24 h-8 mx-auto mb-4 bg-gradient-to-r from-brand-emerald to-brand-cyan rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 mx-auto bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-4/5 mx-auto bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Vision Skeleton - Full Width */}
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-cyan rounded-full mx-auto mb-4 animate-pulse"></div>
                    <div className="w-24 h-8 mx-auto mb-6 bg-gradient-to-r from-brand-cyan to-brand-emerald rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 mx-auto bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-4/5 mx-auto bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <SkeletonFoundationPrograms />
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="w-96 h-10 mx-auto mb-4 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse"></div>
                <div className="w-64 h-6 mx-auto bg-gray-300 animate-pulse"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-full">
                    <div className="rounded-2xl shadow-lg p-6 border-2 border-gray-200">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-3 animate-pulse"></div>
                        <div className="w-48 h-6 mx-auto mb-2 bg-gray-300 animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-300 animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gray-300 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <SkeletonFoundationCTA />
        </main>
        <FoundationFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning={true}>
      <FoundationHeader />
      <main suppressHydrationWarning={true}>
        {/* Hero */}
        <section
          id="beranda"
          className="relative overflow-hidden bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 py-16 lg:py-24"
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {hero ? (
                <>
                  <AnimatedSection direction="left" delay={0.2}>
                    <div>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm font-semibold text-[#4caade] tracking-wide mb-2"
                      >
                        {hero.subtitle}
                      </motion.p>
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance bg-gradient-to-r from-[#4caade] via-[#f2cd5b] to-[#4caade] bg-clip-text text-transparent"
                      >
                        {hero.title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-muted-foreground leading-relaxed text-pretty"
                      >
                        {hero.description}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 flex flex-col sm:flex-row gap-3"
                      >
                        {hero.buttons.map((button, index) =>
                          button.variant === 'primary' ? (
                            <Link
                              key={index}
                              href={button.href}
                              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#4caade] to-[#3a8fc7] text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
                            >
                              {button.label}
                            </Link>
                          ) : (
                            <a
                              key={index}
                              href={button.href}
                              className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-[#f2cd5b] text-[#4caade] font-semibold hover:bg-[#f2cd5b]/20 transition-all duration-300 hover:scale-105"
                            >
                              {button.label}
                            </a>
                          )
                        )}
                      </motion.div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection direction="right" delay={0.4}>
                    <div className="relative">
                      <motion.img
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        src="/gallery/gallery-008.jpg"
                        alt={hero.image.alt}
                        className="rounded-2xl shadow-lg w-full"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="absolute -top-4 -right-4 hidden sm:block"
                      >
                        <img
                          src={hero.image.logo.src}
                          alt={hero.image.logo.alt}
                          className="w-14 h-14 rounded-full ring-4 ring-white shadow-md"
                        />
                      </motion.div>
                    </div>
                  </AnimatedSection>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Loading hero content...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        <VisionMissionSection />

        {/* Nilai-Nilai Komunitas */}
        <section
          id="nilai-komunitas"
          className="py-16 bg-gradient-to-br from-brand-off-white to-brand-sky/10"
        >
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
                  Nilai-Nilai Komunitas
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Prinsip-prinsip fundamental yang menjadi landasan dalam setiap
                  aktivitas pendidikan dan pengembangan komunitas kami.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <AnimatedSection delay={0.2}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-[#4caade] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
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
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </motion.div>
                      <motion.h3
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-[#4caade] mb-4"
                      >
                        Fitrah
                      </motion.h3>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-brand-gray leading-relaxed text-center flex-grow"
                    >
                      Kami meyakini bahwa manusia diciptakan dengan fitrah.
                      Fitrah sebagai bekal, dan fitrah sebagai prediksi peran.
                      Tugas orang tua mengembalikan fitrah diri dan menjaga
                      kesejatian fitrah anak agar tumbuh secara paripurna.
                    </motion.p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-brand-cyan rounded-full flex items-center justify-center mx-auto mb-4"
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
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </motion.div>
                      <motion.h3
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-brand-cyan mb-4"
                      >
                        Bertahap
                      </motion.h3>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-brand-gray leading-relaxed text-center flex-grow"
                    >
                      Kami meyakini bahwa pendidikan harus dilakukan berdasarkan
                      kebutuhan pada setiap tahap kehidupan. Ketiadaan
                      kebertahapan, hanya akan menjadi bom waktu untuk tumbuh
                      kembang anak di masa depan.
                    </motion.p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-brand-warm-brown rounded-full flex items-center justify-center mx-auto mb-4"
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
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </motion.div>
                      <motion.h3
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-brand-warm-brown mb-4"
                      >
                        Paripurna
                      </motion.h3>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-brand-gray leading-relaxed text-center flex-grow"
                    >
                      Kami meyakini bahwa pendidikan harus dilihat sebagai
                      sebuah ekosistem yang saling terkait guna membentuk
                      manusia paripurna, secara fisik, jiwa, dan akal.
                      Pendidikan holistik merupakan pengejawantahan atas
                      keyakinan kami tentang bagaimana seharusnya pendidikan itu
                      sendiri.
                    </motion.p>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="text-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4"
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
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.div>
                      <motion.h3
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-brand-coral mb-4"
                      >
                        Sukses & Bahagia
                      </motion.h3>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-brand-gray leading-relaxed text-center flex-grow"
                    >
                      Kami mendefinisikan sukses sebagai sebuah hasil dari
                      perjalanan panjang menemukan misi hidup, menjawab kenapa
                      kami dilahirkan. Sukses yang sejalan dengan misi hidup
                      adalah sukses yang mampu menjawab ekspektasi Allah SWT
                      sebagai Dzat yang menciptakan menciptakan, sehingga akan
                      muncul kesejatian kebahagiaan.
                    </motion.p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 7 Pendidikan Holistik */}
        <section
          id="pendidikan-holistik"
          className="py-16 bg-gradient-to-br from-brand-lime/5 to-brand-emerald/5"
        >
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
                  7 Dimensi Pendidikan Holistik
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Pendekatan komprehensif yang mengintegrasikan berbagai aspek
                  perkembangan anak sesuai dengan tahapan usia mereka.
                </p>
              </div>
            </AnimatedSection>

            <div className="max-w-7xl mx-auto">
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-brand-lime/20 mb-12">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    src="/7-dimensi-pendidikan.jpg"
                    alt="7 Dimensi Pendidikan Holistik - Tahapan 0-15 Tahun"
                    className="w-full h-auto"
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-emerald/20 hover:border-brand-emerald/40 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-emerald rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            1
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-emerald mb-2">
                            Pendidikan Iman, Islam & Ihsan
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Membangun fondasi spiritual dan keimanan yang kuat
                            sejak dini
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-cyan/20 hover:border-brand-cyan/40 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            2
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-cyan mb-2">
                            Pendidikan Ego, Sosial & Adab
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Mengembangkan karakter, etika sosial, dan adab mulia
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-lime/20 hover:border-brand-lime/40 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-lime rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            3
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-warm-brown mb-2">
                            Pendidikan Emosi & Manajemen Konflik
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Mengelola emosi secara sehat dan menyelesaikan
                            konflik dengan bijak
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-coral/20 hover:border-brand-coral/40 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            4
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-coral mb-2">
                            Stimulasi Sensorik-Motorik & Pendidikan Jasmani
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Mengoptimalkan perkembangan fisik dan keterampilan
                            motorik
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-warm-brown/20 hover:border-brand-warm-brown/40 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-warm-brown rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            5
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-warm-brown mb-2">
                            Pendidikan Intelektual & Learning Agility
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Mengasah kemampuan berpikir kritis dan adaptif dalam
                            belajar
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-emerald/20 hover:border-brand-emerald/40 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-emerald rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            6
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-emerald mb-2">
                            Pendidikan Bakat, Keterampilan & Peran
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Menggali dan mengembangkan potensi unik setiap
                            individu
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-brand-cyan/20 hover:border-brand-cyan/40 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-3">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            7
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-cyan mb-2">
                            Pendidikan Seksual, Generatif & Keberlanjutan
                            Peradaban
                          </h3>
                          <p className="text-sm text-brand-gray">
                            Memahami fitrah seksualitas dengan sehat dan
                            kontribusi positif bagi peradaban
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Program Komunitas */}
        <section
          id="program"
          className="py-16 bg-gradient-to-br from-white to-brand-emerald/5"
        >
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent">
                  Program Komunitas
                </h2>
                <p className="text-brand-gray max-w-2xl mx-auto">
                  Dukungan pendidikan dan keluarga untuk tumbuh bersama dalam
                  nilai fitrah.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {programs.map((program, index) => {
                const isGradient = program.color.includes('from-');
                const bgClass = isGradient
                  ? `bg-gradient-to-br ${program.color}`
                  : `bg-${program.color}`;
                const textClass = isGradient
                  ? 'text-brand-emerald'
                  : `text-${program.color}`;

                return (
                  <AnimatedSection key={program.id} delay={0.1 + index * 0.1}>
                    <Link href={program.href}>
                      <Card
                        className={`bg-white/80 backdrop-blur-sm border-2 border-${
                          program.borderColor
                        }/20 hover:border-${
                          program.borderColor
                        }/40 hover:shadow-xl transition-all duration-300 h-full group ${
                          program.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''
                        }`}
                      >
                        <CardContent className="p-6 h-full flex flex-col">
                          <div className="mb-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.3 }}
                              className={`w-14 h-14 ${bgClass} rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg`}
                            >
                              <ProgramIcon iconName={program.icon} />
                            </motion.div>
                            <h3
                              className={`font-bold text-xl ${textClass} mb-2 group-hover:opacity-80 transition-all`}
                            >
                              {program.title}
                            </h3>
                          </div>
                          <p className="text-brand-gray leading-relaxed flex-grow">
                            {program.desc}
                          </p>
                          <span
                            className={`mt-4 inline-block text-sm font-medium ${textClass} group-hover:translate-x-1 transition-transform`}
                          >
                            Pelajari lebih lanjut →
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedSection>
                );
              })}
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
              {cta ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/60 shadow-xl">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple bg-clip-text text-transparent mb-2">
                      {cta.title}
                    </h3>
                    <p className="text-muted-foreground">{cta.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {cta.buttons.map((button, index) => (
                      <Link
                        key={index}
                        href={button.href}
                        className={`px-6 py-3 rounded-full ${
                          button.variant === 'primary'
                            ? 'bg-gradient-to-r from-fun-blue to-fun-purple text-white font-semibold shadow-lg hover:opacity-90'
                            : 'border-2 border-fun-blue/30 font-semibold hover:bg-fun-blue/10'
                        } transition-all duration-300 hover:scale-105 text-center`}
                      >
                        {button.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Loading CTA content...
                  </p>
                </div>
              )}
            </AnimatedSection>
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
