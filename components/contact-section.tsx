'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const locations = [
    {
      title: 'Kantor Pusat Yasmina-Sekolah Iqrolife',
      address:
        'Jl. Johar Raya no. 38 Kel. Kedung Waringin\nKec. Tanah Sareal Kota Bogor\nJawa Barat 16164',
      phone: '08111202244 / 0251-8357845',
      email: 'hkd@sekolahiqrolife.sch.id',
    },
    {
      title: 'Lokasi KBTK Iqrolife',
      address:
        'Jl. Johar Raya no. 38 RT 02/ RW 04 Kel. Kedung Waringin, Kec. Tanah Sareal, Kota Bogor, Jawa Barat 16164',
      phone: '08111202244',
      email: 'hkd@sekolahiqrolife.sch.id',
    },
    {
      title: 'Lokasi SD Iqrolife',
      address:
        'Jl. Kranji Ujung No.71 RT 03/RW 04\nKel. Sukaresmi, Kec. Tanah Sareal, Kota Bogor\nJawa Barat 16165',
      phone: '08111202244',
      email: 'hkd@sekolahiqrolife.sch.id',
    },
    {
      title: 'Lokasi SMP & HS SMU Iqrolife',
      address:
        'Jl. raya Munjul RT 03/ RW 05 Kel. Kayu Manis Kec. Tanah Sareal, Kota Bogor Jawa Barat 16169',
      phone: '08111202244',
      email: 'hkd@sekolahiqrolife.sch.id',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600">
            Informasi kontak dan lokasi Sekolah Iqrolife
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {locations.map((location, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">
                  {location.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gray-500 mt-1 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-gray-700 whitespace-pre-line">
                      {location.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="text-gray-700">{location.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-700">{location.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <a
              href="https://wa.me/628111202244"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
