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
} from '@/components/ui/dialog';
import { 
  Search, 
  Eye, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  User,
  GraduationCap,
  Upload,
  Award,
  Activity,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Home
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface PortfolioActivity {
  id: string;
  type: 'registration' | 'form_submission' | 'document_upload' | 'approval' | 'payment' | 'enrollment';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected';
}

interface StudentPortfolio {
  id: string;
  studentName: string;
  studentId: string;
  program: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'enrolled';
  progress: number;
  parent: string;
  email: string;
  phone: string;
  activities: PortfolioActivity[];
  documents: {
    formData: boolean;
    paymentProof: boolean;
    birthCertificate: boolean;
    healthCertificate: boolean;
    photo: boolean;
  };
  formData?: {
    birthDate: string;
    age: number;
    gender: string;
    address: string;
    previousSchool?: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
  };
}

export default function PortofolioPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState<StudentPortfolio | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    registration: true,
    form: false,
    documents: false,
    timeline: false,
  });

  const [portfolios] = useState<StudentPortfolio[]>([
    {
      id: '1',
      studentName: 'Ahmad Zaki',
      studentId: 'IQL-2024-001',
      program: 'KBTK',
      registrationDate: '2024-10-15',
      status: 'enrolled',
      progress: 100,
      parent: 'Bapak Ahmad',
      email: 'ahmad@example.com',
      phone: '081234567890',
      documents: {
        formData: true,
        paymentProof: true,
        birthCertificate: true,
        healthCertificate: true,
        photo: true,
      },
      activities: [
        {
          id: '1',
          type: 'registration',
          title: 'Pendaftaran Online',
          description: 'Pendaftaran akun dan data awal berhasil',
          date: '2024-10-15 09:30',
          status: 'completed',
        },
        {
          id: '2',
          type: 'form_submission',
          title: 'Pengisian Formulir',
          description: 'Formulir pendaftaran lengkap disubmit',
          date: '2024-10-15 10:15',
          status: 'completed',
        },
        {
          id: '3',
          type: 'document_upload',
          title: 'Upload Dokumen',
          description: 'Bukti transfer dan dokumen pendukung diupload',
          date: '2024-10-16 14:20',
          status: 'completed',
        },
        {
          id: '4',
          type: 'approval',
          title: 'Verifikasi Admin',
          description: 'Data dan dokumen diverifikasi dan disetujui',
          date: '2024-10-17 11:00',
          status: 'completed',
        },
        {
          id: '5',
          type: 'enrollment',
          title: 'Terdaftar Resmi',
          description: 'Murid terdaftar resmi di program KBTK',
          date: '2024-10-18 09:00',
          status: 'completed',
        },
      ],
    },
    {
      id: '2',
      studentName: 'Siti Fatimah',
      studentId: 'IQL-2024-002',
      program: 'Kelas Pra Aqil Baligh',
      registrationDate: '2024-10-20',
      status: 'pending',
      progress: 60,
      parent: 'Ibu Siti',
      email: 'siti@example.com',
      phone: '081234567891',
      documents: {
        formData: true,
        paymentProof: true,
        birthCertificate: true,
        healthCertificate: false,
        photo: false,
      },
      activities: [
        {
          id: '1',
          type: 'registration',
          title: 'Pendaftaran Online',
          description: 'Pendaftaran akun berhasil',
          date: '2024-10-20 13:45',
          status: 'completed',
        },
        {
          id: '2',
          type: 'form_submission',
          title: 'Pengisian Formulir',
          description: 'Formulir pendaftaran disubmit',
          date: '2024-10-20 14:30',
          status: 'completed',
        },
        {
          id: '3',
          type: 'document_upload',
          title: 'Upload Dokumen',
          description: 'Menunggu upload dokumen kesehatan dan foto',
          date: '2024-10-21 10:00',
          status: 'pending',
        },
      ],
    },
    {
      id: '3',
      studentName: 'Muhammad Rizki',
      studentId: 'IQL-2024-003',
      program: 'KBTK',
      registrationDate: '2024-10-18',
      status: 'approved',
      progress: 80,
      parent: 'Ibu Rina',
      email: 'rizki@example.com',
      phone: '081234567892',
      documents: {
        formData: true,
        paymentProof: true,
        birthCertificate: true,
        healthCertificate: true,
        photo: true,
      },
      activities: [
        {
          id: '1',
          type: 'registration',
          title: 'Pendaftaran Online',
          description: 'Pendaftaran berhasil',
          date: '2024-10-18 08:15',
          status: 'completed',
        },
        {
          id: '2',
          type: 'form_submission',
          title: 'Pengisian Formulir',
          description: 'Formulir lengkap disubmit',
          date: '2024-10-18 09:00',
          status: 'completed',
        },
        {
          id: '3',
          type: 'document_upload',
          title: 'Upload Dokumen',
          description: 'Semua dokumen berhasil diupload',
          date: '2024-10-19 15:30',
          status: 'completed',
        },
        {
          id: '4',
          type: 'approval',
          title: 'Verifikasi Admin',
          description: 'Data disetujui, menunggu pembayaran',
          date: '2024-10-20 10:45',
          status: 'completed',
        },
      ],
    },
  ]);

  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.parent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
      case 'enrolled':
        return 'Terdaftar';
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <User className="w-5 h-5 text-brand-emerald" />;
      case 'form_submission':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'document_upload':
        return <Upload className="w-5 h-5 text-purple-600" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'payment':
        return <Award className="w-5 h-5 text-orange-600" />;
      case 'enrollment':
        return <GraduationCap className="w-5 h-5 text-brand-cyan" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleViewDetail = (portfolio: StudentPortfolio) => {
    setSelectedPortfolio(portfolio);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Portofolio Peserta Didik</h2>
          <p className="text-gray-600 mt-1">
            Timeline dan progress pendaftaran peserta didik
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Portofolio</p>
                <p className="text-3xl font-bold text-brand-emerald mt-1">
                  {portfolios.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-brand-emerald/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-brand-emerald" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terdaftar</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {portfolios.filter(p => p.status === 'enrolled').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {portfolios.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {portfolios.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Portofolio</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama, ID, atau orang tua..."
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
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    ID / Nama Murid
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Program
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Orang Tua
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">
                    Progress
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPortfolios.map((portfolio) => (
                  <tr key={portfolio.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {portfolio.studentName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {portfolio.studentId}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">
                        {portfolio.program}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">
                        {portfolio.parent}
                      </div>
                      <div className="text-xs text-gray-500">
                        {portfolio.phone}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              portfolio.progress === 100
                                ? 'bg-green-600'
                                : portfolio.progress >= 60
                                ? 'bg-blue-600'
                                : 'bg-yellow-600'
                            }`}
                            style={{ width: `${portfolio.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {portfolio.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(portfolio.status)}`}>
                        {getStatusText(portfolio.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-brand-emerald hover:text-brand-emerald/80"
                        onClick={() => handleViewDetail(portfolio)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Portofolio Peserta Didik</DialogTitle>
          </DialogHeader>
          {selectedPortfolio && (
            <div className="space-y-6 py-4">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 rounded-lg border border-brand-emerald/20">
                <div>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                  <p className="font-semibold text-gray-900">{selectedPortfolio.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID Murid</p>
                  <p className="font-semibold text-gray-900">{selectedPortfolio.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-semibold text-gray-900">{selectedPortfolio.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Daftar</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedPortfolio.registrationDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Orang Tua</p>
                  <p className="font-semibold text-gray-900">{selectedPortfolio.parent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(selectedPortfolio.status)}`}>
                    {getStatusText(selectedPortfolio.status)}
                  </span>
                </div>
              </div>

              {/* Documents Checklist */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-emerald" />
                  Kelengkapan Dokumen
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'formData', label: 'Formulir Pendaftaran' },
                    { key: 'paymentProof', label: 'Bukti Transfer' },
                    { key: 'birthCertificate', label: 'Akta Kelahiran' },
                    { key: 'healthCertificate', label: 'Surat Keterangan Sehat' },
                    { key: 'photo', label: 'Pas Foto' },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className={`p-3 rounded-lg border flex items-center gap-3 ${
                        selectedPortfolio.documents[doc.key as keyof typeof selectedPortfolio.documents]
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {selectedPortfolio.documents[doc.key as keyof typeof selectedPortfolio.documents] ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-emerald" />
                  Timeline Aktivitas
                </h3>
                <div className="space-y-4">
                  {selectedPortfolio.activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-white border-2 border-brand-emerald rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        {index < selectedPortfolio.activities.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                              {getActivityStatusIcon(activity.status)}
                            </div>
                            <span className="text-xs text-gray-500">{activity.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
