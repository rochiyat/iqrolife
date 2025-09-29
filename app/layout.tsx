import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Sekolah Iqrolife Bogor - Sekolah Islam Unggulan #1 di Kota Bogor",
  description:
    "Sekolah Islam terpadu dengan program Islamic Leadership, Green School, dan Tahfidz. Membangun generasi Qur'ani yang berkarakter, kreatif, dan berprestasi.",
  keywords: "sekolah islam, sekolah bogor, islamic leadership, tahfidz, green school, pendidikan islam terpadu",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans ${inter.variable} ${poppins.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
