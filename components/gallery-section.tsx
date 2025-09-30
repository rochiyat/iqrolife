'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      src: '/school-building-exterior.png',
      alt: 'Gedung Sekolah Iqrolife',
      desc: 'Lingkungan sekolah yang asri dan nyaman',
    },
    {
      src: '/classroom-learning.png',
      alt: 'Suasana Pembelajaran',
      desc: 'Kegiatan belajar yang interaktif dan menyenangkan',
    },
    {
      src: '/placeholder-0vs98.png',
      alt: 'Area Bermain Siswa',
      desc: 'Fasilitas bermain untuk mengembangkan motorik anak',
    },
    {
      src: '/school-library-with-books.jpg',
      alt: 'Perpustakaan Sekolah',
      desc: 'Perpustakaan lengkap untuk menumbuhkan minat baca',
    },
    {
      src: '/science-laboratory.png',
      alt: 'Laboratorium Sains',
      desc: 'Lab sains modern untuk eksperimen dan penelitian',
    },
    {
      src: '/placeholder-23ct9.png',
      alt: 'Wisuda Siswa',
      desc: 'Momen kelulusan yang membanggakan',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Gallery Sekolah Iqrolife
          </h2>
          <p className="text-xl text-gray-600">
            Dokumentasi kegiatan dan fasilitas Sekolah Iqrolife
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(index)}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={image.src || '/placeholder.svg'}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">{image.alt}</h3>
                      <p className="text-sm text-white/90">{image.desc}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                <h3 className="text-white font-semibold text-lg">
                  {galleryImages[selectedImage].alt}
                </h3>
                <p className="text-white/90">
                  {galleryImages[selectedImage].desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
