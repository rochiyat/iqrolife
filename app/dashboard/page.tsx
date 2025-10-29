'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/dashboard/statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Pendaftar',
      value: stats.total,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Menunggu Persetujuan',
      value: stats.pending,
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Disetujui',
      value: stats.approved,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Ditolak',
      value: stats.rejected,
      icon: UserX,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang di Dashboard Iqrolife 🎉
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-5 w-5 ${card.textColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-gray-900">
                        {card.value}
                      </div>
                      <div className="text-sm text-gray-500">pendaftar</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.total === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada pendaftaran
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p>✅ {stats.approved} pendaftar telah disetujui</p>
                  <p className="mt-2">⏳ {stats.pending} pendaftar menunggu persetujuan</p>
                  <p className="mt-2">❌ {stats.rejected} pendaftar ditolak</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-brand-emerald" />
                <h3 className="font-semibold text-gray-900">Kelola Calon Murid</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Lihat dan kelola pendaftaran siswa baru
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <UserCheck className="h-10 w-10 mx-auto mb-3 text-brand-cyan" />
                <h3 className="font-semibold text-gray-900">Kelola Users</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Tambah dan kelola user admin/staff
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-3 text-brand-lime" />
                <h3 className="font-semibold text-gray-900">Lihat Laporan</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Analisis data pendaftaran siswa
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
