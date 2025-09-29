import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-white via-fun-yellow/5 to-fun-pink/5 shadow-lg border-b-4 border-gradient-to-r from-fun-blue to-fun-green">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 fun-hover">
            <div className="relative">
              <Image
                src="/logo-iqrolife.png"
                alt="Sekolah Iqrolife Logo"
                width={50}
                height={50}
                className="rounded-full border-3 border-fun-blue shadow-lg hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 animate-bounce-gentle">
                <Sparkles className="w-4 h-4 text-fun-yellow" />
              </div>
            </div>
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple bg-clip-text text-transparent hover:from-fun-purple hover:to-fun-pink transition-all duration-300"
            >
              Sekolah Iqrolife
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-fun-blue font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              🏠 Beranda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-blue group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/tentang"
              className="text-gray-700 hover:text-fun-green font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              ℹ️ Tentang Kami
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-green group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-fun-purple font-medium transition-all duration-300 hover:scale-105 flex items-center">
                🎓 Program
                <svg
                  className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-fun-blue/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-3">
                  <Link
                    href="/kbtk"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-blue/10 hover:text-fun-blue font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    🧸 KB-TK Iqrolife
                  </Link>
                  <Link
                    href="/sd"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-green/10 hover:text-fun-green font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    📖 SD Iqrolife
                  </Link>
                  <Link
                    href="/smp"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-orange/10 hover:text-fun-orange font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    🎯 SMP Iqrolife
                  </Link>
                  <Link
                    href="/homeschooling"
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-fun-purple/10 hover:text-fun-purple font-medium transition-all duration-200 rounded-lg mx-2"
                  >
                    🏠 Homeschooling
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/ppdb"
              className="text-gray-700 hover:text-fun-orange font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              📝 PPDB
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-orange group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/kontak"
              className="text-gray-700 hover:text-fun-pink font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              📞 Kontak
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fun-pink group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-fun-orange to-fun-pink hover:from-fun-pink hover:to-fun-orange text-white font-bold px-6 py-2 rounded-full fun-button shadow-lg border-2 border-white/20">
              <Link href="/ppdb">✨ Daftar</Link>
            </Button>
            <Button className="bg-gradient-to-r from-fun-blue to-fun-purple hover:from-fun-purple hover:to-fun-blue text-white font-bold px-6 py-2 rounded-full fun-button shadow-lg">
              <Link href="/login">🚀 Masuk Online</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
