'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function PurposePage() {
  const [purposeData, setPurposeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurposeData = async () => {
      try {
        const response = await fetch('/api/profile/purpose');
        const data = await response.json();
        setPurposeData(data);
      } catch (error) {
        console.error('Error fetching purpose data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurposeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-80 mx-auto mb-6 bg-gradient-to-r from-purple-300 to-indigo-300" />
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
              <CardContent className="p-8">
                <Skeleton className="h-6 w-full mb-4 bg-gradient-to-r from-purple-200 to-violet-200" />
                <Skeleton className="h-6 w-5/6 mb-6 bg-gradient-to-r from-violet-200 to-indigo-200" />

                <div className="space-y-6 mt-8">
                  <Skeleton className="h-6 w-full mb-4 bg-gradient-to-r from-indigo-200 to-purple-200" />
                  <Skeleton className="h-6 w-4/5 mb-6 bg-gradient-to-r from-purple-200 to-pink-200" />

                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg"
                      >
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-300 to-indigo-300" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2 bg-gradient-to-r from-purple-300 to-violet-300" />
                          <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                          <Skeleton className="h-4 w-3/4 bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!purposeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Error loading page</h1>
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
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
            {purposeData.title}
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
              <blockquote className="text-2xl font-semibold text-gray-800 text-center mb-6 leading-relaxed">
                "{purposeData.quote}"
              </blockquote>

              <p className="text-lg text-gray-700 text-center leading-relaxed mb-8">
                {purposeData.description}
              </p>

              <div className="space-y-6 mt-8">
                <h2 className="text-xl font-semibold text-purple-800 text-center mb-6">
                  Pilar Purpose Iqrolife:
                </h2>
                <div className="space-y-4">
                  {purposeData.pillars.map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
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
