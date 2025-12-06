'use client';

import { useState, useEffect } from 'react';
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
  ClipboardCheck,
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
  program?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  registrationDate: string;
  notes?: string;
  paymentProof?: string;
  userId?: number;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewNotes?: string;
  referenceName?: string;
  referencePhone?: string;
  referenceRelation?: string;
  couponCode?: string;
}

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<
    'reviewed' | 'approved' | 'rejected'
  >('reviewed');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

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
    status: 'pending',
    catatan: '',
    referenceName: '',
    referencePhone: '',
    referenceRelation: '',
    couponCode: '',
  });
  const [buktiTransferFile, setBuktiTransferFile] = useState<File | null>(null);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/registrations');
      const result = await response.json();

      if (response.ok && result.success) {
        setStudents(result.data);
      } else {
        console.error('Failed to fetch students:', result.error);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages =
    itemsPerPage === -1 ? 1 : Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === -1 ? filteredStudents.length : startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search term or items per page changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value === 'all' ? -1 : parseInt(value));
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
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
      case 'reviewed':
        return 'Direview';
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

  const confirmCreateUser = async () => {
    if (!selectedStudent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/dashboard/registrations/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          email: selectedStudent.email,
          name: selectedStudent.parent,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        let alertMessage = '';
        switch (result.action) {
          case 'created':
            alertMessage = `✅ User baru berhasil dibuat!\n\nNama: ${selectedStudent.parent}\nEmail: ${selectedStudent.email}\nRole: Parent\n\nPassword telah dikirim ke email.`;
            break;
          case 'role_added':
            alertMessage = `✅ User sudah ada!\n\nRole Parent berhasil ditambahkan.\nAnak "${selectedStudent.name}" berhasil dimapping ke user ${selectedStudent.email}.`;
            break;
          case 'mapping_added':
            alertMessage = `✅ User sudah ada sebagai Parent!\n\nAnak "${selectedStudent.name}" berhasil dimapping ke user ${selectedStudent.email}.`;
            break;
        }
        alert(alertMessage);
        setIsCreateUserDialogOpen(false);
        setSelectedStudent(null);
        fetchStudents(); // Refresh data
      } else {
        alert(result.error || 'Gagal membuat user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Terjadi kesalahan saat membuat user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student: Student) => {
    // Format date for input (YYYY-MM-DD) using local time to avoid timezone shifts
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDateForInput(student.birthDate);

    setEditFormData({
      ...student,
      birthDate: formattedDate,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: keyof Student, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const confirmEdit = async () => {
    if (!editFormData) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('id', editFormData.id);
      formData.append('namaLengkap', editFormData.name);
      formData.append('tanggalLahir', editFormData.birthDate);
      formData.append('jenisKelamin', editFormData.gender);
      formData.append('namaOrangTua', editFormData.parent);
      formData.append('noTelepon', editFormData.phone);
      formData.append('email', editFormData.email);
      formData.append('alamat', editFormData.address);
      formData.append('asalSekolah', editFormData.previousSchool || '');
      formData.append('status', editFormData.status);
      formData.append('catatan', editFormData.notes || '');
      formData.append('referenceName', editFormData.referenceName || '');
      formData.append('referencePhone', editFormData.referencePhone || '');
      formData.append(
        'referenceRelation',
        editFormData.referenceRelation || ''
      );
      formData.append('couponCode', editFormData.couponCode || '');

      const response = await fetch('/api/dashboard/registrations', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Data ${editFormData.name} berhasil diupdate!`);
        setIsEditDialogOpen(false);
        setEditFormData(null);
        fetchStudents(); // Refresh data from server
      } else {
        alert(result.error || 'Gagal mengupdate data');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Terjadi kesalahan saat mengupdate data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/dashboard/registrations?id=${selectedStudent.id}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Data ${selectedStudent.name} berhasil dihapus!`);
        setIsDeleteDialogOpen(false);
        setSelectedStudent(null);

        // Refresh data from database
        fetchStudents();
      } else {
        alert(result.error || 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Terjadi kesalahan saat menghapus data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = (student: Student) => {
    setSelectedStudent(student);
    setReviewNotes('');
    setReviewStatus('reviewed');
    setIsReviewDialogOpen(true);
  };

  const confirmReview = async () => {
    if (!selectedStudent) return;

    // Validate notes (mandatory)
    if (!reviewNotes.trim()) {
      setModalMessage('Catatan review wajib diisi!');
      setIsErrorModalOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/dashboard/registrations/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          status: reviewStatus,
          reviewNotes: reviewNotes.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setModalMessage(
          `Data ${
            selectedStudent.name
          } berhasil direview dengan status: ${getStatusText(reviewStatus)}`
        );
        setIsSuccessModalOpen(true);
        setIsReviewDialogOpen(false);
        setSelectedStudent(null);
        setReviewNotes('');

        // Refresh data from database
        fetchStudents();
      } else {
        setModalMessage(result.error || 'Gagal melakukan review');
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Error reviewing student:', error);
      setModalMessage('Terjadi kesalahan saat melakukan review');
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
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
      formData.append('status', addFormData.status);
      formData.append('catatan', addFormData.catatan);
      formData.append('referenceName', addFormData.referenceName);
      formData.append('referencePhone', addFormData.referencePhone);
      formData.append('referenceRelation', addFormData.referenceRelation);
      formData.append('couponCode', addFormData.couponCode);

      if (buktiTransferFile) {
        formData.append('buktiTransfer', buktiTransferFile);
      }

      const response = await fetch('/api/dashboard/registrations', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
          status: 'pending',
          catatan: '',
          referenceName: '',
          referencePhone: '',
          referenceRelation: '',
          couponCode: '',
        });
        setBuktiTransferFile(null);

        setIsAddDialogOpen(false);
        alert('Data registrasi berhasil ditambahkan!');

        // Refresh data from database
        fetchStudents();
      } else {
        alert(result.error || 'Gagal menambahkan data registrasi');
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
          <h2 className="text-3xl font-bold text-gray-900">Registrasi</h2>
          <p className="text-gray-600 mt-1">
            Kelola data registrasi dan pendaftaran
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-emerald hover:bg-emerald-600 cursor-pointer transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Registrasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Registrasi Baru</DialogTitle>
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
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
                  <Label>Status Pendaftaran</Label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors"
                    value={addFormData.status}
                    onChange={(e) =>
                      handleAddInputChange('status', e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Direview</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Kode Kupon (Opsional)</Label>
                  <Input
                    placeholder="Masukkan kode kupon jika ada"
                    value={addFormData.couponCode}
                    onChange={(e) =>
                      handleAddInputChange(
                        'couponCode',
                        e.target.value.toUpperCase()
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Catatan</Label>
                  <textarea
                    rows={2}
                    placeholder="Tambahkan catatan atau informasi tambahan"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
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
                className="hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </Button>
              <Button
                className="bg-brand-emerald hover:bg-emerald-600 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Summary Cards */}
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama atau orang tua..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">
                Show:
              </Label>
              <select
                value={itemsPerPage === -1 ? 'all' : itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data calon murid...</p>
            </div>
          ) : (
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
                      Kupon
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
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50"
                      >
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
                          {student.couponCode ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {student.couponCode}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
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
                            {(() => {
                              const isApproved = student.status === 'approved';

                              return (
                                <>
                                  {/* View - Always enabled */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                    title="Lihat Detail"
                                    onClick={() => handleViewDetail(student)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>

                                  {/* Create User - Only enabled when approved and user not created yet */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className={`text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer transition-colors ${
                                      !isApproved || !!student.userId
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                    title={
                                      !isApproved
                                        ? 'Status harus Disetujui untuk buat user'
                                        : !!student.userId
                                        ? 'User sudah dibuat'
                                        : 'Buat User'
                                    }
                                    onClick={() => handleCreateUser(student)}
                                    disabled={!isApproved || !!student.userId}
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </Button>

                                  {/* Review - Disabled when approved */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className={`text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer transition-colors ${
                                      isApproved
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                    title={
                                      isApproved
                                        ? 'Tidak dapat review data yang sudah disetujui'
                                        : 'Review'
                                    }
                                    onClick={() => handleReview(student)}
                                    disabled={isApproved}
                                  >
                                    <ClipboardCheck className="w-4 h-4" />
                                  </Button>

                                  {/* Edit - Disabled when approved */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className={`text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer transition-colors ${
                                      isApproved
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                    title={
                                      isApproved
                                        ? 'Tidak dapat edit data yang sudah disetujui'
                                        : 'Edit'
                                    }
                                    onClick={() => handleEdit(student)}
                                    disabled={isApproved}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>

                                  {/* Delete - Disabled when approved */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className={`text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors ${
                                      isApproved
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                    title={
                                      isApproved
                                        ? 'Tidak dapat hapus data yang sudah disetujui'
                                        : 'Hapus'
                                    }
                                    onClick={() => handleDelete(student)}
                                    disabled={isApproved}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gray-500"
                      >
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {!loading && itemsPerPage !== -1 && filteredStudents.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan {startIndex + 1} -{' '}
                {Math.min(endIndex, filteredStudents.length)} dari{' '}
                {filteredStudents.length} data
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className={`cursor-pointer ${
                          currentPage === page
                            ? 'bg-brand-emerald hover:bg-emerald-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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

              {/* Referensi */}
              {(selectedStudent.referenceName ||
                selectedStudent.referencePhone ||
                selectedStudent.referenceRelation) && (
                <div className="space-y-4 pt-4 border-t">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Referensi
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-600">Nama Referensi</Label>
                      <p className="font-medium">
                        {selectedStudent.referenceName || '-'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">No. HP Referensi</Label>
                      <p className="font-medium">
                        {selectedStudent.referencePhone || '-'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Hubungan</Label>
                      <p className="font-medium capitalize">
                        {selectedStudent.referenceRelation || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  <div>
                    <Label className="text-gray-600">Kode Kupon</Label>
                    {selectedStudent.couponCode ? (
                      <p className="font-medium">
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {selectedStudent.couponCode}
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-400">-</p>
                    )}
                  </div>
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
                    className="inline-flex items-center gap-2 text-sm text-brand-emerald hover:text-emerald-700 cursor-pointer transition-colors"
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
              className="hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
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
                  <strong>Catatan:</strong>
                </p>
                <ul className="text-xs text-yellow-800 mt-1 ml-4 list-disc">
                  <li>
                    Jika email sudah terdaftar sebagai user lain, akan
                    ditambahkan role Parent
                  </li>
                  <li>
                    Jika email sudah terdaftar sebagai Parent, anak akan
                    dimapping ke user tersebut
                  </li>
                  <li>
                    Jika email belum terdaftar, user baru akan dibuat dan
                    password dikirim via email
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateUserDialogOpen(false)}
              disabled={isSubmitting}
              className="hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
            >
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-emerald-600 cursor-pointer transition-colors"
              onClick={confirmCreateUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Buat User
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Registrasi</DialogTitle>
          </DialogHeader>
          {editFormData && (
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors"
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
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="edit-previousSchool">Asal Sekolah/TK</Label>
                    <Input
                      id="edit-previousSchool"
                      value={editFormData.previousSchool || ''}
                      onChange={(e) =>
                        handleEditInputChange('previousSchool', e.target.value)
                      }
                      placeholder="Asal sekolah/TK (jika ada)"
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="edit-parent">Nama Orang Tua/Wali</Label>
                    <Input
                      id="edit-parent"
                      value={editFormData.parent}
                      onChange={(e) =>
                        handleEditInputChange('parent', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">No. Telepon/WhatsApp</Label>
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
                    <Label htmlFor="edit-address">Alamat Lengkap</Label>
                    <textarea
                      id="edit-address"
                      value={editFormData.address}
                      onChange={(e) =>
                        handleEditInputChange('address', e.target.value)
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
                    />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status Pendaftaran</Label>
                    <select
                      id="edit-status"
                      value={editFormData.status}
                      disabled
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Direview</option>
                      <option value="approved">Disetujui</option>
                      <option value="rejected">Ditolak</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      Status hanya dapat diubah melalui menu Review
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-couponCode">Kode Kupon</Label>
                    <Input
                      id="edit-couponCode"
                      value={editFormData.couponCode || ''}
                      onChange={(e) =>
                        handleEditInputChange(
                          'couponCode',
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Kode kupon (opsional)"
                    />
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
                      placeholder="Tambahkan catatan jika ada"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
            >
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-emerald-600 cursor-pointer transition-colors"
              onClick={confirmEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
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
              className="hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
              onClick={confirmDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Pendaftaran</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedStudent.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Status Review <span className="text-red-500">*</span>
                </Label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors"
                  value={reviewStatus}
                  onChange={(e) =>
                    setReviewStatus(
                      e.target.value as 'reviewed' | 'approved' | 'rejected'
                    )
                  }
                >
                  <option value="reviewed">Direview</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>
                  Catatan Review <span className="text-red-500">*</span>
                </Label>
                <textarea
                  rows={4}
                  placeholder="Masukkan catatan review (wajib diisi)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 hover:border-gray-400 transition-colors"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Catatan ini akan tersimpan dan dapat dilihat oleh admin/staff
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmitting}
              className="hover:bg-gray-200 hover:border-gray-400 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              onClick={confirmReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Memproses...
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Simpan Review
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Berhasil!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="text-green-600 text-2xl">✅</div>
                <p className="text-sm text-green-800">{modalMessage}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer transition-colors"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gagal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <div className="text-red-600 text-2xl">❌</div>
                <p className="text-sm text-red-800">{modalMessage}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
              onClick={() => setIsErrorModalOpen(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
