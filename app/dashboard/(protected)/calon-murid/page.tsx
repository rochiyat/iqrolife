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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  age: number;
  parent: string;
  phone: string;
  email: string;
  program: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
}

export default function CalonMuridPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Ahmad Zaki',
      age: 7,
      parent: 'Bapak Ahmad',
      phone: '081234567890',
      email: 'ahmad@example.com',
      program: 'Kelas Eksplorasi',
      status: 'approved',
      registrationDate: '2024-10-15',
    },
    {
      id: '2',
      name: 'Siti Fatimah',
      age: 10,
      parent: 'Ibu Siti',
      phone: '081234567891',
      email: 'siti@example.com',
      program: 'Kelas Pra Aqil Baligh',
      status: 'pending',
      registrationDate: '2024-10-20',
    },
    {
      id: '3',
      name: 'Muhammad Rizki',
      age: 5,
      parent: 'Ibu Rina',
      phone: '081234567892',
      email: 'rizki@example.com',
      program: 'KBTK',
      status: 'approved',
      registrationDate: '2024-10-18',
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
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
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
    </div>
  );
}
