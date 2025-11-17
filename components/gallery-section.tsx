'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

const galleryImages = [
  {
    src: '/gallery/gallery-001.jpg',
    alt: 'Kegiatan Komunitas',
    caption: 'Momen berharga bersama komunitas',
  },
  {
    src: '/gallery/gallery-003.jpg',
    alt: 'Aktivitas Pembelajaran',
    caption: 'Aktivitas pembelajaran yang menyenangkan',
  },
  {
    src: '/program/kelas-belajar-orang-tua/family-camp/family-camp-005.jpg',
    alt: 'Family Camp',
    caption: 'Kebersamaan keluarga dalam Family Camp',
  },
  {
    src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-008.jpg',
    alt: 'Minggu Bersama Ayah',
    caption: 'Quality time ayah dan anak',
  },
  {
    src: '/gallery/gallery-005.jpg',
    alt: 'Kebersamaan Belajar',
    caption: 'Kebersamaan dalam belajar',
  },
  {
    src: '/program/kelas-siap-sekolah/kelas-bermain/kelas-bermain-003.jpg',
    alt: 'Kelas Bermain',
    caption: 'Bermain sambil belajar di Kelas Bermain',
  },
  {
    src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-006.jpg',
    alt: 'Jelajah Museum',
    caption: 'Eksplorasi pengetahuan di museum',
  },
  {
    src: '/gallery/gallery-007.jpg',
    alt: 'Pengalaman Bermakna',
    caption: 'Pengalaman belajar yang bermakna',
  },
  {
    src: '/program/kelas-belajar-orang-tua/fbe/fbe-004.jpg',
    alt: 'Fitrah Based Education',
    caption: 'Workshop FBE untuk orang tua',
  },
  {
    src: '/program/kelas-aqil-baligh/magang-kuliner/magang-kuliner-007.jpg',
    alt: 'Magang Kuliner',
    caption: 'Belajar keterampilan kuliner',
  },
  {
    src: '/program/kelas-eksplorasi/jelajah-air/jelajah-air-002.jpg',
    alt: 'Jelajah Air',
    caption: 'Petualangan seru di Jelajah Air',
  },
  {
    src: '/program/kelas-siap-sekolah/siap-sekolah-002.jpg',
    alt: 'Kelas Siap Sekolah',
    caption: 'Persiapan memasuki jenjang sekolah',
  },
  {
    src: '/program/kelas-belajar-orang-tua/family-camp/family-camp-011.jpg',
    alt: 'Family Camp Activities',
    caption: 'Aktivitas seru di Family Camp',
  },
  {
    src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-015.jpg',
    alt: 'Bonding Ayah dan Anak',
    caption: 'Mempererat ikatan ayah dan anak',
  },
  {
    src: '/gallery/gallery-006.jpg',
    alt: 'Kreativitas Anak',
    caption: 'Eksplorasi dan kreativitas',
  },
  {
    src: '/program/kelas-siap-sekolah/level/level-002.jpg',
    alt: 'Program Level',
    caption: 'Pembelajaran bertahap sesuai level',
  },
  {
    src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-009.jpg',
    alt: 'Eksplorasi Museum',
    caption: 'Mengenal sejarah dan budaya',
  },
  {
    src: '/program/kelas-aqil-baligh/magang-kuliner/magang-kuliner-003.jpg',
    alt: 'Praktik Kuliner',
    caption: 'Mengasah keterampilan memasak',
  },
  {
    src: '/program/kelas-siap-sekolah/kelas-bermain/kelas-bermain-006.jpg',
    alt: 'Bermain dan Belajar',
    caption: 'Tumbuh kembang melalui bermain',
  },
  {
    src: '/gallery/gallery-008.jpg',
    alt: 'Kebahagiaan Bersama',
    caption: 'Senyum dan kebahagiaan bersama',
  },
];

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Galeri Kegiatan
          </h2>
          <p className="text-xl text-gray-600">
            Dokumentasi kegiatan dan momen berharga komunitas kami
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Previous Button */}
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) =>
                  (prev - 1 + galleryImages.length) % galleryImages.length
              )
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-brand-emerald/30 flex items-center justify-center text-gray-700 hover:bg-brand-emerald/10 hover:scale-110 transition-all duration-300 group"
            aria-label="Previous image"
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
              setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-brand-emerald/30 flex items-center justify-center text-gray-700 hover:bg-brand-emerald/10 hover:scale-110 transition-all duration-300 group"
            aria-label="Next image"
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

          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-500 animate-scale-in overflow-hidden p-6">
            <div
              className="relative h-[500px] cursor-pointer group overflow-hidden rounded-lg"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
              }
            >
              <Image
                src={galleryImages[currentIndex].src || '/placeholder.svg'}
                alt={galleryImages[currentIndex].alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {galleryImages[currentIndex].alt}
                </h3>
                <p className="text-sm text-white/90">
                  {galleryImages[currentIndex].caption}
                </p>
              </div>
              <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
            </div>
          </Card>

          <div className="flex justify-center mt-8 gap-3">
            {galleryImages.map((_: any, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 animate-pulse border-0 cursor-pointer ${
                  index === currentIndex
                    ? 'bg-brand-emerald scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
