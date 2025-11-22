'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function Page() {
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/contact');
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4caade]/10 via-white to-[#f2cd5b]/10">
        <FoundationHeader />
        <main>
          <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="text-center mb-10">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gradient-to-r from-blue-300 to-cyan-300" />
              <Skeleton className="h-6 w-96 mx-auto bg-gradient-to-r from-cyan-200 to-teal-200" />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm border-2 border-blue-200">
                <div className="space-y-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg"
                    >
                      <Skeleton className="h-5 w-16 mb-2 bg-gradient-to-r from-blue-300 to-cyan-300" />
                      <Skeleton className="h-4 w-full bg-gray-200" />
                      {i === 3 && (
                        <div className="space-y-1 mt-2">
                          <Skeleton className="h-4 w-32 bg-gray-200" />
                        </div>
                      )}
                    </div>
                  ))}
                  <Skeleton className="h-10 w-full bg-gradient-to-r from-blue-300 to-cyan-300" />
                </div>
              </Card>

              <Card className="shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-cyan-200">
                <Skeleton className="h-96 w-full bg-gradient-to-br from-blue-200 to-cyan-200" />
              </Card>
            </div>
          </section>
        </main>
        <FoundationFooter />
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <FoundationHeader />
        <main>
          <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Error loading page</h1>
            </div>
          </section>
        </main>
        <FoundationFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <FoundationHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
              {contactData?.title || 'Hubungi Kami'}
            </h1>
            <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
              {contactData?.subtitle ||
                'Jika Anda memiliki pertanyaan atau ingin mengetahui lebih lanjut tentang program-program kami, silakan hubungi kami melalui kontak di bawah ini.'}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Alamat
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {contactData?.office?.address ||
                      'Gg. Haji Soleh No. 1A RT 01/06 Kel. Kedung Waringin Kec. Tanah Sareal, Kota Bogor 16163'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="mt-2 text-gray-600">
                    {contactData?.office?.email || 'info@iqrolife.or.id'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Telepon
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {contactData?.office?.phone || '+62813-1522-5557'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Jam Operasional
                  </h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>
                      {contactData?.office?.hours ||
                        'Senin - Jumat: 08.00 - 16.00 WIB'}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <a
                    href="https://maps.app.goo.gl/eBvyD7rMYi1QT3Vq7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full transition-transform hover:-translate-y-0.5">
                      Buka di Google Maps
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            <Card className="shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.6192632291422!2d106.78327259999999!3d-6.569643999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c516b6b5f175%3A0xdcb8a03ffb629ce5!2sSaung%20Iqrolife!5e0!3m2!1sen!2sid!4v1759298955005!5m2!1sen!2sid"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Card>
          </div>
        </section>
        <div className="text-center pt-6 pb-12">
          <Button
            asChild
            size="lg"
            className="bg-[#4caade] hover:bg-[#3a8fc7] text-white shadow-lg transition-all duration-300 hover:scale-105"
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
      </main>
      <FoundationFooter />
    </div>
  );
}
