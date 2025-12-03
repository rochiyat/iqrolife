'use client';

import { useState, useEffect } from 'react';
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
  Save,
  Loader,
} from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  is_public: boolean;
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/settings');
      if (response.ok) {
        const data = await response.json();
        const settingsMap: { [key: string]: any } = {};
        data.data.forEach((setting: Setting) => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const settingsToUpdate = [
        {
          key: 'organization_name',
          value: settings.organization_name || 'Yayasan Iqrolife',
          type: 'string',
          category: 'organization',
        },
        {
          key: 'organization_email',
          value: settings.organization_email || 'info@iqrolife.com',
          type: 'string',
          category: 'organization',
        },
        {
          key: 'organization_phone',
          value: settings.organization_phone || '+62 813 1522 5557',
          type: 'string',
          category: 'organization',
        },
        {
          key: 'organization_website',
          value: settings.organization_website || 'https://iqrolife.com',
          type: 'string',
          category: 'organization',
        },
        {
          key: 'organization_address',
          value: settings.organization_address || '',
          type: 'text',
          category: 'organization',
        },
        {
          key: 'smtp_host',
          value: settings.smtp_host || '',
          type: 'string',
          category: 'email',
        },
        {
          key: 'smtp_port',
          value: settings.smtp_port || '587',
          type: 'string',
          category: 'email',
        },
        {
          key: 'smtp_username',
          value: settings.smtp_username || '',
          type: 'string',
          category: 'email',
        },
        {
          key: 'enable_email_notifications',
          value: settings.enable_email_notifications ? 'true' : 'false',
          type: 'boolean',
          category: 'notifications',
        },
        {
          key: 'enable_registration_notifications',
          value: settings.enable_registration_notifications ? 'true' : 'false',
          type: 'boolean',
          category: 'notifications',
        },
        {
          key: 'enable_form_notifications',
          value: settings.enable_form_notifications ? 'true' : 'false',
          type: 'boolean',
          category: 'notifications',
        },
        {
          key: 'enable_user_notifications',
          value: settings.enable_user_notifications ? 'true' : 'false',
          type: 'boolean',
          category: 'notifications',
        },
        {
          key: 'enable_2fa',
          value: settings.enable_2fa ? 'true' : 'false',
          type: 'boolean',
          category: 'security',
        },
        {
          key: 'force_strong_password',
          value: settings.force_strong_password ? 'true' : 'false',
          type: 'boolean',
          category: 'security',
        },
        {
          key: 'session_timeout',
          value: settings.session_timeout || '30',
          type: 'number',
          category: 'security',
        },
        {
          key: 'primary_color',
          value: settings.primary_color || '#10b981',
          type: 'string',
          category: 'appearance',
        },
        {
          key: 'enable_dark_mode',
          value: settings.enable_dark_mode ? 'true' : 'false',
          type: 'boolean',
          category: 'appearance',
        },
      ];

      // Send all settings in a single batch request
      const response = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToUpdate), // Send array
      });

      const result = await response.json();

      if (response.ok) {
        alert('Settings berhasil disimpan!');
        await fetchSettings(); // Refresh data
      } else {
        alert(result.error || 'Gagal menyimpan settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-brand-emerald" />
      </div>
    );
  }

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
              <Input
                value={settings.organization_name || 'Yayasan Iqrolife'}
                onChange={(e) =>
                  handleSettingChange('organization_name', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email Resmi</Label>
              <Input
                type="email"
                value={settings.organization_email || 'info@iqrolife.com'}
                onChange={(e) =>
                  handleSettingChange('organization_email', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input
                value={settings.organization_phone || '+62 813 1522 5557'}
                onChange={(e) =>
                  handleSettingChange('organization_phone', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={settings.organization_website || 'https://iqrolife.com'}
                onChange={(e) =>
                  handleSettingChange('organization_website', e.target.value)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alamat</Label>
            <Textarea
              value={settings.organization_address || ''}
              onChange={(e) =>
                handleSettingChange('organization_address', e.target.value)
              }
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
              <Input
                placeholder="smtp.gmail.com"
                value={settings.smtp_host || ''}
                onChange={(e) =>
                  handleSettingChange('smtp_host', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input
                placeholder="587"
                value={settings.smtp_port || '587'}
                onChange={(e) =>
                  handleSettingChange('smtp_port', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Username</Label>
              <Input
                placeholder="email@domain.com"
                value={settings.smtp_username || ''}
                onChange={(e) =>
                  handleSettingChange('smtp_username', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={settings.smtp_password || ''}
                onChange={(e) =>
                  handleSettingChange('smtp_password', e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                Aktifkan Email Notifications
              </p>
              <p className="text-sm text-gray-600">
                Kirim email otomatis untuk notifikasi penting
              </p>
            </div>
            <Switch
              checked={settings.enable_email_notifications || false}
              onCheckedChange={(checked) =>
                handleSettingChange('enable_email_notifications', checked)
              }
            />
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
                <p className="font-medium text-gray-900">
                  Notifikasi Pendaftaran Baru
                </p>
                <p className="text-sm text-gray-600">
                  Terima notifikasi saat ada pendaftaran baru
                </p>
              </div>
              <Switch
                checked={settings.enable_registration_notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingChange(
                    'enable_registration_notifications',
                    checked
                  )
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Notifikasi Formulir</p>
                <p className="text-sm text-gray-600">
                  Terima notifikasi untuk formulir yang perlu di-review
                </p>
              </div>
              <Switch
                checked={settings.enable_form_notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingChange('enable_form_notifications', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Notifikasi User Baru
                </p>
                <p className="text-sm text-gray-600">
                  Terima notifikasi saat user baru ditambahkan
                </p>
              </div>
              <Switch
                checked={settings.enable_user_notifications || false}
                onCheckedChange={(checked) =>
                  handleSettingChange('enable_user_notifications', checked)
                }
              />
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
                <p className="font-medium text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-600">
                  Tambahkan lapisan keamanan ekstra
                </p>
              </div>
              <Switch
                checked={settings.enable_2fa || false}
                onCheckedChange={(checked) =>
                  handleSettingChange('enable_2fa', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Force Strong Password
                </p>
                <p className="text-sm text-gray-600">
                  Wajibkan password yang kuat untuk semua user
                </p>
              </div>
              <Switch
                checked={settings.force_strong_password || false}
                onCheckedChange={(checked) =>
                  handleSettingChange('force_strong_password', checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (menit)</Label>
              <Input
                type="number"
                value={settings.session_timeout || '30'}
                onChange={(e) =>
                  handleSettingChange('session_timeout', e.target.value)
                }
              />
              <p className="text-sm text-gray-500">
                User akan logout otomatis setelah tidak aktif
              </p>
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
            <Label>Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={settings.primary_color || '#10b981'}
                onChange={(e) =>
                  handleSettingChange('primary_color', e.target.value)
                }
                className="w-20"
              />
              <Input
                value={settings.primary_color || '#10b981'}
                onChange={(e) =>
                  handleSettingChange('primary_color', e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-600">Aktifkan tema gelap</p>
            </div>
            <Switch
              checked={settings.enable_dark_mode || false}
              onCheckedChange={(checked) =>
                handleSettingChange('enable_dark_mode', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={fetchSettings}>
          Reset ke Default
        </Button>
        <Button
          className="bg-brand-emerald hover:bg-brand-emerald/90"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
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
                Pengaturan ini akan mempengaruhi seluruh sistem. Pastikan Anda
                memiliki hak akses yang sesuai sebelum mengubah pengaturan
                penting. Perubahan yang Anda buat akan disimpan dan diterapkan
                ke seluruh pengguna sistem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
