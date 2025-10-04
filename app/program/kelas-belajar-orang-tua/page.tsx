'use client';

import FoundationFooter from '@/components/foundation-footer';
import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function Page() {
  const [kelasBelajarOrangTuaData, setKelasBelajarOrangTuaData] =
    useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelasBelajarOrangTuaData = async () => {
      try {
        const response = await fetch('/api/programs/kelas-belajar-orang-tua');
        const data = await response.json();
        setKelasBelajarOrangTuaData(data);
      } catch (error) {
        console.error('Error fetching kelas-belajar-orang-tua data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKelasBelajarOrangTuaData();
  }, []);

  if (loading) {
    return (
      <div>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-sm text-muted-foreground mb-4">
            <Skeleton className="h-4 w-16 inline-block" />
            <Skeleton className="h-4 w-2 inline-block mx-2" />
            <Skeleton className="h-4 w-32 inline-block" />
          </nav>

          <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
            <div>
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-5/6 mb-4" />
              <ul className="mt-6 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Skeleton className="w-1.5 h-1.5 rounded-full mt-2" />
                    <Skeleton className="h-4 w-32" />
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>
        <FoundationFooter />
      </div>
    );
  }

  if (!kelasBelajarOrangTuaData) {
    return (
      <div>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Error loading page</h1>
          </div>
        </section>
        <FoundationFooter />
      </div>
    );
  }
  return (
    <div>
      <main>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-sm text-muted-foreground">
            <Link href="/program" className="hover:text-primary">
              Program
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Kelas Belajar Orang Tua</span>
          </nav>

          <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
                {kelasBelajarOrangTuaData.title}
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {kelasBelajarOrangTuaData.description}
              </p>
              <ul className="mt-6 list-disc pl-5 text-muted-foreground">
                {kelasBelajarOrangTuaData.features.map(
                  (feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  )
                )}
              </ul>
              <div className="mt-6 flex gap-3">
                {kelasBelajarOrangTuaData.buttons.map(
                  (button: any, index: number) =>
                    button.href ? (
                      <Link key={index} href={button.href}>
                        <Button variant={button.variant}>{button.text}</Button>
                      </Link>
                    ) : (
                      <Button key={index} variant={button.variant}>
                        {button.text}
                      </Button>
                    )
                )}
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <img
                src={kelasBelajarOrangTuaData.image}
                alt={kelasBelajarOrangTuaData.imageAlt}
                className="h-auto w-full rounded-md"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {kelasBelajarOrangTuaData.details.map(
              (detail: any, index: number) => (
                <div key={index} className="rounded-lg border bg-card p-5">
                  <h3 className="font-semibold">{detail.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {detail.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
