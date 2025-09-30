import FoundationHeader from "@/components/foundation-header"

const timeline = [
  { year: "2012", title: "Awal Berdiri", desc: "Langkah pertama membangun komunitas belajar." },
  { year: "2016", title: "Penguatan Program", desc: "Pengembangan kurikulum dan pelatihan guru." },
  { year: "2020", title: "Digitalisasi", desc: "Adaptasi platform daring untuk pembelajaran." },
  { year: "2024", title: "Ekspansi", desc: "Kolaborasi lebih luas dengan berbagai mitra." },
]

export default function Page() {
  return (
    <main>
      <FoundationHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-3xl font-semibold md:text-4xl">Sejarah</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Perjalanan kami membentuk fondasi pendidikan yang hangat dan profesional.
        </p>

        <div className="mt-8 space-y-4">
          {timeline.map((item, idx) => (
            <div
              key={item.year}
              className="grid items-start gap-4 rounded-lg border bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 md:grid-cols-[120px_1fr]"
            >
              <div className="text-xl font-semibold md:text-2xl">{item.year}</div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
