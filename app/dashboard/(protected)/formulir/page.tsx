'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Home,
  Users,
  Heart,
  CheckSquare,
  FileText,
} from 'lucide-react';

interface FormData {
  // Step 1: Data Pribadi
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  kewarganegaraan: string;
  anakKe: string;
  jumlahSaudara: string;
  bahasaSehariHari: string;

  // Step 2: Keterangan Tempat Tinggal
  alamatLengkap: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  jarakKeSekolah: string;

  // Step 3: Data Orang Tua/Wali
  namaAyah: string;
  pekerjaanAyah: string;
  pendidikanAyah: string;
  teleponAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  pendidikanIbu: string;
  teleponIbu: string;
  namaWali: string;
  hubunganWali: string;
  teleponWali: string;

  // Step 4: Data Kesehatan & Lainnya
  golonganDarah: string;
  riwayatPenyakit: string;
  alergi: string;
  tinggiBadan: string;
  beratBadan: string;
  riwayatVaksinasi: string;
  hobiMinat: string;
  prestasiYangPernahDiraih: string;

  // Step 5: Pernyataan dan Konfirmasi
  programYangDipilih: string;
  informasiTambahan: string;
  pernyataanSetuju: boolean;
}

export default function FormulirPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    namaLengkap: '',
    namaPanggilan: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    agama: '',
    kewarganegaraan: 'Indonesia',
    anakKe: '',
    jumlahSaudara: '',
    bahasaSehariHari: '',

    // Step 2
    alamatLengkap: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kabupatenKota: '',
    provinsi: '',
    kodePos: '',
    telepon: '',
    jarakKeSekolah: '',

    // Step 3
    namaAyah: '',
    pekerjaanAyah: '',
    pendidikanAyah: '',
    teleponAyah: '',
    namaIbu: '',
    pekerjaanIbu: '',
    pendidikanIbu: '',
    teleponIbu: '',
    namaWali: '',
    hubunganWali: '',
    teleponWali: '',

    // Step 4
    golonganDarah: '',
    riwayatPenyakit: '',
    alergi: '',
    tinggiBadan: '',
    beratBadan: '',
    riwayatVaksinasi: '',
    hobiMinat: '',
    prestasiYangPernahDiraih: '',

    // Step 5
    programYangDipilih: '',
    informasiTambahan: '',
    pernyataanSetuju: false,
  });

  const steps = [
    {
      number: 1,
      title: 'Data Pribadi',
      icon: User,
      description: 'DATA PRIBADI',
    },
    {
      number: 2,
      title: 'Tempat Tinggal',
      icon: Home,
      description: 'KETERANGAN TEMPAT TINGGAL',
    },
    {
      number: 3,
      title: 'Data Orang Tua',
      icon: Users,
      description: 'DATA ORANG TUA/WALI',
    },
    {
      number: 4,
      title: 'Kesehatan & Lainnya',
      icon: Heart,
      description: 'DATA KESEHATAN DAN LAINNYA',
    },
    {
      number: 5,
      title: 'Konfirmasi',
      icon: CheckSquare,
      description: 'PERNYATAAN DAN KONFIRMASI',
    },
  ];

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Formulir berhasil dikirim!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-emerald mb-4">
              DATA PRIBADI
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaLengkap">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    handleInputChange('namaLengkap', e.target.value)
                  }
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="namaPanggilan">
                  Nama Panggilan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="namaPanggilan"
                  value={formData.namaPanggilan}
                  onChange={(e) =>
                    handleInputChange('namaPanggilan', e.target.value)
                  }
                  placeholder="Masukkan nama panggilan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenisKelamin">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </Label>
                <select
                  id="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={(e) =>
                    handleInputChange('jenisKelamin', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempatLahir">
                  Tempat Lahir <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={(e) =>
                    handleInputChange('tempatLahir', e.target.value)
                  }
                  placeholder="Masukkan tempat lahir"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahir">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) =>
                    handleInputChange('tanggalLahir', e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agama">
                  Agama <span className="text-red-500">*</span>
                </Label>
                <select
                  id="agama"
                  value={formData.agama}
                  onChange={(e) => handleInputChange('agama', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Pilih agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kewarganegaraan">
                  Kewarganegaraan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kewarganegaraan"
                  value={formData.kewarganegaraan}
                  onChange={(e) =>
                    handleInputChange('kewarganegaraan', e.target.value)
                  }
                  placeholder="Masukkan kewarganegaraan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anakKe">
                  Anak Ke- <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="anakKe"
                  type="number"
                  value={formData.anakKe}
                  onChange={(e) => handleInputChange('anakKe', e.target.value)}
                  placeholder="Contoh: 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlahSaudara">
                  Jumlah Saudara <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jumlahSaudara"
                  type="number"
                  value={formData.jumlahSaudara}
                  onChange={(e) =>
                    handleInputChange('jumlahSaudara', e.target.value)
                  }
                  placeholder="Contoh: 2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bahasaSehariHari">
                  Bahasa Sehari-hari <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bahasaSehariHari"
                  value={formData.bahasaSehariHari}
                  onChange={(e) =>
                    handleInputChange('bahasaSehariHari', e.target.value)
                  }
                  placeholder="Contoh: Bahasa Indonesia, Jawa"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-emerald mb-4">
              KETERANGAN TEMPAT TINGGAL
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamatLengkap">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={(e) =>
                    handleInputChange('alamatLengkap', e.target.value)
                  }
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rt">
                    RT <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rt"
                    value={formData.rt}
                    onChange={(e) => handleInputChange('rt', e.target.value)}
                    placeholder="Contoh: 001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rw">
                    RW <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rw"
                    value={formData.rw}
                    onChange={(e) => handleInputChange('rw', e.target.value)}
                    placeholder="Contoh: 005"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kelurahan">
                    Kelurahan/Desa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kelurahan"
                    value={formData.kelurahan}
                    onChange={(e) =>
                      handleInputChange('kelurahan', e.target.value)
                    }
                    placeholder="Masukkan kelurahan/desa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kecamatan">
                    Kecamatan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kecamatan"
                    value={formData.kecamatan}
                    onChange={(e) =>
                      handleInputChange('kecamatan', e.target.value)
                    }
                    placeholder="Masukkan kecamatan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kabupatenKota">
                    Kabupaten/Kota <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kabupatenKota"
                    value={formData.kabupatenKota}
                    onChange={(e) =>
                      handleInputChange('kabupatenKota', e.target.value)
                    }
                    placeholder="Masukkan kabupaten/kota"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provinsi">
                    Provinsi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="provinsi"
                    value={formData.provinsi}
                    onChange={(e) =>
                      handleInputChange('provinsi', e.target.value)
                    }
                    placeholder="Masukkan provinsi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kodePos">
                    Kode Pos <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kodePos"
                    value={formData.kodePos}
                    onChange={(e) =>
                      handleInputChange('kodePos', e.target.value)
                    }
                    placeholder="Contoh: 12345"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telepon">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="telepon"
                    value={formData.telepon}
                    onChange={(e) =>
                      handleInputChange('telepon', e.target.value)
                    }
                    placeholder="Contoh: 081234567890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jarakKeSekolah">Jarak ke Sekolah (km)</Label>
                  <Input
                    id="jarakKeSekolah"
                    value={formData.jarakKeSekolah}
                    onChange={(e) =>
                      handleInputChange('jarakKeSekolah', e.target.value)
                    }
                    placeholder="Contoh: 5"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-emerald mb-4">
              DATA ORANG TUA/WALI
            </h3>

            <div className="space-y-6">
              {/* Data Ayah */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-md mb-3 text-gray-700">
                  Data Ayah
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaAyah">
                      Nama Lengkap Ayah <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="namaAyah"
                      value={formData.namaAyah}
                      onChange={(e) =>
                        handleInputChange('namaAyah', e.target.value)
                      }
                      placeholder="Masukkan nama ayah"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pekerjaanAyah">
                      Pekerjaan Ayah <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pekerjaanAyah"
                      value={formData.pekerjaanAyah}
                      onChange={(e) =>
                        handleInputChange('pekerjaanAyah', e.target.value)
                      }
                      placeholder="Masukkan pekerjaan ayah"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pendidikanAyah">
                      Pendidikan Terakhir Ayah
                    </Label>
                    <select
                      id="pendidikanAyah"
                      value={formData.pendidikanAyah}
                      onChange={(e) =>
                        handleInputChange('pendidikanAyah', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Pilih pendidikan</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="D3">D3</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teleponAyah">
                      Nomor Telepon Ayah <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teleponAyah"
                      value={formData.teleponAyah}
                      onChange={(e) =>
                        handleInputChange('teleponAyah', e.target.value)
                      }
                      placeholder="Contoh: 081234567890"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Data Ibu */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-md mb-3 text-gray-700">
                  Data Ibu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaIbu">
                      Nama Lengkap Ibu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="namaIbu"
                      value={formData.namaIbu}
                      onChange={(e) =>
                        handleInputChange('namaIbu', e.target.value)
                      }
                      placeholder="Masukkan nama ibu"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pekerjaanIbu">
                      Pekerjaan Ibu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pekerjaanIbu"
                      value={formData.pekerjaanIbu}
                      onChange={(e) =>
                        handleInputChange('pekerjaanIbu', e.target.value)
                      }
                      placeholder="Masukkan pekerjaan ibu"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pendidikanIbu">
                      Pendidikan Terakhir Ibu
                    </Label>
                    <select
                      id="pendidikanIbu"
                      value={formData.pendidikanIbu}
                      onChange={(e) =>
                        handleInputChange('pendidikanIbu', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Pilih pendidikan</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="D3">D3</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teleponIbu">
                      Nomor Telepon Ibu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teleponIbu"
                      value={formData.teleponIbu}
                      onChange={(e) =>
                        handleInputChange('teleponIbu', e.target.value)
                      }
                      placeholder="Contoh: 081234567890"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Data Wali (Optional) */}
              <div>
                <h4 className="font-semibold text-md mb-3 text-gray-700">
                  Data Wali (Opsional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaWali">Nama Lengkap Wali</Label>
                    <Input
                      id="namaWali"
                      value={formData.namaWali}
                      onChange={(e) =>
                        handleInputChange('namaWali', e.target.value)
                      }
                      placeholder="Masukkan nama wali"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hubunganWali">Hubungan dengan Wali</Label>
                    <Input
                      id="hubunganWali"
                      value={formData.hubunganWali}
                      onChange={(e) =>
                        handleInputChange('hubunganWali', e.target.value)
                      }
                      placeholder="Contoh: Paman, Bibi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teleponWali">Nomor Telepon Wali</Label>
                    <Input
                      id="teleponWali"
                      value={formData.teleponWali}
                      onChange={(e) =>
                        handleInputChange('teleponWali', e.target.value)
                      }
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-emerald mb-4">
              DATA KESEHATAN DAN LAINNYA
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="golonganDarah">Golongan Darah</Label>
                <select
                  id="golonganDarah"
                  value={formData.golonganDarah}
                  onChange={(e) =>
                    handleInputChange('golonganDarah', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Pilih golongan darah</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tinggiBadan">Tinggi Badan (cm)</Label>
                <Input
                  id="tinggiBadan"
                  type="number"
                  value={formData.tinggiBadan}
                  onChange={(e) =>
                    handleInputChange('tinggiBadan', e.target.value)
                  }
                  placeholder="Contoh: 120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
                <Input
                  id="beratBadan"
                  type="number"
                  value={formData.beratBadan}
                  onChange={(e) =>
                    handleInputChange('beratBadan', e.target.value)
                  }
                  placeholder="Contoh: 25"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="riwayatPenyakit">Riwayat Penyakit</Label>
                <Textarea
                  id="riwayatPenyakit"
                  value={formData.riwayatPenyakit}
                  onChange={(e) =>
                    handleInputChange('riwayatPenyakit', e.target.value)
                  }
                  placeholder="Sebutkan riwayat penyakit jika ada"
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alergi">Alergi</Label>
                <Textarea
                  id="alergi"
                  value={formData.alergi}
                  onChange={(e) => handleInputChange('alergi', e.target.value)}
                  placeholder="Sebutkan alergi jika ada"
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="riwayatVaksinasi">Riwayat Vaksinasi</Label>
                <Textarea
                  id="riwayatVaksinasi"
                  value={formData.riwayatVaksinasi}
                  onChange={(e) =>
                    handleInputChange('riwayatVaksinasi', e.target.value)
                  }
                  placeholder="Sebutkan riwayat vaksinasi"
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hobiMinat">Hobi dan Minat</Label>
                <Textarea
                  id="hobiMinat"
                  value={formData.hobiMinat}
                  onChange={(e) =>
                    handleInputChange('hobiMinat', e.target.value)
                  }
                  placeholder="Sebutkan hobi dan minat anak"
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="prestasiYangPernahDiraih">
                  Prestasi yang Pernah Diraih
                </Label>
                <Textarea
                  id="prestasiYangPernahDiraih"
                  value={formData.prestasiYangPernahDiraih}
                  onChange={(e) =>
                    handleInputChange(
                      'prestasiYangPernahDiraih',
                      e.target.value
                    )
                  }
                  placeholder="Sebutkan prestasi yang pernah diraih (jika ada)"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-emerald mb-4">
              PERNYATAAN DAN KONFIRMASI
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="programYangDipilih">
                  Program yang Dipilih <span className="text-red-500">*</span>
                </Label>
                <select
                  id="programYangDipilih"
                  value={formData.programYangDipilih}
                  onChange={(e) =>
                    handleInputChange('programYangDipilih', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Pilih program</option>
                  <option value="KBTK">Kelas Siap Sekolah</option>
                  <option value="Kelas Eksplorasi">Kelas Eksplorasi</option>
                  <option value="Kelas Pra Aqil Baligh">
                    Kelas Pra Aqil Baligh
                  </option>
                  <option value="Kelas Aqil Baligh">Kelas Aqil Baligh</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="informasiTambahan">Informasi Tambahan</Label>
                <Textarea
                  id="informasiTambahan"
                  value={formData.informasiTambahan}
                  onChange={(e) =>
                    handleInputChange('informasiTambahan', e.target.value)
                  }
                  placeholder="Informasi tambahan yang ingin disampaikan"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm mb-3">Ringkasan Data</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">
                      {formData.namaLengkap || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Program:</span>
                    <span className="font-medium">
                      {formData.programYangDipilih || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Alamat:</span>
                    <span className="font-medium">
                      {formData.alamatLengkap || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Nama Ayah:</span>
                    <span className="font-medium">
                      {formData.namaAyah || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Nama Ibu:</span>
                    <span className="font-medium">
                      {formData.namaIbu || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="pernyataanSetuju"
                    checked={formData.pernyataanSetuju}
                    onChange={(e) =>
                      handleInputChange('pernyataanSetuju', e.target.checked)
                    }
                    className="mt-1"
                    required
                  />
                  <Label
                    htmlFor="pernyataanSetuju"
                    className="text-sm cursor-pointer"
                  >
                    <span className="text-red-500">*</span> Saya menyatakan
                    bahwa data yang saya isikan adalah benar dan dapat
                    dipertanggungjawabkan. Saya bersedia mengikuti seluruh
                    peraturan dan ketentuan yang berlaku di Sekolah Iqrolife.
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Formulir Pendaftaran Murid
        </h2>
        <p className="text-gray-600 mt-1">
          Isi formulir pendaftaran dengan lengkap dan benar
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2
                        ${isActive ? 'bg-brand-emerald text-white' : ''}
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${
                          !isActive && !isCompleted
                            ? 'bg-gray-200 text-gray-500'
                            : ''
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs text-center font-medium ${
                        isActive ? 'text-brand-emerald' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2 mb-8
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-brand-emerald">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span>-</span>
              <span>{steps[currentStep - 1].description}</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="min-h-[400px]">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                className="bg-brand-emerald hover:bg-brand-emerald/90 flex items-center gap-2"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.pernyataanSetuju}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                Submit Formulir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 border-brand-emerald/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-brand-emerald mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Petunjuk Pengisian Formulir
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Isi semua field yang bertanda{' '}
                  <span className="text-red-500">*</span> (wajib diisi)
                </li>
                <li>• Pastikan data yang diisikan benar dan akurat</li>
                <li>
                  • Anda dapat kembali ke step sebelumnya untuk mengubah data
                </li>
                <li>• Setelah submit, formulir akan diproses oleh admin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
