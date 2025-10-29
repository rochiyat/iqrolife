import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get statistics from database
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.prospectiveStudent.count(),
      prisma.prospectiveStudent.count({ where: { status: 'pending' } }),
      prisma.prospectiveStudent.count({ where: { status: 'approved' } }),
      prisma.prospectiveStudent.count({ where: { status: 'rejected' } }),
    ]);

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik' },
      { status: 500 }
    );
  }
}
