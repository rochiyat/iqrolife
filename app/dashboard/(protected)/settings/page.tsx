'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Building, 
  Mail, 
  Bell, 
  Shield, 
  Palette,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">
          Kelola pengaturan sistem dan preferensi
        </p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-brand-emerald" />
            Informasi Organisasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Organisasi</Label>
              <Input defaultValue="Yayasan Iqrolife" />
            </div>
            <div className="space-y-2">
              <Label>Email Resmi</Label>
              <Input type="email" defaultValue="info@iqrolife.com" />
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input defaultValue="+62 813 1522 5557" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input defaultValue="https://iqrolife.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alamat</Label>
            <Textarea 
              defaultValue="Jl. Contoh No. 123, Jakarta Selatan"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-emerald" />
            Pengaturan Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Username</Label>
              <Input placeholder="email@domain.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Aktifkan Email Notifications</p>
              <p className="text-sm text-gray-600">Kirim email otomatis untuk notifikasi penting</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-emerald" />
            Pengaturan Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Notifikasi Pendaftaran Baru</p>
                <p className="text-sm text-gray-600">Terima notifikasi saat ada pendaftaran baru</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Notifikasi Formulir</p>
                <p className="text-sm text-gray-600">Terima notifikasi untuk formulir yang perlu di-review</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Notifikasi User Baru</p>
                <p className="text-sm text-gray-600">Terima notifikasi saat user baru ditambahkan</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-emerald" />
            Keamanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Tambahkan lapisan keamanan ekstra</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Force Strong Password</p>
                <p className="text-sm text-gray-600">Wajibkan password yang kuat untuk semua user</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (menit)</Label>
              <Input type="number" defaultValue="30" />
              <p className="text-sm text-gray-500">User akan logout otomatis setelah tidak aktif</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand-emerald" />
            Tampilan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo Organisasi</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src="/logo-iqrolife.png" alt="Logo" className="w-16 h-16 object-contain" />
              </div>
              <Button variant="outline">Upload Logo Baru</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input type="color" defaultValue="#10b981" className="w-20" />
              <Input defaultValue="#10b981" className="flex-1" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-600">Aktifkan tema gelap</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset ke Default</Button>
        <Button 
          className="bg-brand-emerald hover:bg-brand-emerald/90"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 border-brand-emerald/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <SettingsIcon className="w-6 h-6 text-brand-emerald mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Tentang Settings
              </h3>
              <p className="text-sm text-gray-600">
                Pengaturan ini akan mempengaruhi seluruh sistem. Pastikan Anda memiliki hak akses 
                yang sesuai sebelum mengubah pengaturan penting. Perubahan yang Anda buat akan 
                disimpan dan diterapkan ke seluruh pengguna sistem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
