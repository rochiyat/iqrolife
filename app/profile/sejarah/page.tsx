'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function SejarahPage() {
  const [sejarahData, setSejarahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSejarahData = async () => {
      try {
        const response = await fetch('/api/profile/sejarah');
        const data = await response.json();
        setSejarahData(data);
      } catch (error) {
        console.error('Error fetching sejarah data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSejarahData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-6" />
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-64">
                      <Skeleton className="w-full h-full" />
                      <div className="absolute bottom-4 left-4">
                        <Skeleton className="h-8 w-16 bg-black/60" />
                      </div>
                    </div>
                    <div className="p-6">
                      <Skeleton className="h-7 w-48 mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!sejarahData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
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

  const milestones = sejarahData.milestones;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {sejarahData.title}
          </h1>
          <div className="text-center text-gray-600 max-w-3xl mx-auto mb-12 space-y-4">
            {sejarahData.subtitle
              .split('\n\n')
              .map((paragraph: string, index: number) => {
                // Handle bold text with ** markers
                const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={index} className="leading-relaxed">
                    {parts.map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={i} className="font-bold text-gray-800">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              })}
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto space-y-12">
          {milestones.map((milestone: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-64 md:h-full">
                      <Image
                        src={milestone.image}
                        alt={milestone.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r">
                        <div className="absolute bottom-4 left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                          <span className="text-4xl font-bold text-white">
                            {milestone.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-4">
                        {milestone.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <FoundationFooter />
    </div>
  );
}
