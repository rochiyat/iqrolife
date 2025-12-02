import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * GET - Fetch student portfolios from registrations table
 * Joins with users and formulir_pendaftaran tables
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
        r.id,
        r.nama_lengkap as student_name,
        r.tanggal_lahir as birth_date,
        r.jenis_kelamin as gender,
        r.nama_orang_tua as parent_name,
        r.no_telepon as parent_phone,
        r.email as parent_email,
        r.alamat as address,
        r.asal_sekolah as previous_school,
        r.status,
        r.catatan as notes,
        r.review_notes,
        r.created_at as registration_date,
        r.user_id,
        r.formulir_pendaftaran_id,
        r.bukti_transfer_url as payment_proof_url,
        r.bukti_transfer_public_id as payment_proof_public_id,
        r.reviewed_by,
        r.reviewed_at,
        r.created_at,
        r.updated_at,
        u.name as user_parent_name,
        u.email as user_email,
        u.phone as user_phone,
        fp.program_yang_dipilih as program,
        fp.nama_ayah as father_name,
        fp.nama_ibu as mother_name,
        fp.pekerjaan_ayah as father_job,
        fp.pekerjaan_ibu as mother_job,
        fp.telepon_ayah as father_phone,
        fp.telepon_ibu as mother_phone,
        fp.hobi_minat as hobbies,
        fp.prestasi_yang_pernah_diraih as achievements
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN formulir_pendaftaran fp ON r.formulir_pendaftaran_id = fp.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by user_id for parent role
    if (user.role === 'parent') {
      conditions.push(`r.user_id = $${paramIndex}`);
      params.push(user.id);
      paramIndex++;
    } else if (userId) {
      conditions.push(`r.user_id = $${paramIndex}`);
      params.push(userId);
      paramIndex++;
    }

    // Filter by status
    if (statusFilter) {
      conditions.push(`r.status = $${paramIndex}`);
      params.push(statusFilter);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);

    // Transform data to match frontend structure
    const portfolios = result.rows.map((row) => {
      // Calculate age from birth_date
      const age = (() => {
        if (!row.birth_date) return 0;
        const birthDate = new Date(row.birth_date);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          calculatedAge--;
        }
        return calculatedAge;
      })();

      // Calculate progress based on status
      let progress = 0;
      let mappedStatus: 'pending' | 'approved' | 'rejected' | 'enrolled' =
        'pending';

      switch (row.status) {
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
          progress = 40;
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
        description: 'Pendaftaran calon murid berhasil',
        date: new Date(row.created_at).toLocaleString('id-ID'),
        status: 'completed',
      });

      // 2. Data verification (always completed for registrations)
      activities.push({
        id: '2',
        type: 'form_submission',
        title: 'Verifikasi Data',
        description: 'Data calon murid telah diverifikasi',
        date: new Date(row.created_at).toLocaleString('id-ID'),
        status: 'completed',
      });

      // 3. Approval/Review
      if (
        row.status === 'reviewed' ||
        row.status === 'approved' ||
        row.status === 'rejected'
      ) {
        activities.push({
          id: '3',
          type: 'approval',
          title: 'Review Admin',
          description:
            row.status === 'rejected'
              ? 'Pendaftaran ditolak'
              : row.status === 'approved'
              ? 'Data calon murid disetujui'
              : 'Data calon murid telah direview',
          date: row.reviewed_at
            ? new Date(row.reviewed_at).toLocaleString('id-ID')
            : new Date(row.updated_at).toLocaleString('id-ID'),
          status: row.status === 'rejected' ? 'rejected' : 'completed',
        });
      }

      // 4. Enrollment
      if (row.status === 'enrolled') {
        activities.push({
          id: '4',
          type: 'enrollment',
          title: 'Terdaftar Resmi',
          description: `Murid terdaftar resmi${
            row.program ? ` di program ${row.program}` : ''
          }`,
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
        parent: row.parent_name || row.user_parent_name || 'N/A',
        parentEmail: row.parent_email || row.user_email || '',
        email: row.parent_email || row.user_email || '',
        phone: row.parent_phone || row.user_phone || '',
        activities: activities,
        documents: {
          formData: !!row.formulir_pendaftaran_id, // Has formulir if formulir_id exists
          paymentProof: !!row.payment_proof_url,
          birthCertificate: false, // TODO: Add document tracking
          healthCertificate: false,
          photo: false,
        },
        formData: {
          birthDate: row.birth_date,
          age: age,
          gender: row.gender || '',
          address: row.address || '',
          previousSchool: row.previous_school || '',
          parentName: row.parent_name || row.user_parent_name || '',
          parentEmail: row.parent_email || row.user_email || '',
          parentPhone: row.parent_phone || row.user_phone || '',
          fatherName: row.father_name || '',
          motherName: row.mother_name || '',
          fatherJob: row.father_job || '',
          motherJob: row.mother_job || '',
          fatherPhone: row.father_phone || '',
          motherPhone: row.mother_phone || '',
        },
        reviewNotes: row.review_notes || row.notes,
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
