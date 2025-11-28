'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, FileText, TrendingUp } from 'lucide-react';

interface User {
  role: string;
}

interface DashboardStats {
  totalCalonMurid: number;
  calonMuridChange: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/dashboard/login');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);

            // Fetch stats only for superadmin and staff
            if (data.user.role === 'superadmin' || data.user.role === 'staff') {
              fetchDashboardStats();
            } else {
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data.stats);
          setRecentActivities(result.data.recentActivities);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = stats
    ? [
        {
          title: 'Total Calon Murid',
          value: stats.totalCalonMurid.toString(),
          icon: GraduationCap,
          color: 'bg-blue-500',
          change: stats.calonMuridChange,
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
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
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
