import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Dashboard Statistics
export async function GET(request: NextRequest) {
  try {
    // Get user from auth token
    const authToken = request.cookies.get('auth-token');

    if (!authToken || !authToken.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(authToken.value);
    const { role } = user;

    // Only superadmin and staff can access stats
    if (role !== 'superadmin' && role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    // Get total calon murid
    const calonMuridResult = await pool.query(
      'SELECT COUNT(*) as total FROM calon_murid'
    );
    const totalCalonMurid = parseInt(calonMuridResult.rows[0].total);

    // Get calon murid from last month for comparison
    const lastMonthCalonMuridResult = await pool.query(
      `SELECT COUNT(*) as total FROM calon_murid 
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND created_at < DATE_TRUNC('month', CURRENT_DATE)`
    );
    const lastMonthCalonMurid = parseInt(
      lastMonthCalonMuridResult.rows[0].total
    );

    // Get this month calon murid
    const thisMonthCalonMuridResult = await pool.query(
      `SELECT COUNT(*) as total FROM calon_murid 
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
    );
    const thisMonthCalonMurid = parseInt(
      thisMonthCalonMuridResult.rows[0].total
    );

    // Calculate calon murid change percentage
    const calonMuridChange =
      lastMonthCalonMurid > 0
        ? Math.round(
            ((thisMonthCalonMurid - lastMonthCalonMurid) /
              lastMonthCalonMurid) *
              100
          )
        : 0;

    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total);

    // Get users from last month
    const lastMonthUsersResult = await pool.query(
      `SELECT COUNT(*) as total FROM users 
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND created_at < DATE_TRUNC('month', CURRENT_DATE)`
    );
    const lastMonthUsers = parseInt(lastMonthUsersResult.rows[0].total);

    // Get this month users
    const thisMonthUsersResult = await pool.query(
      `SELECT COUNT(*) as total FROM users 
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
    );
    const thisMonthUsers = parseInt(thisMonthUsersResult.rows[0].total);

    // Calculate users change percentage
    const usersChange =
      lastMonthUsers > 0
        ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
        : 0;

    // Get pending formulir
    const pendingFormulirResult = await pool.query(
      `SELECT COUNT(*) as total FROM formulir_pendaftaran 
       WHERE status = 'submitted' OR status = 'pending'`
    );
    const pendingFormulir = parseInt(pendingFormulirResult.rows[0].total);

    // Get last month pending
    const lastMonthPendingResult = await pool.query(
      `SELECT COUNT(*) as total FROM formulir_pendaftaran 
       WHERE (status = 'submitted' OR status = 'pending')
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND created_at < DATE_TRUNC('month', CURRENT_DATE)`
    );
    const lastMonthPending = parseInt(lastMonthPendingResult.rows[0].total);

    // Calculate pending change
    const pendingChange =
      lastMonthPending > 0
        ? Math.round(
            ((pendingFormulir - lastMonthPending) / lastMonthPending) * 100
          )
        : 0;

    // Get approval rate
    const totalFormulirResult = await pool.query(
      'SELECT COUNT(*) as total FROM formulir_pendaftaran'
    );
    const totalFormulir = parseInt(totalFormulirResult.rows[0].total);

    const approvedFormulirResult = await pool.query(
      `SELECT COUNT(*) as total FROM formulir_pendaftaran 
       WHERE status = 'approved' OR status = 'reviewed'`
    );
    const approvedFormulir = parseInt(approvedFormulirResult.rows[0].total);

    const approvalRate =
      totalFormulir > 0
        ? Math.round((approvedFormulir / totalFormulir) * 100)
        : 0;

    // Get last month approval rate
    const lastMonthTotalResult = await pool.query(
      `SELECT COUNT(*) as total FROM formulir_pendaftaran 
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND created_at < DATE_TRUNC('month', CURRENT_DATE)`
    );
    const lastMonthTotal = parseInt(lastMonthTotalResult.rows[0].total);

    const lastMonthApprovedResult = await pool.query(
      `SELECT COUNT(*) as total FROM formulir_pendaftaran 
       WHERE (status = 'approved' OR status = 'reviewed')
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND created_at < DATE_TRUNC('month', CURRENT_DATE)`
    );
    const lastMonthApproved = parseInt(lastMonthApprovedResult.rows[0].total);

    const lastMonthApprovalRate =
      lastMonthTotal > 0
        ? Math.round((lastMonthApproved / lastMonthTotal) * 100)
        : 0;

    const approvalRateChange = approvalRate - lastMonthApprovalRate;

    // Get recent activities (last 10)
    const activitiesResult = await pool.query(
      `SELECT 
        al.action,
        al.description,
        al.created_at,
        u.name as user_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10`
    );

    const recentActivities = activitiesResult.rows.map((row) => ({
      action: row.description || row.action,
      name: row.user_name || 'System',
      time: getTimeAgo(new Date(row.created_at)),
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalCalonMurid,
          calonMuridChange: `${
            calonMuridChange >= 0 ? '+' : ''
          }${calonMuridChange}%`,
          totalUsers,
          usersChange: `${usersChange >= 0 ? '+' : ''}${usersChange}%`,
          pendingFormulir,
          pendingChange: `${pendingChange >= 0 ? '+' : ''}${pendingChange}%`,
          approvalRate: `${approvalRate}%`,
          approvalRateChange: `${
            approvalRateChange >= 0 ? '+' : ''
          }${approvalRateChange}%`,
        },
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data statistik' },
      { status: 500 }
    );
  }
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  return date.toLocaleDateString('id-ID');
}
