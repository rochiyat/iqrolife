'use client';

import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import FoundationFooter from '@/components/foundation-footer';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  const [kelasEksplorasiData, setKelasEksplorasiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const programs = [
    'Kidsventure: Museum Layang-Layang',
    'Mengenal Siklus Ikan, Sampai ke Meja Makan',
    'Jelajah Alam: Lingkungan Lestari, Hidupi Generasi',
    'Artventure: Fun Clay & Membatik',
    'Crafting Class: Menjahit dengan Kain Fanel',
    'Minggu Bersama Ayah: Trekking, Edukasi Kopi',
    'Membuat Main Tradisional',
    'Pop Up Book for Kids',
  ];

  const galleryImages = [
    {
      src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-003.jpg',
      alt: 'Jelajah Museum - Mengenal Sejarah',
    },
    {
      src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-007.jpg',
      alt: 'Minggu Bersama Ayah - Quality Time',
    },
    {
      src: '/program/kelas-eksplorasi/jelajah-air/jelajah-air-001.jpg',
      alt: 'Jelajah Air - Petualangan Seru',
    },
    {
      src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-008.jpg',
      alt: 'Eksplorasi Museum - Belajar Budaya',
    },
    {
      src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-012.jpg',
      alt: 'Kegiatan Outdoor Bersama Ayah',
    },
    {
      src: '/program/kelas-eksplorasi/jelajah-air/jelajah-air-004.jpg',
      alt: 'Jelajah Air - Mengenal Ekosistem',
    },
    {
      src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-005.jpg',
      alt: 'Museum Tour - Edukasi Interaktif',
    },
    {
      src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-016.jpg',
      alt: 'Bonding Ayah dan Anak',
    },
    {
      src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-010.jpg',
      alt: 'Jelajah Museum - Eksplorasi Pengetahuan',
    },
    {
      src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-019.jpg',
      alt: 'Minggu Bersama Ayah - Aktivitas Seru',
    },
  ];

  const handlePrevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'Escape') setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, galleryImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-16 inline-block bg-gray-300" />
            <Skeleton className="h-4 w-2 inline-block bg-gray-300" />
            <Skeleton className="h-4 w-32 inline-block bg-gray-300" />
          </nav>
          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#4caade]/30 shadow-xl">
              <CardContent className="p-8">
                <Skeleton className="h-10 w-3/4 mb-6 bg-gradient-to-r from-[#4caade]/50 to-[#f2cd5b]/50" />
                <Skeleton className="h-6 w-full mb-4 bg-gradient-to-r from-sky-200 to-blue-200" />
                <Skeleton className="h-6 w-5/6 mb-8 bg-gradient-to-r from-blue-200 to-indigo-200" />
                <Skeleton className="h-8 w-48 mb-4 bg-gradient-to-r from-cyan-400 to-sky-400" />
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 rounded-full bg-cyan-300" />
                      <Skeleton className="h-4 w-64 bg-gray-200" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Skeleton className="h-10 w-32 bg-gradient-to-r from-cyan-300 to-sky-300" />
                  <Skeleton className="h-10 w-36 bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery Skeleton */}
          <div className="mt-12">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-cyan-200 shadow-xl">
              <CardContent className="p-8">
                <Skeleton className="h-8 w-48 mb-6 bg-gradient-to-r from-cyan-300 to-sky-300" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-square rounded-lg bg-gradient-to-br from-cyan-200 to-blue-200" />
                      <Skeleton className="h-4 w-full mt-2 bg-gray-200" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold mb-6 text-primary">
                  {kelasEksplorasiData.title}
                </h1>

                <div className="mb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Program pendidikan dimana teman Iqrolife akan dipaparkan
                    dengan berbagai hal tentang bagaimana dunia bekerja dan
                    dikenalkan dengan berbagai tokoh dan profesi yang ada di
                    dunia.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">
                    Program yang sudah berjalan
                  </h2>
                  <ul className="space-y-3">
                    {programs.map((program, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{program}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex gap-3">
                  <Link href="/kontak">
                    <Button>Hubungi Kami</Button>
                  </Link>
                  <Link href="/program">
                    <Button variant="outline">Lihat Program Lain</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery Section */}
          <div className="mt-12">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  Galeri Kegiatan
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div
                        className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm text-center text-muted-foreground line-clamp-2">
                        {image.alt}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Modal */}
          {selectedImage !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>

              <button
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
              >
                <ChevronLeft className="w-12 h-12" />
              </button>

              <button
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
              >
                <ChevronRight className="w-12 h-12" />
              </button>

              <div
                className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={galleryImages[selectedImage].src}
                    alt={galleryImages[selectedImage].alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white text-lg font-medium">
                    {galleryImages[selectedImage].alt}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
                {selectedImage + 1} / {galleryImages.length}
              </div>
            </div>
          )}
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
