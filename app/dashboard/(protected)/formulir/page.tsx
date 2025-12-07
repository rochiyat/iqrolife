'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Home,
  Users,
  Heart,
  CheckSquare,
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface CalonMurid {
  id: number;
  name: string;
  birthDate: string;
  age: number;
  gender: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  formulirPendaftaranId?: number;
  formulir_pendaftaran_id?: number;
}

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
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for selection
  const [selectedStudent, setSelectedStudent] = useState<CalonMurid | null>(
    null
  );
  const [students, setStudents] = useState<CalonMurid[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<CalonMurid[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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

  // Fetch calon murid list
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students when search or filter changes
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter((student) => student.gender === genderFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter, genderFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/registrations');
      const result = await response.json();

      if (response.ok && result.success) {
        setStudents(result.data);
        setFilteredStudents(result.data);
        setUserRole(result.userRole);
      } else {
        console.error('Failed to fetch students:', result.error);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      approved: {
        label: 'Disetujui',
        className: 'bg-green-100 text-green-800',
      },
      pending: {
        label: 'Menunggu',
        className: 'bg-yellow-100 text-yellow-800',
      },
      rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800' },
      active: { label: 'Aktif', className: 'bg-blue-100 text-blue-800' },
    };

    const config = statusConfig[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const handleSelectStudent = async (student: CalonMurid) => {
    setSelectedStudent(student);

    // Format date for input (YYYY-MM-DD) using local time
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Get formulirPendaftaranId (support both camelCase and snake_case)
    const formulirPendaftaranId =
      student.formulirPendaftaranId || student.formulir_pendaftaran_id;

    // If student has formulir pendaftaran, fetch it
    if (formulirPendaftaranId) {
      try {
        const response = await fetch(
          `/api/dashboard/formulir-pendaftaran/${formulirPendaftaranId}`
        );
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          const formulir = result.data;
          // Pre-fill form with existing formulir data
          setFormData((prev) => ({
            ...prev,
            // Support both camelCase and snake_case from backend
            namaLengkap:
              formulir.namaLengkap || formulir.nama_lengkap || student.name,
            namaPanggilan:
              formulir.namaPanggilan || formulir.nama_panggilan || student.name.split(' ')[0],
            jenisKelamin:
              formulir.jenisKelamin || formulir.jenis_kelamin || student.gender,
            tempatLahir: formulir.tempatLahir || formulir.tempat_lahir || '',
            tanggalLahir:
              formulir.tanggalLahir || formulir.tanggal_lahir
                ? formatDateForInput(
                    formulir.tanggalLahir || formulir.tanggal_lahir
                  )
                : formatDateForInput(student.birthDate),
            agama: formulir.agama || '',
            kewarganegaraan: formulir.kewarganegaraan || '',
            anakKe: formulir.anakKe || formulir.anak_ke || '',
            jumlahSaudara: formulir.jumlahSaudara || formulir.jumlah_saudara || '',
            bahasaSehariHari:
              formulir.bahasaSehariHari || formulir.bahasa_sehari_hari || '',
            alamatLengkap:
              formulir.alamatLengkap || formulir.alamat_lengkap || student.address,
            rt: formulir.rt || '',
            rw: formulir.rw || '',
            kelurahan: formulir.kelurahan || '',
            kecamatan: formulir.kecamatan || '',
            kabupatenKota: formulir.kabupatenKota || formulir.kabupaten_kota || '',
            provinsi: formulir.provinsi || '',
            kodePos: formulir.kodePos || formulir.kode_pos || '',
            telepon: formulir.telepon || student.phone,
            jarakKeSekolah:
              formulir.jarakKeSekolah || formulir.jarak_ke_sekolah || '',
            namaAyah: formulir.namaAyah || formulir.nama_ayah || '',
            pekerjaanAyah: formulir.pekerjaanAyah || formulir.pekerjaan_ayah || '',
            pendidikanAyah:
              formulir.pendidikanAyah || formulir.pendidikan_ayah || '',
            teleponAyah: formulir.teleponAyah || formulir.telepon_ayah || '',
            namaIbu: formulir.namaIbu || formulir.nama_ibu || '',
            pekerjaanIbu: formulir.pekerjaanIbu || formulir.pekerjaan_ibu || '',
            pendidikanIbu:
              formulir.pendidikanIbu || formulir.pendidikan_ibu || '',
            teleponIbu: formulir.teleponIbu || formulir.telepon_ibu || '',
            namaWali: formulir.namaWali || formulir.nama_wali || '',
            hubunganWali: formulir.hubunganWali || formulir.hubungan_wali || '',
            teleponWali: formulir.teleponWali || formulir.telepon_wali || '',
            golonganDarah:
              formulir.golonganDarah || formulir.golongan_darah || '',
            riwayatPenyakit:
              formulir.riwayatPenyakit || formulir.riwayat_penyakit || '',
            alergi: formulir.alergi || '',
            tinggiBadan: formulir.tinggiBadan || formulir.tinggi_badan || '',
            beratBadan: formulir.beratBadan || formulir.berat_badan || '',
            riwayatVaksinasi:
              formulir.riwayatVaksinasi || formulir.riwayat_vaksinasi || '',
            hobiMinat: formulir.hobiMinat || formulir.hobi_minat || '',
            prestasiYangPernahDiraih:
              formulir.prestasiYangPernahDiraih ||
              formulir.prestasi_yang_pernah_diraih ||
              '',
            programYangDipilih:
              formulir.programYangDipilih || formulir.program_yang_dipilih || '',
            informasiTambahan:
              formulir.informasiTambahan || formulir.informasi_tambahan || '',
            pernyataanSetuju:
              formulir.pernyataanSetuju || formulir.pernyataan_setuju || false,
          }));
        } else {
          // If formulir not found, use student data
          setFormData((prev) => ({
            ...prev,
            namaLengkap: student.name,
            namaPanggilan: student.name.split(' ')[0],
            jenisKelamin: student.gender,
            tanggalLahir: formatDateForInput(student.birthDate),
            alamatLengkap: student.address,
            telepon: student.phone,
          }));
        }
      } catch (error) {
        console.error('Error fetching formulir:', error);
        // Fallback to student data if error
        setFormData((prev) => ({
          ...prev,
          namaLengkap: student.name,
          namaPanggilan: student.name.split(' ')[0],
          jenisKelamin: student.gender,
          tanggalLahir: formatDateForInput(student.birthDate),
          alamatLengkap: student.address,
          telepon: student.phone,
        }));
      }
    } else {
      // No formulir pendaftaran, use student data
      setFormData((prev) => ({
        ...prev,
        namaLengkap: student.name,
        namaPanggilan: student.name.split(' ')[0],
        jenisKelamin: student.gender,
        tanggalLahir: formatDateForInput(student.birthDate),
        alamatLengkap: student.address,
        telepon: student.phone,
      }));
    }

    setCurrentStep(1); // Move to first form step
  };

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

  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Step 1 - Data Pribadi
    if (!formData.namaLengkap.trim()) errors.push('Nama Lengkap');
    if (!formData.namaPanggilan.trim()) errors.push('Nama Panggilan');
    if (!formData.jenisKelamin) errors.push('Jenis Kelamin');
    if (!formData.tempatLahir.trim()) errors.push('Tempat Lahir');
    if (!formData.tanggalLahir) errors.push('Tanggal Lahir');
    if (!formData.agama) errors.push('Agama');
    if (!formData.kewarganegaraan.trim()) errors.push('Kewarganegaraan');
    if (!formData.anakKe) errors.push('Anak Ke');
    if (!formData.jumlahSaudara) errors.push('Jumlah Saudara');
    if (!formData.bahasaSehariHari.trim()) errors.push('Bahasa Sehari-hari');

    // Step 2 - Tempat Tinggal
    if (!formData.alamatLengkap.trim()) errors.push('Alamat Lengkap');
    if (!formData.rt.trim()) errors.push('RT');
    if (!formData.rw.trim()) errors.push('RW');
    if (!formData.kelurahan.trim()) errors.push('Kelurahan/Desa');
    if (!formData.kecamatan.trim()) errors.push('Kecamatan');
    if (!formData.kabupatenKota.trim()) errors.push('Kabupaten/Kota');
    if (!formData.provinsi.trim()) errors.push('Provinsi');
    if (!formData.kodePos.trim()) errors.push('Kode Pos');
    if (!formData.telepon.trim()) errors.push('Nomor Telepon');

    // Step 3 - Data Orang Tua
    if (!formData.namaAyah.trim()) errors.push('Nama Ayah');
    if (!formData.pekerjaanAyah.trim()) errors.push('Pekerjaan Ayah');
    if (!formData.teleponAyah.trim()) errors.push('Telepon Ayah');
    if (!formData.namaIbu.trim()) errors.push('Nama Ibu');
    if (!formData.pekerjaanIbu.trim()) errors.push('Pekerjaan Ibu');
    if (!formData.teleponIbu.trim()) errors.push('Telepon Ibu');

    // Step 5 - Konfirmasi
    if (!formData.programYangDipilih) errors.push('Program Yang Dipilih');
    if (!formData.pernyataanSetuju) errors.push('Pernyataan Setuju (checkbox)');

    return errors;
  };

  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrorModal(true);
      setErrorMessage('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const response = await fetch('/api/dashboard/formulir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedStudent?.id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccessModal(true);
        // Reset form after successful submission
        setTimeout(() => {
          setCurrentStep(0);
          setSelectedStudent(null);
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setErrorMessage(result.error || 'Gagal mengirim formulir');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Terjadi kesalahan saat mengirim formulir');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
                  <option value="KKS">Kelas Siap Sekolah</option>
                  <option value="KB">Kelas Bermain</option>
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
          {currentStep === 0
            ? 'Pilih nama calon murid yang akan diisi formulirnya'
            : 'Isi formulir pendaftaran dengan lengkap dan benar'}
        </p>
      </div>

      {/* Step 0: Student Selection */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-brand-emerald" />
              Pilih Calon Murid
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data calon murid...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Belum Ada Calon Murid
                </h3>
                <p className="text-gray-500 mb-4">
                  {userRole === 'parent'
                    ? 'Anda belum mendaftarkan calon murid. Silakan hubungi admin untuk mendaftarkan anak Anda.'
                    : 'Belum ada data calon murid yang terdaftar.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Info:</strong>{' '}
                    {userRole === 'parent'
                      ? 'Pilih salah satu anak Anda yang akan diisi formulir pendaftarannya.'
                      : 'Pilih salah satu calon murid untuk mengisi formulir pendaftaran.'}
                  </p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cari Nama</Label>
                    <Input
                      placeholder="Cari nama murid atau orang tua..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">Semua Status</option>
                      <option value="approved">Disetujui</option>
                      <option value="pending">Menunggu</option>
                      <option value="rejected">Ditolak</option>
                      <option value="active">Aktif</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">Semua</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredStudents.length} dari {students.length}{' '}
                  calon murid
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Tidak Ada Hasil
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Tidak ada calon murid yang sesuai dengan filter yang
                      dipilih.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setGenderFilter('all');
                      }}
                    >
                      Reset Filter
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                      <Card
                        key={student.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-brand-emerald"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full bg-brand-emerald/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-brand-emerald" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900 truncate">
                                  {student.name}
                                </h3>
                                {getStatusBadge(student.status)}
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  {student.age} tahun • {student.gender}
                                </p>
                                <p className="truncate">{student.parentName}</p>
                                <p className="truncate">{student.phone}</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-2 bg-brand-emerald hover:bg-emerald-600"
                            onClick={() => handleSelectStudent(student)}
                          >
                            Pilih & Isi Formulir
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form Steps */}
      {currentStep > 0 && (
        <>
          {/* Selected Student Info */}
          {selectedStudent && (
            <Card className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 border-brand-emerald/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-emerald flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Mengisi formulir untuk:
                      </p>
                      <p className="font-semibold text-gray-900">
                        {selectedStudent.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentStep(0);
                      setSelectedStudent(null);
                    }}
                    className="hover:bg-gray-100"
                  >
                    Ganti Murid
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                    disabled={!formData.pernyataanSetuju || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        Submit Formulir
                      </>
                    )}
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
                      • Anda dapat kembali ke step sebelumnya untuk mengubah
                      data
                    </li>
                    <li>• Setelah submit, formulir akan diproses oleh admin</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Formulir Berhasil Dikirim! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              Formulir pendaftaran Anda telah berhasil disimpan. Admin akan
              meninjau data Anda segera.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-brand-emerald hover:bg-brand-emerald/90"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              {validationErrors.length > 0 ? 'Lengkapi Form' : 'Gagal Mengirim'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>

          {validationErrors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Field yang perlu diisi:
              </p>
              <div className="max-h-60 overflow-y-auto bg-red-50 rounded-lg p-3 border border-red-200">
                <ul className="text-sm text-red-800 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                setShowErrorModal(false);
                setValidationErrors([]);
              }}
              variant="outline"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
