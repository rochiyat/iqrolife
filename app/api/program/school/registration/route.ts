import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const namaLengkap = formData.get('namaLengkap') as string;
    const tanggalLahir = formData.get('tanggalLahir') as string;
    const jenisKelamin = formData.get('jenisKelamin') as string;
    const namaOrangTua = formData.get('namaOrangTua') as string;
    const noTelepon = formData.get('noTelepon') as string;
    const email = formData.get('email') as string;
    const alamat = formData.get('alamat') as string;
    const asalSekolah = formData.get('asalSekolah') as string;
    const catatan = formData.get('catatan') as string;
    const buktiTransfer = formData.get('buktiTransfer') as File;

    // Validate required fields
    if (
      !namaLengkap ||
      !tanggalLahir ||
      !jenisKelamin ||
      !namaOrangTua ||
      !noTelepon ||
      !email ||
      !alamat ||
      !buktiTransfer
    ) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (buktiTransfer.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5MB' },
        { status: 400 }
      );
    }

    // Create registration data object
    const registrationData = {
      namaLengkap,
      tanggalLahir,
      jenisKelamin,
      namaOrangTua,
      noTelepon,
      email,
      alamat,
      asalSekolah,
      catatan,
      timestamp: new Date().toISOString(),
    };

    // Save file to public/uploads directory
    let fileName = '';
    if (buktiTransfer) {
      const bytes = await buktiTransfer.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = buktiTransfer.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      fileName = `${timestamp}_${originalName}`;

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'registrations');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
    }

    // Save to database
    const prospectiveStudent = await prisma.prospectiveStudent.create({
      data: {
        namaLengkap,
        tanggalLahir,
        jenisKelamin,
        asalSekolah: asalSekolah || null,
        namaOrangTua,
        noTelepon,
        email,
        alamat,
        catatan: catatan || null,
        buktiTransferPath: fileName ? `/uploads/registrations/${fileName}` : null,
        status: 'pending',
      },
    });

    console.log('New Registration saved to database:', prospectiveStudent.id);

    // TODO: In production:
    // - Send email notification to admin
    // - Send confirmation email to parent
    // - Add to CRM system

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil diterima',
      registrationId: prospectiveStudent.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}
