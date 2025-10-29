import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// GET - List all prospective students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search, mode: 'insensitive' } },
        { namaOrangTua: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.prospectiveStudent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    );
  }
}

// POST - Approve/Reject student and optionally create user
export async function POST(request: NextRequest) {
  try {
    const { studentId, action, createUser } = await request.json();

    if (!studentId || !action) {
      return NextResponse.json(
        { error: 'Student ID dan action wajib diisi' },
        { status: 400 }
      );
    }

    // Get student data
    const student = await prisma.prospectiveStudent.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update student status
    const updatedStudent = await prisma.prospectiveStudent.update({
      where: { id: studentId },
      data: { status: action === 'approve' ? 'approved' : 'rejected' },
    });

    let newUser = null;

    // Create user if approved and createUser is true
    if (action === 'approve' && createUser) {
      // Generate random password
      const generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 char password
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Create user with student's parent email
      try {
        newUser = await prisma.user.create({
          data: {
            email: student.email,
            name: student.namaOrangTua,
            password: hashedPassword,
            roleId: 'parent', // New role for parents
          },
        });

        console.log('User created for approved student:', {
          email: student.email,
          password: generatedPassword, // Log for sending email
        });

        // TODO: Send email with credentials
        // await sendWelcomeEmail(student.email, generatedPassword);
      } catch (userError: any) {
        console.error('Error creating user:', userError);
        // If user already exists, continue without error
        if (userError.code !== 'P2002') {
          throw userError;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Siswa berhasil ${
        action === 'approve' ? 'disetujui' : 'ditolak'
      }`,
      student: updatedStudent,
      user: newUser ? { email: newUser.email, roleId: newUser.roleId } : null,
    });
  } catch (error) {
    console.error('Approve/Reject student error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses persetujuan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID wajib diisi' },
        { status: 400 }
      );
    }

    await prisma.prospectiveStudent.delete({
      where: { id: studentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Siswa berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus siswa' },
      { status: 500 }
    );
  }
}
