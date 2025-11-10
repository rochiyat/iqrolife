'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function KelasAqilBalighPage() {
  const [kelasAqilBalighData, setKelasAqilBalighData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const programs = ['Pemuda Peduli, Pemuda Beraksi', 'Magang Kuliner'];

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=600&fit=crop',
      alt: 'Kegiatan pemuda peduli',
    },
    {
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      alt: 'Aksi sosial pemuda',
    },
    {
      src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
      alt: 'Magang kuliner',
    },
    {
      src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop',
      alt: 'Pembelajaran kuliner',
    },
    {
      src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
      alt: 'Kegiatan sosial masyarakat',
    },
    {
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      alt: 'Pemuda beraksi',
    },
    {
      src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      alt: 'Praktik kuliner',
    },
    {
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      alt: 'Kegiatan amal kebaikan',
    },
    {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      alt: 'Pelatihan kuliner',
    },
    {
      src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
      alt: 'Keterlibatan sosial pemuda',
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
    const fetchKelasAqilBalighData = async () => {
      try {
        const response = await fetch('/api/programs/kelas-aqil-baligh');
        const data = await response.json();
        setKelasAqilBalighData(data);
      } catch (error) {
        console.error('Error fetching kelas-aqil-baligh data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKelasAqilBalighData();
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
      <div>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-sm text-muted-foreground mb-4">
            <Skeleton className="h-4 w-16 inline-block" />
            <Skeleton className="h-4 w-2 inline-block mx-2" />
            <Skeleton className="h-4 w-24 inline-block" />
          </nav>
          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <Skeleton className="h-10 w-3/4 mb-6" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-5/6 mb-8" />
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="h-4 w-48" />
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

  if (!kelasAqilBalighData) {
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
            <span className="text-foreground">Kelas Aqil Baligh</span>
          </nav>

          <div className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold mb-6 text-primary">
                  {kelasAqilBalighData.title}
                </h1>

                <div className="mb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Program pendidikan guna mempersiapkan teman iqrolife menuju
                    tahapan aqil balighnya dengan pendalaman bidang keahlian,
                    menguatkan kesadaran tanggung jawab & kedewasaan, serta
                    keterlibatan pada kegiatan sosial dan amal kebaikan di
                    tengah masyarakat.
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
                  <Link href="/contact">
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
