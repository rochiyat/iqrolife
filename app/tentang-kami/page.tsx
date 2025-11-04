'use client';

import FoundationFooter from '@/components/foundation-footer';
import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function Page() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div>
        <FoundationHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
          <div className="mt-16">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-lg border bg-card p-6 shadow-sm ${
                    i === 6 ? 'md:col-span-2 lg:col-span-3' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div>
        <FoundationHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Error loading page</h1>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  return (
    <div>
      <main>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
                {aboutData.hero.title}
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {aboutData.hero.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {aboutData.hero.buttons.map((button: any, index: number) => (
                  <Button
                    key={index}
                    variant={button.variant}
                    asChild={button.href ? true : undefined}
                    className={`transition-transform hover:-translate-y-0.5 ${
                      button.variant === 'outline' ? 'bg-transparent' : ''
                    }`}
                  >
                    {button.href ? (
                      <a href={button.href}>{button.text}</a>
                    ) : (
                      button.text
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="rounded-lg border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <img
                  src={aboutData.hero.image}
                  alt={aboutData.hero.imageAlt}
                  className="h-auto w-full rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-gradient-to-br from-brand-lime/5 to-brand-emerald/5">
          <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-warm-brown to-brand-emerald bg-clip-text text-transparent">
                7 Dimensi Pendidikan Holistik
              </h2>
              <p className="text-brand-gray max-w-2xl mx-auto">
                Pendekatan komprehensif yang mengintegrasikan berbagai aspek
                perkembangan anak sesuai dengan tahapan usia mereka.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-emerald/20 hover:border-brand-emerald/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-emerald rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-emerald mb-2">
                      Pendidikan Iman, Islam & Ihsan
                    </h3>
                    <p className="text-sm text-brand-gray">
                      Membangun fondasi spiritual dan keimanan yang kuat sejak
                      dini
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-cyan/20 hover:border-brand-cyan/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
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
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-lime/20 hover:border-brand-lime/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-lime rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-warm-brown mb-2">
                      Pendidikan Emosi & Manajemen Konflik
                    </h3>
                    <p className="text-sm text-brand-gray">
                      Mengelola emosi secara sehat dan menyelesaikan konflik
                      dengan bijak
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-coral/20 hover:border-brand-coral/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-coral rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-coral mb-2">
                      Stimulasi Sensorik-Motorik & Pendidikan Jasmani
                    </h3>
                    <p className="text-sm text-brand-gray">
                      Mengoptimalkan perkembangan fisik dan keterampilan motorik
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-warm-brown/20 hover:border-brand-warm-brown/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-warm-brown rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">5</span>
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
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-emerald/20 hover:border-brand-emerald/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-emerald rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">6</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-emerald mb-2">
                      Pendidikan Bakat, Keterampilan & Peran
                    </h3>
                    <p className="text-sm text-brand-gray">
                      Menggali dan mengembangkan potensi unik setiap individu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-brand-cyan/20 hover:border-brand-cyan/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6 md:col-span-2 lg:col-span-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">7</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-cyan mb-2">
                      Pendidikan Seksual, Generatif & Keberlanjutan Peradaban
                    </h3>
                    <p className="text-sm text-brand-gray">
                      Memahami fitrah seksualitas dengan sehat dan kontribusi
                      positif bagi peradaban
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
