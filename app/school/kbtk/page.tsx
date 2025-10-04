'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function KBTKPage() {
  const [kbtkData, setKBTKData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKBTKData = async () => {
      try {
        const response = await fetch('/api/school/kbtk');
        const data = await response.json();
        setKBTKData(data);
      } catch (error) {
        console.error('Error fetching KBTK data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKBTKData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section Skeleton */}
          <section className="bg-gradient-to-br from-primary-light to-secondary-light py-20">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <Skeleton className="h-16 w-96" />
                  <Skeleton className="h-6 w-full max-w-md" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-12 w-40" />
                  </div>
                </div>
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          </section>

          {/* Activities Section Skeleton */}
          <section className="py-16 bg-gradient-to-r from-yellow-50 to-pink-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-48 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-3xl" />
                ))}
              </div>
            </div>
          </section>

          {/* Features Section Skeleton */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-3xl" />
                ))}
              </div>
            </div>
          </section>

          {/* Games Section Skeleton */}
          <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-8 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-80 mx-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-3xl" />
                ))}
              </div>
            </div>
          </section>

          {/* Location Section Skeleton */}
          <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="container mx-auto px-4">
              <Skeleton className="h-64 w-full max-w-4xl mx-auto rounded-3xl" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!kbtkData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading KBTK information
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
        <section className="bg-gradient-to-br from-primary-light to-secondary-light py-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-12 h-12 bg-yellow-300 rounded-full animate-bounce opacity-70">
              🌟
            </div>
            <div className="absolute top-20 right-20 w-10 h-10 bg-pink-300 rounded-full animate-pulse opacity-70">
              🎈
            </div>
            <div
              className="absolute bottom-20 left-20 w-14 h-14 bg-green-300 rounded-full animate-bounce opacity-70"
              style={{ animationDelay: '1s' }}
            >
              🌈
            </div>
            <div
              className="absolute bottom-10 right-10 w-8 h-8 bg-orange-300 rounded-full animate-pulse opacity-70"
              style={{ animationDelay: '2s' }}
            >
              ⭐
            </div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-purple-300 rounded-full animate-wiggle opacity-70">
              🦋
            </div>
            <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-blue-300 rounded-full animate-float opacity-70">
              ☁️
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight animate-bounce">
                  {kbtkData.hero.title}
                  <br />
                  <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {kbtkData.hero.subtitle}
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {kbtkData.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {kbtkData.hero.buttons[0].text}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    {kbtkData.hero.buttons[1].text}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-20 animate-pulse"></div>
                <Image
                  src="/happy-kindergarten-children-playing-and-learning-i.jpg"
                  alt="KBTK Iqrolife - Anak-anak bermain dan belajar"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-yellow-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-wiggle">
                {kbtkData.activities.title}
              </h2>
              <p className="text-xl text-gray-600">
                {kbtkData.activities.description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {kbtkData.activities.items.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    // Simple interaction feedback
                    const element = document.getElementById(
                      `activity-${index}`
                    );
                    if (element) {
                      element.classList.add('animate-bounce');
                      setTimeout(
                        () => element.classList.remove('animate-bounce'),
                        1000
                      );
                    }
                  }}
                >
                  <div id={`activity-${index}`} className="text-center">
                    <div className="text-6xl mb-4 group-hover:animate-spin">
                      {activity.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {activity.name}
                    </h3>
                    <p className="text-primary font-semibold">
                      {activity.sound}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce">
                {kbtkData.features.title}
              </h2>
              <p className="text-xl text-gray-600">
                {kbtkData.features.description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kbtkData.features.items.map((feature: any, index: number) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden group"
                >
                  <CardContent className="p-6 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-4 animate-bounce group-hover:animate-spin transition-all duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Educational Games Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-wiggle">
                {kbtkData.games.title}
              </h2>
              <p className="text-xl text-gray-600">
                {kbtkData.games.description}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {kbtkData.games.items.map((game: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-8xl mb-4 animate-bounce">
                      {game.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {game.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{game.description}</p>
                    <Button
                      className={`text-white rounded-2xl px-6 py-2 hover:scale-105 transition-transform ${game.color}`}
                    >
                      {game.buttonText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="rounded-3xl overflow-hidden shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center animate-bounce">
                    {kbtkData.location.title}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
                        <h4 className="font-semibold text-lg mb-3 flex items-center">
                          📍 Alamat Sekolah
                        </h4>
                        <p className="text-gray-700 mb-4">
                          {kbtkData.location.address.street}
                          <br />
                          {kbtkData.location.address.district}
                          <br />
                          {kbtkData.location.address.city}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                        <h4 className="font-semibold text-lg mb-3 flex items-center">
                          📞 Hubungi Kami
                        </h4>
                        <p className="text-gray-700">
                          Telepon: {kbtkData.location.contact.phone}
                          <br />
                          Email: {kbtkData.location.contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-64 flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🗺️</div>
                        <p className="text-gray-600 font-semibold">
                          Peta Lokasi KBTK Iqrolife
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
