import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SDPage() {
  const curriculum = [
    {
      title: "Tahfidz Al-Qur'an",
      description: "Program menghafal Al-Qur'an dengan metode yang menyenangkan",
      icon: "📖",
    },
    {
      title: "Sains & Teknologi",
      description: "Pembelajaran sains dengan praktik langsung di laboratorium",
      icon: "🔬",
    },
    {
      title: "Bahasa Internasional",
      description: "Penguasaan bahasa Arab dan Inggris sejak dini",
      icon: "🌍",
    },
    {
      title: "Leadership Training",
      description: "Pembentukan jiwa kepemimpinan melalui berbagai kegiatan",
      icon: "👑",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  SD Kreativa
                  <br />
                  <span className="text-green-600">Pendidikan Dasar Unggulan</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Pendidikan dasar dengan kurikulum terintegrasi yang mengembangkan potensi akademik dan islami siswa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Daftar Sekarang
                  </Button>
                  <Button variant="outline" size="lg">
                    Info Lebih Lanjut
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/school-building-exterior.png"
                  alt="SD Kreativa"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Kurikulum SD Kreativa</h2>
              <p className="text-xl text-gray-600">Program pembelajaran yang komprehensif dan berkarakter</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {curriculum.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Lokasi SD Kreativa</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Alamat</h4>
                      <p className="text-gray-700 mb-4">
                        Jl. Kranji Ujung No.71 RT 03/RW 04
                        <br />
                        Kel. Sukaresmi, Kec. Tanah Sareal
                        <br />
                        Kota Bogor, Jawa Barat 16165
                      </p>
                      <h4 className="font-semibold text-lg mb-3">Kontak</h4>
                      <p className="text-gray-700">
                        Telepon: 08111202244
                        <br />
                        Email: hkd@sekolahkreativa.sch.id
                      </p>
                    </div>
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-gray-500">Peta Lokasi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
