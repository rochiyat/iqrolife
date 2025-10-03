'use client';

import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
      <main>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Loading...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!programsData) {
    return (
      <main>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Error loading page</h1>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
              {programsData.hero.title}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {programsData.hero.description}
            </p>
            <div className="mt-6">
              <Button className="transition-transform hover:-translate-y-0.5">
                {programsData.hero.button.text}
              </Button>
            </div>
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
          {programsData.programs.map((p: any) => (
            <Link
              key={p.title}
              href={p.href}
              className="group rounded-lg border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={p.title}
            >
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">
                Pelajari lebih lanjut →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
