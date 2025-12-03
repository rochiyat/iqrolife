import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch calon murid list based on user role
export async function GET(request: NextRequest) {
  try {
    // Get user from auth token
    const authToken = request.cookies.get('auth-token');

    if (!authToken || !authToken.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(authToken.value);
    const { role, id: userId } = user;

    let query = '';
    let params: any[] = [];

    // For superadmin, staff, and guru: show all students
    if (role === 'superadmin' || role === 'staff' || role === 'guru') {
      query = `
        SELECT 
          id,
          nama_lengkap as name,
          tanggal_lahir as birth_date,
          jenis_kelamin as gender,
          nama_ayah as parent_name,
          telepon as phone,
          alamat_lengkap as address,
          status,
          created_at
        FROM formulir_pendaftaran
        ORDER BY nama_lengkap ASC
      `;
    }
    // For parent: show only their registered children
    else if (role === 'parent') {
      query = `
        SELECT 
          id,
          nama_lengkap as name,
          tanggal_lahir as birth_date,
          jenis_kelamin as gender,
          nama_ayah as parent_name,
          telepon as phone,
          alamat_lengkap as address,
          status,
          created_at
        FROM formulir_pendaftaran
        WHERE user_id = $1
        ORDER BY nama_lengkap ASC
      `;
      params = [userId];
    } else {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    const result = await pool.query(query, params);

    // Transform data
    const students = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      birthDate: row.birth_date,
      age: Math.floor(
        (new Date().getTime() - new Date(row.birth_date).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      ),
      gender: row.gender,
      parentName: row.parent_name,
      phone: row.phone,
      email: row.email || '',
      address: row.address,
      status: row.status,
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: students,
      total: students.length,
      userRole: role,
    });
  } catch (error) {
    console.error('Fetch calon murid list error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data calon murid' },
      { status: 500 }
    );
  }
}
