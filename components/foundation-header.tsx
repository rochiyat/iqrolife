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
      { href: '/program/komunitas-ayah', label: 'Mentoring Ayah' },
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
    <header className="w-full sticky top-0 z-50 border-b-2 border-brand-lime/30 bg-brand-emerald backdrop-blur supports-[backdrop-filter]:bg-brand-emerald/95 transition-all duration-300">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Iqrolife Community - Beranda"
        >
          <img
            src="/iqrolife-logo.jpg"
            alt="Logo Iqrolife"
            className="h-9 w-9 rounded-md ring-1 ring-border group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none text-brand-off-white md:text-lg group-hover:text-brand-lime transition-colors duration-300">
              Iqrolife Community
            </span>
            <span className="text-sm text-brand-lime md:text-base">
              Profesional • Kekeluargaan
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {foundationNav.map((item) => {
            if (item.children) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-base font-medium text-brand-off-white transition-colors duration-300 hover:text-brand-lime">
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
                  'text-base font-medium transition-colors duration-300 hover:text-brand-lime',
                  pathname === item.href
                    ? 'text-brand-lime font-bold'
                    : 'text-brand-off-white'
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
              className="w-[84%] sm:w-[380px] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-lime/30">
                <div className="flex items-center gap-3">
                  <img
                    src="/iqrolife-logo.jpg"
                    alt="Logo Iqrolife"
                    className="h-7 w-7 rounded-md ring-1 ring-brand-lime/30"
                  />
                  <span className="text-sm font-bold text-brand-emerald">
                    Iqrolife Community
                  </span>
                </div>
              </div>

              <div className="mt-6 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-1 pb-6">
                  {foundationNav.map((item) => {
                    if (item.children) {
                      return (
                        <div key={item.href}>
                          <div className="px-3 py-2 text-base font-medium text-brand-emerald">
                            {item.label}
                          </div>
                          <div className="ml-3 flex flex-col gap-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  'rounded-md px-3 py-2 text-sm transition-all duration-300 hover:bg-brand-lime/20 hover:translate-x-0.5',
                                  pathname === child.href
                                    ? 'bg-brand-lime/20 font-medium text-brand-emerald'
                                    : 'text-brand-gray'
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
                          'rounded-md px-3 py-3 text-base transition-all duration-300 hover:bg-brand-lime/20 hover:translate-x-0.5',
                          pathname === item.href
                            ? 'bg-brand-lime/20 font-medium text-brand-emerald'
                            : 'text-brand-gray'
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
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
