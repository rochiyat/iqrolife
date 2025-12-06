'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loading';

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
      instagram: string;
      youtube: string;
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
      <footer className="border-t border-[#4caade]/30 bg-gradient-to-b from-white to-[#4caade]/5">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Logo and About Section Skeleton */}
            <div className="md:col-span-4 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-9 w-9 rounded-md" />
                <div className="flex flex-col">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Quick Links Section Skeleton */}
            <div className="md:col-span-2 lg:col-span-1">
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))}
              </div>
            </div>

            {/* Programs Section Skeleton */}
            <div className="md:col-span-2 lg:col-span-1">
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-28" />
                ))}
              </div>
            </div>

            {/* Contact Section Skeleton */}
            <div className="md:col-span-2 lg:col-span-1">
              <Skeleton className="h-4 w-16 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section Skeleton */}
          <div className="mt-8 border-t pt-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-3 w-64 mx-auto" />
              <div className="flex justify-center gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#4caade]/30 bg-gradient-to-b from-white to-[#4caade]/5">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={footerData?.about.logo || '/logo-iqrolife.png'}
                alt="Logo Iqrolife Community"
                className="h-9 w-9 rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none text-foreground md:text-base">
                  {footerData?.about.title || 'Iqrolife Community'}
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">
                  Fitrah - Bertahap - Paripurna - Sukses & Bahagia
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {footerData?.about.description ||
                'Yayasan yang berfokus pada penguatan ekosistem pendidikan: keluarga, sekolah, dan komunitas.'}
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#4caade]">
              {footerData?.quickLinks.title || 'Profile'}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {footerData?.quickLinks.items.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-[#4caade] transition-colors duration-300"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#4caade]">
              {footerData?.programs.title || 'Program'}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {footerData?.programs.items.map((program, index) => (
                <li key={index}>
                  <a
                    href={program.href}
                    className="hover:text-[#4caade] transition-colors duration-300"
                  >
                    {program.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-[#4caade]">
              {footerData?.contact.title || 'Kontak'}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>Email: {footerData?.contact.email}</li>
              <li>Telepon: {footerData?.contact.phone}</li>
              <li>Alamat: {footerData?.contact.address}</li>
              <li className="pt-2 flex gap-4">
                {footerData?.contact.social.instagram && (
                  <a
                    href={footerData.contact.social.instagram}
                    className="hover:text-[#4caade] transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                )}
                {footerData?.contact.social.youtube && (
                  <a
                    href={footerData.contact.social.youtube}
                    className="hover:text-[#4caade] transition-colors duration-300"
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
