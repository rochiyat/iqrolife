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
  Phone,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

interface FormSubmission {
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
  registrationDate: string;
  notes?: string;
  paymentProof?: string;
}

export default function FormulirListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<FormSubmission | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
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
      const response = await fetch('/api/dashboard/formulir-list');
      const result = await response.json();

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

  const filteredSubmissions = submissions.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.parent.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  submissions.filter(
                    (s) =>
                      new Date(s.registrationDate).getMonth() ===
                      new Date().getMonth()
                  ).length
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
                  submissions.filter(
                    (s) =>
                      new Date(s.registrationDate).toDateString() ===
                      new Date().toDateString()
                  ).length
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
                  {paginatedSubmissions.map((form) => (
                    <tr key={form.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{form.name}</div>
                      </td>
                      <td className="py-3 px-4">{form.age} tahun</td>
                      <td className="py-3 px-4">{form.parent}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{form.phone}</div>
                          <div className="text-gray-500">{form.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(form.registrationDate).toLocaleDateString(
                          'id-ID'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors"
                          title="Lihat Detail"
                          onClick={() => handleViewDetail(form)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Formulir Pendaftaran</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-6 py-4">
              {/* Data Anak */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Anak
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Nama Lengkap</Label>
                    <p className="font-medium">{selectedForm.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Jenis Kelamin</Label>
                    <p className="font-medium">{selectedForm.gender}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tanggal Lahir</Label>
                    <p className="font-medium">
                      {new Date(selectedForm.birthDate).toLocaleDateString(
                        'id-ID'
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Usia</Label>
                    <p className="font-medium">{selectedForm.age} tahun</p>
                  </div>
                  {selectedForm.previousSchool && (
                    <div className="col-span-2">
                      <Label className="text-gray-600">Asal Sekolah/TK</Label>
                      <p className="font-medium">
                        {selectedForm.previousSchool}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-pink-800 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Data Orang Tua/Wali
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Nama Orang Tua/Wali</Label>
                    <p className="font-medium">{selectedForm.parent}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">
                      No. Telepon/WhatsApp
                    </Label>
                    <p className="font-medium">{selectedForm.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Email</Label>
                    <p className="font-medium">{selectedForm.email}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Alamat Lengkap</Label>
                    <p className="font-medium">{selectedForm.address}</p>
                  </div>
                </div>
              </div>

              {/* Info Pendaftaran */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informasi Pendaftaran
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Tanggal Pendaftaran</Label>
                    <p className="font-medium">
                      {new Date(
                        selectedForm.registrationDate
                      ).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {selectedForm.notes && (
                    <div>
                      <Label className="text-gray-600">Catatan</Label>
                      <p className="font-medium">{selectedForm.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bukti Transfer */}
              {selectedForm.paymentProof && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    Bukti Transfer Pendaftaran
                  </h3>

                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={selectedForm.paymentProof}
                      alt="Bukti Transfer"
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                  </div>
                  <a
                    href={selectedForm.paymentProof}
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
    </div>
  );
}
