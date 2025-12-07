'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Eye,
  FileImage,
  ExternalLink,
  Calendar,
  User,
  Users,
  Phone,
  Mail,
  CheckCircle,
  Edit,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

interface FormSubmission {
  id: number;
  // Support both camelCase (from backend) and snake_case (legacy)
  namaLengkap?: string;
  nama_lengkap?: string;
  namaPanggilan?: string;
  nama_panggilan?: string;
  jenisKelamin?: string;
  jenis_kelamin?: string;
  tempatLahir?: string;
  tempat_lahir?: string;
  tanggalLahir?: string;
  tanggal_lahir?: string;
  agama?: string;
  kewarganegaraan?: string;
  anakKe?: number;
  anak_ke?: number;
  jumlahSaudara?: number;
  jumlah_saudara?: number;
  bahasaSehariHari?: string;
  bahasa_sehari_hari?: string;
  alamatLengkap?: string;
  alamat_lengkap?: string;
  rt?: string;
  rw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kabupatenKota?: string;
  kabupaten_kota?: string;
  provinsi?: string;
  kodePos?: string;
  kode_pos?: string;
  telepon?: string;
  jarakKeSekolah?: string | number;
  jarak_ke_sekolah?: string;
  namaAyah?: string;
  nama_ayah?: string;
  pekerjaanAyah?: string;
  pekerjaan_ayah?: string;
  pendidikanAyah?: string;
  pendidikan_ayah?: string;
  teleponAyah?: string;
  telepon_ayah?: string;
  namaIbu?: string;
  nama_ibu?: string;
  pekerjaanIbu?: string;
  pekerjaan_ibu?: string;
  pendidikanIbu?: string;
  pendidikan_ibu?: string;
  teleponIbu?: string;
  telepon_ibu?: string;
  namaWali?: string;
  nama_wali?: string;
  hubunganWali?: string;
  hubungan_wali?: string;
  teleponWali?: string;
  telepon_wali?: string;
  golonganDarah?: string;
  golongan_darah?: string;
  riwayatPenyakit?: string;
  riwayat_penyakit?: string;
  alergi?: string;
  tinggiBadan?: number;
  tinggi_badan?: number;
  beratBadan?: number;
  berat_badan?: number;
  riwayatVaksinasi?: string;
  riwayat_vaksinasi?: string;
  hobiMinat?: string;
  hobi_minat?: string;
  prestasiYangPernahDiraih?: string;
  prestasi_yang_pernah_diraih?: string;
  programYangDipilih?: string;
  program_yang_dipilih?: string;
  informasiTambahan?: string;
  informasi_tambahan?: string;
  pernyataanSetuju?: boolean;
  pernyataan_setuju?: boolean;
  status?: string;
  submissionDate?: string;
  submission_date?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  reviewNotes?: string;
  review_notes?: string;
  reviewedBy?: number;
  reviewed_by?: number;
  reviewedAt?: string;
  reviewed_at?: string;
  userId?: number;
  user_id?: number;
}

// Helper function to get field value (supports both camelCase and snake_case)
const getField = (
  form: FormSubmission,
  camelCase: string,
  snakeCase: string
): any => {
  return (form as any)[camelCase] ?? (form as any)[snakeCase] ?? '';
};

export default function FormulirListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<FormSubmission | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions from API
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      console.log('Fetching submissions...');
      const response = await fetch('/api/dashboard/formulir-list');
      console.log('Response:', response);
      const result = await response.json();
      console.log('Result:', result);
      if (response.ok && result.success) {
        setSubmissions(result.data);
      } else {
        console.error('Failed to fetch submissions:', result.error);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((form) => {
    const namaLengkap = String(
      getField(form, 'namaLengkap', 'nama_lengkap') || ''
    ).toLowerCase();
    const namaAyah = String(
      getField(form, 'namaAyah', 'nama_ayah') || ''
    ).toLowerCase();
    const namaIbu = String(
      getField(form, 'namaIbu', 'nama_ibu') || ''
    ).toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      namaLengkap.includes(search) ||
      namaAyah.includes(search) ||
      namaIbu.includes(search)
    );
  });

  // Pagination logic
  const totalPages =
    itemsPerPage === -1
      ? 1
      : Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === -1
      ? filteredSubmissions.length
      : startIndex + itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  // Reset to page 1 when search term or items per page changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value === 'all' ? -1 : parseInt(value));
    setCurrentPage(1);
  };

  const handleViewDetail = (form: FormSubmission) => {
    setSelectedForm(form);
    setIsDetailDialogOpen(true);
  };

  const handleOpenReview = (form: FormSubmission) => {
    setSelectedForm(form);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  const handleOpenEdit = (form: FormSubmission) => {
    setSelectedForm(form);
    setEditNotes('');
    setIsEditDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedForm || !reviewNotes.trim()) {
      alert('Catatan review wajib diisi');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        '/api/dashboard/formulir-pendaftaran/review',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedForm.id,
            status: 'reviewed',
            notes: reviewNotes,
            action: 'review',
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Formulir berhasil direview dan email telah dikirim!');
        setIsReviewDialogOpen(false);
        fetchSubmissions(); // Refresh data
      } else {
        alert(result.error || 'Gagal mereview formulir');
      }
    } catch (error) {
      console.error('Review error:', error);
      alert('Terjadi kesalahan saat mereview formulir');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedForm || !editNotes.trim()) {
      alert('Catatan edit wajib diisi');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        '/api/dashboard/formulir-pendaftaran/review',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedForm.id,
            status: 'pending',
            notes: editNotes,
            action: 'edit',
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Permintaan edit berhasil dikirim dan email telah dikirim!');
        setIsEditDialogOpen(false);
        fetchSubmissions(); // Refresh data
      } else {
        alert(result.error || 'Gagal mengirim permintaan edit');
      }
    } catch (error) {
      console.error('Edit request error:', error);
      alert('Terjadi kesalahan saat mengirim permintaan edit');
    } finally {
      setActionLoading(false);
    }
  };

  const displayValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return '-';
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Formulir List</h2>
          <p className="text-gray-600 mt-1">
            Daftar formulir pendaftaran yang telah dikirim
          </p>
        </div>
        <Link href="/dashboard/formulir">
          <Button className="bg-brand-emerald hover:bg-emerald-600 cursor-pointer transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Formulir
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-emerald">
                {submissions.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Formulir</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {
                  submissions.filter((s) => {
                    const submissionDate = getField(
                      s,
                      'submissionDate',
                      'submission_date'
                    );
                    return (
                      submissionDate &&
                      new Date(submissionDate).getMonth() ===
                        new Date().getMonth()
                    );
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">Bulan Ini</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {
                  submissions.filter((s) => {
                    const submissionDate = getField(
                      s,
                      'submissionDate',
                      'submission_date'
                    );
                    return (
                      submissionDate &&
                      new Date(submissionDate).toDateString() ===
                        new Date().toDateString()
                    );
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">Hari Ini</div>
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
              <p className="text-gray-600">Memuat data formulir...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Belum Ada Formulir
              </h3>
              <p className="text-gray-500 mb-4">
                Belum ada formulir pendaftaran yang dikirim
              </p>
              <Link href="/dashboard/formulir">
                <Button className="bg-brand-emerald hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Formulir Pertama
                </Button>
              </Link>
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
                      Tanggal Daftar
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubmissions.map((form) => {
                    const tanggalLahir = getField(
                      form,
                      'tanggalLahir',
                      'tanggal_lahir'
                    );
                    const age = tanggalLahir
                      ? Math.floor(
                          (new Date().getTime() -
                            new Date(tanggalLahir).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )
                      : 0;
                    return (
                      <tr key={form.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {getField(form, 'namaLengkap', 'nama_lengkap')}
                          </div>
                        </td>
                        <td className="py-3 px-4">{age} tahun</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div>
                              Ayah: {getField(form, 'namaAyah', 'nama_ayah')}
                            </div>
                            <div className="text-gray-500">
                              Ibu: {getField(form, 'namaIbu', 'nama_ibu')}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div>{getField(form, 'telepon', 'telepon')}</div>
                            <div className="text-gray-500">
                              {getField(form, 'teleponAyah', 'telepon_ayah')}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {(() => {
                            const submissionDate = getField(
                              form,
                              'submissionDate',
                              'submission_date'
                            );
                            return submissionDate
                              ? new Date(submissionDate).toLocaleDateString(
                                  'id-ID'
                                )
                              : '-';
                          })()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors"
                              title="Lihat Detail"
                              onClick={() => handleViewDetail(form)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer transition-colors"
                              title="Review"
                              onClick={() => handleOpenReview(form)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer transition-colors"
                              title="Minta Edit"
                              onClick={() => handleOpenEdit(form)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {submissions.length > 0 &&
            itemsPerPage !== -1 &&
            filteredSubmissions.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} -{' '}
                  {Math.min(endIndex, filteredSubmissions.length)} dari{' '}
                  {filteredSubmissions.length} data
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Formulir Pendaftaran</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-6 py-4">
              {/* Step 1: Data Pribadi */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-emerald flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Pribadi
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Nama Lengkap</Label>
                    <p className="font-medium">
                      {getField(selectedForm, 'namaLengkap', 'nama_lengkap')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Nama Panggilan</Label>
                    <p className="font-medium">{selectedForm.nama_panggilan}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Jenis Kelamin</Label>
                    <p className="font-medium">{selectedForm.jenis_kelamin}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tempat Lahir</Label>
                    <p className="font-medium">{selectedForm.tempat_lahir}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tanggal Lahir</Label>
                    <p className="font-medium">
                      {(() => {
                        const tanggalLahir = getField(
                          selectedForm,
                          'tanggalLahir',
                          'tanggal_lahir'
                        );
                        return tanggalLahir
                          ? new Date(tanggalLahir).toLocaleDateString('id-ID')
                          : '-';
                      })()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Usia</Label>
                    <p className="font-medium">
                      {(() => {
                        const tanggalLahir = getField(
                          selectedForm,
                          'tanggalLahir',
                          'tanggal_lahir'
                        );
                        return tanggalLahir
                          ? Math.floor(
                              (new Date().getTime() -
                                new Date(tanggalLahir).getTime()) /
                                (365.25 * 24 * 60 * 60 * 1000)
                            )
                          : 0;
                      })()}{' '}
                      tahun
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Agama</Label>
                    <p className="font-medium">{selectedForm.agama}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Kewarganegaraan</Label>
                    <p className="font-medium">
                      {selectedForm.kewarganegaraan}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Anak Ke</Label>
                    <p className="font-medium">
                      {selectedForm.anak_ke} dari {selectedForm.jumlah_saudara}{' '}
                      bersaudara
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Bahasa Sehari-hari</Label>
                    <p className="font-medium">
                      {selectedForm.bahasa_sehari_hari}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Keterangan Tempat Tinggal */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Keterangan Tempat Tinggal
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-gray-600">Alamat Lengkap</Label>
                    <p className="font-medium">{selectedForm.alamat_lengkap}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">RT / RW</Label>
                    <p className="font-medium">
                      {selectedForm.rt} / {selectedForm.rw}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Kelurahan</Label>
                    <p className="font-medium">{selectedForm.kelurahan}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Kecamatan</Label>
                    <p className="font-medium">{selectedForm.kecamatan}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Kabupaten/Kota</Label>
                    <p className="font-medium">{selectedForm.kabupaten_kota}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Provinsi</Label>
                    <p className="font-medium">{selectedForm.provinsi}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Kode Pos</Label>
                    <p className="font-medium">{selectedForm.kode_pos}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Telepon</Label>
                    <p className="font-medium">{selectedForm.telepon}</p>
                  </div>
                  {selectedForm.jarak_ke_sekolah && (
                    <div>
                      <Label className="text-gray-600">Jarak ke Sekolah</Label>
                      <p className="font-medium">
                        {selectedForm.jarak_ke_sekolah} km
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Data Orang Tua/Wali */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Data Orang Tua/Wali
                </h3>

                {/* Data Ayah */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-3 text-blue-900">
                    Data Ayah
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Nama Ayah</Label>
                      <p className="font-medium">
                        {getField(selectedForm, 'namaAyah', 'nama_ayah')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Pekerjaan</Label>
                      <p className="font-medium">
                        {selectedForm.pekerjaan_ayah}
                      </p>
                    </div>
                    {selectedForm.pendidikan_ayah && (
                      <div>
                        <Label className="text-gray-600">
                          Pendidikan Terakhir
                        </Label>
                        <p className="font-medium">
                          {selectedForm.pendidikan_ayah}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-600">Telepon</Label>
                      <p className="font-medium">{selectedForm.telepon_ayah}</p>
                    </div>
                  </div>
                </div>

                {/* Data Ibu */}
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-3 text-pink-900">
                    Data Ibu
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Nama Ibu</Label>
                      <p className="font-medium">
                        {getField(selectedForm, 'namaIbu', 'nama_ibu')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Pekerjaan</Label>
                      <p className="font-medium">
                        {selectedForm.pekerjaan_ibu}
                      </p>
                    </div>
                    {selectedForm.pendidikan_ibu && (
                      <div>
                        <Label className="text-gray-600">
                          Pendidikan Terakhir
                        </Label>
                        <p className="font-medium">
                          {selectedForm.pendidikan_ibu}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-600">Telepon</Label>
                      <p className="font-medium">{selectedForm.telepon_ibu}</p>
                    </div>
                  </div>
                </div>

                {/* Data Wali (jika ada) */}
                {selectedForm.nama_wali && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-3 text-gray-900">
                      Data Wali
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Nama Wali</Label>
                        <p className="font-medium">{selectedForm.nama_wali}</p>
                      </div>
                      {selectedForm.hubungan_wali && (
                        <div>
                          <Label className="text-gray-600">Hubungan</Label>
                          <p className="font-medium">
                            {selectedForm.hubungan_wali}
                          </p>
                        </div>
                      )}
                      {selectedForm.telepon_wali && (
                        <div>
                          <Label className="text-gray-600">Telepon</Label>
                          <p className="font-medium">
                            {selectedForm.telepon_wali}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Data Kesehatan dan Lainnya */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Kesehatan dan Lainnya
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Golongan Darah</Label>
                    <p className="font-medium">
                      {displayValue(selectedForm.golongan_darah)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tinggi Badan</Label>
                    <p className="font-medium">
                      {selectedForm.tinggi_badan
                        ? `${selectedForm.tinggi_badan} cm`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Berat Badan</Label>
                    <p className="font-medium">
                      {selectedForm.berat_badan
                        ? `${selectedForm.berat_badan} kg`
                        : '-'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Riwayat Penyakit</Label>
                    <p className="font-medium">
                      {displayValue(selectedForm.riwayat_penyakit)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Alergi</Label>
                    <p className="font-medium">
                      {displayValue(selectedForm.alergi)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Riwayat Vaksinasi</Label>
                    <p className="font-medium">
                      {displayValue(selectedForm.riwayat_vaksinasi)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Hobi dan Minat</Label>
                    <p className="font-medium">
                      {displayValue(selectedForm.hobi_minat)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">
                      Prestasi yang Pernah Diraih
                    </Label>
                    <p className="font-medium">
                      {displayValue(selectedForm.prestasi_yang_pernah_diraih)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5: Pernyataan dan Konfirmasi */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Pernyataan dan Konfirmasi
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">
                      Program yang Dipilih
                    </Label>
                    <p className="font-medium">
                      {getField(
                        selectedForm,
                        'programYangDipilih',
                        'program_yang_dipilih'
                      )}
                    </p>
                  </div>
                  {getField(
                    selectedForm,
                    'informasiTambahan',
                    'informasi_tambahan'
                  ) && (
                    <div>
                      <Label className="text-gray-600">
                        Informasi Tambahan
                      </Label>
                      <p className="font-medium">
                        {getField(
                          selectedForm,
                          'informasiTambahan',
                          'informasi_tambahan'
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-600">Tanggal Pendaftaran</Label>
                    <p className="font-medium">
                      {(() => {
                        const submissionDate = getField(
                          selectedForm,
                          'submissionDate',
                          'submission_date'
                        );
                        return submissionDate
                          ? new Date(submissionDate).toLocaleDateString(
                              'id-ID',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )
                          : '-';
                      })()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <p className="font-medium">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedForm.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : selectedForm.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : selectedForm.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {selectedForm.status === 'submitted'
                          ? 'Menunggu Review'
                          : selectedForm.status === 'reviewed'
                          ? 'Sudah Direview'
                          : selectedForm.status === 'approved'
                          ? 'Disetujui'
                          : 'Ditolak'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
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

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Review Formulir
            </DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Formulir:</strong>{' '}
                  {getField(selectedForm, 'namaLengkap', 'nama_lengkap')}
                </p>
                <p className="text-sm text-blue-900">
                  <strong>Program:</strong>{' '}
                  {getField(
                    selectedForm,
                    'programYangDipilih',
                    'program_yang_dipilih'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewNotes">
                  Catatan Review <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Masukkan catatan hasil review..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Catatan ini akan dikirim via email ke orang tua/wali
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                  disabled={actionLoading}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleReviewSubmit}
                  disabled={actionLoading || !reviewNotes.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim...
                    </div>
                  ) : (
                    'Kirim Review'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Request Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-600" />
              Minta Edit Formulir
            </DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4 py-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-900">
                  <strong>Formulir:</strong>{' '}
                  {getField(selectedForm, 'namaLengkap', 'nama_lengkap')}
                </p>
                <p className="text-sm text-orange-900">
                  <strong>Program:</strong>{' '}
                  {getField(
                    selectedForm,
                    'programYangDipilih',
                    'program_yang_dipilih'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editNotes">
                  Catatan Edit <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="editNotes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Jelaskan bagian mana yang perlu diedit..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Permintaan edit akan dikirim via email ke orang tua/wali
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={actionLoading}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  disabled={actionLoading || !editNotes.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {actionLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim...
                    </div>
                  ) : (
                    'Kirim Permintaan'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
