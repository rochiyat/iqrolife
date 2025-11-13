import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// GET - Fetch all calon murid
export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch from database
    // const students = await db.student.findMany();

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data calon murid' },
      { status: 500 }
    );
  }
}

// POST - Create new calon murid
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
    const program = formData.get('program') as string;
    const status = formData.get('status') as string;
    const catatan = formData.get('catatan') as string;
    const buktiTransfer = formData.get('buktiTransfer') as File | null;

    // Validate required fields
    if (
      !namaLengkap ||
      !tanggalLahir ||
      !jenisKelamin ||
      !namaOrangTua ||
      !noTelepon ||
      !email ||
      !alamat
    ) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Upload bukti transfer to Cloudinary if provided
    let cloudinaryResult;
    if (buktiTransfer && buktiTransfer.size > 0) {
      // Validate file size (5MB max)
      if (buktiTransfer.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Ukuran file maksimal 5MB' },
          { status: 400 }
        );
      }

      const bytes = await buktiTransfer.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique public_id
      const timestamp = Date.now();
      const sanitizedName = namaLengkap
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const publicId = `calon_murid_${sanitizedName}_${timestamp}`;

      cloudinaryResult = await uploadToCloudinary(buffer, 'calon-murid', {
        public_id: publicId,
        resource_type: 'auto',
      });
    }

    // Calculate age from birth date
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Create student data object
    const studentData = {
      name: namaLengkap,
      birthDate: tanggalLahir,
      age,
      gender: jenisKelamin,
      parent: namaOrangTua,
      phone: noTelepon,
      email,
      address: alamat,
      previousSchool: asalSekolah || null,
      program: program || 'KBTK',
      status: status || 'pending',
      notes: catatan || null,
      paymentProof: cloudinaryResult?.secure_url || null,
      paymentProofPublicId: cloudinaryResult?.public_id || null,
      registrationDate: new Date().toISOString(),
    };

    // TODO: Save to database
    // const newStudent = await db.student.create({ data: studentData });

    console.log('New Student Created:', studentData);

    return NextResponse.json({
      success: true,
      message: 'Data calon murid berhasil ditambahkan',
      data: studentData,
    });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan data calon murid' },
      { status: 500 }
    );
  }
}

// PUT - Update calon murid
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const studentId = formData.get('id') as string;

    if (!studentId) {
      return NextResponse.json(
        { error: 'ID calon murid diperlukan' },
        { status: 400 }
      );
    }

    // TODO: Fetch existing student from database
    // const existingStudent = await db.student.findUnique({ where: { id: studentId } });

    const namaLengkap = formData.get('namaLengkap') as string;
    const tanggalLahir = formData.get('tanggalLahir') as string;
    const jenisKelamin = formData.get('jenisKelamin') as string;
    const namaOrangTua = formData.get('namaOrangTua') as string;
    const noTelepon = formData.get('noTelepon') as string;
    const email = formData.get('email') as string;
    const alamat = formData.get('alamat') as string;
    const asalSekolah = formData.get('asalSekolah') as string;
    const program = formData.get('program') as string;
    const status = formData.get('status') as string;
    const catatan = formData.get('catatan') as string;
    const buktiTransfer = formData.get('buktiTransfer') as File | null;
    const oldPublicId = formData.get('oldPublicId') as string | null;

    // Upload new bukti transfer if provided
    let cloudinaryResult;
    if (buktiTransfer && buktiTransfer.size > 0) {
      // Delete old image from Cloudinary if exists
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }

      // Validate file size (5MB max)
      if (buktiTransfer.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Ukuran file maksimal 5MB' },
          { status: 400 }
        );
      }

      const bytes = await buktiTransfer.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const sanitizedName = namaLengkap
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const publicId = `calon_murid_${sanitizedName}_${timestamp}`;

      cloudinaryResult = await uploadToCloudinary(buffer, 'calon-murid', {
        public_id: publicId,
        resource_type: 'auto',
      });
    }

    // Calculate age
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    const updateData = {
      name: namaLengkap,
      birthDate: tanggalLahir,
      age,
      gender: jenisKelamin,
      parent: namaOrangTua,
      phone: noTelepon,
      email,
      address: alamat,
      previousSchool: asalSekolah || null,
      program,
      status,
      notes: catatan || null,
      ...(cloudinaryResult && {
        paymentProof: cloudinaryResult.secure_url,
        paymentProofPublicId: cloudinaryResult.public_id,
      }),
    };

    // TODO: Update in database
    // const updatedStudent = await db.student.update({
    //   where: { id: studentId },
    //   data: updateData,
    // });

    console.log('Student Updated:', updateData);

    return NextResponse.json({
      success: true,
      message: 'Data calon murid berhasil diupdate',
      data: updateData,
    });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data calon murid' },
      { status: 500 }
    );
  }
}

// DELETE - Delete calon murid
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');
    const publicId = searchParams.get('publicId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'ID calon murid diperlukan' },
        { status: 400 }
      );
    }

    // Delete image from Cloudinary if exists
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    // TODO: Delete from database
    // await db.student.delete({ where: { id: studentId } });

    console.log('Student Deleted:', studentId);

    return NextResponse.json({
      success: true,
      message: 'Data calon murid berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data calon murid' },
      { status: 500 }
    );
  }
}
