'use client';

import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';

export default function Page() {
  const [kelasEksplorasiData, setKelasEksplorasiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelasEksplorasiData = async () => {
      try {
        const response = await fetch('/api/programs/kelas-eksplorasi');
        const data = await response.json();
        setKelasEksplorasiData(data);
      } catch (error) {
        console.error('Error fetching kelas-eksplorasi data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKelasEksplorasiData();
  }, []);

  if (loading) {
    return (
      <div>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Loading...</h1>
          </div>
        </section>
        <FoundationFooter />
      </div>
    );
  }

  if (!kelasEksplorasiData) {
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
            <span className="text-foreground">Kelas Eksplorasi</span>
          </nav>

          <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
                {kelasEksplorasiData.title}
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {kelasEksplorasiData.description}
              </p>
              <ul className="mt-6 list-disc pl-5 text-muted-foreground">
                {kelasEksplorasiData.features.map(
                  (feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  )
                )}
              </ul>
              <div className="mt-6 flex gap-3">
                {kelasEksplorasiData.buttons.map((button: any, index: number) =>
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
                src={kelasEksplorasiData.image}
                alt={kelasEksplorasiData.imageAlt}
                className="h-auto w-full rounded-md"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {kelasEksplorasiData.details.map((detail: any, index: number) => (
              <div key={index} className="rounded-lg border bg-card p-5">
                <h3 className="font-semibold">{detail.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
