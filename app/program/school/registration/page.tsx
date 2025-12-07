'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FoundationHeader } from '@/components/foundation-header';
import FoundationFooter from '@/components/foundation-footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  FileText,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

import { RegistrationSuccessModal } from '@/components/registration-success-modal';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tanggalLahir: '',
    jenisKelamin: '',
    namaOrangTua: '',
    noTelepon: '',
    email: '',
    alamat: '',
    asalSekolah: '',
    program: '',
    catatan: '',
    referralCode: '',
    nominal: '',
  });
  const [buktiTransfer, setBuktiTransfer] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Referral code states
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  const [referralStatus, setReferralStatus] = useState<
    'idle' | 'valid' | 'invalid'
  >('idle');

  // Coupon states
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponData, setCouponData] = useState<{
    discountValue: number;
    couponName: string;
  } | null>(null);
  const originalPrice = 350000; // Harga awal hardcoded

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'nominal') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      // Format with thousand separator (dot)
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setBuktiTransfer(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'nominal') {
          // Send raw number without dots
          formDataToSend.append(key, value.replace(/\./g, ''));
        } else {
          formDataToSend.append(key, value);
        }
      });
      if (buktiTransfer) {
        formDataToSend.append('buktiTransfer', buktiTransfer);
      }
      // Add couponCode if valid coupon is applied
      // if (referralStatus === 'valid' && couponData && formData.referralCode) {
      formDataToSend.append('couponCode', formData.referralCode);
      // }

      const response = await fetch('/api/program/school/registration', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setShowSuccessModal(true);
        setFormData({
          namaLengkap: '',
          tanggalLahir: '',
          jenisKelamin: '',
          namaOrangTua: '',
          noTelepon: '',
          email: '',
          alamat: '',
          asalSekolah: '',
          program: '',
          catatan: '',
          referralCode: '',
          nominal: '',
        });
        setReferralStatus('idle');
        setBuktiTransfer(null);
        setPreviewUrl('');
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(
          errorData.error ||
            'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(
        'Terjadi kesalahan jaringan. Pastikan koneksi internet Anda stabil dan coba lagi.'
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckReferral = async () => {
    if (!formData.referralCode.trim()) return;

    setIsCheckingReferral(true);
    setReferralStatus('idle');
    setCouponData(null);

    try {
      const response = await fetch(BACKEND_URL + '/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.referralCode,
          program: 'KSS',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReferralStatus('valid');
        const discountValue = parseFloat(data.coupon.discountValue);
        setCouponData({
          discountValue: discountValue,
          couponName: data.coupon.name,
        });
        setShowCouponModal(true);
      } else {
        setReferralStatus('invalid');
      }
    } catch (error) {
      console.error('Error checking referral:', error);
      setReferralStatus('invalid');
    } finally {
      setIsCheckingReferral(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <FoundationHeader />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">
              📝
            </div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse">
              ✨
            </div>
            <div className="absolute bottom-20 left-20 text-3xl animate-float">
              🎓
            </div>
            <div className="absolute bottom-10 right-10 text-4xl animate-bounce-gentle">
              🌟
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 text-lg animate-bounce">
              Formulir Pendaftaran
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-bounce-gentle">
              🎒 Kelas Siap Sekolah Iqrolife 🎒
            </h1>
            <p className="text-center text-gray-700 max-w-3xl mx-auto mb-4 text-lg font-medium leading-relaxed">
              Bergabunglah dengan keluarga besar Iqrolife dan wujudkan masa
              depan gemilang putra-putri Anda! ✨
            </p>
            <Link href="/program/school">
              <Button
                variant="outline"
                className="gap-2 hover:scale-105 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Halaman Sekolah
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 text-6xl animate-bounce-gentle opacity-70">
            🎨
          </div>
          <div className="absolute -top-6 -right-6 text-6xl animate-pulse opacity-70">
            ✏️
          </div>
          <div className="absolute -bottom-6 -left-6 text-6xl animate-float opacity-70">
            📚
          </div>
          <div className="absolute -bottom-6 -right-6 text-6xl animate-bounce-gentle opacity-70">
            🌈
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-4 border-gradient-to-r from-orange-200 via-pink-200 to-purple-200 shadow-2xl relative overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-orange-200 to-transparent opacity-50"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-200 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-200 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-200 to-transparent opacity-50"></div>

            <CardContent className="p-8 relative z-10">
              {/* Success Modal */}
              <RegistrationSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
              />

              {/* Coupon Success Modal */}
              {showCouponModal && couponData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowCouponModal(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-green-200"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        🎉 Kupon Berhasil Digunakan! 🎉
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Selamat! Anda mendapat potongan harga dari kupon{' '}
                        <strong>{couponData.couponName}</strong>
                      </p>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Harga Awal:</span>
                            <span className="text-gray-800 font-semibold">
                              {formatCurrency(originalPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-green-600">
                            <span>Potongan:</span>
                            <span className="font-semibold">
                              - {formatCurrency(couponData.discountValue)}
                            </span>
                          </div>
                          <div className="border-t-2 border-green-300 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-bold text-lg">
                                Total Bayar:
                              </span>
                              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {formatCurrency(
                                  originalPrice - couponData.discountValue
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setShowCouponModal(false)}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        Lanjutkan Pendaftaran
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Error Modal */}
              {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowErrorModal(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-red-200"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-400 to-rose-400 flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        😔 Pendaftaran Gagal 😔
                      </h3>
                      <p className="text-gray-600 mb-6">{errorMessage}</p>

                      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 mb-6 border-2 border-red-200">
                        <p className="text-sm text-gray-700">
                          Pastikan semua data sudah diisi dengan benar dan coba
                          lagi. Jika masalah berlanjut, silakan hubungi admin
                          kami.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => setShowErrorModal(false)}
                          variant="outline"
                          className="flex-1 py-3 border-2 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Tutup
                        </Button>
                        <Button
                          onClick={() => {
                            setShowErrorModal(false);
                            setSubmitStatus('idle');
                          }}
                          className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          Coba Lagi
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Anak */}
                <div className="space-y-4 bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-2xl border-2 border-orange-200 shadow-md">
                  <h2 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    Data Anak
                  </h2>

                  <div>
                    <Label
                      htmlFor="namaLengkap"
                      className="text-gray-700 font-semibold"
                    >
                      Nama Lengkap Anak <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="namaLengkap"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan nama lengkap anak"
                      className="mt-1 border-2 focus:border-orange-400 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="tanggalLahir"
                        className="text-gray-700 font-semibold"
                      >
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tanggalLahir"
                        name="tanggalLahir"
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        required
                        className="mt-1 border-2 focus:border-orange-400 transition-all"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="jenisKelamin"
                        className="text-gray-700 font-semibold"
                      >
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="jenisKelamin"
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all"
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="asalSekolah"
                      className="text-gray-700 font-semibold"
                    >
                      Asal Sekolah/TK (jika ada)
                    </Label>
                    <Input
                      id="asalSekolah"
                      name="asalSekolah"
                      value={formData.asalSekolah}
                      onChange={handleInputChange}
                      placeholder="Masukkan asal sekolah/TK"
                      className="mt-1 border-2 focus:border-orange-400 transition-all"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="program"
                      className="text-gray-700 font-semibold"
                    >
                      Pilih Program <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all"
                    >
                      <option value="">Pilih program</option>
                      <option value="Kelas Siap Sekolah">
                        Kelas Siap Sekolah
                      </option>
                      <option value="Kelas Bermain">Kelas Bermain</option>
                    </select>
                  </div>
                </div>

                {/* Data Orang Tua */}
                <div className="space-y-4 bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-200 shadow-md">
                  <h2 className="text-2xl font-bold text-pink-800 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    Data Orang Tua/Wali
                  </h2>

                  <div>
                    <Label
                      htmlFor="namaOrangTua"
                      className="text-gray-700 font-semibold"
                    >
                      Nama Orang Tua/Wali{' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="namaOrangTua"
                      name="namaOrangTua"
                      value={formData.namaOrangTua}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan nama orang tua/wali"
                      className="mt-1 border-2 focus:border-pink-400 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="noTelepon"
                        className="text-gray-700 font-semibold"
                      >
                        No. Telepon/WhatsApp{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="noTelepon"
                          name="noTelepon"
                          type="tel"
                          value={formData.noTelepon}
                          onChange={handleInputChange}
                          required
                          placeholder="08xx-xxxx-xxxx"
                          className="mt-1 pl-10 border-2 focus:border-pink-400 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-semibold"
                      >
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="email@example.com"
                          className="mt-1 pl-10 border-2 focus:border-pink-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="alamat"
                      className="text-gray-700 font-semibold"
                    >
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Masukkan alamat lengkap"
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition-all"
                    />
                  </div>
                </div>

                {/* Referral Code - Moved above Bukti Transfer */}
                <div className="space-y-4 bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    Referral Code (Opsional)
                  </h2>
                  <p className="text-sm text-gray-600">
                    Masukkan kode referral jika Anda memilikinya untuk
                    mendapatkan keuntungan khusus
                  </p>

                  <div className="space-y-2">
                    <Label
                      htmlFor="referralCode"
                      className="text-gray-700 font-semibold"
                    >
                      Kode Referral
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          id="referralCode"
                          name="referralCode"
                          type="text"
                          value={formData.referralCode}
                          onChange={(e) => {
                            handleInputChange(e);
                            setReferralStatus('idle');
                          }}
                          placeholder="Masukkan kode referral"
                          className="border-2 border-gray-300 focus:border-orange-400 focus:ring-orange-500"
                        />
                      </div>
                      {/*
                      <Button
                        type="button"
                        onClick={handleCheckReferral}
                        disabled={
                          !formData.referralCode.trim() || isCheckingReferral
                        }
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCheckingReferral ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          'Check'
                        )}
                      </Button>
                    */}
                    </div>
                    {/* Status Messages */}
                    {referralStatus === 'valid' && couponData && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            Kode referral valid! 🎉
                          </span>
                        </div>
                        <p className="text-sm mt-2 ml-7">
                          Anda mendapat potongan{' '}
                          <strong className="text-green-800">
                            {formatCurrency(couponData.discountValue)}
                          </strong>{' '}
                          dari harga{' '}
                          <span className="line-through">
                            {formatCurrency(originalPrice)}
                          </span>{' '}
                          menjadi{' '}
                          <strong className="text-green-800">
                            {formatCurrency(
                              originalPrice - couponData.discountValue
                            )}
                          </strong>
                        </p>
                      </motion.div>
                    )}

                    {referralStatus === 'invalid' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Kode referral tidak valid
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Upload Bukti Transfer */}
                <div className="space-y-4 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-200 shadow-md">
                  <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    Bukti Transfer Pendaftaran
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      Informasi Pembayaran:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Bank: BSI</li>
                      <li>• No. Rekening: 7336694568</li>
                      <li>• Atas Nama: TUMBUH BERSAMA IQROLIFE</li>
                    </ul>
                  </div>

                  <div>
                    <Label
                      htmlFor="nominal"
                      className="text-gray-700 font-semibold"
                    >
                      Nominal Transfer <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                        Rp
                      </span>
                      <Input
                        id="nominal"
                        name="nominal"
                        type="text"
                        inputMode="numeric"
                        value={formData.nominal}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan jumlah yang ditransfer"
                        className="mt-1 pl-10 border-2 focus:border-purple-400 transition-all font-semibold text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="buktiTransfer"
                      className="text-gray-700 font-semibold"
                    >
                      Upload Bukti Transfer{' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-300 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition-all">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="buktiTransfer"
                            className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                          >
                            <span>Upload file</span>
                            <input
                              id="buktiTransfer"
                              name="buktiTransfer"
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleFileChange}
                              required
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">atau drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF hingga 5MB
                        </p>
                      </div>
                    </div>

                    {previewUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 relative"
                      >
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        {buktiTransfer?.type.includes('image') ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-64 rounded-lg border border-gray-300 mx-auto"
                          />
                        ) : (
                          <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-3">
                            <FileText className="w-8 h-8 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {buktiTransfer?.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {(
                                  buktiTransfer?.size || 0 / 1024 / 1024
                                ).toFixed(2)}{' '}
                                MB
                              </p>
                            </div>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBuktiTransfer(null);
                            setPreviewUrl('');
                          }}
                          className="mt-2"
                        >
                          Hapus File
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Catatan Tambahan */}
                <div className="space-y-4 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    Catatan Tambahan
                  </h2>

                  <div>
                    <Label
                      htmlFor="catatan"
                      className="text-gray-700 font-semibold"
                    >
                      Catatan (Opsional)
                    </Label>
                    <textarea
                      id="catatan"
                      name="catatan"
                      value={formData.catatan}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tambahkan catatan atau informasi tambahan jika ada"
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-md">
                  <div className="text-center mb-4">
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      🎉 Siap Bergabung? 🎉
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Klik tombol di bawah untuk mengirim pendaftaran Anda
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:from-orange-700 hover:via-pink-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Kirim Pendaftaran
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <FoundationFooter />
    </div>
  );
}
