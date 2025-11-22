'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ContactData {
  title: string;
  subtitle: string;
  office: {
    title: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    hours: string;
  };
  social: {
    instagram: string;
    youtube: string;
  };
  map: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  form: {
    title: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      placeholder: string;
    }>;
  };
}

export default function ContactSection() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/contact');
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-brand-off-white to-brand-cyan/5">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-emerald border-r-transparent mb-4"></div>
            <p className="text-brand-gray">Memuat informasi kontak...</p>
          </div>
        </div>
      </section>
    );
  }

  const locations = [
    {
      title: 'Kantor Iqrolife',
      address:
        'Gg. Haji Soleh No. 1A RT 01/06 Kel. Kedung Waringin Kec. Tanah Sareal, Kota Bogor 16163',
      phone: '+62813-1522-5557',
      email: 'iqrolife@gmail.com',
    },
  ];

  return (
    <section
      id="kontak"
      className="py-16 bg-gradient-to-br from-brand-off-white to-brand-cyan/5"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent">
            {contactData?.title || 'Hubungi Kami'}
          </h2>
          <p className="text-brand-gray max-w-2xl mx-auto">
            {contactData?.subtitle || 'Informasi kontak dan lokasi Iqrolife'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          {locations.map((location, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-2 border-brand-emerald/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-brand-emerald text-center">
                  {location.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-brand-cyan mt-1 mr-3 flex-shrink-0"
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
                    <p className="text-brand-gray whitespace-pre-line leading-relaxed">
                      {location.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-brand-cyan mr-3"
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
                    <p className="text-brand-gray font-medium">
                      {location.phone}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-brand-cyan mr-3"
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
                    <p className="text-brand-gray font-medium">
                      {location.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-brand-emerald hover:bg-brand-cyan text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <a
              href={`https://wa.me/${contactData?.office.whatsapp.replace(
                /[^0-9]/g,
                ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
