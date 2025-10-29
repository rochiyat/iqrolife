'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Search,
  Eye,
  Trash2,
  UserPlus,
  Filter,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProspectiveStudent {
  id: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: string;
  asalSekolah?: string;
  namaOrangTua: string;
  noTelepon: string;
  email: string;
  alamat: string;
  catatan?: string;
  buktiTransferPath?: string;
  status: string;
  createdAt: string;
}

export default function CalonMuridPage() {
  const [students, setStudents] = useState<ProspectiveStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<ProspectiveStudent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [statusFilter, search]);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/dashboard/students?${params}`);
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId: string, createUser: boolean) => {
    if (!confirm(`Apakah Anda yakin ingin menyetujui pendaftar ini?${createUser ? '\n\nAkun user akan dibuat otomatis dengan email orang tua.' : ''}`)) {
      return;
    }

    try {
      const response = await fetch('/api/dashboard/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, action: 'approve', createUser }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message + (data.user ? `\n\nUser berhasil dibuat:\nEmail: ${data.user.email}\nRole: ${data.user.role?.displayName || data.user.roleName}` : ''));
        fetchStudents();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error approving student:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleReject = async (studentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menolak pendaftar ini?')) {
      return;
    }

    try {
      const response = await fetch('/api/dashboard/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, action: 'reject', createUser: false }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchStudents();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error rejecting student:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pendaftar ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/students?id=${studentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchStudents();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Terjadi kesalahan');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Menunggu</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Ditolak</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calon Murid</h1>
          <p className="text-gray-600 mt-1">Kelola pendaftaran siswa baru</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama anak, orang tua, atau email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                >
                  Menunggu
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                >
                  Disetujui
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                >
                  Ditolak
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pendaftar ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald mx-auto"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data pendaftar
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Nama Anak</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Orang Tua</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Kontak</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Tanggal Daftar</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-gray-900">{student.namaLengkap}</div>
                            <div className="text-sm text-gray-500">
                              {student.jenisKelamin} • {new Date(student.tanggalLahir).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-900">{student.namaOrangTua}</td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="text-gray-900">{student.noTelepon}</div>
                            <div className="text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(student.status)}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedStudent(student);
                                setDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {student.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(student.id, true)}
                                  title="Setujui & Buat User"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleReject(student.id)}
                                  title="Tolak"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pendaftar</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-3">Data Anak</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Nama Lengkap</p>
                    <p className="font-medium">{selectedStudent.namaLengkap}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal Lahir</p>
                    <p className="font-medium">{new Date(selectedStudent.tanggalLahir).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Jenis Kelamin</p>
                    <p className="font-medium">{selectedStudent.jenisKelamin}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Asal Sekolah</p>
                    <p className="font-medium">{selectedStudent.asalSekolah || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Data Orang Tua</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Nama Orang Tua</p>
                    <p className="font-medium">{selectedStudent.namaOrangTua}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">No. Telepon</p>
                    <p className="font-medium">{selectedStudent.noTelepon}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedStudent.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Alamat</p>
                    <p className="font-medium">{selectedStudent.alamat}</p>
                  </div>
                </div>
              </div>

              {selectedStudent.catatan && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Catatan</h3>
                  <p className="text-sm">{selectedStudent.catatan}</p>
                </div>
              )}

              {selectedStudent.buktiTransferPath && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Bukti Transfer</h3>
                  <img
                    src={selectedStudent.buktiTransferPath}
                    alt="Bukti Transfer"
                    className="max-w-full rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
