export default function FoundationFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/iqrolife-logo.jpg" alt="Logo Yayasan Iqrolife" className="h-9 w-9 rounded-md" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none text-foreground md:text-base">
                  Tumbuh Bersama Iqrolife
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">Profesional • Kekeluargaan</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Yayasan yang berfokus pada penguatan ekosistem pendidikan: keluarga, sekolah, dan komunitas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide">Navigasi</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/tentang-kami" className="hover:text-foreground transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="/sejarah" className="hover:text-foreground transition-colors">
                  Sejarah
                </a>
              </li>
              <li>
                <a href="/program" className="hover:text-foreground transition-colors">
                  Program
                </a>
              </li>
              <li>
                <a href="/kontak" className="hover:text-foreground transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide">Kontak</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Email: info@iqrolife.org</li>
              <li>Telepon: +62 812 3456 7890</li>
              <li>Alamat: Jl. Iqrolife No. 123, Kota Harmoni</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © 2025 Tumbuh Bersama Iqrolife. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
