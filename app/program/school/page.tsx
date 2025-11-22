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

// Carousel Component (reusable for Facilities and Activities)
function ImageCarousel({
  items,
  colorTheme = 'purple',
}: {
  items: any[];
  colorTheme?: 'purple' | 'orange' | 'green';
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const themeColors = {
    purple: {
      border: 'border-[#4caade]/30',
      hover: 'hover:bg-[#4caade]/10',
      dot: 'bg-[#4caade]',
    },
    orange: {
      border: 'border-[#f2cd5b]/30',
      hover: 'hover:bg-[#f2cd5b]/10',
      dot: 'bg-[#f2cd5b]',
    },
    green: {
      border: 'border-[#4caade]/30',
      hover: 'hover:bg-[#4caade]/10',
      dot: 'bg-[#4caade]',
    },
  };

  const theme = themeColors[colorTheme];

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Previous Button */}
      <button
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
        }
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 ${theme.border} flex items-center justify-center text-gray-700 ${theme.hover} hover:scale-110 transition-all duration-300 group`}
        aria-label="Previous"
      >
        <svg
          className="w-6 h-6 group-hover:scale-125 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 ${theme.border} flex items-center justify-center text-gray-700 ${theme.hover} hover:scale-110 transition-all duration-300 group`}
        aria-label="Next"
      >
        <svg
          className="w-6 h-6 group-hover:scale-125 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 animate-scale-in overflow-hidden p-6">
        <div
          className="relative h-[500px] cursor-pointer group overflow-hidden rounded-lg"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
        >
          <Image
            src={items[currentIndex].image}
            alt={items[currentIndex].title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {items[currentIndex].title}
            </h3>
            <p className="text-sm text-white/90">
              {items[currentIndex].description}
            </p>
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
        </div>
      </Card>

      <div className="flex justify-center mt-8 gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 animate-pulse border-0 cursor-pointer ${
              index === currentIndex
                ? `${theme.dot} scale-125`
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Item ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

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
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
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

  const programs = schoolData.programs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-16 relative overflow-hidden bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-sm">
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

        {/* Why Choose Section */}
        {schoolData.whyChoose && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16 bg-gradient-to-br from-[#4caade]/10 to-[#f2cd5b]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-[#4caade] animate-bounce-gentle">
              {schoolData.whyChoose.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {schoolData.whyChoose.items.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="h-full bg-gradient-to-br from-[#4caade] to-[#3a8fc7] border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up">
                    <CardContent className="p-8 text-center h-full flex flex-col">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-4">
                        {item.title}
                      </h3>
                      <p className="text-white/95 leading-relaxed flex-grow">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Curriculum Focus Section */}
        {schoolData.curriculum && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-16 bg-gradient-to-br from-[#f2cd5b]/10 to-[#4caade]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-[#4caade] animate-bounce-gentle">
              {schoolData.curriculum.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {schoolData.curriculum.subtitle}
            </p>

            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Left Side - Curriculum Items */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                  {schoolData.curriculum.items.map(
                    (item: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="bg-white border-2 border-cyan-400 rounded-2xl px-6 py-4 text-center shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <p className="font-medium text-gray-800">{item}</p>
                      </motion.div>
                    )
                  )}
                </div>

                {/* Arrow */}
                <div className="text-gray-400 text-4xl hidden md:block">➜</div>

                {/* Center - Method */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-gradient-to-br from-[#4caade] to-[#3a8fc7] rounded-3xl px-12 py-16 shadow-xl"
                >
                  <p className="text-white text-2xl font-bold text-center leading-tight">
                    {schoolData.curriculum.method}
                  </p>
                </motion.div>

                {/* Arrow */}
                <div className="text-gray-400 text-4xl hidden md:block">➜</div>

                {/* Right Side - Output */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-gradient-to-br from-[#f2cd5b] to-[#e5bc45] rounded-3xl px-12 py-16 shadow-xl"
                >
                  <p className="text-gray-800 text-2xl font-bold text-center leading-tight">
                    {schoolData.curriculum.output}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Programs Section */}
        <section className="mb-16 bg-gradient-to-br from-[#4caade]/10 to-[#f2cd5b]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#4caade] animate-bounce-gentle">
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
                      <h3 className="text-xl font-semibold text-[#4caade]">
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
            className="mb-16 bg-gradient-to-br from-[#4caade]/10 to-[#f2cd5b]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-[#4caade] animate-bounce-gentle">
              Level Pendidikan
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {schoolData.levels.map((level: any, index: number) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-64 flex items-center justify-center bg-gray-50 p-4">
                    <Image
                      src={level.image}
                      alt={level.title}
                      width={300}
                      height={200}
                      className="object-contain max-h-full"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{level.icon}</span>
                      <h3 className="font-bold text-xl text-[#4caade]">
                        {level.title}
                      </h3>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-[#f2cd5b]">
                        {level.age}
                      </p>
                      {level.capacity && (
                        <p className="text-xs font-medium text-[#4caade] mt-1">
                          {level.capacity}
                        </p>
                      )}
                    </div>
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: level.description }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Daily Schedule Section */}
        {schoolData.dailySchedule && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16 bg-gradient-to-br from-[#f2cd5b]/10 to-[#4caade]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-[#4caade] animate-bounce-gentle">
              {schoolData.dailySchedule.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {schoolData.dailySchedule.description}
            </p>

            <div className="max-w-5xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                        <th className="px-6 py-4 text-left text-white font-bold">
                          Waktu
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold">
                          Aktivitas
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolData.dailySchedule.schedule.map(
                        (item: any, index: number) => (
                          <tr
                            key={index}
                            className={`border-b ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } hover:bg-yellow-50 transition-colors`}
                          >
                            <td className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">
                              {item.time}
                            </td>
                            <td className="px-6 py-4 text-gray-800">
                              {item.activity}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {item.description}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </motion.section>
        )}

        {/* Yearly Activities Section */}
        {schoolData.yearlyActivities && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.33 }}
            className="mb-16 bg-gradient-to-br from-[#4caade]/10 to-[#f2cd5b]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-[#4caade] animate-bounce-gentle">
              {schoolData.yearlyActivities.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {schoolData.yearlyActivities.description}
            </p>

            <div className="max-w-5xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                        <th className="px-6 py-4 text-center text-white font-bold">
                          No
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold">
                          Kegiatan
                        </th>
                        <th className="px-6 py-4 text-left text-white font-bold">
                          Ritme
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolData.yearlyActivities.activities.map(
                        (item: any, index: number) => (
                          <tr
                            key={index}
                            className={`border-b ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } hover:bg-yellow-50 transition-colors`}
                          >
                            <td className="px-6 py-4 text-center font-semibold text-gray-700">
                              {item.no}
                            </td>
                            <td className="px-6 py-4 text-gray-800">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {item.frequency}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </motion.section>
        )}

        {/* Facilities Section */}
        {schoolData.facilities && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-16 bg-gradient-to-br from-[#f2cd5b]/10 to-[#4caade]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-[#4caade] animate-bounce-gentle">
              {schoolData.facilities.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up">
              {schoolData.facilities.description}
            </p>

            <ImageCarousel
              items={schoolData.facilities.items}
              colorTheme="purple"
            />
          </motion.section>
        )}

        {/* Activities Section */}
        {schoolData.activities && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16 bg-gradient-to-br from-[#4caade]/10 to-[#f2cd5b]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-[#4caade] animate-bounce-gentle">
              {schoolData.activities.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up">
              {schoolData.activities.description}
            </p>

            <ImageCarousel
              items={schoolData.activities.items}
              colorTheme="green"
            />
          </motion.section>
        )}

        {/* PPDB Info Section */}
        {schoolData.ppdb && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16 bg-gradient-to-br from-[#f2cd5b]/10 to-[#4caade]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-[#4caade]">
              {schoolData.ppdb.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {schoolData.ppdb.items.map((item: any, index: number) => (
                <Card
                  key={index}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-8 text-center">
                    <div className="bg-white/80 rounded-lg p-6">
                      <div className="text-3xl font-bold text-[#4caade] mb-2">
                        {item.level}
                      </div>
                      <div className="text-xl text-gray-700 mb-2">
                        Usia: {item.age}
                      </div>
                      <div className="text-2xl font-bold text-[#f2cd5b] mb-1">
                        {item.fee}
                      </div>
                      <div className="text-sm text-gray-600">{item.note}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Requirements & Timeline Section */}
        {(schoolData.requirements || schoolData.timeline) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-16 bg-gradient-to-br from-[#4caade]/10 to-[#f2cd5b]/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
          >
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {schoolData.requirements && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-[#4caade] animate-bounce-gentle">
                      {schoolData.requirements.title}
                    </h2>
                    <ul className="space-y-3">
                      {schoolData.requirements.items.map(
                        (req: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <CheckCircle className="w-5 h-5 text-[#4caade] mt-0.5 flex-shrink-0" />
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
                    <h2 className="text-2xl font-bold mb-6 text-[#4caade] animate-bounce-gentle">
                      {schoolData.timeline.title}
                    </h2>
                    <div className="space-y-4">
                      {schoolData.timeline.items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4caade]/20 to-[#f2cd5b]/20 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-[#4caade]" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-[#4caade]">
                              {item.phase}
                            </h3>
                            <p className="text-sm text-[#f2cd5b] font-medium">
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

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-[#4caade]/20 via-white to-[#f2cd5b]/20 border-0 shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-[#4caade]">
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
                    <button className="px-8 py-4 text-lg font-semibold text-white bg-[#4caade] border-2 border-[#4caade] rounded-lg shadow-lg hover:shadow-xl hover:bg-[#3a8fc7] transform hover:scale-110 transition-all duration-300 animate-pulse">
                      {schoolData.cta.whatsappButton.text}
                    </button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <FoundationFooter />
    </div>
  );
}
