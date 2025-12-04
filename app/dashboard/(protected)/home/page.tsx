'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardStats {
  totalRegistrations: number;
  registrationsChange: string;
  totalUsers: number;
  usersChange: string;
  pendingFormulir: number;
  pendingChange: string;
  approvalRate: string;
  approvalRateChange: string;
}

interface Activity {
  action: string;
  name: string;
  time: string;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (user) {
      // Fetch stats only for superadmin and staff
      if (user.role === 'superadmin' || user.role === 'staff') {
        fetchDashboardStats();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data.stats);
          setRecentActivities(result.data.recentActivities || []);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search
  const filteredActivities = recentActivities.filter((activity) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      activity.action.toLowerCase().includes(searchLower) ||
      activity.name.toLowerCase().includes(searchLower) ||
      activity.time.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  // Reset to page 1 when search or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  const statsCards = stats
    ? [
        {
          title: 'Total Registrasi',
          value: stats.totalRegistrations.toString(),
          icon: GraduationCap,
          color: 'bg-blue-500',
          change: stats.registrationsChange,
        },
        {
          title: 'Total Users',
          value: stats.totalUsers.toString(),
          icon: Users,
          color: 'bg-green-500',
          change: stats.usersChange,
        },
        {
          title: 'Formulir Pending',
          value: stats.pendingFormulir.toString(),
          icon: FileText,
          color: 'bg-yellow-500',
          change: stats.pendingChange,
        },
        {
          title: 'Approval Rate',
          value: stats.approvalRate,
          icon: TrendingUp,
          color: 'bg-purple-500',
          change: stats.approvalRateChange,
        },
      ]
    : [];

  // Check if user is parent or teacher
  const isLimitedRole = user?.role === 'parent' || user?.role === 'teacher';

  // For parent and teacher, show simple welcome
  if (isLimitedRole) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Selamat Datang! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Selamat datang di Dashboard Iqrolife
          </p>
        </div>
      </div>
    );
  }

  // For superadmin and staff, show full dashboard
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang! 👋
        </h2>
        <p className="text-gray-600">
          Berikut adalah ringkasan dashboard Anda hari ini
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stat.change.startsWith('+')
                            ? 'text-green-600'
                            : stat.change.startsWith('-')
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terkini</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search and Show Entries */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Cari aktivitas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      Show:
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Activities List */}
                {recentActivities.length > 0 ? (
                  <>
                    {paginatedActivities.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {paginatedActivities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 pb-4 border-b last:border-0"
                          >
                            <div className="w-2 h-2 bg-brand-emerald rounded-full mt-2" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.action}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">
                        Tidak ada aktivitas yang cocok dengan pencarian
                      </p>
                    )}

                    {/* Pagination */}
                    {filteredActivities.length > 0 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Menampilkan {startIndex + 1} -{' '}
                          {Math.min(endIndex, filteredActivities.length)} dari{' '}
                          {filteredActivities.length} aktivitas
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter((page) => {
                                // Show first page, last page, current page, and pages around current
                                return (
                                  page === 1 ||
                                  page === totalPages ||
                                  Math.abs(page - currentPage) <= 1
                                );
                              })
                              .map((page, index, array) => {
                                // Add ellipsis if there's a gap
                                const prevPage = array[index - 1];
                                const showEllipsis =
                                  prevPage && page - prevPage > 1;

                                return (
                                  <div key={page} className="flex items-center">
                                    {showEllipsis && (
                                      <span className="px-2 text-gray-400">
                                        ...
                                      </span>
                                    )}
                                    <Button
                                      variant={
                                        currentPage === page
                                          ? 'default'
                                          : 'outline'
                                      }
                                      size="sm"
                                      onClick={() => handlePageChange(page)}
                                      className="w-8 h-8 p-0"
                                    >
                                      {page}
                                    </Button>
                                  </div>
                                );
                              })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Belum ada aktivitas terkini
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-brand-emerald hover:bg-brand-emerald/5 transition-colors text-left">
                    <GraduationCap className="w-8 h-8 text-brand-emerald mb-2" />
                    <p className="text-sm font-medium">Tambah Calon Murid</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-brand-cyan hover:bg-brand-cyan/5 transition-colors text-left">
                    <Users className="w-8 h-8 text-brand-cyan mb-2" />
                    <p className="text-sm font-medium">Tambah User</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-brand-lime hover:bg-brand-lime/5 transition-colors text-left">
                    <FileText className="w-8 h-8 text-brand-lime mb-2" />
                    <p className="text-sm font-medium">Lihat Formulir</p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-brand-coral hover:bg-brand-coral/5 transition-colors text-left">
                    <TrendingUp className="w-8 h-8 text-brand-coral mb-2" />
                    <p className="text-sm font-medium">Lihat Report</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Role Info */}
      {user && (
        <Card className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 border-brand-emerald/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-brand-emerald p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Role Anda</h3>
                <p className="text-sm text-gray-600 capitalize">
                  Login sebagai <strong>{user.role}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
