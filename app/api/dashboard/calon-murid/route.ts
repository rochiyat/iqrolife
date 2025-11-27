import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all calon murid
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT 
        id, name, birth_date, age, gender, parent_name, phone, email, 
        address, previous_school, status, notes, payment_proof_url, 
        payment_proof_public_id, registration_date, created_at
      FROM calon_murid
      ORDER BY created_at DESC
    `;

    const params: any[] = [];

    if (status) {
      query = `
        SELECT 
          id, name, birth_date, age, gender, parent_name, phone, email, 
          address, previous_school, status, notes, payment_proof_url, 
          payment_proof_public_id, registration_date, created_at
        FROM calon_murid
        WHERE status = $1
        ORDER BY created_at DESC
      `;
      params.push(status);
    }

    const result = await pool.query(query, params);

    // Transform data to match frontend interface
    const students = result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      birthDate: row.birth_date,
      age: row.age,
      gender: row.gender,
      parent: row.parent_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      previousSchool: row.previous_school,
      status: row.status,
      notes: row.notes,
      paymentProof: row.payment_proof_url,
      paymentProofPublicId: row.payment_proof_public_id,
      registrationDate: row.registration_date,
    }));

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

    // Save to database
    const result = await pool.query(
      `INSERT INTO calon_murid (
        name, birth_date, age, gender, parent_name, phone, email, address,
        previous_school, status, notes, payment_proof_url, payment_proof_public_id,
        registration_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING id, name, birth_date, age, gender, parent_name, phone, email, 
                address, previous_school, status, notes, payment_proof_url, 
                payment_proof_public_id, registration_date`,
      [
        namaLengkap,
        tanggalLahir,
        age,
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
        new Date().toISOString().split('T')[0],
      ]
    );

    const newStudent = result.rows[0];

    // Transform to match frontend interface
    const studentData = {
      id: newStudent.id.toString(),
      name: newStudent.name,
      birthDate: newStudent.birth_date,
      age: newStudent.age,
      gender: newStudent.gender,
      parent: newStudent.parent_name,
      phone: newStudent.phone,
      email: newStudent.email,
      address: newStudent.address,
      previousSchool: newStudent.previous_school,
      status: newStudent.status,
      notes: newStudent.notes,
      paymentProof: newStudent.payment_proof_url,
      paymentProofPublicId: newStudent.payment_proof_public_id,
      registrationDate: newStudent.registration_date,
    };

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'CREATE',
        'calon_murid',
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

    // Update in database
    const result = await pool.query(
      `UPDATE calon_murid 
       SET name = $1, birth_date = $2, age = $3, gender = $4, parent_name = $5,
           phone = $6, email = $7, address = $8, previous_school = $9,
           status = $10, notes = $11,
           ${
             cloudinaryResult
               ? 'payment_proof_url = $12, payment_proof_public_id = $13,'
               : ''
           }
           updated_at = NOW()
       WHERE id = $${cloudinaryResult ? '14' : '12'}
       RETURNING id, name, birth_date, age, gender, parent_name, phone, email,
                 address, previous_school, status, notes, payment_proof_url,
                 payment_proof_public_id, registration_date`,
      cloudinaryResult
        ? [
            namaLengkap,
            tanggalLahir,
            age,
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
            age,
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
      name: updatedStudent.name,
      birthDate: updatedStudent.birth_date,
      age: updatedStudent.age,
      gender: updatedStudent.gender,
      parent: updatedStudent.parent_name,
      phone: updatedStudent.phone,
      email: updatedStudent.email,
      address: updatedStudent.address,
      previousSchool: updatedStudent.previous_school,
      status: updatedStudent.status,
      notes: updatedStudent.notes,
      paymentProof: updatedStudent.payment_proof_url,
      paymentProofPublicId: updatedStudent.payment_proof_public_id,
      registrationDate: updatedStudent.registration_date,
    };

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'UPDATE',
        'calon_murid',
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
      'SELECT name, payment_proof_public_id FROM calon_murid WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Calon murid tidak ditemukan' },
        { status: 404 }
      );
    }

    const student = studentResult.rows[0];
    const imagePublicId = publicId || student.payment_proof_public_id;

    // Delete image from Cloudinary if exists
    if (imagePublicId) {
      try {
        await deleteFromCloudinary(imagePublicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    // Delete from database
    await pool.query('DELETE FROM calon_murid WHERE id = $1', [studentId]);

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'DELETE',
        'calon_murid',
        studentId,
        `Calon murid dihapus: ${student.name}`,
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
