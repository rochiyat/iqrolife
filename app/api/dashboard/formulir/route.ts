import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { uploadToCloudinary } from '@/lib/cloudinary';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// POST - Submit new formulir (for parents)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const studentName = formData.get('studentName') as string;
    const birthDate = formData.get('birthDate') as string;
    const gender = formData.get('gender') as string;
    const parentName = formData.get('parentName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const previousSchool = formData.get('previousSchool') as string;
    const notes = formData.get('notes') as string;
    const paymentProof = formData.get('paymentProof') as File | null;
    const userId = formData.get('userId') as string;

    // Validate required fields
    if (
      !studentName ||
      !birthDate ||
      !gender ||
      !parentName ||
      !phone ||
      !email ||
      !address
    ) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Calculate age
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    // Upload payment proof if provided
    let cloudinaryResult;
    if (paymentProof && paymentProof.size > 0) {
      if (paymentProof.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Ukuran file maksimal 5MB' },
          { status: 400 }
        );
      }

      const bytes = await paymentProof.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const sanitizedName = studentName
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const publicId = `formulir_${sanitizedName}_${timestamp}`;

      cloudinaryResult = await uploadToCloudinary(buffer, 'formulir', {
        public_id: publicId,
        resource_type: 'auto',
      });
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO formulir (
        user_id, student_name, birth_date, age, gender, parent_name, phone, email, 
        address, previous_school, notes, payment_proof_url, payment_proof_public_id, 
        status, submission_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW(), NOW())
      RETURNING id, student_name, birth_date, age, gender, parent_name, phone, email, 
                address, previous_school, notes, payment_proof_url, status, submission_date`,
      [
        userId || null,
        studentName,
        birthDate,
        age,
        gender,
        parentName,
        phone,
        email,
        address,
        previousSchool || null,
        notes || null,
        cloudinaryResult?.secure_url || null,
        cloudinaryResult?.public_id || null,
        'submitted',
      ]
    );

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        userId || null,
        'SUBMIT_FORM',
        'formulir',
        result.rows[0].id,
        `Formulir pendaftaran dikirim: ${studentName}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Formulir pendaftaran berhasil dikirim',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error submitting formulir:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim formulir pendaftaran' },
      { status: 500 }
    );
  }
}
