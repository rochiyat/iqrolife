'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function SchoolPage() {
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await fetch('/api/programs/school');
        const data = await response.json();
        setSchoolData(data);
      } catch (error) {
        console.error('Error fetching school data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
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
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="w-1.5 h-1.5 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-full mb-6" />
                <div className="flex justify-center mb-8">
                  <Skeleton className="h-12 w-40" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="space-y-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-32" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="space-y-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-28" />
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

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
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

  const programs = schoolData.programs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
            {schoolData.title}
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            {schoolData.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{program.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-yellow-800">
                      {program.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <ul className="space-y-2">
                    {program.details.map((detail: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-yellow-800">
                {schoolData.cta.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {schoolData.cta.description}
              </p>
              <div className="flex justify-center mb-8">
                <a
                  href={schoolData.cta.button.href}
                  className="inline-block"
                >
                  <button className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    {schoolData.cta.button.text}
                  </button>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Persyaratan:</h4>
                  <ul className="space-y-1 text-gray-600">
                    {schoolData.cta.requirements.map(
                      (req: string, i: number) => (
                        <li key={i}>• {req}</li>
                      )
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Waktu Pendaftaran:</h4>
                  <ul className="space-y-1 text-gray-600">
                    {schoolData.cta.registrationTime.map(
                      (time: string, i: number) => (
                        <li key={i}>• {time}</li>
                      )
                    )}
                  </ul>
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
