import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomeschoolingPage() {
  const advantages = [
    {
      title: "Fleksibilitas Waktu",
      description: "Jadwal belajar yang dapat disesuaikan dengan kebutuhan keluarga",
      icon: "⏰",
    },
    {
      title: "Pembelajaran Personal",
      description: "Pendekatan pembelajaran yang disesuaikan dengan gaya belajar anak",
      icon: "👨‍🏫",
    },
    {
      title: "Kurikulum Terintegrasi",
      description: "Kombinasi kurikulum nasional dengan nilai-nilai islami",
      icon: "📚",
    },
    {
      title: "Bimbingan Profesional",
      description: "Didampingi oleh guru-guru berpengalaman dan berkualitas",
      icon: "🎓",
    },
  ]

  const packages = [
    {
      name: "Paket Basic",
      price: "Rp 8.000.000",
      features: [
        "Modul pembelajaran lengkap",
        "Konsultasi online mingguan",
        "Evaluasi bulanan",
        "Sertifikat kelulusan",
      ],
    },
    {
      name: "Paket Premium",
      price: "Rp 12.000.000",
      features: [
        "Semua fitur Basic",
        "Kunjungan guru ke rumah 2x/bulan",
        "Akses laboratorium virtual",
        "Kegiatan outdoor learning",
      ],
    },
    {
      name: "Paket Ultimate",
      price: "Rp 15.000.000",
      features: [
        "Semua fitur Premium",
        "Kunjungan guru ke rumah 4x/bulan",
        "Program ekstrakurikuler",
        "Konsultasi psikologi anak",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Homeschooling Kreativa
                  <br />
                  <span className="text-purple-600">Belajar di Rumah dengan Kualitas Sekolah</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Program pembelajaran fleksibel di rumah dengan bimbingan guru profesional dan kurikulum terstruktur
                  yang mengintegrasikan nilai-nilai islami.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Konsultasi Gratis
                  </Button>
                  <Button variant="outline" size="lg">
                    Download Brosur
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/classroom-learning.png"
                  alt="Homeschooling Kreativa"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Keunggulan Homeschooling Kreativa</h2>
              <p className="text-xl text-gray-600">Solusi pendidikan terbaik untuk keluarga modern</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((advantage, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{advantage.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{advantage.title}</h3>
                    <p className="text-gray-600">{advantage.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Paket Homeschooling</h2>
              <p className="text-xl text-gray-600">Pilih paket yang sesuai dengan kebutuhan keluarga Anda</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`hover:shadow-lg transition-shadow ${index === 1 ? "ring-2 ring-purple-600" : ""}`}
                >
                  <CardContent className="p-8">
                    {index === 1 && (
                      <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                        POPULER
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-purple-600 mb-6">{pkg.price}</div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${index === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}`}
                    >
                      Pilih Paket
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
