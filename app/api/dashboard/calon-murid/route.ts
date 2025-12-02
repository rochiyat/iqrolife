import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all calon murid (from registrations table)
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from cookie
    const authToken = request.cookies.get('auth-token');
    if (!authToken || !authToken.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(authToken.value);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT 
        id, nama_lengkap, tanggal_lahir, jenis_kelamin, nama_orang_tua, 
        no_telepon, email, alamat, asal_sekolah, status, catatan, 
        bukti_transfer_url, bukti_transfer_public_id, created_at, updated_at
      FROM registrations
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by status
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    // Transform data to match frontend interface
    const students = result.rows.map((row) => {
      // Calculate age from birth date
      const birthDate = new Date(row.tanggal_lahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return {
        id: row.id.toString(),
        name: row.nama_lengkap,
        birthDate: row.tanggal_lahir,
        age: age,
        gender: row.jenis_kelamin,
        parent: row.nama_orang_tua,
        phone: row.no_telepon,
        email: row.email,
        address: row.alamat,
        previousSchool: row.asal_sekolah,
        status: row.status,
        notes: row.catatan,
        paymentProof: row.bukti_transfer_url,
        paymentProofPublicId: row.bukti_transfer_public_id,
        registrationDate: row.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: students,
      total: students.length,
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
      const publicId = `registrations_${sanitizedName}_${timestamp}`;

      cloudinaryResult = await uploadToCloudinary(buffer, 'registrations', {
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

    // Save to database
    const result = await pool.query(
      `INSERT INTO registrations (
        nama_lengkap, tanggal_lahir, jenis_kelamin, nama_orang_tua, no_telepon, 
        email, alamat, asal_sekolah, status, catatan, bukti_transfer_url, 
        bukti_transfer_public_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING id, nama_lengkap, tanggal_lahir, jenis_kelamin, nama_orang_tua, 
                no_telepon, email, alamat, asal_sekolah, status, catatan, 
                bukti_transfer_url, bukti_transfer_public_id, created_at`,
      [
        namaLengkap,
        tanggalLahir,
        jenisKelamin,
        namaOrangTua,
        noTelepon,
        email,
        alamat,
        asalSekolah || null,
        status || 'pending',
        catatan || null,
        cloudinaryResult?.secure_url || null,
        cloudinaryResult?.public_id || null,
      ]
    );

    const newStudent = result.rows[0];

    // Transform to match frontend interface
    const studentData = {
      id: newStudent.id.toString(),
      name: newStudent.nama_lengkap,
      birthDate: newStudent.tanggal_lahir,
      age: age,
      gender: newStudent.jenis_kelamin,
      parent: newStudent.nama_orang_tua,
      phone: newStudent.no_telepon,
      email: newStudent.email,
      address: newStudent.alamat,
      previousSchool: newStudent.asal_sekolah,
      status: newStudent.status,
      notes: newStudent.catatan,
      paymentProof: newStudent.bukti_transfer_url,
      paymentProofPublicId: newStudent.bukti_transfer_public_id,
      registrationDate: newStudent.created_at,
    };

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'CREATE',
        'registrations',
        newStudent.id,
        `Calon murid baru ditambahkan: ${namaLengkap}`,
      ]
    );

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
      const publicId = `registrations_${sanitizedName}_${timestamp}`;

      cloudinaryResult = await uploadToCloudinary(buffer, 'registrations', {
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

    // Update in database
    const result = await pool.query(
      `UPDATE registrations 
       SET nama_lengkap = $1, tanggal_lahir = $2, jenis_kelamin = $3, nama_orang_tua = $4,
           no_telepon = $5, email = $6, alamat = $7, asal_sekolah = $8,
           status = $9, catatan = $10,
           ${
             cloudinaryResult
               ? 'bukti_transfer_url = $11, bukti_transfer_public_id = $12,'
               : ''
           }
           updated_at = NOW()
       WHERE id = $${cloudinaryResult ? '13' : '11'}
       RETURNING id, nama_lengkap, tanggal_lahir, jenis_kelamin, nama_orang_tua, 
                 no_telepon, email, alamat, asal_sekolah, status, catatan, 
                 bukti_transfer_url, bukti_transfer_public_id, created_at`,
      cloudinaryResult
        ? [
            namaLengkap,
            tanggalLahir,
            jenisKelamin,
            namaOrangTua,
            noTelepon,
            email,
            alamat,
            asalSekolah || null,
            status,
            catatan || null,
            cloudinaryResult.secure_url,
            cloudinaryResult.public_id,
            studentId,
          ]
        : [
            namaLengkap,
            tanggalLahir,
            jenisKelamin,
            namaOrangTua,
            noTelepon,
            email,
            alamat,
            asalSekolah || null,
            status,
            catatan || null,
            studentId,
          ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Calon murid tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedStudent = result.rows[0];

    // Transform to match frontend interface
    const updateData = {
      id: updatedStudent.id.toString(),
      name: updatedStudent.nama_lengkap,
      birthDate: updatedStudent.tanggal_lahir,
      age: age,
      gender: updatedStudent.jenis_kelamin,
      parent: updatedStudent.nama_orang_tua,
      phone: updatedStudent.no_telepon,
      email: updatedStudent.email,
      address: updatedStudent.alamat,
      previousSchool: updatedStudent.asal_sekolah,
      status: updatedStudent.status,
      notes: updatedStudent.catatan,
      paymentProof: updatedStudent.bukti_transfer_url,
      paymentProofPublicId: updatedStudent.bukti_transfer_public_id,
      registrationDate: updatedStudent.created_at,
    };

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'UPDATE',
        'registrations',
        studentId,
        `Data calon murid diupdate: ${namaLengkap}`,
      ]
    );

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

    // Get student data first
    const studentResult = await pool.query(
      'SELECT nama_lengkap, bukti_transfer_public_id FROM registrations WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Calon murid tidak ditemukan' },
        { status: 404 }
      );
    }

    const student = studentResult.rows[0];
    const imagePublicId = publicId || student.bukti_transfer_public_id;

    // Delete image from Cloudinary if exists
    if (imagePublicId) {
      try {
        await deleteFromCloudinary(imagePublicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    // Delete from database
    await pool.query('DELETE FROM registrations WHERE id = $1', [studentId]);

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'DELETE',
        'registrations',
        studentId,
        `Calon murid dihapus: ${student.nama_lengkap}`,
      ]
    );

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
