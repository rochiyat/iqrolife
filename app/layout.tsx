import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Iqrolife Community',
  description:
    'Komunitas pendidikan berbasis fitrah dengan 7 pendekatan pendidikan yang holistik guna mengembangkan manusia yang paripurna dari 3 aspek: jiwa, fisik dan akal. Iqrolife hadir dengan ekosistem pendidikan untuk semua komponen keluarga: Ayah, Ibu dan Anak dengan program-program yang terstruktur dan terukur.',
  keywords: 'iqrolife, komunitas, pendidikan, keluarga, sekolah, fitrah',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo-iqrolife.png" type="image/png" />
      </head>
      <body
        className={`font-sans ${inter.variable} ${poppins.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
