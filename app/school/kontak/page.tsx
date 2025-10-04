'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

export default function KontakPage() {
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/school/contact');
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        const data = await response.json();
        setContactData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section Skeleton */}
          <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Skeleton className="h-12 w-80 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
            </div>
          </section>

          {/* Contact Information Skeleton */}
          <section className="py-16 bg-gradient-to-b from-blue-50 to-green-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <Skeleton className="h-8 w-48 mx-auto mb-4" />
                  <Skeleton className="h-6 w-64 mx-auto" />
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading contact information
            </h2>
            <p className="text-gray-600">{error || 'Data not available'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute top-20 right-20 w-6 h-6 bg-pink-300 rounded-full animate-pulse opacity-70"></div>
            <div
              className="absolute bottom-20 left-20 w-10 h-10 bg-green-300 rounded-full animate-bounce opacity-70"
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className="absolute bottom-10 right-10 w-4 h-4 bg-orange-300 rounded-full animate-pulse opacity-70"
              style={{ animationDelay: '2s' }}
            ></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-bounce">
                {contactData.hero.title}
              </h1>
              <p className="text-xl text-blue-100">
                {contactData.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-wiggle">
                  {contactData.contactInfo.title}
                </h2>
                <p className="text-xl text-gray-600">
                  {contactData.contactInfo.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
                {/* Kantor Pusat */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-primary hover:scale-105 transition-transform duration-300">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {contactData.contactInfo.locations[0].title}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {contactData.contactInfo.locations[0].address}
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {contactData.contactInfo.locations[0].phone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {contactData.contactInfo.locations[0].email}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-secondary hover:scale-105 transition-transform duration-300">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                      <MapPin className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {contactData.contactInfo.locations[1].title}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {contactData.contactInfo.locations[1].address}
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {contactData.contactInfo.locations[1].phone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {contactData.contactInfo.locations[1].email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form and Map */}
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    ✉️ Kirim Pesan Kepada Kami! ✉️
                  </h3>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <Input placeholder="Masukkan nama lengkap" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input type="email" placeholder="Masukkan email" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No. Telepon
                        </label>
                        <Input placeholder="Masukkan nomor telepon" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subjek
                        </label>
                        <Input placeholder="Masukkan subjek" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pesan
                      </label>
                      <Textarea
                        placeholder="Tulis pesan Anda di sini..."
                        rows={6}
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-300">
                      <Send className="w-4 h-4 mr-2" />
                      🚀 Kirim Pesan
                    </Button>
                  </form>
                </div>

                {/* Map and Additional Info */}
                <div>
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl h-64 mb-6 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-bounce">🗺️</div>
                      <p className="text-gray-600 font-semibold">
                        Peta Lokasi Sekolah Iqrolife
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {contactData.operationalInfo.title}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {contactData.operationalInfo.hours.map(
                            (hour: string, index: number) => (
                              <p key={index}>{hour}</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {contactData.contactDetails.title}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{contactData.contactDetails.phone}</p>
                          <p>WhatsApp: {contactData.contactDetails.whatsapp}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-white rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center flex-shrink-0 animate-wiggle">
                        <Mail className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {contactData.emailInfo.title}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {contactData.emailInfo.emails.map(
                            (email: string, index: number) => (
                              <p key={index}>{email}</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-bounce">
                  {contactData.faq.title}
                </h2>
                <p className="text-xl text-gray-600">
                  {contactData.faq.description}
                </p>
              </div>

              <div className="space-y-6">
                {contactData.faq.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
