'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  userEmail,
}: ResetPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/dashboard/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.'
        );
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'Gagal mengirim email reset password');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password via Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Messages */}
          {message && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <p className="font-medium mb-2">Anda akan menerima email ke:</p>
              <p className="font-mono text-xs bg-white px-2 py-1 rounded">
                {userEmail}
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-gray-600">
            <p>Email akan berisi:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Link untuk reset password</li>
              <li>Link berlaku selama 1 jam</li>
              <li>Instruksi untuk membuat password baru</li>
            </ul>
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 text-sm">
              Jika email tidak masuk dalam beberapa menit, cek folder Spam/Junk
              Anda.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim Email...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Email Reset
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
