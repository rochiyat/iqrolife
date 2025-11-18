'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonialsData = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonialsData(data);
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonialsData();
  }, []);

  useEffect(() => {
    if (testimonialsData && testimonialsData.items) {
      const timer = setInterval(() => {
        setCurrentTestimonial(
          (prev) => (prev + 1) % testimonialsData.items.length
        );
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonialsData]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-yellow-200">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <Skeleton className="w-24 h-24 rounded-full" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-6 h-6 mr-1" />
                      ))}
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-4 h-4 rounded-full" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-6 w-8 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonialsData) {
    return (
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading testimonials
            </h2>
          </div>
        </div>
      </section>
    );
  }

  const testimonials = testimonialsData.items;

  return (
    <section
      id="testimoni"
      className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">
          ⭐
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">
          🌟
        </div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">
          ✨
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">
          💫
        </div>
        <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">
          🎈
        </div>
        <div className="absolute top-1/3 right-5 text-2xl animate-wiggle delay-700">
          🎈
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
            💝 {testimonialsData.title} 💝
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up">
            {testimonialsData.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Previous Button */}
          <button
            onClick={() =>
              setCurrentTestimonial(
                (prev) => (prev - 1 + testimonials.length) % testimonials.length
              )
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-yellow-300 flex items-center justify-center text-gray-700 hover:bg-yellow-50 hover:scale-110 transition-all duration-300 group"
            aria-label="Previous testimonial"
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
            onClick={() =>
              setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-yellow-300 flex items-center justify-center text-gray-700 hover:bg-yellow-50 hover:scale-110 transition-all duration-300 group"
            aria-label="Next testimonial"
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

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-yellow-200 hover:shadow-2xl transition-all duration-500 animate-scale-in">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      testimonials[currentTestimonial].avatar ||
                      '/placeholder.svg'
                    }
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full border-4 border-yellow-300 shadow-lg animate-wiggle"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-3">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      )
                    )}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-primary font-medium">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_: any, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 animate-pulse border-0 cursor-pointer ${
                  index === currentTestimonial
                    ? 'bg-primary scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
