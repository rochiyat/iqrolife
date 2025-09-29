import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function GallerySection() {
  const galleryImages = [
    {
      src: "/school-building-exterior.png",
      alt: "Gedung Sekolah Iqrolife",
    },
    {
      src: "/classroom-learning.png",
      alt: "Suasana Pembelajaran",
    },
    {
      src: "/placeholder-0vs98.png",
      alt: "Area Bermain Siswa",
    },
    {
      src: "/school-library-with-books.jpg",
      alt: "Perpustakaan Sekolah",
    },
    {
      src: "/science-laboratory.png",
      alt: "Laboratorium Sains",
    },
    {
      src: "/placeholder-23ct9.png",
      alt: "Wisuda Siswa",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Gallery Sekolah Iqrolife</h2>
          <p className="text-xl text-gray-600">Dokumentasi kegiatan dan fasilitas Sekolah Iqrolife</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-[4/3] relative">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
