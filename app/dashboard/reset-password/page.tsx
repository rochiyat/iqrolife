'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Validate token on page load
    if (token) {
      validateToken(token);
    } else {
      setIsValidating(false);
    }
  }, [token]);

  const validateToken = async (resetToken: string) => {
    try {
      const response = await fetch(
        `/api/dashboard/forgot-password?token=${resetToken}`
      );
      const data = await response.json();

      if (data.valid) {
        setIsValidToken(true);
        setEmail(data.email);
      } else {
        setIsValidToken(false);
        setMessage(data.error || 'Token tidak valid');
      }
    } catch (error) {
      setIsValidToken(false);
      setMessage('Terjadi kesalahan saat validasi token');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/dashboard/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(
          'Password berhasil direset! Silakan login dengan password baru Anda.'
        );
        setTimeout(() => {
          router.push('/dashboard/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Gagal reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setStatus('error');
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-cyan-50 to-lime-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald mx-auto"></div>
            <p className="mt-4 text-gray-600">Memvalidasi token...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || !isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-cyan-50 to-lime-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Token Tidak Valid
            </h2>
            <p className="text-gray-600 mb-6">
              {message ||
                'Link reset password tidak valid atau sudah kadaluarsa.'}
            </p>
            <Link href="/dashboard/forgot-password">
              <Button>Kirim Link Reset Baru</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-cyan-50 to-lime-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">
          🔑
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">
          🔒
        </div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce">
          ✅
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse">
          🎉
        </div>
        <div className="absolute top-1/2 left-5 text-2xl animate-wiggle">
          🌟
        </div>
        <div className="absolute top-1/3 right-5 text-2xl animate-wiggle">
          ✨
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
            🔄 Reset Password 🔄
          </h1>
          <p className="text-gray-600">Buat password baru untuk akun Anda</p>
          <p className="text-sm text-gray-500 mt-2">Email: {email}</p>
        </div>

        <Card className="shadow-2xl border-2 border-emerald-200 bg-white/95 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-brand-emerald">
              Masukkan Password Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-800">Berhasil!</p>
                    <p className="text-sm text-green-700">{message}</p>
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
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  🔒 Password Baru
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-2 border-emerald-200 focus:border-brand-emerald"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 animate-fade-in-up">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  🔒 Konfirmasi Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-2 border-emerald-200 focus:border-brand-emerald"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 animate-bounce-gentle"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </div>
                ) : (
                  '✅ Reset Password ✅'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/dashboard/login"
                className="text-sm text-brand-emerald hover:text-brand-cyan transition-colors duration-300"
              >
                ← Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
