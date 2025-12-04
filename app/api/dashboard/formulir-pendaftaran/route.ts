import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

// Force Node.js runtime (required for nodemailer and pg)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Email transporter with validation
const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  // Validate credentials
  if (!emailUser || !emailPass) {
    console.warn(
      '⚠️ Email credentials not configured. EMAIL_USER or EMAIL_PASSWORD is missing.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const transporter = createEmailTransporter();

// Parse staff emails from environment variable (comma-separated)
function parseStaffEmails(): string[] {
  const staffEmail = process.env.STAFF_EMAIL || '';
  return staffEmail
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

// Email template for staff notification
function getStaffNotificationTemplate(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #10b981; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 Formulir Pendaftaran Baru</h1>
          <p>Ada formulir pendaftaran yang baru saja dikirim</p>
        </div>
        <div class="content">
          <h2 style="color: #10b981;">Data Calon Murid</h2>
          
          <div class="info-row">
            <span class="label">Nama Lengkap:</span> ${data.namaLengkap}
          </div>
          
          <div class="info-row">
            <span class="label">Nama Panggilan:</span> ${data.namaPanggilan}
          </div>
          
          <div class="info-row">
            <span class="label">Jenis Kelamin:</span> ${data.jenisKelamin}
          </div>
          
          <div class="info-row">
            <span class="label">Tanggal Lahir:</span> ${new Date(
              data.tanggalLahir
            ).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          
          <div class="info-row">
            <span class="label">Program:</span> ${data.programYangDipilih}
          </div>
          
          <h3 style="color: #10b981; margin-top: 25px;">Data Orang Tua</h3>
          
          <div class="info-row">
            <span class="label">Nama Ayah:</span> ${data.namaAyah}
          </div>
          
          <div class="info-row">
            <span class="label">Nama Ibu:</span> ${data.namaIbu}
          </div>
          
          <div class="info-row">
            <span class="label">Telepon:</span> ${data.telepon}
          </div>
          
          <div class="info-row">
            <span class="label">Alamat:</span> ${data.alamatLengkap}
          </div>
          
          <div style="text-align: center;">
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
            }/dashboard/formulir-list" class="button">
              Lihat Detail Formulir
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Email ini dikirim secara otomatis dari sistem Iqrolife</p>
          <p>Jangan balas email ini</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// GET - Fetch all formulir pendaftaran
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    // If ID is provided, fetch single record
    if (id) {
      const result = await pool.query(
        `SELECT * FROM formulir_pendaftaran WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Formulir tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
      });
    }

    // Fetch all records
    let query = `
      SELECT * FROM formulir_pendaftaran
      ORDER BY submission_date DESC
    `;

    const params: any[] = [];

    if (status) {
      query = `
        SELECT * FROM formulir_pendaftaran
        WHERE status = $1
        ORDER BY submission_date DESC
      `;
      params.push(status);
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Fetch formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data formulir' },
      { status: 500 }
    );
  }
}

// POST - Create or update formulir pendaftaran
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token');
    if (!authToken || !authToken.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(authToken.value);
    const data = await request.json();

    // Validate required fields
    if (
      !data.namaLengkap ||
      !data.tanggalLahir ||
      !data.jenisKelamin ||
      !data.programYangDipilih
    ) {
      return NextResponse.json(
        { error: 'Field wajib tidak lengkap' },
        { status: 400 }
      );
    }

    // Check if formulir already exists for this user
    const checkQuery = `
      SELECT id FROM formulir_pendaftaran 
      WHERE user_id = $1 AND nama_lengkap = $2
    `;
    const checkResult = await pool.query(checkQuery, [
      user.id,
      data.namaLengkap,
    ]);

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing formulir
      result = await pool.query(
        `UPDATE formulir_pendaftaran SET
          nama_panggilan = $1,
          jenis_kelamin = $2,
          tempat_lahir = $3,
          tanggal_lahir = $4,
          agama = $5,
          kewarganegaraan = $6,
          anak_ke = $7,
          jumlah_saudara = $8,
          bahasa_sehari_hari = $9,
          alamat_lengkap = $10,
          rt = $11,
          rw = $12,
          kelurahan = $13,
          kecamatan = $14,
          kabupaten_kota = $15,
          provinsi = $16,
          kode_pos = $17,
          telepon = $18,
          jarak_ke_sekolah = $19,
          nama_ayah = $20,
          pekerjaan_ayah = $21,
          pendidikan_ayah = $22,
          telepon_ayah = $23,
          nama_ibu = $24,
          pekerjaan_ibu = $25,
          pendidikan_ibu = $26,
          telepon_ibu = $27,
          nama_wali = $28,
          hubungan_wali = $29,
          telepon_wali = $30,
          golongan_darah = $31,
          riwayat_penyakit = $32,
          alergi = $33,
          tinggi_badan = $34,
          berat_badan = $35,
          riwayat_vaksinasi = $36,
          hobi_minat = $37,
          prestasi_yang_pernah_diraih = $38,
          program_yang_dipilih = $39,
          informasi_tambahan = $40,
          pernyataan_setuju = $41,
          status = $42,
          updated_at = NOW()
        WHERE id = $43
        RETURNING id`,
        [
          data.namaPanggilan,
          data.jenisKelamin,
          data.tempatLahir,
          data.tanggalLahir,
          data.agama,
          data.kewarganegaraan,
          parseInt(data.anakKe) || 0,
          parseInt(data.jumlahSaudara) || 0,
          data.bahasaSehariHari,
          data.alamatLengkap,
          data.rt,
          data.rw,
          data.kelurahan,
          data.kecamatan,
          data.kabupatenKota,
          data.provinsi,
          data.kodePos,
          data.telepon,
          parseInt(data.jarakKeSekolah) || null,
          data.namaAyah,
          data.pekerjaanAyah,
          data.pendidikanAyah || null,
          data.teleponAyah,
          data.namaIbu,
          data.pekerjaanIbu,
          data.pendidikanIbu || null,
          data.teleponIbu,
          data.namaWali || null,
          data.hubunganWali || null,
          data.teleponWali || null,
          data.golonganDarah || null,
          data.riwayatPenyakit || null,
          data.alergi || null,
          parseInt(data.tinggiBadan) || null,
          parseInt(data.beratBadan) || null,
          data.riwayatVaksinasi || null,
          data.hobiMinat || null,
          data.prestasiYangPernahDiraih || null,
          data.programYangDipilih,
          data.informasiTambahan || null,
          data.pernyataanSetuju || false,
          'submitted',
          checkResult.rows[0].id,
        ]
      );

      // Send email notification to staff (non-blocking)
      const staffEmails = parseStaffEmails();
      if (transporter && staffEmails.length > 0) {
        Promise.all(
          staffEmails.map((email) =>
            transporter.sendMail({
              from: `"Iqrolife School" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: '📝 Formulir Pendaftaran Diperbarui - Iqrolife',
              html: getStaffNotificationTemplate(data),
            })
          )
        ).catch((error) => {
          console.error('⚠️ Email notification failed:', error);
          // Don't throw - submission is already saved
        });
      } else if (!transporter && staffEmails.length > 0) {
        console.warn('⚠️ Email not sent: Email credentials not configured');
      }

      return NextResponse.json({
        success: true,
        message: 'Formulir berhasil diperbarui',
        data: { id: result.rows[0].id },
      });
    } else {
      // Insert new formulir
      result = await pool.query(
        `INSERT INTO formulir_pendaftaran (
          user_id, nama_lengkap, nama_panggilan, jenis_kelamin,
          tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
          anak_ke, jumlah_saudara, bahasa_sehari_hari,
          alamat_lengkap, rt, rw, kelurahan, kecamatan,
          kabupaten_kota, provinsi, kode_pos, telepon, jarak_ke_sekolah,
          nama_ayah, pekerjaan_ayah, pendidikan_ayah, telepon_ayah,
          nama_ibu, pekerjaan_ibu, pendidikan_ibu, telepon_ibu,
          nama_wali, hubungan_wali, telepon_wali,
          golongan_darah, riwayat_penyakit, alergi,
          tinggi_badan, berat_badan, riwayat_vaksinasi,
          hobi_minat, prestasi_yang_pernah_diraih,
          program_yang_dipilih, informasi_tambahan, pernyataan_setuju, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, NOW(), NOW()
        ) RETURNING id`,
        [
          user.id,
          data.namaLengkap,
          data.namaPanggilan,
          data.jenisKelamin,
          data.tempatLahir,
          data.tanggalLahir,
          data.agama,
          data.kewarganegaraan,
          parseInt(data.anakKe) || 0,
          parseInt(data.jumlahSaudara) || 0,
          data.bahasaSehariHari,
          data.alamatLengkap,
          data.rt,
          data.rw,
          data.kelurahan,
          data.kecamatan,
          data.kabupatenKota,
          data.provinsi,
          data.kodePos,
          data.telepon,
          parseInt(data.jarakKeSekolah) || null,
          data.namaAyah,
          data.pekerjaanAyah,
          data.pendidikanAyah || null,
          data.teleponAyah,
          data.namaIbu,
          data.pekerjaanIbu,
          data.pendidikanIbu || null,
          data.teleponIbu,
          data.namaWali || null,
          data.hubunganWali || null,
          data.teleponWali || null,
          data.golonganDarah || null,
          data.riwayatPenyakit || null,
          data.alergi || null,
          parseInt(data.tinggiBadan) || null,
          parseInt(data.beratBadan) || null,
          data.riwayatVaksinasi || null,
          data.hobiMinat || null,
          data.prestasiYangPernahDiraih || null,
          data.programYangDipilih,
          data.informasiTambahan || null,
          data.pernyataanSetuju || false,
          'submitted',
        ]
      );

      // Send email notification to staff (non-blocking)
      const staffEmails = parseStaffEmails();
      if (transporter && staffEmails.length > 0) {
        Promise.all(
          staffEmails.map((email) =>
            transporter.sendMail({
              from: `"Iqrolife School" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: '📝 Formulir Pendaftaran Baru - Iqrolife',
              html: getStaffNotificationTemplate(data),
            })
          )
        ).catch((error) => {
          console.error('⚠️ Email notification failed:', error);
          // Don't throw - submission is already saved
        });
      } else if (!transporter && staffEmails.length > 0) {
        console.warn('⚠️ Email not sent: Email credentials not configured');
      }

      return NextResponse.json({
        success: true,
        message: 'Formulir berhasil dikirim',
        data: { id: result.rows[0].id },
      });
    }
  } catch (error) {
    console.error('Create/Update formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan formulir' },
      { status: 500 }
    );
  }
}

// PUT - Update formulir status
export async function PUT(request: NextRequest) {
  try {
    const { id, status, reviewNotes, reviewedBy } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID formulir diperlukan' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE formulir_pendaftaran 
       SET status = $1, review_notes = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING id, nama_lengkap, status`,
      [status, reviewNotes || null, reviewedBy || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status formulir berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update formulir pendaftaran error:', error);
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

    const result = await pool.query(
      'DELETE FROM formulir_pendaftaran WHERE id = $1 RETURNING nama_lengkap',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Formulir berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus formulir' },
      { status: 500 }
    );
  }
}
