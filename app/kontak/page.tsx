import FoundationHeader from "@/components/foundation-header"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-3xl font-semibold md:text-4xl">Kontak</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Hubungi yayasan untuk kolaborasi dan informasi program.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-semibold">Alamat</h3>
            <p className="mt-2 text-sm text-muted-foreground">Jl. Iqrolife No. 123, Kota Harmoni</p>
            <h3 className="mt-4 font-semibold">Email</h3>
            <p className="mt-2 text-sm text-muted-foreground">info@iqrolife.org</p>
            <h3 className="mt-4 font-semibold">Telepon</h3>
            <p className="mt-2 text-sm text-muted-foreground">+62 812 3456 7890</p>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-semibold">Arah & Peta</h3>
            <p className="mt-2 text-sm text-muted-foreground">Temukan lokasi kami dan rencanakan kunjungan.</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex">
              <Button className="transition-transform hover:-translate-y-0.5">Buka Google Maps</Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
