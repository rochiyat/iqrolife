import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PPDBPage() {
  const programs = [
    {
      level: "KB-TK Iqrolife",
      age: "3-6 tahun",
      fee: "Rp 15.000.000",
      color: "bg-blue-100 text-blue-800",
    },
    {
      level: "SD Iqrolife",
      age: "6-12 tahun",
      fee: "Rp 18.000.000",
      color: "bg-green-100 text-green-800",
    },
    {
      level: "SMP Iqrolife",
      age: "12-15 tahun",
      fee: "Rp 20.000.000",
      color: "bg-orange-100 text-orange-800",
    },
    {
      level: "Homeschooling",
      age: "6-15 tahun",
      fee: "Rp 12.000.000",
      color: "bg-purple-100 text-purple-800",
    },
  ]

  const requirements = [
    "Fotokopi Akta Kelahiran",
    "Fotokopi Kartu Keluarga",
    "Pas Foto 3x4 (4 lembar)",
    "Fotokopi Ijazah/SKHUN (untuk SD & SMP)",
    "Surat Keterangan Sehat dari Dokter",
    "Formulir Pendaftaran yang telah diisi",
  ]

  const timeline = [
    {
      phase: "Pendaftaran",
      date: "Januari - Maret 2025",
      description: "Pengisian formulir dan pengumpulan berkas",
    },
    {
      phase: "Tes Masuk",
      date: "April 2025",
      description: "Tes akademik dan wawancara",
    },
    {
      phase: "Pengumuman",
      date: "Mei 2025",
      description: "Pengumuman hasil seleksi",
    },
    {
      phase: "Daftar Ulang",
      date: "Juni 2025",
      description: "Pembayaran dan daftar ulang",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🎓</div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">📝</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">🌟</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">🎉</div>
            <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">🎈</div>
            <div className="absolute top-1/3 right-5 text-2xl animate-wiggle delay-700">🎈</div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <Badge className="mb-4 bg-orange-200 text-orange-800 animate-bounce">PPDB 2025/2026</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-bounce-gentle">
                🎒 Penerimaan Peserta Didik Baru 🎒
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up">
                Bergabunglah dengan Sekolah Iqrolife dan wujudkan masa depan gemilang putra-putri Anda bersama kami! ✨
              </p>
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 animate-bounce-gentle hover:scale-105 transition-all duration-300"
              >
                🚀 Daftar Sekarang 🚀
              </Button>
            </div>
          </div>
        </section>

        {/* Programs & Fees */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                📚 Program & Biaya Pendidikan 📚
              </h2>
              <p className="text-xl text-gray-600">
                Pilih program pendidikan yang sesuai untuk putra-putri tercinta Anda
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-yellow-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <Badge className={`mb-2 ${program.color} animate-pulse`}>{program.age}</Badge>
                    <CardTitle className="text-xl text-primary">{program.level}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-4">{program.fee}</div>
                    <p className="text-sm text-gray-600 mb-4">*Biaya per tahun</p>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      💡 Info Detail
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fade-in-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">📋 Persyaratan Pendaftaran 📋</h2>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-start animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 animate-bounce">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{requirement}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-fade-in-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">📅 Timeline PPDB 📅</h2>
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold animate-bounce">
                          {index + 1}
                        </div>
                        {index < timeline.length - 1 && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.phase}</h3>
                        <p className="text-orange-600 font-medium">{item.date}</p>
                        <p className="text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                😊 Anak-Anak Bahagia di Iqrolife 😊
              </h2>
              <p className="text-xl text-gray-600">
                Lihat kegembiraan anak-anak yang sudah bergabung dengan keluarga besar Iqrolife
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in-up">
                <img
                  src="https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=400&h=300&fit=crop"
                  alt="Anak-anak KB-TK sedang belajar membaca dengan gembira"
                  className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📖 Belajar Membaca</h3>
                <p className="text-gray-600">Metode pembelajaran yang menyenangkan</p>
              </div>
              <div className="text-center animate-fade-in-up delay-200">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                  alt="Anak-anak KB-TK bermain dan belajar bersama"
                  className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float delay-300"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🤝 Bermain Bersama</h3>
                <p className="text-gray-600">Mengembangkan kemampuan sosial anak</p>
              </div>
              <div className="text-center animate-fade-in-up delay-300">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop"
                  alt="Anak-anak KB-TK dalam kegiatan pembelajaran kreatif"
                  className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float delay-500"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎨 Aktivitas Kreatif</h3>
                <p className="text-gray-600">Mengasah kreativitas dan imajinasi</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-3xl animate-pulse">⭐</div>
            <div className="absolute top-20 right-20 text-3xl animate-bounce">🌟</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-pulse delay-300">✨</div>
            <div className="absolute bottom-10 right-10 text-3xl animate-bounce delay-500">💫</div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4 animate-bounce-gentle">
              🎉 Siap Bergabung dengan Sekolah Iqrolife? 🎉
            </h2>
            <p className="text-xl text-blue-100 mb-8 animate-fade-in-up">
              Hubungi kami untuk informasi lebih lanjut atau langsung daftar online untuk masa depan cerah anak Anda!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 animate-bounce-gentle hover:scale-105 transition-all duration-300"
              >
                🚀 Daftar Online
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent animate-bounce-gentle hover:scale-105 transition-all duration-300"
              >
                <a href="https://wa.me/628111202244" target="_blank" rel="noopener noreferrer">
                  💬 Hubungi via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
