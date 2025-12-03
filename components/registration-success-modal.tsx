'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationSuccessModal({
  isOpen,
  onClose,
}: RegistrationSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              {/* Decorative Header */}
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-32 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-30"></div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="bg-white p-4 rounded-full shadow-lg relative z-10"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>

                {/* Confetti effects */}
                <div className="absolute top-4 left-10 text-2xl animate-bounce">
                  🎉
                </div>
                <div className="absolute bottom-4 right-10 text-2xl animate-pulse">
                  ✨
                </div>
              </div>

              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Pendaftaran Berhasil!
                </h2>
                <p className="text-gray-600 mb-8">
                  Terima kasih telah mendaftar. Data Anda telah kami terima dan
                  akan segera kami proses. Silakan cek email atau WhatsApp Anda
                  secara berkala.
                </p>

                <div className="space-y-3">
                  <Link href="/program/school">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      Kembali ke Halaman Sekolah
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    Tutup
                  </Button>
                </div>
              </div>

              {/* Close button absolute */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/30 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
