'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';

export default function TermsPage() {
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
                Syarat dan Ketentuan
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
                    1. Penerimaan Syarat
                  </h2>
                  <p className="leading-relaxed">
                    Selamat datang di Iqrolife Community. Dengan mengakses dan
                    menggunakan situs web ini serta layanan kami, Anda setuju
                    untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak
                    setuju dengan syarat ini, mohon untuk tidak menggunakan
                    layanan kami.
                  </p>
                </section>

                {/* Definisi */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    2. Definisi
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>"Kami"</strong> atau <strong>"Iqrolife"</strong>{' '}
                      merujuk pada Iqrolife Community
                    </li>
                    <li>
                      <strong>"Anda"</strong> atau <strong>"Pengguna"</strong>{' '}
                      merujuk pada individu yang mengakses layanan kami
                    </li>
                    <li>
                      <strong>"Layanan"</strong> merujuk pada semua program,
                      kegiatan, dan fasilitas yang kami tawarkan
                    </li>
                    <li>
                      <strong>"Situs Web"</strong> merujuk pada website Iqrolife
                      Community
                    </li>
                    <li>
                      <strong>"Konten"</strong> merujuk pada teks, gambar,
                      video, dan materi lainnya di situs web
                    </li>
                  </ul>
                </section>

                {/* Penggunaan Layanan */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    3. Penggunaan Layanan
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        3.1 Kelayakan
                      </h3>
                      <p className="leading-relaxed">
                        Untuk menggunakan layanan kami, Anda harus berusia
                        minimal 18 tahun atau memiliki persetujuan orang
                        tua/wali. Dengan mendaftar, Anda menyatakan bahwa
                        informasi yang Anda berikan adalah akurat dan lengkap.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        3.2 Akun Pengguna
                      </h3>
                      <p className="leading-relaxed mb-2">
                        Anda bertanggung jawab untuk:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Menjaga kerahasiaan informasi akun Anda</li>
                        <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
                        <li>
                          Memberi tahu kami segera jika terjadi penggunaan tidak
                          sah
                        </li>
                        <li>
                          Memastikan informasi akun Anda selalu akurat dan
                          terkini
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        3.3 Penggunaan yang Dilarang
                      </h3>
                      <p className="leading-relaxed mb-2">
                        Anda setuju untuk TIDAK:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          Menggunakan layanan untuk tujuan ilegal atau tidak sah
                        </li>
                        <li>Mengganggu atau merusak layanan atau server</li>
                        <li>Mengumpulkan informasi pengguna lain tanpa izin</li>
                        <li>Mengirim spam, virus, atau kode berbahaya</li>
                        <li>Menyamar sebagai orang atau entitas lain</li>
                        <li>Melanggar hak kekayaan intelektual pihak lain</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Pendaftaran Program */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    4. Pendaftaran dan Pembayaran Program
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        4.1 Proses Pendaftaran
                      </h3>
                      <p className="leading-relaxed">
                        Pendaftaran program dilakukan melalui formulir online
                        atau langsung di kantor kami. Pendaftaran dianggap sah
                        setelah pembayaran diterima dan dikonfirmasi.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        4.2 Pembayaran
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          Semua biaya harus dibayar sesuai dengan jadwal yang
                          ditentukan
                        </li>
                        <li>
                          Pembayaran dapat dilakukan melalui transfer bank atau
                          metode yang tersedia
                        </li>
                        <li>
                          Keterlambatan pembayaran dapat mengakibatkan penundaan
                          atau pembatalan layanan
                        </li>
                        <li>
                          Biaya yang telah dibayarkan tidak dapat dikembalikan
                          kecuali dinyatakan lain
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-cyan mb-2">
                        4.3 Pembatalan dan Pengembalian Dana
                      </h3>
                      <p className="leading-relaxed mb-2">
                        Kebijakan pembatalan dan pengembalian dana:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          Pembatalan 30 hari sebelum program dimulai:
                          pengembalian 75%
                        </li>
                        <li>
                          Pembatalan 14-29 hari sebelum program: pengembalian
                          50%
                        </li>
                        <li>
                          Pembatalan kurang dari 14 hari: tidak ada pengembalian
                          dana
                        </li>
                        <li>
                          Kami berhak membatalkan program dengan pengembalian
                          dana penuh
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Hak Kekayaan Intelektual */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    5. Hak Kekayaan Intelektual
                  </h2>
                  <p className="leading-relaxed mb-3">
                    Semua konten di situs web ini, termasuk teks, grafik, logo,
                    gambar, video, dan perangkat lunak, adalah milik Iqrolife
                    Community atau pemberi lisensi kami dan dilindungi oleh
                    hukum hak cipta dan kekayaan intelektual.
                  </p>
                  <p className="leading-relaxed">
                    Anda tidak diperbolehkan untuk mereproduksi,
                    mendistribusikan, memodifikasi, atau menggunakan konten kami
                    untuk tujuan komersial tanpa izin tertulis dari kami.
                  </p>
                </section>

                {/* Privasi */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    6. Privasi dan Perlindungan Data
                  </h2>
                  <p className="leading-relaxed">
                    Penggunaan informasi pribadi Anda diatur oleh Kebijakan
                    Privasi kami. Dengan menggunakan layanan kami, Anda
                    menyetujui pengumpulan dan penggunaan informasi sesuai
                    dengan kebijakan tersebut.
                  </p>
                </section>

                {/* Tanggung Jawab */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    7. Batasan Tanggung Jawab
                  </h2>
                  <div className="space-y-4">
                    <p className="leading-relaxed">
                      Iqrolife Community tidak bertanggung jawab atas:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Kerugian tidak langsung, insidental, atau konsekuensial
                      </li>
                      <li>Kehilangan data atau keuntungan</li>
                      <li>Gangguan layanan atau kesalahan teknis</li>
                      <li>Tindakan atau kelalaian pihak ketiga</li>
                      <li>
                        Kecelakaan atau cedera selama kegiatan (kecuali karena
                        kelalaian kami)
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Ganti Rugi */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    8. Ganti Rugi
                  </h2>
                  <p className="leading-relaxed">
                    Anda setuju untuk mengganti rugi dan membebaskan Iqrolife
                    Community, direktur, karyawan, dan mitra kami dari segala
                    klaim, kerugian, kewajiban, dan biaya (termasuk biaya hukum)
                    yang timbul dari pelanggaran Anda terhadap Syarat dan
                    Ketentuan ini.
                  </p>
                </section>

                {/* Perubahan Layanan */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    9. Perubahan Layanan dan Syarat
                  </h2>
                  <p className="leading-relaxed mb-3">Kami berhak untuk:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Mengubah, menangguhkan, atau menghentikan layanan kapan
                      saja
                    </li>
                    <li>
                      Memperbarui Syarat dan Ketentuan ini tanpa pemberitahuan
                      sebelumnya
                    </li>
                    <li>
                      Menolak layanan kepada siapa pun dengan alasan yang sah
                    </li>
                    <li>Mengubah harga dan biaya program</li>
                  </ul>
                </section>

                {/* Penyelesaian Sengketa */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    10. Penyelesaian Sengketa
                  </h2>
                  <p className="leading-relaxed mb-3">
                    Setiap sengketa yang timbul dari atau terkait dengan Syarat
                    dan Ketentuan ini akan diselesaikan melalui:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Negosiasi langsung antara para pihak</li>
                    <li>Mediasi jika negosiasi gagal</li>
                    <li>
                      Arbitrasi atau pengadilan yang berwenang di Indonesia
                    </li>
                  </ol>
                </section>

                {/* Hukum yang Berlaku */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    11. Hukum yang Berlaku
                  </h2>
                  <p className="leading-relaxed">
                    Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai
                    dengan hukum Republik Indonesia. Setiap sengketa akan tunduk
                    pada yurisdiksi eksklusif pengadilan di Indonesia.
                  </p>
                </section>

                {/* Ketentuan Umum */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    12. Ketentuan Umum
                  </h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Jika ada ketentuan yang tidak sah, ketentuan lainnya tetap
                      berlaku
                    </li>
                    <li>
                      Kegagalan kami menegakkan hak tidak berarti pengesampingan
                      hak tersebut
                    </li>
                    <li>
                      Syarat ini merupakan keseluruhan perjanjian antara Anda
                      dan kami
                    </li>
                    <li>
                      Anda tidak dapat mengalihkan hak Anda tanpa persetujuan
                      kami
                    </li>
                  </ul>
                </section>

                {/* Kontak */}
                <section>
                  <h2 className="text-2xl font-bold text-brand-emerald mb-4">
                    13. Hubungi Kami
                  </h2>
                  <p className="leading-relaxed mb-3">
                    Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan
                    ini, silakan hubungi kami:
                  </p>
                  <div className="bg-brand-sky/10 p-6 rounded-lg border-2 border-brand-lime/30">
                    <p className="font-semibold text-brand-emerald mb-2">
                      Iqrolife Community
                    </p>
                    <p>Email: info@iqrolife.com</p>
                    <p>Telepon: +62 XXX-XXXX-XXXX</p>
                    <p>Alamat: [Alamat Lengkap]</p>
                  </div>
                </section>

                {/* Persetujuan */}
                <section className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 p-6 rounded-lg border-2 border-brand-emerald/20">
                  <h2 className="text-xl font-bold text-brand-emerald mb-3">
                    Persetujuan Anda
                  </h2>
                  <p className="leading-relaxed">
                    Dengan menggunakan situs web dan layanan kami, Anda mengakui
                    bahwa Anda telah membaca, memahami, dan setuju untuk terikat
                    oleh Syarat dan Ketentuan ini.
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
