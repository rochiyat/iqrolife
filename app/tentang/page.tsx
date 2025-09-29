import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TentangPage() {
  const achievements = [
    {
      title: "Akreditasi A",
      description: "Semua jenjang pendidikan terakreditasi A",
      icon: "🏆",
    },
    {
      title: "ISO 9001:2015",
      description: "Sertifikat manajemen mutu internasional",
      icon: "📜",
    },
    {
      title: "Green School",
      description: "Sekolah ramah lingkungan bersertifikat",
      icon: "🌱",
    },
    {
      title: "Digital School",
      description: "Pembelajaran berbasis teknologi digital",
      icon: "💻",
    },
  ]

  const facilities = [
    "Ruang Kelas Ber-AC",
    "Laboratorium Sains",
    "Perpustakaan Digital",
    "Masjid",
    "Lapangan Olahraga",
    "Kantin Sehat",
    "Area Bermain",
    "Ruang Multimedia",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌈</div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">⭐</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">🎨</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">📚</div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-bounce-gentle">
                🏫 Tentang Sekolah Iqrolife 🏫
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
                Sekolah Islam terpadu yang mengedepankan pendidikan berkualitas dengan nilai-nilai islami untuk
                anak-anak tercinta
              </p>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-5 text-2xl animate-wiggle">🎈</div>
            <div className="absolute top-1/2 right-5 text-2xl animate-wiggle delay-700">🎈</div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">📖 Sejarah Sekolah Iqrolife 📖</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    Sekolah Iqrolife didirikan pada tahun 2010 dengan visi menjadi lembaga pendidikan Islam terpadu yang
                    unggul di Kota Bogor. Berawal dari kepedulian terhadap pendidikan anak yang berkualitas dengan tetap
                    menjaga nilai-nilai islami yang menyenangkan untuk anak-anak! 🌟
                  </p>
                  <p className="leading-relaxed">
                    Dengan mengusung konsep "Leadership School with Islamic Values", Sekolah Iqrolife terus berkembang
                    dan kini telah memiliki berbagai jenjang pendidikan mulai dari KB-TK, SD, hingga SMP dengan suasana
                    belajar yang ceria dan menyenangkan! 🎉
                  </p>
                  <p className="leading-relaxed">
                    Sekolah Iqrolife berkomitmen untuk terus memberikan pendidikan terbaik dengan mengintegrasikan
                    kurikulum nasional, nilai-nilai islam, dan program unggulan seperti tahfidz Al-Qur'an dalam
                    lingkungan yang penuh kasih sayang! 💝
                  </p>
                </div>
              </div>
              <div className="relative animate-fade-in-right">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop"
                  alt="Gedung Sekolah Iqrolife yang indah dan ramah anak"
                  className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-float"
                />
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🏫</div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                🏆 Prestasi & Sertifikasi 🏆
              </h2>
              <p className="text-xl text-gray-600">
                Pengakuan atas komitmen kami terhadap pendidikan berkualitas untuk anak-anak
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-yellow-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 animate-bounce">{achievement.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">{achievement.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-3xl animate-pulse">🎪</div>
            <div className="absolute top-20 right-20 text-3xl animate-bounce">🎠</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-pulse delay-300">🎯</div>
            <div className="absolute bottom-10 right-10 text-3xl animate-bounce delay-500">🎲</div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">🏢 Fasilitas Sekolah 🏢</h2>
              <p className="text-xl text-gray-600">
                Fasilitas lengkap dan menyenangkan untuk mendukung proses pembelajaran anak-anak
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border-2 border-blue-200"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="font-medium text-blue-900">{facility}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce-gentle">
                👶 Kehidupan Anak-Anak di Iqrolife 👶
              </h2>
              <p className="text-xl text-gray-600">
                Lihat betapa bahagianya anak-anak belajar dan bermain di sekolah kami
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center animate-fade-in-left">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=300&fit=crop"
                  alt="Anak-anak KB-TK sedang belajar di dalam kelas dengan gembira"
                  className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">📚 Belajar di Dalam Kelas 📚</h3>
                <p className="text-gray-600 leading-relaxed">
                  Suasana belajar yang menyenangkan dengan metode pembelajaran interaktif dan guru yang sabar
                </p>
              </div>
              <div className="text-center animate-fade-in-right">
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&h=300&fit=crop"
                  alt="Anak-anak KB-TK bermain di luar kelas dengan riang gembira"
                  className="rounded-2xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 animate-float delay-300"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🌳 Bermain di Luar Kelas 🌳</h3>
                <p className="text-gray-600 leading-relaxed">
                  Area bermain yang aman dan menyenangkan untuk mengembangkan motorik dan sosial anak
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
