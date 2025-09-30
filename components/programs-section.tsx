import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Gamepad2, Home, Star } from "lucide-react"

const programs = [
  {
    icon: BookOpen,
    title: "KBTK Iqrolife",
    description: "Program pendidikan anak usia dini dengan pendekatan bermain sambil belajar yang menyenangkan.",
    color: "bg-fun-blue text-white",
    emoji: "🧸",
    gradient: "from-fun-blue to-blue-400",
  },
  {
    icon: Users,
    title: "SD Iqrolife",
    description: "Pendidikan dasar dengan kurikulum terintegrasi yang mengembangkan potensi akademik dan karakter.",
    color: "bg-fun-green text-white",
    emoji: "📚",
    gradient: "from-fun-green to-green-400",
  },
  {
    icon: Gamepad2,
    title: "SMP Iqrolife",
    description: "Program pendidikan menengah pertama dengan fokus pada pengembangan kepemimpinan dan kreativitas.",
    color: "bg-fun-orange text-white",
    emoji: "🎯",
    gradient: "from-fun-orange to-orange-400",
  },
  {
    icon: Home,
    title: "Homeschooling",
    description: "Program pembelajaran fleksibel di rumah dengan bimbingan guru profesional dan kurikulum terstruktur.",
    color: "bg-fun-purple text-white",
    emoji: "🏠",
    gradient: "from-fun-purple to-purple-400",
  },
]

export default function ProgramsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-fun-yellow/10 via-white to-fun-pink/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Star className="w-6 h-6 text-fun-yellow/30" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce-gentle">
          <Star className="w-8 h-8 text-fun-pink/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-wiggle">
          <Star className="w-7 h-7 text-fun-blue/30" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-bounce-gentle">
            <span className="bg-gradient-to-r from-fun-blue via-fun-purple to-fun-pink bg-clip-text text-transparent">
              Program Pendidikan
            </span>
            <br />
            <span className="text-fun-orange">Sekolah Iqrolife Bogor</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            🌟 Kami menyediakan berbagai program pendidikan yang disesuaikan dengan kebutuhan dan tahap perkembangan
            setiap siswa 🌟
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-2xl transition-all duration-500 group fun-hover border-0 overflow-hidden relative"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-90`}></div>

              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-bounce-gentle">
                    <program.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-3xl animate-wiggle">{program.emoji}</div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
                  {program.title}
                </h3>
                <p className="text-white/90 leading-relaxed font-medium text-lg">{program.description}</p>

                <div className="flex justify-center mt-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-white/60 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
