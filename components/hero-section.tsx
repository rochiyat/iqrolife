'use client';

import { Button } from '@/components/ui/button';
import { Play, Star, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/school/hero');
        const data = await response.json();
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-fun-blue/20 via-fun-pink/10 to-fun-yellow/20 py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loading...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) {
    return (
      <section className="relative bg-gradient-to-br from-fun-blue/20 via-fun-pink/10 to-fun-yellow/20 py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading hero data
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-fun-blue/20 via-fun-pink/10 to-fun-yellow/20 py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Star className="w-8 h-8 text-fun-yellow animate-wiggle" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce-gentle">
          <Heart className="w-6 h-6 text-fun-pink" />
        </div>
        <div
          className="absolute bottom-20 left-20 animate-float"
          style={{ animationDelay: '1s' }}
        >
          <Sparkles className="w-10 h-10 text-fun-purple animate-rainbow" />
        </div>
        <div
          className="absolute bottom-10 right-10 animate-bounce-gentle"
          style={{ animationDelay: '2s' }}
        >
          <Star className="w-7 h-7 text-fun-green" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-bounce-gentle">
              <span className="text-fun-blue">{heroData.title}</span>
              <br />
              <span className="text-fun-orange">{heroData.subtitle}</span>
              <br />
              <span className="bg-gradient-to-r from-fun-pink to-fun-purple bg-clip-text text-transparent">
                {heroData.description}
              </span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              {heroData.content}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {heroData.buttons?.map((button: any, index: number) => (
                <Button
                  key={index}
                  size="lg"
                  asChild={button.href ? true : undefined}
                  className={
                    button.variant === 'primary'
                      ? 'bg-gradient-to-r from-fun-orange to-fun-pink hover:from-fun-pink hover:to-fun-orange text-white px-8 py-4 text-lg font-bold rounded-full fun-button shadow-lg transform hover:scale-105 transition-all duration-300'
                      : 'flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-fun-blue text-fun-blue hover:bg-fun-blue hover:text-white px-8 py-4 text-lg font-bold rounded-full fun-hover transition-all duration-300'
                  }
                >
                  {button.href ? (
                    <a href={button.href}>
                      {button.variant === 'outline' && (
                        <Play className="w-5 h-5" />
                      )}
                      {button.text}
                    </a>
                  ) : (
                    <>
                      {button.variant === 'outline' && (
                        <Play className="w-5 h-5" />
                      )}
                      {button.text}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-fun-pink via-fun-blue to-fun-green rounded-3xl opacity-20 animate-pulse-color"></div>
            <div className="relative bg-white p-4 rounded-3xl shadow-2xl fun-hover">
              <Image
                src={
                  heroData.image ||
                  '/happy-kindergarten-children-playing-and-learning-i.jpg'
                }
                alt={heroData.imageAlt || 'Students at Sekolah Iqrolife'}
                width={600}
                height={500}
                className="rounded-2xl"
              />
              <div className="absolute -top-2 -left-2 bg-fun-yellow rounded-full p-2 animate-bounce-gentle">
                <span className="text-2xl">📚</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-fun-pink rounded-full p-2 animate-wiggle">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="absolute -bottom-2 -left-2 bg-fun-green rounded-full p-2 animate-float">
                <span className="text-2xl">🎨</span>
              </div>
              <div
                className="absolute -bottom-2 -right-2 bg-fun-purple rounded-full p-2 animate-bounce-gentle"
                style={{ animationDelay: '1s' }}
              >
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
