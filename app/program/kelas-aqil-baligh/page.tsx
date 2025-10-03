'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function KelasAqilBalighPage() {
  const [kelasAqilBalighData, setKelasAqilBalighData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelasAqilBalighData = async () => {
      try {
        const response = await fetch('/api/programs/kelas-aqil-baligh');
        const data = await response.json();
        setKelasAqilBalighData(data);
      } catch (error) {
        console.error('Error fetching kelas-aqil-baligh data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKelasAqilBalighData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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

  if (!kelasAqilBalighData) {
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

  const programs = kelasAqilBalighData.programs;
  const schedule = kelasAqilBalighData.schedule;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {kelasAqilBalighData.title}
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            {kelasAqilBalighData.subtitle}
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
                    <div
                      className={`w-12 h-12 rounded-full bg-${program.color}-100 flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-2xl">{program.icon}</span>
                    </div>
                    <h3
                      className={`text-xl font-semibold text-${program.color}-800`}
                    >
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
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-${program.color}-400`}
                        />
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
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
                Jadwal Program
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-blue-700">
                    Kelas Reguler
                  </h3>
                  <div className="grid gap-4">
                    {schedule.regular.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-blue-50/50"
                      >
                        <div className="font-medium text-blue-900">
                          {item.day}
                        </div>
                        <div className="text-gray-600">{item.time}</div>
                        <div className="text-sm text-blue-600">{item.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 text-green-700">
                    Program Khusus
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {schedule.special.map((item: string, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-green-50/50 text-center"
                      >
                        <span className="text-green-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Persyaratan Peserta:
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                    {kelasAqilBalighData.requirements.map(
                      (req: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          {req}
                        </li>
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
