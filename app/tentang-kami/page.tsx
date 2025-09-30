import FoundationHeader from "@/components/foundation-header"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h1 className="text-pretty text-3xl font-semibold md:text-4xl">Tentang Kami</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Yayasan Tumbuh Bersama Iqrolife berkomitmen membangun lingkungan pendidikan yang profesional, hangat, dan
              kekeluargaan. Kami mendampingi pertumbuhan anak dan keluarga melalui program yang terstruktur dan
              kolaboratif.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="transition-transform hover:-translate-y-0.5">Lihat Program</Button>
              <Button variant="outline" className="transition-transform hover:-translate-y-0.5 bg-transparent">
                Hubungi Kami
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="rounded-lg border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <img
                src="/keluarga-belajar.jpg"
                alt="Ilustrasi keluarga belajar bersama"
                className="h-auto w-full rounded-md"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Profesional", desc: "Standar mutu, proses rapi, dan akuntabel." },
              { title: "Kekeluargaan", desc: "Pendekatan hangat yang merangkul orang tua." },
              { title: "Kolaboratif", desc: "Bersinergi dengan guru, orang tua, dan komunitas." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
