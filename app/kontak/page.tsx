import FoundationHeader from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <FoundationHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Hubungi Kami
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Jika Anda memiliki pertanyaan atau ingin mengetahui lebih lanjut
              tentang program-program kami, silakan hubungi kami melalui kontak
              di bawah ini.
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
                    Cimanggu Hejo, Kedung Waringin, Kec. Tanah Sereal, Kota
                    Bogor, Jawa Barat 17540
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="mt-2 text-gray-600">info@iqrolife.or.id</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Telepon
                  </h3>
                  <p className="mt-2 text-gray-600">+0813-1040-5995</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Jam Operasional
                  </h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>Senin - Jumat: 08.00 - 16.00 WIB</p>
                    <p>Sabtu - Minggu: Tutup</p>
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
      </main>
      <FoundationFooter />
    </div>
  );
}
