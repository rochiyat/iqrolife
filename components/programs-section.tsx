'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Gamepad2, Home, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SkeletonPrograms } from '@/components/ui/skeleton-loading';

const iconMap = {
  BookOpen,
  Users,
  Gamepad2,
  Home,
};

export default function ProgramsSection() {
  const [programsData, setProgramsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        // API endpoint removed - school folder deleted
        setProgramsData(null);
      } catch (error) {
        console.error('Error fetching programs data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsData();
  }, []);

  if (loading) {
    return <SkeletonPrograms />;
  }

  if (!programsData) {
    return (
      <section className="py-20 bg-gradient-to-br from-fun-yellow/10 via-white to-fun-pink/10 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading programs data
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#f2cd5b]/15 via-white to-[#4caade]/15 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Star className="w-6 h-6 text-[#f2cd5b]/40" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce-gentle">
          <Star className="w-8 h-8 text-[#4caade]/40" />
        </div>
        <div className="absolute bottom-20 left-20 animate-wiggle">
          <Star className="w-7 h-7 text-[#f2cd5b]/40" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-bounce-gentle">
            <span className="bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
              {programsData.title}
            </span>
            <br />
            <span className="text-[#4caade]">{programsData.subtitle}</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            {programsData.description}
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-3xl mx-auto">
          {programsData.items?.map((program: any, index: number) => {
            const IconComponent =
              iconMap[program.icon as keyof typeof iconMap] || BookOpen;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-2xl transition-all duration-500 group fun-hover border-0 overflow-hidden relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-90`}
                ></div>

                <CardContent className="p-8 relative z-10">
                  <div className="relative mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-bounce-gentle">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-wiggle">
                      {program.emoji}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
                    {program.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed font-medium text-lg">
                    {program.description}
                  </p>

                  <div className="flex justify-center mt-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-white/60 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
