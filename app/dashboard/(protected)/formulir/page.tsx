'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus,
  Search
} from 'lucide-react';

interface Form {
  id: string;
  title: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  type: string;
  notes?: string;
}

export default function FormulirPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      title: 'Formulir Pendaftaran - Ahmad Zaki',
      submittedBy: 'Bapak Ahmad',
      submittedDate: '2024-10-25',
      status: 'pending',
      type: 'Pendaftaran Siswa',
    },
    {
      id: '2',
      title: 'Formulir Pendaftaran - Siti Fatimah',
      submittedBy: 'Ibu Siti',
      submittedDate: '2024-10-24',
      status: 'approved',
      type: 'Pendaftaran Siswa',
      notes: 'Semua dokumen lengkap',
    },
    {
      id: '3',
      title: 'Formulir Perubahan Data - Muhammad Rizki',
      submittedBy: 'Ibu Rina',
      submittedDate: '2024-10-23',
      status: 'approved',
      type: 'Perubahan Data',
    },
    {
      id: '4',
      title: 'Formulir Pendaftaran - Fatimah Az-Zahra',
      submittedBy: 'Bapak Yusuf',
      submittedDate: '2024-10-22',
      status: 'rejected',
      type: 'Pendaftaran Siswa',
      notes: 'Dokumen tidak lengkap',
    },
  ]);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || form.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'pending':
        return 'Menunggu';
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
          <h2 className="text-3xl font-bold text-gray-900">Formulir</h2>
          <p className="text-gray-600 mt-1">
            Kelola dan review formulir pendaftaran
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-brand-emerald hover:bg-brand-emerald/90">
              <Plus className="w-4 h-4 mr-2" />
              Formulir Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Formulir Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Judul Formulir</Label>
                <Input placeholder="Masukkan judul formulir" />
              </div>
              <div className="space-y-2">
                <Label>Tipe Formulir</Label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Pendaftaran Siswa</option>
                  <option>Perubahan Data</option>
                  <option>Pengajuan Cuti</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea 
                  placeholder="Masukkan deskripsi formulir"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Batal</Button>
              <Button className="bg-brand-emerald hover:bg-brand-emerald/90">
                Buat Formulir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari formulir..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      <div className="grid gap-4">
        {filteredForms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-brand-emerald/10 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-brand-emerald" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {form.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Diajukan oleh:</span> {form.submittedBy}
                      </div>
                      <div>
                        <span className="font-medium">Tanggal:</span> {new Date(form.submittedDate).toLocaleDateString('id-ID')}
                      </div>
                      <div>
                        <span className="font-medium">Tipe:</span> {form.type}
                      </div>
                    </div>
                    {form.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                        <span className="font-medium">Catatan:</span> {form.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(form.status)}`}>
                    {getStatusIcon(form.status)}
                    <span className="text-sm font-medium">{getStatusText(form.status)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-brand-emerald" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{forms.length}</div>
                <div className="text-sm text-gray-600">Total Formulir</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {forms.filter(f => f.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Menunggu</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {forms.filter(f => f.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Disetujui</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {forms.filter(f => f.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-600">Ditolak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
