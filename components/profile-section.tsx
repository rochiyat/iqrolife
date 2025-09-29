import Image from "next/image"

export default function ProfileSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Profil Sekolah Iqrolife Bogor</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sekolah Iqrolife adalah Lembaga Pendidikan Islam Terpadu di Bogor dengan konsep unggulan berbasis Islamic
            Leadership, Green School, dan Tahfidz yang terintegrasi dalam pembelajaran holistik untuk membentuk generasi
            Qur'ani yang berkarakter, kreatif, dan berprestasi.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/school-principal-or-teacher-with-certificate.jpg"
              alt="Profil Kepala Sekolah"
              width={500}
              height={400}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi lembaga pendidikan Islam terpadu yang unggul dalam menghasilkan generasi Qur'ani, berkarakter,
                kreatif, dan berprestasi dengan mengedepankan nilai-nilai Islam dalam setiap aspek pembelajaran.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Menyelenggarakan pendidikan Islam terpadu yang berkualitas dengan kurikulum nasional dan
                    internasional.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Mengembangkan potensi akademik, kreativitas, dan kepemimpinan siswa melalui program Islamic
                    Leadership.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Membangun kesadaran lingkungan melalui program Green School yang berkelanjutan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mengintegrasikan program Tahfidz Al-Qur'an dalam pembelajaran sehari-hari.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
