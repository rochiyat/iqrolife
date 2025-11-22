'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Button } from '@/components/ui/button';
import { ProgramIcon } from '@/lib/utils/program-icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function Page() {
  const [programsData, setProgramsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        const response = await fetch('/api/programs/page');
        const data = await response.json();
        setProgramsData(data);
      } catch (error) {
        console.error('Error fetching programs data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main>
          <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="grid items-center gap-8 md:grid-cols-2 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-10">
              <div>
                <Skeleton className="h-10 w-3/4 mb-3 bg-gradient-to-r from-blue-200 to-purple-200" />
                <Skeleton className="h-6 w-full mb-2 bg-gradient-to-r from-purple-200 to-pink-200" />
                <Skeleton className="h-6 w-5/6 mb-4 bg-gradient-to-r from-pink-200 to-orange-200" />
                <Skeleton className="h-12 w-32 bg-gradient-to-r from-blue-300 to-purple-300" />
              </div>
              <div className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-4 shadow-sm">
                <Skeleton className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300" />
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-gray-200 p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <Skeleton className="h-12 w-12 rounded-full mb-3 bg-gradient-to-br from-blue-300 to-purple-300" />
                  <Skeleton className="h-6 w-3/4 mb-3 bg-gradient-to-r from-gray-300 to-gray-400" />
                  <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-2/3 mb-4 bg-gray-200" />
                  <Skeleton className="h-4 w-32 bg-gradient-to-r from-blue-200 to-purple-200" />
                </div>
              ))}
            </div>
          </section>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!programsData) {
    return (
      <div>
        <FoundationHeader />
        <main>
          <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="text-center">
              <h1 className="text-3xl font-semibold">Error loading page</h1>
            </div>
          </section>
        </main>
        <FoundationFooter />
      </div>
    );
  }
  return (
    <div>
      <FoundationHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
                {programsData.hero.title}
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {programsData.hero.description}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <img
                src={programsData.hero.image}
                alt={programsData.hero.imageAlt}
                className="h-auto w-full rounded-md"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {programsData.programs.map((p: any) => {
              const isGradient = p.color && p.color.includes('from-');
              const bgClass = isGradient
                ? `bg-gradient-to-br ${p.color}`
                : `bg-${p.color || 'brand-emerald'}`;

              return (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group rounded-lg border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={p.title}
                >
                  <div className="mb-3">
                    <div
                      className={`w-12 h-12 ${bgClass} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <ProgramIcon
                        iconName={p.icon || 'book'}
                        className="w-6 h-6 text-white"
                      />
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                    Pelajari lebih lanjut →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
