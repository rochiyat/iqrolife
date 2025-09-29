import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ActivitiesSection() {
  const activities = [
    {
      image: "/classroom-learning.png",
      title: "Pembelajaran Interaktif",
      description: "Siswa belajar dengan metode yang menyenangkan dan interaktif",
    },
    {
      image: "/placeholder-nzl00.png",
      title: "Eksperimen Sains",
      description: "Praktik langsung untuk memahami konsep sains dengan lebih baik",
    },
    {
      image: "/placeholder-p0atk.png",
      title: "Pembelajaran Al-Qur'an",
      description: "Menumbuhkan kecintaan terhadap Al-Qur'an sejak dini",
    },
    {
      image: "/placeholder-bp0kl.png",
      title: "Kegiatan Outdoor",
      description: "Pembelajaran di luar kelas untuk mengenal lingkungan",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Aktivitas Kami</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai kegiatan pembelajaran yang dirancang untuk mengembangkan potensi siswa secara optimal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {activities.map((activity, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <Image src={activity.image || "/placeholder.svg"} alt={activity.title} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <a href="https://www.instagram.com/sekolahkreativa.bogor/" target="_blank" rel="noopener noreferrer">
              Follow us on Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
