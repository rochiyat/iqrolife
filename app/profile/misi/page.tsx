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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-6" />
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <Skeleton className="h-6 w-48 mb-4" />

                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg"
                    >
                      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-full mb-3" />
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <Skeleton className="w-1.5 h-1.5 rounded-full" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!misiData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            {misiData.title}
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
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  {misiData.subtitle}
                </h2>

                {misiData.missions.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <ul className="space-y-2">
                        {item.points.map((point: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-gray-600"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <FoundationFooter />
    </div>
  );
}
