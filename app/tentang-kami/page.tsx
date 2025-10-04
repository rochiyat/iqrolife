'use client';

import FoundationFooter from '@/components/foundation-footer';
import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function Page() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div>
        <FoundationHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
          <div className="mt-16">
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-5 shadow-sm"
                >
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div>
        <FoundationHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Error loading page</h1>
          </div>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  return (
    <div>
      <main>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
                {aboutData.hero.title}
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {aboutData.hero.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {aboutData.hero.buttons.map((button: any, index: number) => (
                  <Button
                    key={index}
                    variant={button.variant}
                    asChild={button.href ? true : undefined}
                    className={`transition-transform hover:-translate-y-0.5 ${
                      button.variant === 'outline' ? 'bg-transparent' : ''
                    }`}
                  >
                    {button.href ? (
                      <a href={button.href}>{button.text}</a>
                    ) : (
                      button.text
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="rounded-lg border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <img
                  src={aboutData.hero.image}
                  alt={aboutData.hero.imageAlt}
                  className="h-auto w-full rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="grid gap-6 md:grid-cols-3">
              {aboutData.values.map((item: any) => (
                <div
                  key={item.title}
                  className="rounded-lg border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
