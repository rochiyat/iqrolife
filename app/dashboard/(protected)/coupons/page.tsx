'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Ticket,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth, getUserPermissions } from '@/lib/auth-context';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  program?: string;
  createdAt: string;
  updatedAt: string;
}

// Coupon form state interface
interface CouponForm {
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  program: string;
}

const initialFormData: CouponForm = {
  code: '',
  name: '',
  description: '',
  discountType: 'fixed',
  discountValue: '',
  minPurchase: '',
  maxDiscount: '',
  usageLimit: '',
  validFrom: '',
  validUntil: '',
  isActive: true,
  program: '',
};

export default function CouponsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Form and selection states
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error and success states
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Check if user has access (superadmin only)
  const permissions = getUserPermissions(user);
  const canAccessCoupons = user?.role === 'superadmin';

  useEffect(() => {
    if (!authLoading && canAccessCoupons) {
      fetchCoupons();
    }
  }, [authLoading, canAccessCoupons]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/coupons`);
      const result = await response.json();

      if (response.ok && result.success) {
        setCoupons(result.data || []);
      } else if (response.ok && Array.isArray(result)) {
        setCoupons(result);
      } else {
        console.error('Failed to fetch coupons:', result.error);
        setCoupons([]);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // Validate coupon code (no spaces)
  const validateCode = (code: string): boolean => {
    if (/\s/.test(code)) {
      setFormError('Kode kupon tidak boleh mengandung spasi');
      return false;
    }
    if (code.length < 3) {
      setFormError('Kode kupon minimal 3 karakter');
      return false;
    }
    return true;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Clear error when user starts typing
    if (formError) setFormError('');

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Open add dialog
  const handleOpenAddDialog = () => {
    setFormData(initialFormData);
    setFormError('');
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
      isActive: coupon.isActive,
      program: coupon.program || '',
    });
    setFormError('');
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  // Open detail dialog
  const handleOpenDetailDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDetailDialogOpen(true);
  };

  // Submit add coupon
  const handleAddCoupon = async () => {
    // Basic validation
    if (
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.discountValue
    ) {
      setFormError('Kode, nama, dan nilai diskon wajib diisi');
      return;
    }

    // Validate code
    if (!validateCode(formData.code)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dashboard/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase().trim(),
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minPurchase: formData.minPurchase
            ? parseFloat(formData.minPurchase)
            : null,
          maxDiscount: formData.maxDiscount
            ? parseFloat(formData.maxDiscount)
            : null,
          usageLimit: formData.usageLimit
            ? parseInt(formData.usageLimit)
            : null,
          validFrom: formData.validFrom || null,
          validUntil: formData.validUntil || null,
          isActive: formData.isActive,
          program: formData.program.trim() || null,
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.id)) {
        setSuccessMessage('Kupon berhasil ditambahkan!');
        setIsAddDialogOpen(false);
        fetchCoupons();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormError(result.error || 'Gagal menambahkan kupon');
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
      setFormError('Terjadi kesalahan saat menambahkan kupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit edit coupon
  const handleEditCoupon = async () => {
    if (!selectedCoupon) return;

    // Basic validation
    if (
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.discountValue
    ) {
      setFormError('Kode, nama, dan nilai diskon wajib diisi');
      return;
    }

    // Validate code
    if (!validateCode(formData.code)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dashboard/coupons`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCoupon.id,
          code: formData.code.toUpperCase().trim(),
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minPurchase: formData.minPurchase
            ? parseFloat(formData.minPurchase)
            : null,
          maxDiscount: formData.maxDiscount
            ? parseFloat(formData.maxDiscount)
            : null,
          usageLimit: formData.usageLimit
            ? parseInt(formData.usageLimit)
            : null,
          validFrom: formData.validFrom || null,
          validUntil: formData.validUntil || null,
          isActive: formData.isActive,
          program: formData.program.trim() || null,
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.id)) {
        setSuccessMessage('Kupon berhasil diupdate!');
        setIsEditDialogOpen(false);
        setSelectedCoupon(null);
        fetchCoupons();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormError(result.error || 'Gagal mengupdate kupon');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      setFormError('Terjadi kesalahan saat mengupdate kupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit delete coupon
  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/dashboard/coupons?id=${selectedCoupon.id}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (response.ok && (result.success || response.status === 200)) {
        setSuccessMessage('Kupon berhasil dihapus!');
        setIsDeleteDialogOpen(false);
        setSelectedCoupon(null);
        fetchCoupons();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.error || 'Gagal menghapus kupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Terjadi kesalahan saat menghapus kupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy coupon code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSuccessMessage(`Kode "${code}" berhasil disalin!`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Filter coupons by search term
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description &&
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Summary statistics
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUsage = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  // Check access
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!canAccessCoupons) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
        <p className="text-gray-600">
          Halaman ini hanya dapat diakses oleh Superadmin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent flex items-center gap-2">
            <Ticket className="w-8 h-8 text-brand-emerald" />
            Manajemen Kupon
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola kupon diskon untuk program
          </p>
        </div>
        <Button
          onClick={handleOpenAddDialog}
          className="bg-gradient-to-r from-brand-emerald to-brand-cyan hover:from-brand-emerald/90 hover:to-brand-cyan/90 text-white gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Kupon
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kupon</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {coupons.length}
                </p>
              </div>
              <Ticket className="w-10 h-10 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kupon Aktif</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeCoupons}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penggunaan</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalUsage}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari kupon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredCoupons.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Kupon Tidak Ditemukan' : 'Belum Ada Kupon'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Coba kata kunci lain'
                : 'Mulai buat kupon diskon untuk program Anda'}
            </p>
            {!searchTerm && (
              <Button onClick={handleOpenAddDialog} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kupon Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Kode
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Nama
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Diskon
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Penggunaan
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Berlaku
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 text-emerald-700 px-2 py-1 rounded font-mono text-sm">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Salin kode"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{coupon.name}</p>
                      {coupon.program && (
                        <Badge variant="outline" className="text-xs">
                          {coupon.program}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {coupon.discountType === 'percentage' ? (
                        <>
                          <Percent className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold text-orange-600">
                            {coupon.discountValue}%
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-green-600">
                          {formatCurrency(coupon.discountValue)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">
                      {coupon.usageCount} / {coupon.usageLimit || '∞'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">
                      {coupon.validFrom || coupon.validUntil ? (
                        <>
                          {coupon.validFrom && (
                            <div>Dari: {formatDate(coupon.validFrom)}</div>
                          )}
                          {coupon.validUntil && (
                            <div>Sampai: {formatDate(coupon.validUntil)}</div>
                          )}
                        </>
                      ) : (
                        <span>Tidak terbatas</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        coupon.isActive
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }
                    >
                      {coupon.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDetailDialog(coupon)}
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditDialog(coupon)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-yellow-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDeleteDialog(coupon)}
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emerald-500" />
              Tambah Kupon Baru
            </DialogTitle>
            <DialogDescription>
              Buat kupon diskon baru untuk program
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {formError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Kode Kupon *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="CONTOH2024"
                  className="uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tanpa spasi, akan dikonversi ke huruf besar
                </p>
              </div>
              <div>
                <Label htmlFor="name">Nama Kupon *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Diskon Early Bird"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Deskripsi singkat tentang kupon..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Tipe Diskon *</Label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fixed">Nominal (Rp)</option>
                  <option value="percentage">Persentase (%)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="discountValue">
                  Nilai Diskon *{' '}
                  {formData.discountType === 'percentage' ? '(%)' : '(Rp)'}
                </Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  placeholder={
                    formData.discountType === 'percentage' ? '10' : '50000'
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPurchase">Minimum Pembelian (Rp)</Label>
                <Input
                  id="minPurchase"
                  name="minPurchase"
                  type="number"
                  min="0"
                  value={formData.minPurchase}
                  onChange={handleInputChange}
                  placeholder="100000"
                />
              </div>
              <div>
                <Label htmlFor="maxDiscount">Maksimum Diskon (Rp)</Label>
                <Input
                  id="maxDiscount"
                  name="maxDiscount"
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  placeholder="100000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Untuk tipe persentase
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageLimit">Batas Penggunaan</Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min="0"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan untuk tidak terbatas
                </p>
              </div>
              <div>
                <Label htmlFor="program">Program</Label>
                <Input
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  placeholder="KSS"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Berlaku Dari</Label>
                <Input
                  id="validFrom"
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Berlaku Sampai</Label>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <Label htmlFor="isActive">Kupon aktif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleAddCoupon}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-brand-emerald to-brand-cyan"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Kupon'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-yellow-500" />
              Edit Kupon
            </DialogTitle>
            <DialogDescription>Ubah informasi kupon</DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {formError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-code">Kode Kupon *</Label>
                <Input
                  id="edit-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="CONTOH2024"
                  className="uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">Tanpa spasi</p>
              </div>
              <div>
                <Label htmlFor="edit-name">Nama Kupon *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Diskon Early Bird"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Deskripsi</Label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Deskripsi singkat tentang kupon..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-discountType">Tipe Diskon *</Label>
                <select
                  id="edit-discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fixed">Nominal (Rp)</option>
                  <option value="percentage">Persentase (%)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-discountValue">
                  Nilai Diskon *{' '}
                  {formData.discountType === 'percentage' ? '(%)' : '(Rp)'}
                </Label>
                <Input
                  id="edit-discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-minPurchase">Minimum Pembelian (Rp)</Label>
                <Input
                  id="edit-minPurchase"
                  name="minPurchase"
                  type="number"
                  min="0"
                  value={formData.minPurchase}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-maxDiscount">Maksimum Diskon (Rp)</Label>
                <Input
                  id="edit-maxDiscount"
                  name="maxDiscount"
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-usageLimit">Batas Penggunaan</Label>
                <Input
                  id="edit-usageLimit"
                  name="usageLimit"
                  type="number"
                  min="0"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-program">Program</Label>
                <Input
                  id="edit-program"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-validFrom">Berlaku Dari</Label>
                <Input
                  id="edit-validFrom"
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-validUntil">Berlaku Sampai</Label>
                <Input
                  id="edit-validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <Label htmlFor="edit-isActive">Kupon aktif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditCoupon}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Update Kupon'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Hapus Kupon
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kupon ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {selectedCoupon && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-medium text-gray-800">
                Kode:{' '}
                <code className="bg-red-100 px-2 py-1 rounded">
                  {selectedCoupon.code}
                </code>
              </p>
              <p className="text-gray-600">{selectedCoupon.name}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCoupon}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus Kupon'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emerald-500" />
              Detail Kupon
            </DialogTitle>
          </DialogHeader>

          {selectedCoupon && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-2xl font-bold text-emerald-700 bg-white px-4 py-2 rounded">
                    {selectedCoupon.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(selectedCoupon.code)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedCoupon.name}
                </p>
                {selectedCoupon.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedCoupon.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Tipe Diskon</p>
                  <p className="font-semibold text-gray-800">
                    {selectedCoupon.discountType === 'percentage'
                      ? 'Persentase'
                      : 'Nominal'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Nilai Diskon</p>
                  <p className="font-semibold text-gray-800">
                    {selectedCoupon.discountType === 'percentage'
                      ? `${selectedCoupon.discountValue}%`
                      : formatCurrency(selectedCoupon.discountValue)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Penggunaan</p>
                  <p className="font-semibold text-gray-800">
                    {selectedCoupon.usageCount} /{' '}
                    {selectedCoupon.usageLimit || '∞'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge
                    className={
                      selectedCoupon.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }
                  >
                    {selectedCoupon.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                {selectedCoupon.minPurchase && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Min. Pembelian</p>
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(selectedCoupon.minPurchase)}
                    </p>
                  </div>
                )}
                {selectedCoupon.maxDiscount && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Maks. Diskon</p>
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(selectedCoupon.maxDiscount)}
                    </p>
                  </div>
                )}
                {selectedCoupon.program && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="font-semibold text-gray-800">
                      {selectedCoupon.program}
                    </p>
                  </div>
                )}
              </div>

              {(selectedCoupon.validFrom || selectedCoupon.validUntil) && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Periode Berlaku</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedCoupon.validFrom && (
                      <p>Dari: {formatDate(selectedCoupon.validFrom)}</p>
                    )}
                    {selectedCoupon.validUntil && (
                      <p>Sampai: {formatDate(selectedCoupon.validUntil)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400 text-right">
                Dibuat: {formatDate(selectedCoupon.createdAt)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Tutup
            </Button>
            <Button
              onClick={() => {
                setIsDetailDialogOpen(false);
                if (selectedCoupon) handleOpenEditDialog(selectedCoupon);
              }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
