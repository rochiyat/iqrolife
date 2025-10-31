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
import { Plus, Search, Edit, Trash2, Eye, UserPlus, FileImage, ExternalLink } from 'lucide-react';

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
      paymentProof: 'https://placehold.co/600x400/0ea5e9/white?text=Bukti+Transfer+Ahmad',
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
      paymentProof: 'https://placehold.co/600x400/ec4899/white?text=Bukti+Transfer+Siti',
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
      paymentProof: 'https://placehold.co/600x400/10b981/white?text=Bukti+Transfer+Rizki',
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
      paymentProof: 'https://placehold.co/600x400/f97316/white?text=Bukti+Transfer+Fatimah',
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
      paymentProof: 'https://placehold.co/600x400/8b5cf6/white?text=Bukti+Transfer+Abdullah',
    },
  ]);

  const filteredStudents = students.filter(student =>
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
      alert(`User berhasil dibuat!\n\nNama: ${selectedStudent.name}\nEmail: ${selectedStudent.email}\nRole: Parent\nPassword: (dikirim via email)`);
      setIsCreateUserDialogOpen(false);
      setSelectedStudent(null);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Calon Murid Baru</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input placeholder="Masukkan nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label>Usia</Label>
                <Input type="number" placeholder="Masukkan usia" />
              </div>
              <div className="space-y-2">
                <Label>Nama Orang Tua</Label>
                <Input placeholder="Masukkan nama orang tua" />
              </div>
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input placeholder="Masukkan no. telepon" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Masukkan email" />
              </div>
              <div className="space-y-2">
                <Label>Program</Label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Kelas Eksplorasi</option>
                  <option>Kelas Pra Aqil Baligh</option>
                  <option>Kelas Aqil Baligh</option>
                  <option>KBTK</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-brand-emerald hover:bg-brand-emerald/90">
                Simpan
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usia</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Orang Tua</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kontak</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
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
                    <td className="py-3 px-4">{student.program}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
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
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          title="Hapus"
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
              <div className="text-3xl font-bold text-brand-emerald">{students.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Pendaftar</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {students.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Disetujui</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {students.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Menunggu</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Calon Murid</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
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
                  <p className="font-medium">{new Date(selectedStudent.birthDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Usia</Label>
                  <p className="font-medium">{selectedStudent.age} tahun</p>
                </div>
                <div>
                  <Label className="text-gray-600">Nama Orang Tua</Label>
                  <p className="font-medium">{selectedStudent.parent}</p>
                </div>
                <div>
                  <Label className="text-gray-600">No. Telepon</Label>
                  <p className="font-medium">{selectedStudent.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Program</Label>
                  <p className="font-medium">{selectedStudent.program}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-600">Alamat</Label>
                  <p className="font-medium">{selectedStudent.address}</p>
                </div>
                {selectedStudent.previousSchool && (
                  <div className="col-span-2">
                    <Label className="text-gray-600">Asal Sekolah</Label>
                    <p className="font-medium">{selectedStudent.previousSchool}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <Label className="text-gray-600">Tanggal Pendaftaran</Label>
                  <p className="font-medium">{new Date(selectedStudent.registrationDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-600">Status</Label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.status)}`}>
                    {getStatusText(selectedStudent.status)}
                  </span>
                </div>
                {selectedStudent.notes && (
                  <div className="col-span-2">
                    <Label className="text-gray-600">Catatan</Label>
                    <p className="font-medium">{selectedStudent.notes}</p>
                  </div>
                )}
                {selectedStudent.paymentProof && (
                  <div className="col-span-2">
                    <Label className="text-gray-600 flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      Bukti Transfer Pendaftaran
                    </Label>
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
                      className="inline-flex items-center gap-2 text-sm text-brand-emerald hover:text-brand-emerald/80 mt-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Lihat gambar full size
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
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
                  <strong>Catatan:</strong> Password akan dikirimkan ke email yang terdaftar.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
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
    </div>
  );
}
