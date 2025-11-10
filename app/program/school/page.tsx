'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';
import { CheckCircle, Calendar, Users, Book } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <FoundationHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
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
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">
              🎓
            </div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">
              📝
            </div>
            <div className="absolute bottom-20 left-20 text-3xl animate-bounce">
              🌟
            </div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse">
              🎉
            </div>
            <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">
              🎈
            </div>
            <div className="absolute top-1/3 right-5 text-2xl animate-wiggle">
              🎈
            </div>
            <div className="absolute top-1/4 left-1/4 text-3xl animate-float">
              📚
            </div>
            <div className="absolute bottom-1/4 right-1/4 text-3xl animate-float">
              ✨
            </div>
            <div className="absolute top-2/3 left-10 text-2xl animate-bounce-gentle">
              🌈
            </div>
            <div className="absolute top-1/3 right-10 text-2xl animate-bounce-gentle">
              🎨
            </div>
          </div>

          <AnimatedSection>
            <div className="text-center relative z-10">
              {schoolData.badge && (
                <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 text-lg animate-bounce">
                  {schoolData.badge}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-bounce-gentle">
                {schoolData.hero?.title || schoolData.title}
              </h1>
              {schoolData.hero?.subtitle && (
                <p className="text-center text-gray-700 max-w-3xl mx-auto mb-6 text-lg font-medium animate-fade-in-up whitespace-pre-line leading-relaxed">
                  {schoolData.hero.subtitle}
                </p>
              )}
              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 text-lg animate-fade-in-up whitespace-pre-line">
                {schoolData.hero?.description || schoolData.description}
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* Programs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800 animate-bounce-gentle">
            Output Pembelajaran
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programs.map((program: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">{program.icon}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-orange-800">
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
                          <span className="w-2 h-2 rounded-full bg-orange-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Levels Section */}
        {schoolData.levels && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-800 animate-bounce-gentle">
              Level Pendidikan
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {schoolData.levels.map((level: any, index: number) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48">
                    <Image
                      src={level.image}
                      alt={level.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{level.icon}</span>
                      <h3 className="font-bold text-xl text-green-700">
                        {level.title}
                      </h3>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-orange-600">
                        {level.age}
                        {level.capacity && ` • ${level.capacity}`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {level.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Activities Section */}
        {schoolData.activities && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-purple-800 animate-bounce-gentle">
              {schoolData.activities.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up">
              {schoolData.activities.description}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {schoolData.activities.items.map(
                (activity: any, index: number) => (
                  <Card
                    key={index}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-pink-700">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </motion.section>
        )}

        {/* PPDB Info Section */}
        {schoolData.ppdb && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-0 shadow-lg max-w-3xl mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-purple-800">
                  {schoolData.ppdb.title}
                </h2>
                <div className="bg-white/80 rounded-lg p-6 mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {schoolData.ppdb.level}
                  </div>
                  <div className="text-xl text-gray-700 mb-2">
                    Usia: {schoolData.ppdb.age}
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {schoolData.ppdb.fee}
                  </div>
                  <div className="text-sm text-gray-600">
                    {schoolData.ppdb.note}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Requirements & Timeline Section */}
        {(schoolData.requirements || schoolData.timeline) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {schoolData.requirements && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-orange-800 animate-bounce-gentle">
                      {schoolData.requirements.title}
                    </h2>
                    <ul className="space-y-3">
                      {schoolData.requirements.items.map(
                        (req: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {schoolData.timeline && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-purple-800 animate-bounce-gentle">
                      {schoolData.timeline.title}
                    </h2>
                    <div className="space-y-4">
                      {schoolData.timeline.items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-purple-700">
                              {item.phase}
                            </h3>
                            <p className="text-sm text-pink-600 font-medium">
                              {item.date}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.section>
        )}

        {/* Gallery Section */}
        {schoolData.gallery && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-purple-800 animate-bounce-gentle">
              {schoolData.gallery.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up">
              {schoolData.gallery.description}
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {schoolData.gallery.items.map((item: any, index: number) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-orange-700">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 border-0 shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-purple-800">
                {schoolData.cta.title}
              </h2>
              <p className="text-gray-700 mb-8 text-lg">
                {schoolData.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a href={schoolData.cta.button.href} className="inline-block">
                  <button className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-pink-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-bounce-gentle">
                    {schoolData.cta.button.text}
                  </button>
                </a>
                {schoolData.cta.whatsappButton && (
                  <a
                    href={schoolData.cta.whatsappButton.href}
                    className="inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="px-8 py-4 text-lg font-semibold text-purple-700 bg-white border-2 border-purple-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-pulse">
                      {schoolData.cta.whatsappButton.text}
                    </button>
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Persyaratan:
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    {schoolData.cta.requirements.map(
                      (req: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          {req}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Waktu Pendaftaran:
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    {schoolData.cta.registrationTime.map(
                      (time: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          {time}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <FoundationFooter />
    </div>
  );
}
