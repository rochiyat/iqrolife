import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * GET - Fetch student portfolios
 * Query params:
 * - user_id: Filter by parent user (for parent role)
 * - status: Filter by status
 */
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token');
    if (!authToken || !authToken.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(authToken.value);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const statusFilter = searchParams.get('status');

    let query = `
      SELECT 
        fp.id,
        fp.nama_lengkap as student_name,
        fp.nama_panggilan as nickname,
        fp.jenis_kelamin as gender,
        fp.tempat_lahir as birth_place,
        fp.tanggal_lahir as birth_date,
        fp.program_yang_dipilih as program,
        fp.status,
        fp.submission_date as registration_date,
        fp.review_notes,
        fp.reviewed_at,
        fp.user_id,
        u.name as parent_name,
        u.email as parent_email,
        u.phone as parent_phone,
        fp.alamat_lengkap as address,
        fp.nama_ayah as father_name,
        fp.nama_ibu as mother_name,
        fp.pekerjaan_ayah as father_job,
        fp.pekerjaan_ibu as mother_job,
        fp.telepon_ayah as father_phone,
        fp.telepon_ibu as mother_phone,
        fp.hobi_minat as hobbies,
        fp.prestasi_yang_pernah_diraih as achievements,
        fp.created_at,
        fp.updated_at
      FROM formulir_pendaftaran fp
      LEFT JOIN users u ON fp.user_id = u.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by user_id for parent role
    if (user.role === 'parent') {
      conditions.push(`fp.user_id = $${paramIndex}`);
      params.push(user.id);
      paramIndex++;
    } else if (userId) {
      conditions.push(`fp.user_id = $${paramIndex}`);
      params.push(userId);
      paramIndex++;
    }

    // Filter by status
    if (statusFilter) {
      conditions.push(`fp.status = $${paramIndex}`);
      params.push(statusFilter);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY fp.submission_date DESC';

    const result = await pool.query(query, params);

    // Transform data to match frontend structure
    const portfolios = result.rows.map((row) => {
      // Calculate age
      const birthDate = new Date(row.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Calculate progress based on status
      let progress = 0;
      let mappedStatus: 'pending' | 'approved' | 'rejected' | 'enrolled' =
        'pending';

      switch (row.status) {
        case 'draft':
          progress = 20;
          mappedStatus = 'pending';
          break;
        case 'submitted':
        case 'pending':
          progress = 40;
          mappedStatus = 'pending';
          break;
        case 'reviewed':
          progress = 60;
          mappedStatus = 'approved';
          break;
        case 'approved':
          progress = 80;
          mappedStatus = 'approved';
          break;
        case 'enrolled':
          progress = 100;
          mappedStatus = 'enrolled';
          break;
        case 'rejected':
          progress = 0;
          mappedStatus = 'rejected';
          break;
        default:
          progress = 20;
          mappedStatus = 'pending';
      }

      // Generate student ID
      const studentId = `IQL-${new Date(
        row.registration_date
      ).getFullYear()}-${String(row.id).padStart(3, '0')}`;

      // Build activities timeline
      const activities = [];

      // 1. Registration
      activities.push({
        id: '1',
        type: 'registration',
        title: 'Pendaftaran Online',
        description: 'Pendaftaran akun dan data awal berhasil',
        date: new Date(row.created_at).toLocaleString('id-ID'),
        status: 'completed',
      });

      // 2. Form submission
      if (row.submission_date) {
        activities.push({
          id: '2',
          type: 'form_submission',
          title: 'Pengisian Formulir',
          description: 'Formulir pendaftaran lengkap disubmit',
          date: new Date(row.submission_date).toLocaleString('id-ID'),
          status: 'completed',
        });
      }

      // 3. Review/Approval
      if (row.reviewed_at) {
        activities.push({
          id: '3',
          type: 'approval',
          title: 'Verifikasi Admin',
          description:
            row.status === 'approved' || row.status === 'reviewed'
              ? 'Data dan dokumen diverifikasi dan disetujui'
              : row.status === 'rejected'
              ? 'Pendaftaran ditolak'
              : 'Sedang dalam proses review',
          date: new Date(row.reviewed_at).toLocaleString('id-ID'),
          status:
            row.status === 'approved' || row.status === 'reviewed'
              ? 'completed'
              : row.status === 'rejected'
              ? 'rejected'
              : 'pending',
        });
      }

      // 4. Enrollment
      if (row.status === 'enrolled') {
        activities.push({
          id: '4',
          type: 'enrollment',
          title: 'Terdaftar Resmi',
          description: `Murid terdaftar resmi di program ${row.program}`,
          date: new Date(row.updated_at).toLocaleString('id-ID'),
          status: 'completed',
        });
      }

      return {
        id: row.id,
        studentName: row.student_name,
        studentId: studentId,
        program: row.program || 'Belum dipilih',
        registrationDate: row.registration_date,
        status: mappedStatus,
        progress: progress,
        parent: row.parent_name || 'N/A',
        parentEmail: row.parent_email || '',
        email: row.parent_email || '',
        phone: row.parent_phone || '',
        activities: activities,
        documents: {
          formData: !!row.submission_date,
          paymentProof: false, // TODO: Add payment tracking
          birthCertificate: false, // TODO: Add document tracking
          healthCertificate: false,
          photo: false,
        },
        formData: {
          birthDate: row.birth_date,
          age: age,
          gender: row.gender === 'L' ? 'Laki-laki' : 'Perempuan',
          address: row.address || '',
          previousSchool: row.previous_school || '',
          parentName: row.parent_name || '',
          parentEmail: row.parent_email || '',
          parentPhone: row.parent_phone || '',
          fatherName: row.father_name || '',
          motherName: row.mother_name || '',
          fatherJob: row.father_job || '',
          motherJob: row.mother_job || '',
          fatherPhone: row.father_phone || '',
          motherPhone: row.mother_phone || '',
        },
        reviewNotes: row.review_notes,
      };
    });

    return NextResponse.json({
      success: true,
      data: portfolios,
      total: portfolios.length,
    });
  } catch (error) {
    console.error('Error fetching student portfolios:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data portfolio' },
      { status: 500 }
    );
  }
}
