import FoundationHeader from "@/components/foundation-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
          <span className="text-foreground">Kelas Eksplorasi</span>
        </nav>

        <div className="mt-4 grid items-start gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-pretty text-3xl font-semibold md:text-4xl">Kelas Eksplorasi</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Ruang belajar berbasis bermain untuk menumbuhkan rasa ingin tahu, kreativitas, kolaborasi, dan kemandirian
              anak melalui kegiatan sensorik, sains sederhana, seni, dan permainan peran.
            </p>
            <ul className="mt-6 list-disc pl-5 text-muted-foreground">
              <li>Kegiatan tematik: alam, sains, seni, dan literasi awal</li>
              <li>Eksperimen aman dan menyenangkan untuk melatih pemecahan masalah</li>
              <li>Penguatan adab dalam interaksi dan kebiasaan baik harian</li>
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
              src="/kelas-eksplorasi-anak-bermain-belajar.jpg"
              alt="Kegiatan Kelas Eksplorasi"
              className="h-auto w-full rounded-md"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Tujuan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Menstimulasi aspek kognitif, sosial-emosional, motorik, dan bahasa secara seimbang.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Metode</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Play-based, project-based, dan discovery learning dengan pendampingan fasilitator.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold">Output</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Anak berani mencoba, mampu berekspresi, dan terbiasa bekerja sama.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
