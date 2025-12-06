import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Transform backend coupon to frontend format
function transformCoupon(coupon: any) {
  return {
    id: coupon.id.toString(),
    code: coupon.code,
    name: coupon.name,
    description: coupon.description || '',
    discountType: coupon.type === 'percentage' ? 'percentage' : 'fixed',
    discountValue: parseFloat(coupon.discountValue) || 0,
    minPurchase: coupon.minTransaction
      ? parseFloat(coupon.minTransaction)
      : undefined,
    maxDiscount: coupon.maxDiscount
      ? parseFloat(coupon.maxDiscount)
      : undefined,
    usageLimit: coupon.maxTotalUses || undefined,
    usageCount: coupon.currentTotalUses || 0,
    validFrom: coupon.startDate || undefined,
    validUntil: coupon.endDate || undefined,
    isActive: coupon.isActive,
    program:
      coupon.programFilter && coupon.programFilter.length > 0
        ? coupon.programFilter.join(', ')
        : undefined,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
  };
}

// Transform frontend form data to backend API format
function transformToBackend(body: any) {
  return {
    code: body.code,
    name: body.name,
    description: body.description || null,
    type: body.discountType === 'percentage' ? 'percentage' : 'fixed',
    discountValue: body.discountValue,
    maxDiscount: body.maxDiscount || null,
    minTransaction: body.minPurchase || null,
    maxTotalUses: body.usageLimit || null,
    maxUsesPerUser: 1,
    startDate: body.validFrom ? new Date(body.validFrom).toISOString() : null,
    endDate: body.validUntil ? new Date(body.validUntil).toISOString() : null,
    isActive: body.isActive !== undefined ? body.isActive : true,
    isPublic: true,
    programFilter: body.program
      ? body.program.split(',').map((p: string) => p.trim())
      : [],
    targetUsers: [],
    excludeUsers: [],
    stackable: false,
    priority: 0,
    termsConditions: null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const page = 1;
    const limit = 99;
    const backendData = await proxyToBackend(
      request,
      `/api/admin/coupons?page=${page}&limit=${limit}`,
      'GET'
    );

    // Transform coupons array from backend response
    const coupons = backendData.coupons || [];
    const transformedCoupons = coupons.map(transformCoupon);

    return NextResponse.json({
      success: true,
      data: transformedCoupons,
      pagination: backendData.pagination,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kupon' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate code has no spaces
    if (body.code && /\s/.test(body.code)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kode kupon tidak boleh mengandung spasi',
        },
        { status: 400 }
      );
    }

    // Transform frontend payload to backend format
    const backendPayload = transformToBackend(body);

    const data = await proxyToBackend(
      request,
      `/api/admin/coupons`,
      'POST',
      backendPayload
    );

    // Transform response back to frontend format
    if (data.coupon) {
      return NextResponse.json({
        success: true,
        data: transformCoupon(data.coupon),
      });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan kupon' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate code has no spaces
    if (body.code && /\s/.test(body.code)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kode kupon tidak boleh mengandung spasi',
        },
        { status: 400 }
      );
    }

    // Transform frontend payload to backend format
    const backendPayload = {
      id: parseInt(body.id),
      ...transformToBackend(body),
    };

    const data = await proxyToBackend(
      request,
      `/api/admin/coupons`,
      'PUT',
      backendPayload
    );

    // Transform response back to frontend format
    if (data.coupon) {
      return NextResponse.json({
        success: true,
        data: transformCoupon(data.coupon),
      });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate kupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID kupon diperlukan' },
        { status: 400 }
      );
    }

    const data = await proxyToBackend(
      request,
      `/api/admin/coupons/${id}`,
      'DELETE'
    );

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus kupon' },
      { status: 500 }
    );
  }
}
