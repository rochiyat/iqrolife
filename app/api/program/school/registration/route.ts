import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

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

    // Upload bukti transfer to Cloudinary
    let cloudinaryResult;
    if (buktiTransfer) {
      const bytes = await buktiTransfer.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique public_id
      const timestamp = Date.now();
      const sanitizedName = namaLengkap
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const publicId = `registration_${sanitizedName}_${timestamp}`;

      cloudinaryResult = await uploadToCloudinary(buffer, 'registrations', {
        public_id: publicId,
        resource_type: 'auto',
      });
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
      buktiTransferUrl: cloudinaryResult?.secure_url || '',
      buktiTransferPublicId: cloudinaryResult?.public_id || '',
      timestamp: new Date().toISOString(),
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to parent

    console.log('New Registration:', registrationData);

    // TODO: Save to database
    // await db.registration.create({ data: registrationData });

    // TODO: Send notification emails
    // await sendAdminNotification(registrationData);
    // await sendParentConfirmation(email, registrationData);

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil diterima',
      registrationId: `REG-${Date.now()}`,
      data: {
        buktiTransferUrl: cloudinaryResult?.secure_url,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran' },
      { status: 500 }
    );
  }
}
