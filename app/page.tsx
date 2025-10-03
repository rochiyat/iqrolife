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
import { useEffect, useState } from 'react';

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
  title: string;
  desc: string;
  icon: string;
  color: string;
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

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <FoundationHeader />
        <main>
          <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Loading...
                </h2>
              </div>
            </div>
          </section>
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
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
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
                        className="text-sm font-semibold text-fun-blue tracking-wide mb-2"
                      >
                        {hero.subtitle}
                      </motion.p>
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance bg-gradient-to-r from-fun-blue via-fun-purple to-fun-blue bg-clip-text text-transparent"
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
                              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-fun-blue to-fun-purple text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
                            >
                              {button.label}
                            </Link>
                          ) : (
                            <a
                              key={index}
                              href={button.href}
                              className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-fun-blue/30 font-semibold hover:bg-fun-blue/10 transition-all duration-300 hover:scale-105"
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
                        src={hero.image.src}
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

        {/* Program Komunitas */}
        <section id="program" className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple bg-clip-text text-transparent">
                  Program Komunitas
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                  Dukungan pendidikan dan keluarga untuk tumbuh bersama dalam
                  nilai islami dan profesionalisme.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {programs && programs.length > 0 ? (
                programs.map((item, i) => (
                  <AnimatedSection key={i} delay={0.2 * (i + 1)}>
                    <Card className="border-2 border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center text-2xl bg-gradient-to-r ${item.color} text-white transform group-hover:scale-110 transition-transform duration-300`}
                        >
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground mt-2">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))
              ) : (
                <div className="col-span-3 text-center">
                  <p className="text-muted-foreground">Loading programs...</p>
                </div>
              )}
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
