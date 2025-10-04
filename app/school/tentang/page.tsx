'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function TentangPage() {
  const [tentangData, setTentangData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTentangData = async () => {
      try {
        const response = await fetch('/api/school/tentang');
        const data = await response.json();
        setTentangData(data);
      } catch (error) {
        console.error('Error fetching tentang data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTentangData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section Skeleton */}
          <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center">
                <Skeleton className="h-16 w-96 mx-auto mb-6" />
                <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
              </div>
            </div>
          </section>

          {/* Profile Section Skeleton */}
          <section className="py-16 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          </section>

          {/* Achievements Section Skeleton */}
          <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="text-center">
                    <CardContent className="p-6">
                      <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Facilities Section Skeleton */}
          <section className="py-16 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-48 mx-auto mb-4" />
                <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </section>

          {/* Life Section Skeleton */}
          <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-48 w-full rounded-2xl mb-4" />
                    <Skeleton className="h-6 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tentangData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading school information
            </h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">
              🌈
            </div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">
              ⭐
            </div>
            <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">
              🎨
            </div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">
              📚
            </div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-bounce-gentle">
                {tentangData.hero.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
                {tentangData.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-5 text-2xl animate-wiggle">
              🎈
            </div>
            <div className="absolute top-1/2 right-5 text-2xl animate-wiggle delay-700">
              🎈
            </div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {tentangData.profile.title}
                </h2>
                <div className="space-y-4 text-gray-600">
                  {tentangData.profile.content.map(
                    (paragraph: string, index: number) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </div>
              <div className="relative animate-fade-in-right">
                <img
                  src={tentangData.profile.image}
                  alt={tentangData.profile.imageAlt}
                  className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-float"
                />
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
                  🏫
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                {tentangData.achievements.title}
              </h2>
              <p className="text-xl text-gray-600">
                {tentangData.achievements.description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tentangData.achievements.items.map(
                (achievement: any, index: number) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-yellow-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4 animate-bounce">
                        {achievement.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-primary">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-3xl animate-pulse">
              🎪
            </div>
            <div className="absolute top-20 right-20 text-3xl animate-bounce">
              🎠
            </div>
            <div className="absolute bottom-20 left-20 text-3xl animate-pulse delay-300">
              🎯
            </div>
            <div className="absolute bottom-10 right-10 text-3xl animate-bounce delay-500">
              🎲
            </div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                {tentangData.facilities.title}
              </h2>
              <p className="text-xl text-gray-600">
                {tentangData.facilities.description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tentangData.facilities.items.map(
                (facility: string, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-blue-200"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <p className="font-medium text-blue-900">{facility}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                {tentangData.life.title}
              </h2>
              <p className="text-xl text-gray-600">
                {tentangData.life.description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {tentangData.life.sections.map((section: any, index: number) => (
                <div
                  key={index}
                  className={`text-center ${
                    index === 0
                      ? 'animate-fade-in-left'
                      : 'animate-fade-in-right'
                  }`}
                >
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
