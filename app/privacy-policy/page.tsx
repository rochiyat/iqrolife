'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-off-white via-white to-brand-sky/10">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent">
                Kebijakan Privasi
              </h1>
              <p className="text-brand-gray mb-8">
                Terakhir diperbarui:{' '}
                {new Date().toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              <div className="space-y-8 text-brand-gray">
                {/* Pendahuluan */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    1. Pendahuluan
                  </h2>
                  <p className="leading-relaxed">
                    Iqrolife Community ("kami", "kita", atau "milik kami")
                    berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi
                    ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
                    mengungkapkan, dan melindungi informasi pribadi Anda ketika
                    Anda menggunakan situs web kami dan layanan yang kami
                    tawarkan.
                  </p>
                </section>

                {/* Informasi yang Dikumpulkan */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    2. Informasi yang Kami Kumpulkan
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        2.1 Informasi yang Anda Berikan
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Nama lengkap</li>
                        <li>Alamat email</li>
                        <li>Nomor telepon</li>
                        <li>Alamat</li>
                        <li>
                          Informasi tentang anak (nama, usia, jenis kelamin)
                        </li>
                        <li>Informasi pendaftaran program</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        2.2 Informasi yang Dikumpulkan Secara Otomatis
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Alamat IP</li>
                        <li>Jenis browser dan perangkat</li>
                        <li>Halaman yang dikunjungi</li>
                        <li>Waktu dan tanggal kunjungan</li>
                        <li>Data cookies dan teknologi pelacakan serupa</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Penggunaan Informasi */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    3. Bagaimana Kami Menggunakan Informasi Anda
                  </h2>
                  <p className="mb-3">
                    Kami menggunakan informasi yang dikumpulkan untuk:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Memproses pendaftaran program dan layanan</li>
                    <li>
                      Berkomunikasi dengan Anda tentang program dan kegiatan
                    </li>
                    <li>Mengirimkan newsletter dan informasi penting</li>
                    <li>Meningkatkan layanan dan pengalaman pengguna</li>
                    <li>Memenuhi kewajiban hukum dan peraturan</li>
                    <li>Mencegah penipuan dan aktivitas ilegal</li>
                    <li>Menganalisis penggunaan situs web untuk perbaikan</li>
                  </ul>
                </section>

                {/* Pembagian Informasi */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    4. Pembagian Informasi
                  </h2>
                  <p className="mb-3">
                    Kami tidak menjual informasi pribadi Anda. Kami dapat
                    membagikan informasi dengan:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Penyedia layanan pihak ketiga yang membantu operasional
                      kami
                    </li>
                    <li>Mitra pendidikan yang bekerja sama dengan kami</li>
                    <li>Otoritas hukum jika diwajibkan oleh hukum</li>
                    <li>Pihak lain dengan persetujuan eksplisit Anda</li>
                  </ul>
                </section>

                {/* Keamanan Data */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    5. Keamanan Data
                  </h2>
                  <p className="leading-relaxed">
                    Kami menerapkan langkah-langkah keamanan teknis dan
                    organisasi yang sesuai untuk melindungi informasi pribadi
                    Anda dari akses, penggunaan, atau pengungkapan yang tidak
                    sah. Namun, tidak ada metode transmisi melalui internet atau
                    penyimpanan elektronik yang 100% aman.
                  </p>
                </section>

                {/* Hak Anda */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    6. Hak Anda
                  </h2>
                  <p className="mb-3">Anda memiliki hak untuk:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Mengakses informasi pribadi yang kami miliki tentang Anda
                    </li>
                    <li>Meminta koreksi informasi yang tidak akurat</li>
                    <li>Meminta penghapusan informasi pribadi Anda</li>
                    <li>Menolak pemrosesan informasi pribadi Anda</li>
                    <li>Meminta pembatasan pemrosesan</li>
                    <li>Portabilitas data</li>
                    <li>Menarik persetujuan kapan saja</li>
                  </ul>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    7. Cookies dan Teknologi Pelacakan
                  </h2>
                  <p className="leading-relaxed mb-3">
                    Kami menggunakan cookies dan teknologi pelacakan serupa
                    untuk meningkatkan pengalaman Anda. Anda dapat mengatur
                    browser Anda untuk menolak cookies, tetapi ini mungkin
                    mempengaruhi fungsionalitas situs web.
                  </p>
                </section>

                {/* Data Anak */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    8. Privasi Anak
                  </h2>
                  <p className="leading-relaxed">
                    Kami sangat serius dalam melindungi privasi anak-anak. Kami
                    hanya mengumpulkan informasi anak dengan persetujuan orang
                    tua atau wali yang sah. Orang tua memiliki hak untuk
                    meninjau, mengubah, atau menghapus informasi anak mereka
                    kapan saja.
                  </p>
                </section>

                {/* Perubahan Kebijakan */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    9. Perubahan Kebijakan Privasi
                  </h2>
                  <p className="leading-relaxed">
                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                    waktu. Kami akan memberi tahu Anda tentang perubahan dengan
                    memposting kebijakan baru di halaman ini dan memperbarui
                    tanggal "Terakhir diperbarui" di atas.
                  </p>
                </section>

                {/* Kontak */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    10. Hubungi Kami
                  </h2>
                  <p className="leading-relaxed mb-3">
                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini
                    atau ingin menggunakan hak Anda, silakan hubungi kami:
                  </p>
                  <div className="bg-brand-sky/10 p-6 rounded-lg border-2 border-brand-lime/30">
                    <p className="font-semibold text-brand-emerald mb-2">
                      Iqrolife Community
                    </p>
                    <p>Email: privacy@iqrolife.com</p>
                    <p>Telepon: +62 XXX-XXXX-XXXX</p>
                    <p>Alamat: [Alamat Lengkap]</p>
                  </div>
                </section>

                {/* Persetujuan */}
                <section className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 p-6 rounded-lg border-2 border-brand-emerald/20">
                  <h2 className="text-xl font-bold text-brand-emerald mb-3">
                    Persetujuan
                  </h2>
                  <p className="leading-relaxed">
                    Dengan menggunakan situs web kami, Anda menyetujui Kebijakan
                    Privasi kami dan setuju dengan syarat dan ketentuannya.
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
      <FoundationFooter />
    </div>
  );
}
