import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/utils/claudinary';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const catatan = formData.get('catatan') as string;
    const buktiTransfer = formData.get('buktiTransfer') as File;
    const couponCode = formData.get('couponCode') as string;
    const nominal = formData.get('nominal') as string;

    // Validate required fields
    if (
      !namaLengkap ||
      !tanggalLahir ||
      !jenisKelamin ||
      !namaOrangTua ||
      !noTelepon ||
      !email ||
      !alamat ||
      !program ||
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

    // Step 1: Upload bukti transfer to backend
    let uploadResult: { url?: string; publicId?: string } = {};
    if (buktiTransfer) {
      try {
        const arrayBuffer = await buktiTransfer.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const folder = 'school'; // Default folder for school registrations

        const result = await uploadToCloudinary(buffer, folder);
        console.log('Upload result:', result);

        uploadResult = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (uploadError) {
        console.error('Upload to Cloudinary failed:', uploadError);
        return NextResponse.json(
          { error: 'Gagal mengupload bukti transfer' },
          { status: 500 }
        );
      }
    }

    // Step 2: Create registration via backend API (public endpoint)
    const registrationPayload = {
      namaLengkap,
      tanggalLahir,
      jenisKelamin,
      namaOrangTua,
      noTelepon,
      email,
      alamat,
      asalSekolah: asalSekolah || '',
      program: program || '',
      catatan: catatan || '',
      buktiTransferUrl: uploadResult.url || '',
      buktiTransferPublicId: uploadResult.publicId || '',
      couponCode: couponCode || '',
      nominal: nominal || '',
    };

    console.log('Sending registration to backend:', registrationPayload);

    const registrationResponse = await fetch(
      `${BACKEND_URL}/api/registrations/public`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      }
    );

    const registrationData = await registrationResponse.json();
    console.log('registrationData', registrationData);

    if (!registrationResponse.ok) {
      console.error('Registration failed:', registrationData);
      return NextResponse.json(
        { error: registrationData.message || 'Gagal menyimpan pendaftaran' },
        { status: registrationResponse.status }
      );
    }

    console.log('✅ Registration saved via backend:', registrationData);

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil diterima',
      registrationId: registrationData.data?.id
        ? `REG-${registrationData.data.id}`
        : '',
      data: {
        buktiTransferUrl: uploadResult.url,
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
