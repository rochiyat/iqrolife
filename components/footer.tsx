'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SkeletonFooter } from '@/components/ui/skeleton-loading';

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // API endpoint removed - school folder deleted
        setFooterData(null);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return <SkeletonFooter />;
  }

  if (!footerData) {
    return (
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Error loading footer data
            </h2>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-[#4caade] via-[#3a8fc7] to-[#4caade] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 bg-[#f2cd5b]/30 rounded-full animate-bounce opacity-50">
          ⭐
        </div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-[#f2cd5b]/30 rounded-full animate-pulse opacity-50">
          🌟
        </div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-white/20 rounded-full animate-float opacity-50">
          🎈
        </div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-[#f2cd5b]/30 rounded-full animate-wiggle opacity-50">
          ✨
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src={footerData.brand.logo || '/logo-iqrolife.png'}
                alt="Sekolah Iqrolife Logo"
                width={40}
                height={40}
                className="rounded-full hover:scale-110 transition-transform duration-300 bg-white p-1"
              />
              <span className="text-xl font-bold text-[#f2cd5b]">
                {footerData.brand.name}
              </span>
            </div>
            <p className="text-white/90 leading-relaxed">
              {footerData.brand.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              🏫 Fasilitas Sekolah
            </h3>
            <ul className="space-y-2 text-gray-300">
              {footerData.facilities?.map((facility: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">❄️</span>
                  {facility}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              🎯 Program Khusus
            </h3>
            <ul className="space-y-2 text-gray-300">
              {footerData.programs?.map((program: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">👑</span>
                  {program}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              📞 Kontak Kami
            </h3>
            <div className="space-y-3 text-white/90">
              <div className="flex items-start gap-3 hover:text-[#f2cd5b] transition-colors duration-300">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-sm">{footerData.contact.address}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-[#f2cd5b] transition-colors duration-300">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{footerData.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 hover:text-[#f2cd5b] transition-colors duration-300">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{footerData.contact.email}</span>
              </div>
              <div className="flex items-start gap-3 hover:text-[#f2cd5b] transition-colors duration-300">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-sm">{footerData.contact.hours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80 flex items-center justify-center gap-2">
            © 2025 Sekolah Iqrolife Bogor. All rights reserved.
            <span className="animate-pulse">💖</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
