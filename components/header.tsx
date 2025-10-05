import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-white via-fun-yellow/5 to-fun-pink/5 shadow-lg border-b-4 border-gradient-to-r from-fun-blue to-fun-green">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 fun-hover">
            <div className="relative">
              <Image
                src="/logo-iqrolife.png"
                alt="Sekolah Iqrolife Logo"
                width={42}
                height={42}
                className="sm:w-[50px] sm:h-[50px] rounded-full border-3 border-fun-blue shadow-lg hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 animate-bounce-gentle">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fun-yellow" />
              </div>
            </div>
            <Link
              href="/school"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple bg-clip-text text-transparent hover:from-fun-purple hover:to-fun-pink transition-all duration-300"
            >
              Sekolah Iqrolife
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/school"
              className="text-gray-700 hover:text-fun-blue font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Beranda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/school/tentang"
              className="text-gray-700 hover:text-fun-green font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Tentang Kami
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-green group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="relative group">
              <Link
                href="/school"
                className="text-gray-700 hover:text-fun-purple font-medium transition-all duration-300 hover:scale-105 flex items-center"
              >
                Program
                <svg
                  className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-fun-blue/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-3">
                  <Link
                    href="/school/kbtk"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-blue/10 hover:text-fun-blue font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    🧸 KBTK Iqrolife
                  </Link>
                  <Link
                    href="/school"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-green/10 hover:text-fun-green font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    🏫 Profil Sekolah
                  </Link>
                  <Link
                    href="/school/tentang"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-purple/10 hover:text-fun-purple font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    📖 Tentang Kami
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/school/ppdb"
              className="text-gray-700 hover:text-fun-orange font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              PPDB
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-orange group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/school/kontak"
              className="text-gray-700 hover:text-fun-pink font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Kontak
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-fun-blue font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Komunitas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              asChild
              className="bg-gradient-to-r from-fun-orange to-fun-pink hover:from-fun-pink hover:to-fun-orange text-white font-bold px-5 py-2 rounded-full fun-button shadow-lg border-2 border-white/20"
            >
              <Link href="/school/ppdb">Daftar</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-fun-blue to-fun-purple hover:from-fun-purple hover:to-fun-blue text-white font-bold px-5 py-2 rounded-full fun-button shadow-lg"
            >
              <Link href="/school/login">Masuk Online</Link>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild aria-label="Buka menu">
                <Button variant="ghost" className="p-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-4/5 sm:max-w-xs">
                <nav className="flex flex-col gap-2 mt-6">
                  <Link
                    href="/school"
                    className="px-3 py-2 rounded-lg hover:bg-fun-blue/10"
                  >
                    Beranda
                  </Link>
                  <Link
                    href="/school/tentang"
                    className="px-3 py-2 rounded-lg hover:bg-fun-green/10"
                  >
                    Tentang Kami
                  </Link>
                  <div className="mt-2">
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Program
                    </p>
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/school/kbtk"
                        className="px-3 py-2 rounded-lg hover:bg-fun-blue/10"
                      >
                        🧸 KBTK Iqrolife
                      </Link>
                      <Link
                        href="/school"
                        className="px-3 py-2 rounded-lg hover:bg-fun-green/10"
                      >
                        🏫 Profil Sekolah
                      </Link>
                      <Link
                        href="/school/tentang"
                        className="px-3 py-2 rounded-lg hover:bg-fun-purple/10"
                      >
                        📖 Tentang Kami
                      </Link>
                    </div>
                  </div>
                  <Link
                    href="/school/ppdb"
                    className="px-3 py-2 rounded-lg hover:bg-fun-orange/10"
                  >
                    PPDB
                  </Link>
                  <Link
                    href="/school/kontak"
                    className="px-3 py-2 rounded-lg hover:bg-fun-pink/10"
                  >
                    Kontak
                  </Link>
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-lg hover:bg-fun-blue/10"
                  >
                    Yayasan
                  </Link>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/school/ppdb"
                      className="flex-1 text-center bg-gradient-to-r from-fun-orange to-fun-pink text-white rounded-full py-2 font-semibold"
                    >
                      Daftar
                    </Link>
                    <Link
                      href="/school/login"
                      className="flex-1 text-center bg-gradient-to-r from-fun-blue to-fun-purple text-white rounded-full py-2 font-semibold"
                    >
                      Masuk
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
