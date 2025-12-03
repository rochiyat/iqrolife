import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// POST - Create user from calon murid
export async function POST(request: NextRequest) {
  try {
    const { studentId, email, name } = await request.json();

    if (!studentId || !email || !name) {
      return NextResponse.json(
        { error: 'Student ID, email, dan name diperlukan' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserResult = await pool.query(
      'SELECT id, role FROM users WHERE email = $1',
      [email]
    );

    let userId: number;
    let action: 'created' | 'role_added' | 'mapping_added';
    let password = '';

    if (existingUserResult.rows.length > 0) {
      // Email already exists
      const existingUser = existingUserResult.rows[0];
      userId = existingUser.id;

      // Check if user already has parent role
      if (existingUser.role === 'parent') {
        // User already parent, just add mapping
        action = 'mapping_added';
      } else {
        // User exists but not parent, add parent role
        await pool.query(
          'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
          ['parent', userId]
        );
        action = 'role_added';
      }
    } else {
      // Email doesn't exist, create new user
      password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUserResult = await pool.query(
        `INSERT INTO users (email, password, name, role, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
          RETURNING id`,
        [email, hashedPassword, name, 'parent', true]
      );

      userId = newUserResult.rows[0].id;
      action = 'created';
    }

    // Update registrations with user_id (create mapping)
    await pool.query(
      'UPDATE registrations SET user_id = $1, updated_at = NOW() WHERE id = $2',
      [userId, studentId]
    );

    // Get registration data to copy to formulir_pendaftaran
    const registrationResult = await pool.query(
      'SELECT * FROM registrations WHERE id = $1',
      [studentId]
    );

    if (registrationResult.rows.length > 0) {
      const regData = registrationResult.rows[0];

      // Check if formulir already exists for this user/student to avoid duplicates
      // We assume one formulir per student name for now, or just insert since it's a new mapping
      const existingFormulir = await pool.query(
        'SELECT id FROM formulir_pendaftaran WHERE user_id = $1 AND nama_lengkap = $2',
        [userId, regData.nama_lengkap]
      );

      if (existingFormulir.rows.length === 0) {
        // Insert into formulir_pendaftaran and get the new id
        const formulirResult = await pool.query(
          `INSERT INTO formulir_pendaftaran (
            user_id,
            nama_lengkap,
            nama_panggilan,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            agama,
            kewarganegaraan,
            anak_ke,
            jumlah_saudara,
            bahasa_sehari_hari,
            alamat_lengkap,
            rt, rw, kelurahan, kecamatan, kabupaten_kota, provinsi, kode_pos,
            telepon,
            nama_ayah,
            pekerjaan_ayah,
            telepon_ayah,
            nama_ibu,
            pekerjaan_ibu,
            telepon_ibu,
            program_yang_dipilih,
            status,
            created_at,
            updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, NOW(), NOW()
          ) RETURNING id`,
          [
            userId,
            regData.nama_lengkap,
            regData.nama_lengkap.split(' ')[0], // Nama panggilan (ambil kata pertama)
            regData.jenis_kelamin,
            '-', // Tempat lahir
            regData.tanggal_lahir,
            'Islam', // Agama
            'Indonesia', // Kewarganegaraan
            1, // Anak ke
            0, // Jumlah saudara
            'Indonesia', // Bahasa
            regData.alamat, // Alamat lengkap
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-', // RT, RW, Kel, Kec, Kab, Prov, Pos
            regData.no_telepon, // Telepon rumah/siswa
            regData.nama_orang_tua, // Nama Ayah (asumsi)
            '-', // Pekerjaan Ayah
            regData.no_telepon, // Telepon Ayah
            regData.nama_orang_tua, // Nama Ibu
            '-', // Pekerjaan Ibu
            '-', // Telepon Ibu
            regData.program, // Program
            'draft', // Status formulir
          ]
        );

        // Update registrations with formulir_pendaftaran_id
        if (formulirResult.rows.length > 0) {
          const formulirId = formulirResult.rows[0].id;
          await pool.query(
            'UPDATE registrations SET formulir_pendaftaran_id = $1, updated_at = NOW() WHERE id = $2',
            [formulirId, studentId]
          );
        }
      } else {
        // If formulir already exists, update registrations with existing formulir id
        const existingFormulirId = existingFormulir.rows[0].id;
        await pool.query(
          'UPDATE registrations SET formulir_pendaftaran_id = $1, updated_at = NOW() WHERE id = $2',
          [existingFormulirId, studentId]
        );
      }
    }

    // Send email notification
    if (action === 'created') {
      try {
        await transporter.sendMail({
          from:
            process.env.EMAIL_FROM ||
            `"Iqrolife School" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Akun Parent Iqrolife - Informasi Login',
          html: getWelcomeEmailTemplate(name, email, password),
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Continue even if email fails
      }
    }

    // Prepare response message
    let message = '';
    switch (action) {
      case 'created':
        message = `User baru berhasil dibuat dengan role Parent. Password telah dikirim ke ${email}`;
        break;
      case 'role_added':
        message = `User sudah ada. Role Parent berhasil ditambahkan dan anak berhasil dimapping`;
        break;
      case 'mapping_added':
        message = `User sudah ada sebagai Parent. Anak berhasil dimapping ke user tersebut`;
        break;
    }

    return NextResponse.json({
      success: true,
      message,
      action,
      userId,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}

// Generate random password
function generatePassword(): string {
  const length = 12;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Welcome email template
function getWelcomeEmailTemplate(
  name: string,
  email: string,
  password: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #4caade 0%, #10b981 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
    }
    .credentials-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #10b981;
    }
    .credentials-box h3 {
      margin-top: 0;
      color: #10b981;
    }
    .credential-item {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      font-family: monospace;
    }
    .warning-box {
      background: #fef3c7;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #f59e0b;
      margin: 20px 0;
    }
    .footer {
      background: #374151;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 0 0 10px 10px;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Selamat Datang di Iqrolife School</h1>
    <p>Akun Parent Anda Telah Dibuat</p>
  </div>
  
  <div class="content">
    <p>Yth. <strong>${name}</strong>,</p>
    
    <p>Selamat! Akun parent Anda di sistem Iqrolife School telah berhasil dibuat. Anda sekarang dapat mengakses dashboard untuk mengelola data anak Anda.</p>
    
    <div class="credentials-box">
      <h3>🔐 Informasi Login Anda</h3>
      <div class="credential-item">
        <strong>Email:</strong> ${email}
      </div>
      <div class="credential-item">
        <strong>Password:</strong> ${password}
      </div>
    </div>
    
    <div class="warning-box">
      <strong>⚠️ Penting:</strong>
      <ul style="margin: 10px 0;">
        <li>Simpan password ini dengan aman</li>
        <li>Segera ganti password setelah login pertama</li>
        <li>Jangan bagikan password ke orang lain</li>
      </ul>
    </div>
    
    <center>
      <a href="${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/dashboard/login" class="button">
        Login ke Dashboard
      </a>
    </center>
    
    <p><strong>Apa yang bisa Anda lakukan di dashboard?</strong></p>
    <ul>
      <li>✅ Melihat data anak Anda</li>
      <li>✅ Mengisi formulir pendaftaran</li>
      <li>✅ Melihat status pendaftaran</li>
      <li>✅ Update profil dan data</li>
    </ul>
    
    <p>Jika ada pertanyaan, silakan hubungi kami:</p>
    <ul>
      <li>📞 WhatsApp: <a href="https://wa.me/6281315225557">0813-1522-5557</a></li>
      <li>📧 Email: info@iqrolife.com</li>
    </ul>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Iqrolife School. All rights reserved.</p>
    <p>Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
  </div>
</body>
</html>
  `;
}
