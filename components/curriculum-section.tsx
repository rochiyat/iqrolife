import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

const curriculumFeatures = [
  "Project-Based Learning",
  "Under 15 Me",
  "Pendidikan Islami",
  "Tahfidz Al-Qur'an",
  "Bilingual Education",
]

export default function CurriculumSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Keunggulan Kurikulum & Program</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kurikulum terintegrasi yang menggabungkan pendidikan akademik, karakter Islami, dan pengembangan kreativitas
            untuk membentuk generasi yang unggul.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pilar Pembelajaran Unggulan</h3>
              <div className="space-y-4">
                {curriculumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-blue-900 mb-3">Program Unggulan: Islamic Leadership</h4>
                <p className="text-blue-800">
                  Program khusus yang mengembangkan jiwa kepemimpinan berdasarkan nilai-nilai Islam, mempersiapkan siswa
                  menjadi pemimpin masa depan yang berakhlak mulia.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <Image
              src="/placeholder-t3e62.png"
              alt="Pembelajaran di Sekolah Kreativa"
              width={600}
              height={500}
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
