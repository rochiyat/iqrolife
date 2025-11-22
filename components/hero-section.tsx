'use client';

import { Button } from '@/components/ui/button';
import { Play, Star, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SkeletonHero } from '@/components/ui/skeleton-loading';

export default function HeroSection() {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // API endpoint removed - school folder deleted
        setHeroData(null);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return <SkeletonHero />;
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
    <section className="relative bg-gradient-to-br from-brand-sky/20 via-brand-off-white to-brand-lime/10 py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Star className="w-8 h-8 text-brand-lime animate-wiggle" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce-gentle">
          <Heart className="w-6 h-6 text-brand-coral" />
        </div>
        <div
          className="absolute bottom-20 left-20 animate-float"
          style={{ animationDelay: '1s' }}
        >
          <Sparkles className="w-10 h-10 text-brand-cyan animate-rainbow" />
        </div>
        <div
          className="absolute bottom-10 right-10 animate-bounce-gentle"
          style={{ animationDelay: '2s' }}
        >
          <Star className="w-7 h-7 text-brand-emerald" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-brand-emerald">{heroData.title}</span>
              <br />
              <span className="text-brand-warm-brown">{heroData.subtitle}</span>
              <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                {heroData.description}
              </span>
            </h1>

            <p className="text-xl text-brand-gray leading-relaxed font-medium">
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
                      ? 'bg-brand-emerald hover:bg-brand-cyan text-brand-off-white px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300'
                      : 'flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white px-8 py-4 text-lg font-bold rounded-full transition-all duration-300'
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
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-coral via-brand-cyan to-brand-emerald rounded-3xl opacity-20 animate-pulse"></div>
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
              <div className="absolute -top-2 -left-2 bg-brand-lime rounded-full p-2 animate-bounce-gentle">
                <span className="text-2xl">📚</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-brand-coral rounded-full p-2 animate-wiggle">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="absolute -bottom-2 -left-2 bg-brand-cyan rounded-full p-2 animate-float">
                <span className="text-2xl">🎨</span>
              </div>
              <div
                className="absolute -bottom-2 -right-2 bg-brand-emerald rounded-full p-2 animate-bounce-gentle"
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
