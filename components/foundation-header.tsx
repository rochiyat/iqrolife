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
      { href: '/profile/visi', label: 'Visi' },
      { href: '/profile/misi', label: 'Misi' },
    ],
  },
  {
    href: '/program',
    label: 'Program',
    children: [
      { href: '/program/pre-school', label: 'Pre-School' },
      { href: '/program/kelas-eksplorasi', label: 'Kelas Eksplorasi' },
      { href: '/program/kelas-aqil-baligh', label: 'Kelas Aqil Baligh' },
      {
        href: '/program/kelas-belajar-orang-tua',
        label: 'Kelas Belajar Orang Tua',
      },
      { href: '/program/konsultasi-tm', label: 'Konsultasi TM' },
      { href: '/program/komunitas-ayah', label: 'Komunitas Ayah' },
    ],
  },
  { href: '/kontak', label: 'Kontak' },
];

export function FoundationHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 border-b-2 border-muted bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Yayasan Tumbuh Bersama Iqrolife - Beranda"
        >
          <img
            src="/iqrolife-logo.jpg"
            alt="Logo Iqrolife"
            className="h-9 w-9 rounded-md ring-1 ring-border group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none text-foreground md:text-base group-hover:text-primary transition-colors">
              Tumbuh Bersama Iqrolife
            </span>
            <span className="text-xs text-muted-foreground md:text-sm">
              Profesional • Kekeluargaan
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {foundationNav.map((item) => {
            if (item.children) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger
                    className={cn(
                      'relative rounded-md px-3 py-2 text-sm transition-all hover:bg-muted hover:translate-y-[-1px] flex items-center gap-0.5',
                      'after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary after:scale-x-0 after:transition-transform after:duration-200 after:origin-left hover:after:scale-x-100',
                      pathname.startsWith(item.href)
                        ? 'bg-muted font-medium after:scale-x-100'
                        : 'text-foreground'
                    )}
                  >
                    {item.label} <ChevronDownIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          href={child.href}
                          className={cn(
                            'w-full cursor-pointer',
                            pathname === child.href ? 'font-medium' : ''
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
                  'relative rounded-md px-3 py-2 text-sm transition-all hover:bg-muted hover:translate-y-[-1px]',
                  'after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary after:scale-x-0 after:transition-transform after:duration-200 after:origin-left hover:after:scale-x-100',
                  pathname === item.href
                    ? 'bg-muted font-medium after:scale-x-100'
                    : 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/school" className="ml-2">
            <Button
              size="sm"
              className="font-medium transition-transform hover:translate-y-[-1px]"
            >
              Masuk Sekolah
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
            <SheetContent side="right" className="w-[84%] sm:w-[380px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/iqrolife-logo.jpg"
                    alt="Logo Iqrolife"
                    className="h-7 w-7 rounded-md ring-1 ring-border"
                  />
                  <span className="text-sm font-semibold">
                    Tumbuh Bersama Iqrolife
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                {foundationNav.map((item) => {
                  if (item.children) {
                    return (
                      <div key={item.href}>
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="ml-3 flex flex-col gap-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                'rounded-md px-3 py-2 text-sm transition-all hover:bg-muted hover:translate-x-0.5',
                                pathname === child.href
                                  ? 'bg-muted font-medium'
                                  : 'text-foreground'
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
                        'rounded-md px-3 py-3 text-base transition-all hover:bg-muted hover:translate-x-0.5',
                        pathname === item.href
                          ? 'bg-muted font-medium'
                          : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/school"
                  onClick={() => setOpen(false)}
                  className="mt-2"
                >
                  <Button className="w-full" size="sm">
                    Masuk Sekolah
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default FoundationHeader;
