"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      alert("Login berhasil! Selamat datang di Sekolah Iqrolife! 🎉")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🌈</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">⭐</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">🎈</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">🎨</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">🦋</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-wiggle delay-700">🌸</div>
        <div className="absolute top-2/3 left-1/4 text-2xl animate-float">☁️</div>
        <div className="absolute top-1/4 right-1/4 text-2xl animate-float delay-500">🌟</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-iqrolife.png"
              alt="Logo Sekolah Iqrolife"
              width={80}
              height={80}
              className="animate-bounce-gentle"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏫 Sekolah Iqrolife 🏫</h1>
          <p className="text-gray-600">Masuk ke portal pembelajaran yang menyenangkan!</p>
        </div>

        <Card className="shadow-2xl border-2 border-yellow-200 bg-white/95 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              🔐 Login Portal 🔐
            </CardTitle>
            <p className="text-gray-600 text-sm">Selamat datang kembali! Mari belajar dengan gembira!</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 animate-fade-in-up">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📧 Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-blue-200 focus:border-primary transition-colors duration-300 hover:border-blue-300"
                />
              </div>

              <div className="space-y-2 animate-fade-in-up delay-200">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  🔒 Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 border-blue-200 focus:border-primary transition-colors duration-300 hover:border-blue-300"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 animate-bounce-gentle"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sedang masuk...
                  </div>
                ) : (
                  "🚀 Masuk Sekarang 🚀"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-300 flex items-center justify-center gap-1"
              >
                🤔 Lupa password?
              </Link>

              <div className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                >
                  Daftar di sini! ✨
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-200 animate-fade-in-up delay-500">
              <p className="text-center text-sm text-gray-700 font-medium">
                🌟 "Belajar itu menyenangkan, mari kita mulai petualangan baru!" 🌟
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 animate-fade-in-up delay-700">
          <p className="text-sm text-gray-600">
            Butuh bantuan? Hubungi kami di{" "}
            <a
              href="https://wa.me/628111202244"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-300"
            >
              💬 WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
