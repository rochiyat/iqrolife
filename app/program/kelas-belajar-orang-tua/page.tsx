import FoundationFooter from '@/components/foundation-footer';
import FoundationHeader from '@/components/foundation-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <main>
        <FoundationHeader />
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <nav className="text-sm text-muted-foreground">
            <Link href="/program" className="hover:text-primary">
              Program
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Kelas Belajar Orang Tua</span>
          </nav>

          <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-pretty text-3xl font-semibold md:text-4xl">
                Kelas Belajar Orang Tua
              </h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Ruang belajar bagi ayah dan ibu untuk memperkuat peran
                pengasuhan melalui materi, praktik, dan pendampingan berbasis
                nilai serta kebutuhan keluarga.
              </p>
              <ul className="mt-6 list-disc pl-5 text-muted-foreground">
                <li>
                  Topik: komunikasi hangat, disiplin positif, literasi, dan adab
                  keluarga
                </li>
                <li>
                  Format: workshop, studi kasus, coaching singkat, dan rencana
                  aksi
                </li>
                <li>
                  Komunitas: saling dukung antar orang tua untuk keberlanjutan
                  perubahan
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Button>Daftar Minat</Button>
                <Link href="/kontak">
                  <Button variant="outline">Konsultasi</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <img
                src="/kelas-parenting-belajar-orang-tua.jpg"
                alt="Kegiatan Kelas Belajar Orang Tua"
                className="h-auto w-full rounded-md"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold">Tujuan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Orang tua memiliki pengetahuan, sikap, dan strategi pengasuhan
                yang membumi.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold">Metode</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Workshop interaktif, praktik terarah, dan pendampingan tindak
                lanjut.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold">Output</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Terbentuknya budaya belajar keluarga dan kebiasaan baik yang
                konsisten.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FoundationFooter />
    </div>
  );
}
