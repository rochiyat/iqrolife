'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  FileImage,
  ExternalLink,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  birthDate: string;
  age: number;
  gender: string;
  parent: string;
  phone: string;
  email: string;
  address: string;
  previousSchool?: string;
  program: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  notes?: string;
  paymentProof?: string;
}

export default function CalonMuridPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add form state
  const [addFormData, setAddFormData] = useState({
    namaLengkap: '',
    tanggalLahir: '',
    jenisKelamin: '',
    asalSekolah: '',
    namaOrangTua: '',
    noTelepon: '',
    email: '',
    alamat: '',
    program: 'KBTK',
    status: 'pending',
    catatan: '',
  });
  const [buktiTransferFile, setBuktiTransferFile] = useState<File | null>(null);

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Ahmad Zaki',
      birthDate: '2017-03-15',
      age: 7,
      gender: 'Laki-laki',
      parent: 'Bapak Ahmad',
      phone: '081234567890',
      email: 'ahmad@example.com',
      address: 'Jl. Merdeka No. 123, Jakarta Selatan',
      previousSchool: 'TK Permata Hati',
      program: 'KBTK',
      status: 'approved',
      registrationDate: '2024-10-15',
      notes: 'Anak aktif dan suka belajar',
      paymentProof:
        'https://placehold.co/600x400/0ea5e9/white?text=Bukti+Transfer+Ahmad',
    },
    {
      id: '2',
      name: 'Siti Fatimah',
      birthDate: '2014-08-20',
      age: 10,
      gender: 'Perempuan',
      parent: 'Ibu Siti',
      phone: '081234567891',
      email: 'siti@example.com',
      address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
      previousSchool: 'SD Harapan Bangsa',
      program: 'Kelas Pra Aqil Baligh',
      status: 'pending',
      registrationDate: '2024-10-20',
      paymentProof:
        'https://placehold.co/600x400/ec4899/white?text=Bukti+Transfer+Siti',
    },
    {
      id: '3',
      name: 'Muhammad Rizki',
      birthDate: '2019-05-10',
      age: 5,
      gender: 'Laki-laki',
      parent: 'Ibu Rina',
      phone: '081234567892',
      email: 'rizki@example.com',
      address: 'Jl. Sudirman No. 78, Jakarta Pusat',
      program: 'KBTK',
      status: 'approved',
      registrationDate: '2024-10-18',
      notes: 'Belum pernah sekolah sebelumnya',
      paymentProof:
        'https://placehold.co/600x400/10b981/white?text=Bukti+Transfer+Rizki',
    },
    {
      id: '4',
      name: 'Fatimah Az-Zahra',
      birthDate: '2018-11-25',
      age: 6,
      gender: 'Perempuan',
      parent: 'Bapak Yusuf',
      phone: '081234567893',
      email: 'yusuf@example.com',
      address: 'Jl. Gatot Subroto No. 99, Jakarta Selatan',
      previousSchool: 'PAUD Ceria',
      program: 'KBTK',
      status: 'pending',
      registrationDate: '2024-10-22',
      paymentProof:
        'https://placehold.co/600x400/f97316/white?text=Bukti+Transfer+Fatimah',
    },
    {
      id: '5',
      name: 'Abdullah Rahman',
      birthDate: '2016-02-14',
      age: 8,
      gender: 'Laki-laki',
      parent: 'Ibu Aminah',
      phone: '081234567894',
      email: 'aminah@example.com',
      address: 'Jl. Thamrin No. 112, Jakarta Pusat',
      previousSchool: 'SD Islam Terpadu',
      program: 'Kelas Eksplorasi',
      status: 'approved',
      registrationDate: '2024-10-19',
      notes: 'Hafal 5 juz Al-Quran',
      paymentProof:
        'https://placehold.co/600x400/8b5cf6/white?text=Bukti+Transfer+Abdullah',
    },
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailDialogOpen(true);
  };

  const handleCreateUser = (student: Student) => {
    setSelectedStudent(student);
    setIsCreateUserDialogOpen(true);
  };

  const confirmCreateUser = () => {
    if (selectedStudent) {
      alert(
        `User berhasil dibuat!\n\nNama: ${selectedStudent.name}\nEmail: ${selectedStudent.email}\nRole: Parent\nPassword: (dikirim via email)`
      );
      setIsCreateUserDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleEdit = (student: Student) => {
    setEditFormData({ ...student });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: keyof Student, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const confirmEdit = () => {
    if (editFormData) {
      setStudents(
        students.map((s) => (s.id === editFormData.id ? editFormData : s))
      );
      alert(`Data ${editFormData.name} berhasil diupdate!`);
      setIsEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      alert(`Data ${selectedStudent.name} berhasil dihapus!`);
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleAddInputChange = (field: string, value: string) => {
    setAddFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setBuktiTransferFile(file);
    }
  };

  const handleAddSubmit = async () => {
    // Validate required fields
    if (
      !addFormData.namaLengkap ||
      !addFormData.tanggalLahir ||
      !addFormData.jenisKelamin ||
      !addFormData.namaOrangTua ||
      !addFormData.noTelepon ||
      !addFormData.email ||
      !addFormData.alamat
    ) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('namaLengkap', addFormData.namaLengkap);
      formData.append('tanggalLahir', addFormData.tanggalLahir);
      formData.append('jenisKelamin', addFormData.jenisKelamin);
      formData.append('namaOrangTua', addFormData.namaOrangTua);
      formData.append('noTelepon', addFormData.noTelepon);
      formData.append('email', addFormData.email);
      formData.append('alamat', addFormData.alamat);
      formData.append('asalSekolah', addFormData.asalSekolah);
      formData.append('program', addFormData.program);
      formData.append('status', addFormData.status);
      formData.append('catatan', addFormData.catatan);

      if (buktiTransferFile) {
        formData.append('buktiTransfer', buktiTransferFile);
      }

      const response = await fetch('/api/dashboard/calon-murid', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Calculate age
        const birthDate = new Date(addFormData.tanggalLahir);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        // Add to students list
        const newStudent: Student = {
          id: `temp-${Date.now()}`,
          name: addFormData.namaLengkap,
          birthDate: addFormData.tanggalLahir,
          age,
          gender: addFormData.jenisKelamin,
          parent: addFormData.namaOrangTua,
          phone: addFormData.noTelepon,
          email: addFormData.email,
          address: addFormData.alamat,
          previousSchool: addFormData.asalSekolah || undefined,
          program: addFormData.program,
          status: addFormData.status as 'pending' | 'approved' | 'rejected',
          registrationDate: new Date().toISOString().split('T')[0],
          notes: addFormData.catatan || undefined,
          paymentProof: result.data?.paymentProof || undefined,
        };

        setStudents([newStudent, ...students]);

        // Reset form
        setAddFormData({
          namaLengkap: '',
          tanggalLahir: '',
          jenisKelamin: '',
          asalSekolah: '',
          namaOrangTua: '',
          noTelepon: '',
          email: '',
          alamat: '',
          program: 'KBTK',
          status: 'pending',
          catatan: '',
        });
        setBuktiTransferFile(null);

        setIsAddDialogOpen(false);
        alert('Data calon murid berhasil ditambahkan!');
      } else {
        alert(result.error || 'Gagal menambahkan data calon murid');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Terjadi kesalahan saat menambahkan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Calon Murid</h2>
          <p className="text-gray-600 mt-1">
            Kelola data calon murid dan pendaftaran
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-emerald hover:bg-brand-emerald/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Calon Murid
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Calon Murid Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Data Anak */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Data Anak
                </h3>

                <div className="space-y-2">
                  <Label>
                    Nama Lengkap Anak <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Masukkan nama lengkap anak"
                    value={addFormData.namaLengkap}
                    onChange={(e) =>
                      handleAddInputChange('namaLengkap', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={addFormData.tanggalLahir}
                      onChange={(e) =>
                        handleAddInputChange('tanggalLahir', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={addFormData.jenisKelamin}
                      onChange={(e) =>
                        handleAddInputChange('jenisKelamin', e.target.value)
                      }
                      required
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Asal Sekolah/TK (jika ada)</Label>
                  <Input
                    placeholder="Masukkan asal sekolah/TK"
                    value={addFormData.asalSekolah}
                    onChange={(e) =>
                      handleAddInputChange('asalSekolah', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-pink-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Data Orang Tua/Wali
                </h3>

                <div className="space-y-2">
                  <Label>
                    Nama Orang Tua/Wali <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Masukkan nama orang tua/wali"
                    value={addFormData.namaOrangTua}
                    onChange={(e) =>
                      handleAddInputChange('namaOrangTua', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      No. Telepon/WhatsApp{' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      placeholder="08xx-xxxx-xxxx"
                      value={addFormData.noTelepon}
                      onChange={(e) =>
                        handleAddInputChange('noTelepon', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={addFormData.email}
                      onChange={(e) =>
                        handleAddInputChange('email', e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={addFormData.alamat}
                    onChange={(e) =>
                      handleAddInputChange('alamat', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Status & Catatan */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Status & Catatan
                </h3>

                <div className="space-y-2">
                  <Label>Program</Label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={addFormData.program}
                    onChange={(e) =>
                      handleAddInputChange('program', e.target.value)
                    }
                  >
                    <option value="KBTK">KBTK</option>
                    <option value="Kelas Pra Aqil Baligh">
                      Kelas Pra Aqil Baligh
                    </option>
                    <option value="Kelas Eksplorasi">Kelas Eksplorasi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status Pendaftaran</Label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={addFormData.status}
                    onChange={(e) =>
                      handleAddInputChange('status', e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Catatan</Label>
                  <textarea
                    rows={2}
                    placeholder="Tambahkan catatan atau informasi tambahan"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={addFormData.catatan}
                    onChange={(e) =>
                      handleAddInputChange('catatan', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Bukti Transfer */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Bukti Transfer (Opsional)
                </h3>

                <div className="space-y-2">
                  <Label>Upload Bukti Transfer</Label>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                  {buktiTransferFile && (
                    <p className="text-xs text-green-600">
                      File terpilih: {buktiTransferFile.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Format: PNG, JPG, PDF (Maks. 5MB)
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                className="bg-brand-emerald hover:bg-brand-emerald/90"
                onClick={handleAddSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Simpan Data
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama atau orang tua..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Usia
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Orang Tua
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Kontak
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{student.name}</div>
                    </td>
                    <td className="py-3 px-4">{student.age} tahun</td>
                    <td className="py-3 px-4">{student.parent}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{student.phone}</div>
                        <div className="text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                          title="Lihat Detail"
                          onClick={() => handleViewDetail(student)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-600 hover:text-purple-700"
                          title="Buat User"
                          onClick={() => handleCreateUser(student)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          title="Edit"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          title="Hapus"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-emerald">
                {students.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Pendaftar</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {students.filter((s) => s.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Disetujui</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {students.filter((s) => s.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Menunggu</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Calon Murid</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Data Anak */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Data Anak
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Nama Lengkap</Label>
                    <p className="font-medium">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Jenis Kelamin</Label>
                    <p className="font-medium">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tanggal Lahir</Label>
                    <p className="font-medium">
                      {new Date(selectedStudent.birthDate).toLocaleDateString(
                        'id-ID'
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Usia</Label>
                    <p className="font-medium">{selectedStudent.age} tahun</p>
                  </div>
                  {selectedStudent.previousSchool && (
                    <div className="col-span-2">
                      <Label className="text-gray-600">Asal Sekolah/TK</Label>
                      <p className="font-medium">
                        {selectedStudent.previousSchool}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-pink-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Data Orang Tua/Wali
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Nama Orang Tua/Wali</Label>
                    <p className="font-medium">{selectedStudent.parent}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">
                      No. Telepon/WhatsApp
                    </Label>
                    <p className="font-medium">{selectedStudent.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Email</Label>
                    <p className="font-medium">{selectedStudent.email}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Alamat Lengkap</Label>
                    <p className="font-medium">{selectedStudent.address}</p>
                  </div>
                </div>
              </div>

              {/* Status & Catatan */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Status & Catatan
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Status Pendaftaran</Label>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedStudent.status
                        )}`}
                      >
                        {getStatusText(selectedStudent.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tanggal Pendaftaran</Label>
                    <p className="font-medium">
                      {new Date(
                        selectedStudent.registrationDate
                      ).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {selectedStudent.notes && (
                    <div>
                      <Label className="text-gray-600">Catatan</Label>
                      <p className="font-medium">{selectedStudent.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bukti Transfer */}
              {selectedStudent.paymentProof && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    Bukti Transfer Pendaftaran
                  </h3>

                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={selectedStudent.paymentProof}
                      alt="Bukti Transfer"
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                  </div>
                  <a
                    href={selectedStudent.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-brand-emerald hover:text-brand-emerald/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Lihat gambar full size
                  </a>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        open={isCreateUserDialogOpen}
        onOpenChange={setIsCreateUserDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Buat User</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-3">
                  Anda akan membuat user baru dengan data berikut:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{selectedStudent.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedStudent.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium text-orange-600">Parent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. Telepon:</span>
                    <span className="font-medium">{selectedStudent.phone}</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Catatan:</strong> Password akan dikirimkan ke email
                  yang terdaftar.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateUserDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              onClick={confirmCreateUser}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Buat User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Calon Murid</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Lengkap</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) =>
                      handleEditInputChange('name', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Jenis Kelamin</Label>
                  <select
                    id="edit-gender"
                    value={editFormData.gender}
                    onChange={(e) =>
                      handleEditInputChange('gender', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-birthDate">Tanggal Lahir</Label>
                  <Input
                    id="edit-birthDate"
                    type="date"
                    value={editFormData.birthDate}
                    onChange={(e) =>
                      handleEditInputChange('birthDate', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-age">Usia</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editFormData.age}
                    onChange={(e) =>
                      handleEditInputChange('age', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-parent">Nama Orang Tua</Label>
                  <Input
                    id="edit-parent"
                    value={editFormData.parent}
                    onChange={(e) =>
                      handleEditInputChange('parent', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">No. Telepon</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) =>
                      handleEditInputChange('phone', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      handleEditInputChange('email', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-address">Alamat</Label>
                  <textarea
                    id="edit-address"
                    value={editFormData.address}
                    onChange={(e) =>
                      handleEditInputChange('address', e.target.value)
                    }
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-previousSchool">Asal Sekolah</Label>
                  <Input
                    id="edit-previousSchool"
                    value={editFormData.previousSchool || ''}
                    onChange={(e) =>
                      handleEditInputChange('previousSchool', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editFormData.status}
                    onChange={(e) =>
                      handleEditInputChange('status', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-notes">Catatan</Label>
                  <textarea
                    id="edit-notes"
                    value={editFormData.notes || ''}
                    onChange={(e) =>
                      handleEditInputChange('notes', e.target.value)
                    }
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              onClick={confirmEdit}
            >
              Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 mb-3">
                  Apakah Anda yakin ingin menghapus data calon murid berikut?
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{selectedStudent.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orang Tua:</span>
                    <span className="font-medium">
                      {selectedStudent.parent}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Perhatian:</strong> Data yang sudah dihapus tidak
                  dapat dikembalikan.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
