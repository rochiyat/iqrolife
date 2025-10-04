'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function PPDBPage() {
  const [ppdbData, setPPDBData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPPDBData = async () => {
      try {
        const response = await fetch('/api/school/ppdb');
        const data = await response.json();
        setPPDBData(data);
      } catch (error) {
        console.error('Error fetching PPDB data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPPDBData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section Skeleton */}
          <section className="bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 py-20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <Skeleton className="h-8 w-32 mx-auto mb-4" />
                <Skeleton className="h-16 w-96 mx-auto mb-6" />
                <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-8" />
                <Skeleton className="h-12 w-48 mx-auto" />
              </div>
            </div>
          </section>

          {/* Programs Section Skeleton */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-80 mx-auto" />
              </div>
              <Skeleton className="h-48 w-full max-w-md mx-auto" />
            </div>
          </section>

          {/* Requirements & Timeline Section Skeleton */}
          <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-8 w-32" />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section Skeleton */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-80 mx-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section Skeleton */}
          <section className="py-16 bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-8 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ppdbData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading PPDB information
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
        <section className="bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">
              🎓
            </div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">
              📝
            </div>
            <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">
              🌟
            </div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">
              🎉
            </div>
            <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">
              🎈
            </div>
            <div className="absolute top-1/3 right-5 text-2xl animate-wiggle delay-700">
              🎈
            </div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <Badge className="mb-4 bg-orange-200 text-orange-800 animate-bounce">
                {ppdbData.hero.badge}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-bounce-gentle">
                {ppdbData.hero.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up">
                {ppdbData.hero.description}
              </p>
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 animate-bounce-gentle hover:scale-105 transition-all duration-300"
              >
                {ppdbData.hero.buttonText}
              </Button>
            </div>
          </div>
        </section>

        {/* Programs & Fees */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                {ppdbData.programs.title}
              </h2>
              <p className="text-xl text-gray-600">
                {ppdbData.programs.description}
              </p>
            </div>
            <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
              {ppdbData.programs.items.map((program: any, index: number) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-yellow-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <Badge className={`mb-2 ${program.color} animate-pulse`}>
                      {program.age}
                    </Badge>
                    <CardTitle className="text-xl text-primary">
                      {program.level}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      {program.fee}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      *Biaya per tahun
                    </p>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      💡 Info Detail
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fade-in-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {ppdbData.requirements.title}
                </h2>
                <div className="space-y-3">
                  {ppdbData.requirements.items.map(
                    (requirement: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 animate-bounce">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {requirement}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="animate-fade-in-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {ppdbData.timeline.title}
                </h2>
                <div className="space-y-6">
                  {ppdbData.timeline.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold animate-bounce">
                          {index + 1}
                        </div>
                        {index < ppdbData.timeline.items.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.phase}
                        </h3>
                        <p className="text-orange-600 font-medium">
                          {item.date}
                        </p>
                        <p className="text-gray-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                {ppdbData.gallery.title}
              </h2>
              <p className="text-xl text-gray-600">
                {ppdbData.gallery.description}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {ppdbData.gallery.items.map((galleryItem: any, index: number) => (
                <div
                  key={index}
                  className={`text-center animate-fade-in-up ${
                    index === 1 ? 'delay-200' : index === 2 ? 'delay-300' : ''
                  }`}
                >
                  <img
                    src={galleryItem.image}
                    alt={galleryItem.imageAlt}
                    className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {galleryItem.title}
                  </h3>
                  <p className="text-gray-600">{galleryItem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-3xl animate-pulse">
              ⭐
            </div>
            <div className="absolute top-20 right-20 text-3xl animate-bounce">
              🌟
            </div>
            <div className="absolute bottom-20 left-20 text-3xl animate-pulse delay-300">
              ✨
            </div>
            <div className="absolute bottom-10 right-10 text-3xl animate-bounce delay-500">
              💫
            </div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4 animate-bounce-gentle">
              {ppdbData.cta.title}
            </h2>
            <p className="text-xl text-blue-100 mb-8 animate-fade-in-up">
              {ppdbData.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 animate-bounce-gentle hover:scale-105 transition-all duration-300"
              >
                {ppdbData.cta.buttons[0].text}
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent animate-bounce-gentle hover:scale-105 transition-all duration-300"
              >
                <a
                  href={ppdbData.cta.buttons[1].href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ppdbData.cta.buttons[1].text}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
