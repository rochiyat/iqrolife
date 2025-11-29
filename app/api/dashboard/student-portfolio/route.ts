import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * GET - Fetch student portfolios from calon_murid
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
        cm.id,
        cm.name as student_name,
        cm.birth_date,
        cm.age,
        cm.gender,
        cm.parent_name,
        cm.phone as parent_phone,
        cm.email as parent_email,
        cm.address,
        cm.previous_school,
        cm.status,
        cm.notes as review_notes,
        cm.registration_date,
        cm.user_id,
        cm.formulir_pendaftaran_id,
        u.name as user_parent_name,
        u.email as user_email,
        u.phone as user_phone,
        cm.created_at,
        cm.updated_at,
        fp.program_yang_dipilih as program,
        fp.nama_ayah as father_name,
        fp.nama_ibu as mother_name,
        fp.pekerjaan_ayah as father_job,
        fp.pekerjaan_ibu as mother_job,
        fp.telepon_ayah as father_phone,
        fp.telepon_ibu as mother_phone,
        fp.hobi_minat as hobbies,
        fp.prestasi_yang_pernah_diraih as achievements
      FROM calon_murid cm
      LEFT JOIN users u ON cm.user_id = u.id
      LEFT JOIN formulir_pendaftaran fp ON cm.formulir_pendaftaran_id = fp.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by user_id for parent role
    if (user.role === 'parent') {
      conditions.push(`cm.user_id = $${paramIndex}`);
      params.push(user.id);
      paramIndex++;
    } else if (userId) {
      conditions.push(`cm.user_id = $${paramIndex}`);
      params.push(userId);
      paramIndex++;
    }

    // Filter by status
    if (statusFilter) {
      conditions.push(`cm.status = $${paramIndex}`);
      params.push(statusFilter);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY cm.registration_date DESC';

    const result = await pool.query(query, params);

    // Transform data to match frontend structure
    const portfolios = result.rows.map((row) => {
      // Use age from calon_murid or calculate if needed
      const age =
        row.age ||
        (() => {
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

      // 2. Data verification (always completed for calon_murid)
      activities.push({
        id: '2',
        type: 'form_submission',
        title: 'Verifikasi Data',
        description: 'Data calon murid telah diverifikasi',
        date: new Date(row.created_at).toLocaleString('id-ID'),
        status: 'completed',
      });

      // 3. Approval (use created_at as approval date for approved status)
      if (row.status === 'approved' || row.status === 'rejected') {
        activities.push({
          id: '3',
          type: 'approval',
          title: 'Persetujuan Admin',
          description:
            row.status === 'approved'
              ? 'Data calon murid disetujui'
              : 'Pendaftaran ditolak',
          date: new Date(row.created_at).toLocaleString('id-ID'),
          status: row.status === 'approved' ? 'completed' : 'rejected',
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
          formData: true, // calon_murid already has complete data
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
