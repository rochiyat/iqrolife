'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function KomunitasAyahPage() {
  const [komunitasAyahData, setKomunitasAyahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKomunitasAyahData = async () => {
      try {
        const response = await fetch('/api/programs/komunitas-ayah');
        const data = await response.json();
        setKomunitasAyahData(data);
      } catch (error) {
        console.error('Error fetching komunitas-ayah data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKomunitasAyahData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Skeleton className="w-1.5 h-1.5 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <Skeleton className="h-8 w-32 mx-auto mb-8" />
                <div className="grid gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-6 w-48 mb-4" />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="p-3 rounded-lg text-center">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 p-4 rounded-lg">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
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

  if (!komunitasAyahData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
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

  const activities = komunitasAyahData.activities;
  const benefits = komunitasAyahData.benefits;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            {komunitasAyahData.title}
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            {komunitasAyahData.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {activities.map((activity: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{activity.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-emerald-600">
                        {activity.schedule}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-700">Kegiatan:</h4>
                    <ul className="space-y-2">
                      {activity.topics.map((topic: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-emerald-800">
                Manfaat Bergabung
              </h2>
              <div className="grid gap-8">
                {benefits.map((benefit: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold text-lg mb-4 text-emerald-700">
                      {benefit.title}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {benefit.points.map((point: string, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-emerald-50/50 text-center"
                        >
                          <span className="text-emerald-800 text-sm">
                            {point}
                          </span>
                        </div>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Cara Bergabung:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  {komunitasAyahData.joinSteps.map(
                    (step: string, index: number) => (
                      <li key={index}>{step}</li>
                    )
                  )}
                </ol>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <FoundationFooter />
    </div>
  );
}
