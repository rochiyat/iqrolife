"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Ibu Sarah Wijaya",
      child: "Aisyah (5 tahun)",
      rating: 5,
      text: "Alhamdulillah, Aisyah sangat senang belajar di Sekolah Iqrolife! Guru-gurunya sabar dan metode pembelajarannya menyenangkan. Aisyah jadi lebih mandiri dan hafalan Al-Qur'annya bertambah terus!",
      image: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e3?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Bapak Ahmad Rizki",
      child: "Faiz (4 tahun)",
      rating: 5,
      text: "Faiz dulu pemalu, tapi setelah masuk Iqrolife jadi lebih percaya diri. Aktivitas bermain sambil belajarnya sangat bagus untuk perkembangan anak. Terima kasih Sekolah Iqrolife!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Ibu Fatimah Sari",
      child: "Zahra (6 tahun)",
      rating: 5,
      text: "Zahra sudah siap masuk SD berkat persiapan yang matang di Iqrolife. Baca tulis Al-Qur'an sudah lancar, matematika dasar juga sudah bisa. Pokoknya recommended banget!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Ibu Dewi Lestari",
      child: "Kenzo (5 tahun)",
      rating: 5,
      text: "Kenzo jadi lebih disiplin dan sopan setelah sekolah di Iqrolife. Nilai-nilai Islam yang diajarkan sangat membantu membentuk karakter anak. Fasilitasnya juga lengkap dan bersih!",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">⭐</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">🌟</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">✨</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">💫</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">🎈</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-wiggle delay-700">🎈</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
            💝 Kata Orang Tua Tentang Kami 💝
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up">
            Testimoni dari orang tua yang telah mempercayakan pendidikan putra-putrinya kepada kami
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-yellow-200 hover:shadow-2xl transition-all duration-500 animate-scale-in">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full border-4 border-yellow-300 shadow-lg animate-wiggle"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-3">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                    <p className="text-primary font-medium">Orang tua dari {testimonials[currentTestimonial].child}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 animate-pulse ${
                  index === currentTestimonial ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center animate-bounce-gentle">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-gray-600">Siswa Bahagia</div>
            <div className="text-2xl">😊</div>
          </div>
          <div className="text-center animate-bounce-gentle delay-200">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-gray-600">Orang Tua Puas</div>
            <div className="text-2xl">👨‍👩‍👧‍👦</div>
          </div>
          <div className="text-center animate-bounce-gentle delay-300">
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-gray-600">Guru Berpengalaman</div>
            <div className="text-2xl">👩‍🏫</div>
          </div>
          <div className="text-center animate-bounce-gentle delay-500">
            <div className="text-4xl font-bold text-primary mb-2">5</div>
            <div className="text-gray-600">Tahun Berpengalaman</div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>
    </section>
  )
}
