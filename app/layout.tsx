import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { ThemeProvider } from '@/lib/theme-provider';
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
  title: 'Sekolah Iqrolife Bogor - Sekolah Berbasis Fitrah #1 di Kota Bogor',
  description:
    "Sekolah Berbasis Fitrah terpadu dengan program Islamic Leadership, Green School, dan Tahfidz. Membangun generasi Qur'ani yang berkarakter, kreatif, dan berprestasi.",
  keywords: 'sekolah berbasis fitrah, sekolah bogor, green school',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-iqrolife.png" type="image/png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('iqrolife-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`font-sans ${inter.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
