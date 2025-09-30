import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SMPPage() {
  const programs = [
    {
      title: "Leadership Development",
      description: "Program pengembangan kepemimpinan untuk membentuk pemimpin masa depan",
      icon: "👨‍💼",
    },
    {
      title: "Entrepreneurship",
      description: "Pembelajaran kewirausahaan untuk mengembangkan jiwa bisnis",
      icon: "💼",
    },
    {
      title: "Digital Literacy",
      description: "Penguasaan teknologi digital dan programming",
      icon: "💻",
    },
    {
      title: "Environmental Care",
      description: "Program peduli lingkungan dan konservasi alam",
      icon: "🌱",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  SMP Kreativa
                  <br />
                  <span className="text-orange-600">Pendidikan Menengah Pertama</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Program pendidikan menengah pertama dengan fokus pada pengembangan kepemimpinan, kreativitas, dan
                  karakter islami.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Daftar Sekarang
                  </Button>
                  <Button variant="outline" size="lg">
                    Info Lebih Lanjut
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/science-laboratory.png"
                  alt="SMP Kreativa"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Unggulan SMP Kreativa</h2>
              <p className="text-xl text-gray-600">Mempersiapkan siswa menjadi pemimpin masa depan</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{program.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{program.title}</h3>
                    <p className="text-gray-600">{program.description}</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Lokasi SMP & HS SMU Kreativa</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Alamat</h4>
                      <p className="text-gray-700 mb-4">
                        Jl. raya Munjul RT 03/ RW 05
                        <br />
                        Kel. Kayu Manis Kec. Tanah Sareal
                        <br />
                        Kota Bogor, Jawa Barat 16169
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
