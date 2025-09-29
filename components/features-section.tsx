import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Sejaran Singkat",
    description:
      "Didirikan dengan visi menciptakan generasi Qur'ani yang berkarakter dan berprestasi melalui pendidikan Islam terpadu.",
    color: "text-blue-600",
  },
  {
    icon: Award,
    title: "Penghargaan",
    description: "Meraih berbagai prestasi akademik dan non-akademik tingkat regional dan nasional.",
    color: "text-green-600",
  },
  {
    icon: Heart,
    title: "Komunitas",
    description: "Membangun komunitas pembelajaran yang solid antara siswa, guru, dan orang tua.",
    color: "text-orange-600",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
