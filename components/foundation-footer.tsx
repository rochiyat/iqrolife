export default function FoundationFooter() {
  return (
    <footer className="border-t bg-gradient-to-b from-white to-[#e8f5e3]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/iqrolife-logo.jpg"
                alt="Logo Yayasan Iqrolife"
                className="h-9 w-9 rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none text-foreground md:text-base">
                  Tumbuh Bersama Iqrolife
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">
                  Profesional • Kekeluargaan
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Yayasan yang berfokus pada penguatan ekosistem pendidikan:
              keluarga, sekolah, dan komunitas.
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#2e7d32]">
              Profile
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/tentang-kami"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="/profile/sejarah"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Sejarah
                </a>
              </li>
              <li>
                <a
                  href="/profile/visi"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Visi
                </a>
              </li>
              <li>
                <a
                  href="/profile/misi"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Misi
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#2e7d32]">
              Program
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/program/pre-school"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Pre-School
                </a>
              </li>
              <li>
                <a
                  href="/program/kelas-eksplorasi"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Kelas Eksplorasi
                </a>
              </li>
              <li>
                <a
                  href="/program/kelas-aqil-baligh"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Kelas Aqil Baligh
                </a>
              </li>
              <li>
                <a
                  href="/program/kelas-belajar-orang-tua"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Kelas Belajar Orang Tua
                </a>
              </li>
              <li>
                <a
                  href="/program/konsultasi-tm"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Konsultasi TM
                </a>
              </li>
              <li>
                <a
                  href="/program/komunitas-ayah"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Komunitas Ayah
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#2e7d32]">
              Kontak
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Email: info@iqrolife.org</li>
              <li>Telepon: +62 812 3456 7890</li>
              <li>Alamat: Jl. Iqrolife No. 123, Kota Harmoni</li>
              <li className="pt-2">
                <a
                  href="/kontak"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a
                  href="/school"
                  className="hover:text-[#2e7d32] transition-colors"
                >
                  Masuk Sekolah
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © 2025 Tumbuh Bersama Iqrolife. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
