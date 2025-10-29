import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const roleId = searchParams.get('roleId');

    let where: any = {};

    if (roleId && roleId !== 'all') {
      where.roleId = roleId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      roleId,
      password: providedPassword,
    } = await request.json();
    console.log('Request body:', {
      email,
      name,
      roleId,
      password: providedPassword,
    });
    if (!email || !name || !roleId) {
      return NextResponse.json(
        { error: 'Email, name, dan role wajib diisi' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Generate random password if not provided
    const password = providedPassword || crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        roleId,
        roleName: (await prisma.role.findUnique({ where: { id: roleId } }))?.name || 'staff',
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        createdAt: true,
      },
    });

    console.log('New user created:', {
      email,
      password, // Log for admin to send to user
    });

    return NextResponse.json({
      success: true,
      message: 'User berhasil dibuat',
      user,
      password, // Return password to show to admin
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const { userId, email, name, roleId, password } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID wajib diisi' },
        { status: 400 }
      );
    }

    const data: any = {};

    if (email) {
      // Check if email is already used by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email sudah digunakan user lain' },
          { status: 400 }
        );
      }

      data.email = email;
    }

    if (name) data.name = name;
    if (roleId) {
      data.roleId = roleId;
      const roleData = await prisma.role.findUnique({ where: { id: roleId } });
      if (roleData) {
        data.roleName = roleData.name;
      }
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User berhasil diupdate',
      user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID wajib diisi' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus user' },
      { status: 500 }
    );
  }
}
