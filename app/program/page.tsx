import FoundationHeader from "@/components/foundation-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const programs = [
  {
    title: "Kelas Eksplorasi",
    desc: "Kegiatan eksploratif berbasis bermain untuk menumbuhkan rasa ingin tahu, kreativitas, dan kemandirian anak.",
    href: "/program/kelas-eksplorasi",
  },
  {
    title: "Kelas Pra Aqil Baligh",
    desc: "Pendampingan masa pra baligh yang menekankan adab, tanggung jawab, dan kesiapan emosional-spiritual.",
    href: "/program/kelas-pra-aqil-baligh",
  },
  {
    title: "Kelas Belajar Orang Tua",
    desc: "Kelas parenting untuk menguatkan peran ayah-ibu melalui diskusi, praktik, dan pendampingan.",
    href: "/program/kelas-belajar-orang-tua",
  },
]

export default function Page() {
  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-pretty text-3xl font-semibold md:text-4xl">Program</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Program kami berfokus pada penguatan keluarga, guru, dan komunitas agar anak tumbuh dalam ekosistem yang
              sehat.
            </p>
            <div className="mt-6">
              <Button className="transition-transform hover:-translate-y-0.5">Konsultasi Program</Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <img
              src="/parenting-program.jpg"
              alt="Ilustrasi kegiatan program keluarga"
              className="h-auto w-full rounded-md"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group rounded-lg border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={p.title}
            >
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Pelajari lebih lanjut →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
