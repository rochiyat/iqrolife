'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);

      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      router.push('/dashboard/home');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4caade]/20 via-white to-[#f2cd5b]/20 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">
          🌈
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">
          ⭐
        </div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce">
          🎈
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse">
          🎨
        </div>
        <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">
          🦋
        </div>
        <div className="absolute top-1/3 right-5 text-2xl animate-wiggle">
          🌸
        </div>
        <div className="absolute top-2/3 left-1/4 text-2xl animate-float">
          ☁️
        </div>
        <div className="absolute top-1/4 right-1/4 text-2xl animate-float">
          🌟
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo-iqrolife.png"
              alt="Logo Iqrolife"
              width={80}
              height={80}
              className="animate-bounce-gentle"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏢 Dashboard Iqrolife 🏢
          </h1>
          <p className="text-gray-600">Masuk ke portal admin dan manajemen</p>
        </div>

        <Card className="shadow-2xl border-2 border-[#4caade]/30 bg-white/95 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-[#4caade] flex items-center justify-center gap-2">
              🔐 Login Dashboard 🔐
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Selamat datang kembali! Kelola sistem Iqrolife
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm animate-fade-in-up">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 animate-fade-in-up">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  📧 Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@iqrolife.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-[#4caade]/30 focus:border-[#4caade] transition-colors duration-300 hover:border-[#4caade]/50"
                />
              </div>

              <div className="space-y-2 animate-fade-in-up">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  🔒 Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 border-[#4caade]/30 focus:border-[#4caade] transition-colors duration-300 hover:border-[#4caade]/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 animate-fade-in-up">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#4caade] border-gray-300 rounded focus:ring-[#4caade] cursor-pointer"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Ingat saya
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4caade] hover:bg-[#3a8fc7] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 animate-bounce-gentle"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sedang masuk...
                  </div>
                ) : (
                  '🚀 Masuk Dashboard 🚀'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <Link
                href="/dashboard/forgot-password"
                className="text-sm text-[#4caade] hover:text-[#3a8fc7] transition-colors duration-300 flex items-center justify-center gap-1"
              >
                🤔 Lupa password?
              </Link>

              <div className="text-sm text-gray-600">
                Kembali ke{' '}
                <Link
                  href="/"
                  className="text-[#4caade] hover:text-[#3a8fc7] font-medium transition-colors duration-300"
                >
                  Beranda ✨
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 animate-fade-in-up">
          <p className="text-sm text-gray-600">
            Butuh bantuan? Hubungi kami di{' '}
            <a
              href="https://wa.me/6281315225557"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4caade] hover:text-[#3a8fc7] font-medium transition-colors duration-300"
            >
              💬 WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
