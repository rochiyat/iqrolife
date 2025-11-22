'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const foundationNav = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  {
    href: '/profile',
    label: 'Profile',
    children: [
      { href: '/profile/sejarah', label: 'Sejarah' },
      { href: '/profile/purpose', label: 'Purpose' },
      { href: '/profile/misi', label: 'Misi' },
      { href: '/profile/visi', label: 'Visi' },
    ],
  },
  {
    href: '/program',
    label: 'Program',
    children: [
      { href: '/program/school', label: 'Kelas Siap Sekolah' },
      { href: '/program/kelas-eksplorasi', label: 'Kelas Eksplorasi' },
      { href: '/program/kelas-aqil-baligh', label: 'Kelas Aqil Baligh' },
      {
        href: '/program/kelas-belajar-orang-tua',
        label: 'Kelas Belajar Orang Tua',
      },
      { href: '/program/mentoring-ayah', label: 'Mentoring Ayah' },
      { href: '/program/mentoring-ibu', label: 'Mentoring Ibu' },
      {
        href: '/program/family-talent-discovery',
        label: 'Family Talent Discovery',
      },
    ],
  },
  { href: '/kontak', label: 'Kontak' },
];

export function FoundationHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 border-b-2 border-[#f2cd5b]/30 bg-[#4caade] backdrop-blur supports-[backdrop-filter]:bg-[#4caade]/95 transition-all duration-300 shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Iqrolife Community - Beranda"
        >
          <img
            src="/logo-iqrolife.png"
            alt="Logo Iqrolife"
            className="h-9 w-9 rounded-md group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none text-white md:text-lg group-hover:text-[#f2cd5b] transition-colors duration-300">
              Iqrolife Community
            </span>
            <span className="text-sm text-[#f2cd5b] md:text-base">
              Fitrah - Bertahap - Paripurna - Sukses & Bahagia
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {foundationNav.map((item) => {
            if (item.children) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-base font-medium text-white transition-colors duration-300 hover:text-[#f2cd5b]">
                    {item.label}
                    <ChevronDownIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          href={child.href}
                          className={cn(
                            'w-full cursor-pointer text-brand-gray transition-colors duration-300 hover:text-brand-cyan',
                            pathname === child.href &&
                              'font-medium text-brand-emerald'
                          )}
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-base font-medium transition-colors duration-300 hover:text-[#f2cd5b]',
                  pathname === item.href
                    ? 'text-[#f2cd5b] font-bold'
                    : 'text-white'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/dashboard/login">
            <Button
              variant="outline"
              className="bg-[#f2cd5b] text-gray-800 hover:bg-[#e5bc45] hover:text-gray-900 border-[#f2cd5b] font-semibold transition-all duration-300 hover:scale-105 shadow-md"
            >
              🔐 Login
            </Button>
          </Link>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                aria-label="Buka menu"
                className="h-9 w-10 bg-transparent"
              >
                <span className="sr-only">Buka menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[84%] sm:w-[380px] flex flex-col p-0"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#4caade]/30">
                <img
                  src="/logo-iqrolife.png"
                  alt="Logo Iqrolife"
                  className="h-8 w-8 rounded-md"
                />
                <span className="text-base font-bold text-[#4caade]">
                  Iqrolife Community
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="flex flex-col gap-1">
                  {foundationNav.map((item) => {
                    if (item.children) {
                      return (
                        <div key={item.href}>
                          <div className="px-3 py-2 text-base font-medium text-[#4caade]">
                            {item.label}
                          </div>
                          <div className="ml-3 flex flex-col gap-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  'rounded-md px-3 py-2 text-sm transition-all duration-300 hover:bg-[#f2cd5b]/20 hover:translate-x-0.5',
                                  pathname === child.href
                                    ? 'bg-[#f2cd5b]/20 font-medium text-[#4caade]'
                                    : 'text-gray-700'
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'rounded-md px-3 py-3 text-base transition-all duration-300 hover:bg-[#f2cd5b]/20 hover:translate-x-0.5',
                          pathname === item.href
                            ? 'bg-[#f2cd5b]/20 font-medium text-[#4caade]'
                            : 'text-gray-700'
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  <Link
                    href="/dashboard/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-semibold transition-all duration-300 bg-[#f2cd5b]/20 hover:bg-[#f2cd5b]/30 text-[#4caade] mt-2"
                  >
                    🔐 Login
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default FoundationHeader;
