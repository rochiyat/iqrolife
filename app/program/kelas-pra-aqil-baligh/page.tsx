'use client';

import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton-loading';
import { useState, useEffect } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for static content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-16 inline-block bg-gray-300" />
            <Skeleton className="h-4 w-2 inline-block bg-gray-300" />
            <Skeleton className="h-4 w-40 inline-block bg-gray-300" />
          </nav>

          <div className="mt-4 grid items-start gap-8 md:grid-cols-2 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <div>
              <Skeleton className="h-10 w-3/4 mb-3 bg-gradient-to-r from-indigo-300 to-violet-300" />
              <Skeleton className="h-6 w-full mb-2 bg-gradient-to-r from-violet-200 to-purple-200" />
              <Skeleton className="h-6 w-5/6 mb-4 bg-gradient-to-r from-purple-200 to-pink-200" />
              <ul className="mt-6 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Skeleton className="w-1.5 h-1.5 rounded-full mt-2 bg-indigo-300" />
                    <Skeleton className="h-4 w-48 bg-gray-200" />
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Skeleton className="h-10 w-24 bg-gradient-to-r from-indigo-300 to-violet-300" />
                <Skeleton className="h-10 w-20 bg-gray-200" />
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-4 shadow-sm">
              <Skeleton className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300" />
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-indigo-200 p-6 shadow-md"
              >
                <Skeleton className="h-6 w-3/4 mb-2 bg-gradient-to-r from-indigo-300 to-violet-300" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-2/3 bg-gray-200" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <nav className="text-sm text-muted-foreground">
          <Link href="/program" className="hover:text-primary">
            Program
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Kelas Pra Aqil Baligh</span>
        </nav>

        <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
              Kelas Pra Aqil Baligh
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Kelas pendampingan menjelang baligh yang menekankan kesiapan adab,
              tanggung jawab, kemampuan mengambil keputusan, serta pemahaman
              keislaman dasar yang membumi pada kehidupan remaja.
            </p>
            <ul className="mt-6 list-disc pl-5 text-muted-foreground">
              <li>Adab pergaulan, amanah, dan kebiasaan baik remaja</li>
              <li>Manajemen diri: waktu, emosi, dan konsistensi ibadah</li>
              <li>Diskusi tematik: identitas, peran sosial, dan kontribusi</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button>Daftar Minat</Button>
              <Button variant="outline" asChild>
                <Link href="/kontak">Konsultasi</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <img
              src="/kelas-pra-aqil-baligh-pembinaan-remaja.jpg"
              alt="Kegiatan Kelas Pra Aqil Baligh"
              className="h-auto w-full rounded-md"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Tujuan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Remaja siap memasuki fase baligh dengan pondasi adab, ibadah, dan
              tanggung jawab.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Metode</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Diskusi interaktif, proyek kelompok, mentoring, dan pembiasaan.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Output</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tumbuhnya karakter, kemandirian, dan kepekaan sosial remaja.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
