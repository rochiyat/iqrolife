'use client';

import { useEffect, useState } from 'react';

interface FooterData {
  about: {
    title: string;
    description: string;
    logo: string;
  };
  quickLinks: {
    title: string;
    items: Array<{
      title: string;
      href: string;
    }>;
  };
  programs: {
    title: string;
    items: Array<{
      title: string;
      href: string;
    }>;
  };
  schools: {
    title: string;
    items: Array<{
      title: string;
      href: string;
    }>;
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
    social: {
      facebook: string;
      instagram: string;
      youtube: string;
      twitter: string;
    };
  };
  copyright: {
    text: string;
    links: Array<{
      title: string;
      href: string;
    }>;
  };
}

export default function FoundationFooter() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/footer');
        const data = await response.json();
        setFooterData(data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <footer className="border-t bg-gradient-to-b from-white to-[#e8f5e3]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <p className="text-center">Loading footer information...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-gradient-to-b from-white to-[#e8f5e3]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={footerData?.about.logo || '/iqrolife-logo.jpg'}
                alt="Logo Yayasan Iqrolife"
                className="h-9 w-9 rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none text-foreground md:text-base">
                  {footerData?.about.title || 'Tumbuh Bersama Iqrolife'}
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">
                  Profesional • Kekeluargaan
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {footerData?.about.description ||
                'Yayasan yang berfokus pada penguatan ekosistem pendidikan: keluarga, sekolah, dan komunitas.'}
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#2e7d32]">
              {footerData?.quickLinks.title || 'Profile'}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {footerData?.quickLinks.items.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-[#2e7d32] transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#2e7d32]">
              {footerData?.programs.title || 'Program'}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {footerData?.programs.items.map((program, index) => (
                <li key={index}>
                  <a
                    href={program.href}
                    className="hover:text-[#2e7d32] transition-colors"
                  >
                    {program.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#2e7d32]">
              {footerData?.contact.title || 'Kontak'}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Email: {footerData?.contact.email}</li>
              <li>Telepon: {footerData?.contact.phone}</li>
              <li>Alamat: {footerData?.contact.address}</li>
              <li className="pt-2 flex gap-4">
                {footerData?.contact.social.facebook && (
                  <a
                    href={footerData.contact.social.facebook}
                    className="hover:text-[#2e7d32] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                )}
                {footerData?.contact.social.instagram && (
                  <a
                    href={footerData.contact.social.instagram}
                    className="hover:text-[#2e7d32] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                )}
                {footerData?.contact.social.youtube && (
                  <a
                    href={footerData.contact.social.youtube}
                    className="hover:text-[#2e7d32] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>{footerData?.copyright.text}</p>
          <div className="mt-2 flex justify-center gap-4">
            {footerData?.copyright.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-[#2e7d32] transition-colors"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
