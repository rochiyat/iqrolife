'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/dashboard/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(
          data.message || 'Link reset password telah dikirim ke email Anda'
        );
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Gagal mengirim link reset password');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setStatus('error');
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4caade]/20 via-white to-[#f2cd5b]/20 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">
          🔑
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">
          ✉️
        </div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce">
          🔒
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse">
          💡
        </div>
        <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">
          🌟
        </div>
        <div className="absolute top-1/3 right-5 text-2xl animate-wiggle">
          ✨
        </div>
        <div className="absolute top-2/3 left-1/4 text-2xl animate-float">
          ☁️
        </div>
        <div className="absolute top-1/4 right-1/4 text-2xl animate-float">
          🎯
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
            🔐 Lupa Password? 🔐
          </h1>
          <p className="text-gray-600">
            Masukkan email Anda untuk reset password
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-emerald-200 bg-white/95 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-brand-emerald flex items-center justify-center gap-2">
              🔄 Reset Password 🔄
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Kami akan mengirimkan link reset ke email Anda
            </p>
          </CardHeader>
          <CardContent>
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-800">Berhasil!</p>
                    <p className="text-sm text-green-700">{message}</p>
                    <p className="text-xs text-green-600 mt-2">
                      Silakan cek email Anda (termasuk folder spam) untuk link
                      reset password.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-red-800">Gagal</p>
                    <p className="text-sm text-red-700">{message}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 animate-fade-in-up">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  📧 Email Terdaftar
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@iqrolife.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-emerald-200 focus:border-brand-emerald transition-colors duration-300 hover:border-emerald-300"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Masukkan email yang Anda gunakan saat mendaftar
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 animate-bounce-gentle"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </div>
                ) : (
                  '📧 Kirim Link Reset 📧'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <Link
                href="/dashboard/login"
                className="text-sm text-brand-emerald hover:text-brand-cyan transition-colors duration-300 flex items-center justify-center gap-1"
              >
                ← Kembali ke Login
              </Link>

              <div className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link
                  href="/"
                  className="text-brand-emerald hover:text-brand-cyan font-medium transition-colors duration-300"
                >
                  Hubungi Admin ✨
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-100 to-emerald-100 rounded-lg border-2 border-cyan-200 animate-fade-in-up">
              <p className="text-center text-sm text-gray-700 font-medium">
                💡 Tip: Link reset password berlaku selama 1 jam
              </p>
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
              className="text-brand-emerald hover:text-brand-cyan font-medium transition-colors duration-300"
            >
              💬 WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
