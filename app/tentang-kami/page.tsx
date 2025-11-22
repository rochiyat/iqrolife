'use client';

import FoundationFooter from '@/components/foundation-footer';
import FoundationHeader from '@/components/foundation-header';
import GallerySection from '@/components/gallery-section';
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
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-16">
            <div className="order-2 md:order-1 space-y-6">
              <Skeleton className="h-12 w-3/4 bg-gradient-to-r from-indigo-300 to-purple-300" />
              <Skeleton className="h-4 w-full bg-gradient-to-r from-purple-200 to-pink-200" />
              <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-pink-200 to-rose-200" />
              <Skeleton className="h-4 w-4/5 bg-gradient-to-r from-rose-200 to-orange-200" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32 bg-gradient-to-r from-indigo-300 to-purple-300" />
                <Skeleton className="h-10 w-32 bg-gray-200" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Skeleton className="h-64 w-full rounded-lg bg-gradient-to-br from-indigo-200 to-purple-200" />
            </div>
          </div>
          <div className="mt-16">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-96 mx-auto mb-4 bg-gradient-to-r from-purple-300 to-pink-300" />
              <Skeleton className="h-6 w-2/3 mx-auto bg-gradient-to-r from-pink-200 to-rose-200" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-purple-200 p-6 shadow-md hover:shadow-lg transition-all ${
                    i === 6 ? 'md:col-span-2 lg:col-span-3' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-300 to-purple-300" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2 bg-gradient-to-r from-purple-300 to-pink-300" />
                      <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                      <Skeleton className="h-4 w-5/6 bg-gray-200" />
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
                  src="/program/family-talent-discovery/family-talent-discovery-002.jpg"
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
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
                7 Dimensi Pendidikan Holistik
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Pendekatan komprehensif yang mengintegrasikan berbagai aspek
                perkembangan anak sesuai dengan tahapan usia mereka.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#4caade]/20 hover:border-[#4caade]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4caade] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Pendidikan Iman, Islam & Ihsan
                    </h3>
                    <p className="text-sm text-gray-700">
                      Membangun fondasi spiritual dan keimanan yang kuat sejak
                      dini
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#f2cd5b]/20 hover:border-[#f2cd5b]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f2cd5b] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-gray-800 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Pendidikan Ego, Sosial & Adab
                    </h3>
                    <p className="text-sm text-gray-700">
                      Mengembangkan karakter, etika sosial, dan adab mulia
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#4caade]/20 hover:border-[#4caade]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4caade] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Pendidikan Emosi & Manajemen Konflik
                    </h3>
                    <p className="text-sm text-gray-700">
                      Mengelola emosi secara sehat dan menyelesaikan konflik
                      dengan bijak
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#f2cd5b]/20 hover:border-[#f2cd5b]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f2cd5b] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-gray-800 font-bold text-lg">4</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Stimulasi Sensorik-Motorik & Pendidikan Jasmani
                    </h3>
                    <p className="text-sm text-gray-700">
                      Mengoptimalkan perkembangan fisik dan keterampilan motorik
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#4caade]/20 hover:border-[#4caade]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4caade] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Pendidikan Intelektual & Learning Agility
                    </h3>
                    <p className="text-sm text-gray-700">
                      Mengasah kemampuan berpikir kritis dan adaptif dalam
                      belajar
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#f2cd5b]/20 hover:border-[#f2cd5b]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f2cd5b] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-gray-800 font-bold text-lg">6</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Pendidikan Bakat, Keterampilan & Peran
                    </h3>
                    <p className="text-sm text-gray-700">
                      Menggali dan mengembangkan potensi unik setiap individu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-[#4caade]/20 hover:border-[#4caade]/40 hover:shadow-xl transition-all duration-300 rounded-lg p-6 md:col-span-2 lg:col-span-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4caade] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">7</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#4caade] mb-2">
                      Pendidikan Seksual, Generatif & Keberlanjutan Peradaban
                    </h3>
                    <p className="text-sm text-gray-700">
                      Memahami fitrah seksualitas dengan sehat dan kontribusi
                      positif bagi peradaban
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <GallerySection />
      </main>
      <FoundationFooter />
    </div>
  );
}
