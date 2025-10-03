'use client';

import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';

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
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <FoundationHeader />
        <main>
          <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Loading...</h1>
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
            <h1 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {contactData.title}
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              {contactData.subtitle}
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
                    {contactData.contactInfo.address}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="mt-2 text-gray-600">
                    {contactData.contactInfo.email}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Telepon
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {contactData.contactInfo.phone}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Jam Operasional
                  </h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>{contactData.contactInfo.hours.weekdays}</p>
                    <p>{contactData.contactInfo.hours.weekends}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <a
                    href={contactData.mapUrl}
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
                src={contactData.mapEmbed}
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
      </main>
      <FoundationFooter />
    </div>
  );
}
