import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - List all roles
export async function GET(request: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data roles' },
      { status: 500 }
    );
  }
}
