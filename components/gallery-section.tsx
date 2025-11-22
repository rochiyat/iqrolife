'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

const galleryImages = [
  {
    src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-008.jpg',
    alt: 'Minggu Bersama Ayah',
    caption: 'Quality time ayah dan anak dalam kegiatan outdoor',
  },
  {
    src: '/program/kelas-belajar-orang-tua/family-camp/family-camp-005.jpg',
    alt: 'Family Camp',
    caption: 'Kebersamaan keluarga dalam Family Camp',
  },
  {
    src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-007.jpg',
    alt: 'Aktivitas Ayah dan Anak',
    caption: 'Membangun bonding melalui kegiatan bersama',
  },
  {
    src: '/program/kelas-belajar-orang-tua/family-camp/family-camp-009.jpg',
    alt: 'Kegiatan Family Camp',
    caption: 'Momen berharga bersama keluarga',
  },
  {
    src: '/program/kelas-eksplorasi/jelajah-museum/jelajah-museum-003.jpg',
    alt: 'Eksplorasi Museum Layang Layang',
    caption: 'Petualangan seru anak di museum',
  },
  {
    src: '/program/kelas-belajar-orang-tua/family-camp/family-camp-011.jpg',
    alt: 'Family Camp Activities',
    caption: 'Aktivitas edukatif untuk seluruh keluarga',
  },
  {
    src: '/program/kelas-eksplorasi/minggu-bersama-ayah/minggu-bersama-ayah-019.jpg',
    alt: 'Kebersamaan Ayah dan Anak',
    caption: 'Mempererat ikatan ayah dan anak',
  },
  {
    src: '/program/kelas-aqil-baligh/magang-kuliner/magang-kuliner-001.jpg',
    alt: 'Momen Magang Kuliner',
    caption: 'Belajar keterampilan kuliner',
  },
  {
    src: '/program/mentoring-ayah/minisoccer/minisoccer-001.jpg',
    alt: 'Mini Soccer',
    caption: 'Main Mini Soccer Bareng Ayah dan Anak',
  },
  {
    src: '/program/mentoring-ibu/mentoring-ibu-004.jpg',
    alt: 'Mentoring Ibu',
    caption: 'Pendampingan intensif untuk para ibu',
  },
  {
    src: '/program/family-talent-discovery/family-talent-discovery-002.jpg',
    alt: 'Family Talent Discovery',
    caption: 'Menggali potensi dan bakat keluarga',
  },
  {
    src: '/program/family-talent-discovery/family-talent-discovery-005.jpg',
    alt: 'Family Talent Discovery',
    caption: 'Menemukan misi hidup bersama keluarga',
  },
  {
    src: '/program/kelas-belajar-orang-tua/family-camp/family-camp-004.jpg',
    alt: 'Family Camp',
    caption: 'Keseruan Permainan bersama keluarga',
  },
  {
    src: '/program/kelas-belajar-orang-tua/fbe/fbe-005.jpg',
    alt: 'Fitrah Based Education',
    caption: 'Sharing Session - Fitrah Based Education',
  },
  {
    src: '/gallery/gallery-008.jpg',
    alt: 'Kebahagiaan Bersama',
    caption: 'Senyum dan kebahagiaan dalam komunitas Iqrolife',
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
    <section id="galeri" className="py-16 bg-gray-50">
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
              className="relative h-[500px] cursor-pointer group overflow-hidden rounded-lg flex items-center justify-center bg-gray-50"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
              }
            >
              <Image
                src={galleryImages[currentIndex].src || '/placeholder.svg'}
                alt={galleryImages[currentIndex].alt}
                fill
                className="object-cover transition-transform duration-300"
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
