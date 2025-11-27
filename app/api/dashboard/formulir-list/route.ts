import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all formulir submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT 
        id, student_name, birth_date, age, gender, parent_name, phone, email,
        address, previous_school, notes, payment_proof_url, payment_proof_public_id,
        status, submission_date, created_at
      FROM formulir
      ORDER BY submission_date DESC
    `;

    const params: any[] = [];

    if (status) {
      query = `
        SELECT 
          id, student_name, birth_date, age, gender, parent_name, phone, email,
          address, previous_school, notes, payment_proof_url, payment_proof_public_id,
          status, submission_date, created_at
        FROM formulir
        WHERE status = $1
        ORDER BY submission_date DESC
      `;
      params.push(status);
    }

    const result = await pool.query(query, params);

    // Transform data to match frontend interface
    const submissions = result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.student_name,
      birthDate: row.birth_date,
      age: row.age,
      gender: row.gender,
      parent: row.parent_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      previousSchool: row.previous_school,
      notes: row.notes,
      paymentProof: row.payment_proof_url,
      registrationDate: row.submission_date,
      status: row.status,
    }));

    return NextResponse.json({
      success: true,
      data: submissions,
      total: submissions.length,
    });
  } catch (error) {
    console.error('Fetch formulir error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data formulir' },
      { status: 500 }
    );
  }
}

// PUT - Update formulir status (review)
export async function PUT(request: NextRequest) {
  try {
    const { id, status, reviewNotes } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID formulir diperlukan' },
        { status: 400 }
      );
    }

    // Update formulir status
    const result = await pool.query(
      `UPDATE formulir 
       SET status = $1, review_notes = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3
       RETURNING id, student_name, status`,
      [status, reviewNotes || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedForm = result.rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'UPDATE',
        'formulir',
        id,
        `Formulir direview: ${updatedForm.student_name} - ${status}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Status formulir berhasil diupdate',
      data: updatedForm,
    });
  } catch (error) {
    console.error('Update formulir error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate status formulir' },
      { status: 500 }
    );
  }
}

// DELETE - Delete formulir
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID formulir diperlukan' },
        { status: 400 }
      );
    }

    // Get formulir data first
    const formResult = await pool.query(
      'SELECT student_name FROM formulir WHERE id = $1',
      [id]
    );

    if (formResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    const form = formResult.rows[0];

    // Delete from database
    await pool.query('DELETE FROM formulir WHERE id = $1', [id]);

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      ['DELETE', 'formulir', id, `Formulir dihapus: ${form.student_name}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Formulir berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete formulir error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus formulir' },
      { status: 500 }
    );
  }
}
