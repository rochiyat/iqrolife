import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// POST - Review calon murid
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from cookie
    const authToken = request.cookies.get('auth-token');
    if (!authToken || !authToken.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(authToken.value);
    const { studentId, status, reviewNotes } = await request.json();

    // Validate required fields
    if (!studentId || !status || !reviewNotes) {
      return NextResponse.json(
        { error: 'Student ID, status, dan review notes diperlukan' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    // Update registration with review data
    const result = await pool.query(
      `UPDATE registrations 
       SET status = $1, 
           reviewed_by = $2, 
           reviewed_at = NOW(), 
           review_notes = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, nama_lengkap, status, reviewed_by, reviewed_at, review_notes`,
      [status, user.id, reviewNotes, studentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Data calon murid tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedStudent = result.rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        'REVIEW',
        'registrations',
        studentId,
        `Registrasi direview oleh ${user.name}: ${updatedStudent.nama_lengkap} - Status: ${status}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Review berhasil disimpan',
      data: {
        id: updatedStudent.id,
        name: updatedStudent.nama_lengkap,
        status: updatedStudent.status,
        reviewedBy: updatedStudent.reviewed_by,
        reviewedAt: updatedStudent.reviewed_at,
        reviewNotes: updatedStudent.review_notes,
      },
    });
  } catch (error) {
    console.error('Review student error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan review' },
      { status: 500 }
    );
  }
}
