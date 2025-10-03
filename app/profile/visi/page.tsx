'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';

export default function VisiPage() {
  const [visiData, setVisiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisiData = async () => {
      try {
        const response = await fetch('/api/profile/visi');
        const data = await response.json();
        setVisiData(data);
      } catch (error) {
        console.error('Error fetching visi data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisiData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Loading...</h1>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!visiData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {visiData.title}
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
              <blockquote className="text-xl text-gray-700 text-center italic leading-relaxed mb-6">
                "{visiData.quote}"
              </blockquote>

              <div className="space-y-6 mt-8">
                <h2 className="text-xl font-semibold text-blue-800">
                  Penjelasan Visi:
                </h2>
                <div className="space-y-4">
                  {visiData.explanation.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    </div>
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
