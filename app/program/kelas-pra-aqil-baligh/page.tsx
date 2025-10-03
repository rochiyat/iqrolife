import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <nav className="text-sm text-muted-foreground">
          <Link href="/program" className="hover:text-primary">
            Program
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Kelas Pra Aqil Baligh</span>
        </nav>

        <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
              Kelas Pra Aqil Baligh
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Kelas pendampingan menjelang baligh yang menekankan kesiapan adab,
              tanggung jawab, kemampuan mengambil keputusan, serta pemahaman
              keislaman dasar yang membumi pada kehidupan remaja.
            </p>
            <ul className="mt-6 list-disc pl-5 text-muted-foreground">
              <li>Adab pergaulan, amanah, dan kebiasaan baik remaja</li>
              <li>Manajemen diri: waktu, emosi, dan konsistensi ibadah</li>
              <li>Diskusi tematik: identitas, peran sosial, dan kontribusi</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button>Daftar Minat</Button>
              <Button variant="outline" asChild>
                <Link href="/kontak">Konsultasi</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <img
              src="/kelas-pra-aqil-baligh-pembinaan-remaja.jpg"
              alt="Kegiatan Kelas Pra Aqil Baligh"
              className="h-auto w-full rounded-md"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Tujuan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Remaja siap memasuki fase baligh dengan pondasi adab, ibadah, dan
              tanggung jawab.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Metode</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Diskusi interaktif, proyek kelompok, mentoring, dan pembiasaan.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Output</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tumbuhnya karakter, kemandirian, dan kepekaan sosial remaja.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
