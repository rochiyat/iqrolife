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
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-6 bg-gradient-to-r from-green-300 to-emerald-300" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-green-200">
              {/* Diagram Skeleton */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl overflow-hidden border-2 border-green-200">
                  <Skeleton className="w-full h-96 bg-gradient-to-br from-green-200 to-emerald-200" />
                </div>
              </div>

              {/* Legend Skeleton */}
              <div className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg"
                  >
                    <Skeleton className="w-12 h-0.5 bg-gradient-to-r from-green-300 to-emerald-300" />
                    <Skeleton className="h-4 w-20 bg-gray-200" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection delay={0.2}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-brand-emerald rounded-full flex items-center justify-center mx-auto mb-4"
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
                  className="text-3xl font-bold bg-gradient-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent mb-6"
                >
                  Misi
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-brand-gray text-lg leading-relaxed text-center italic"
              >
                "Mengembalikan kesejatian pendidikan dengan membersamai tumbuh
                kembang anak, orang tua dan keluarga menuju manusia yang
                paripurna secara jiwa, akal dan fisik guna mencapai misi
                kehidupan dan keluarga masing-masing"
              </motion.p>
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>
      <FoundationFooter />
    </div>
  );
}
