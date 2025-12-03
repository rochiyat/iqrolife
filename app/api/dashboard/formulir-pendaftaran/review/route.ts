import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
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

// POST - Review or Edit Request
export async function POST(request: NextRequest) {
  try {
    const { id, status, notes, action } = await request.json();

    if (!id || !notes || !action) {
      return NextResponse.json(
        { error: 'ID, notes, dan action diperlukan' },
        { status: 400 }
      );
    }

    // Get formulir data
    const formulirResult = await pool.query(
      `SELECT 
        fp.*,
        u.email as parent_email,
        u.name as parent_name
      FROM formulir_pendaftaran fp
      LEFT JOIN users u ON fp.user_id = u.id
      WHERE fp.id = $1`,
      [id]
    );

    if (formulirResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    const formulir = formulirResult.rows[0];
    console.log('formulir', formulir);

    // Update formulir status
    await pool.query(
      `UPDATE formulir_pendaftaran 
       SET status = $1, review_notes = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3`,
      [status, notes, id]
    );

    // Prepare email based on action
    let emailSubject = '';
    let emailHtml = '';
    console.log('action', action);

    if (action === 'review') {
      emailSubject = `Formulir Pendaftaran ${formulir.nama_lengkap} - Sudah Direview`;
      emailHtml = getReviewEmailTemplate(formulir, notes);
    } else if (action === 'edit') {
      emailSubject = `Formulir Pendaftaran ${formulir.nama_lengkap} - Permintaan Edit`;
      emailHtml = getEditRequestEmailTemplate(formulir, notes);
    }
    console.log('emailSubject', emailSubject);
    console.log('emailHtml', emailHtml);

    // Send email
    const recipientEmail = formulir.parent_email;
    console.log('recipientEmail', recipientEmail);

    try {
      await transporter.sendMail({
        from:
          process.env.EMAIL_FROM ||
          `"Iqrolife School" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Formulir berhasil ${
        action === 'review' ? 'direview' : 'diminta edit'
      } dan email telah dikirim`,
    });
  } catch (error) {
    console.error('Review/Edit error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses permintaan' },
      { status: 500 }
    );
  }
}

// Email template for review
function getReviewEmailTemplate(formulir: any, notes: string): string {
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
    .info-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #10b981;
    }
    .info-box h3 {
      margin-top: 0;
      color: #10b981;
    }
    .notes-box {
      background: #ecfdf5;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #10b981;
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
    <h1>🎓 Iqrolife School</h1>
    <p>Formulir Pendaftaran Sudah Direview</p>
  </div>
  
  <div class="content">
    <p>Yth. Bapak/Ibu <strong>${
      formulir.nama_ayah || formulir.nama_ibu
    }</strong>,</p>
    
    <p>Terima kasih telah mengisi formulir pendaftaran untuk:</p>
    
    <div class="info-box">
      <h3>📋 Informasi Pendaftaran</h3>
      <table style="width: 100%;">
        <tr>
          <td><strong>Nama Calon Murid:</strong></td>
          <td>${formulir.nama_lengkap}</td>
        </tr>
        <tr>
          <td><strong>Program:</strong></td>
          <td>${formulir.program_yang_dipilih}</td>
        </tr>
        <tr>
          <td><strong>Tanggal Submit:</strong></td>
          <td>${new Date(formulir.submission_date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</td>
        </tr>
      </table>
    </div>
    
    <p>Formulir pendaftaran Anda telah kami review dengan hasil sebagai berikut:</p>
    
    <div class="notes-box">
      <h4 style="margin-top: 0; color: #10b981;">✅ Catatan Review:</h4>
      <p style="margin: 0;">${notes}</p>
    </div>
    
    <p>Jika ada pertanyaan lebih lanjut, silakan hubungi kami melalui:</p>
    <ul>
      <li>📞 WhatsApp: <a href="https://wa.me/6281315225557">0813-1522-5557</a></li>
      <li>📧 Email: info@iqrolife.com</li>
    </ul>
    
    <center>
      <a href="${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/dashboard/formulir-list" class="button">
        Lihat Status Formulir
      </a>
    </center>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Iqrolife School. All rights reserved.</p>
    <p>Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
  </div>
</body>
</html>
  `;
}

// Email template for edit request
function getEditRequestEmailTemplate(formulir: any, notes: string): string {
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
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
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
    .info-box {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #f59e0b;
    }
    .info-box h3 {
      margin-top: 0;
      color: #f59e0b;
    }
    .notes-box {
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
      background: #f59e0b;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Iqrolife School</h1>
    <p>Permintaan Edit Formulir Pendaftaran</p>
  </div>
  
  <div class="content">
    <p>Yth. Bapak/Ibu <strong>${
      formulir.nama_ayah || formulir.nama_ibu
    }</strong>,</p>
    
    <p>Kami telah mereview formulir pendaftaran untuk:</p>
    
    <div class="info-box">
      <h3>📋 Informasi Pendaftaran</h3>
      <table style="width: 100%;">
        <tr>
          <td><strong>Nama Calon Murid:</strong></td>
          <td>${formulir.nama_lengkap}</td>
        </tr>
        <tr>
          <td><strong>Program:</strong></td>
          <td>${formulir.program_yang_dipilih}</td>
        </tr>
        <tr>
          <td><strong>Tanggal Submit:</strong></td>
          <td>${new Date(formulir.submission_date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</td>
        </tr>
      </table>
    </div>
    
    <p>Terdapat beberapa informasi yang perlu diperbaiki/dilengkapi:</p>
    
    <div class="notes-box">
      <h4 style="margin-top: 0; color: #f59e0b;">✏️ Yang Perlu Diedit:</h4>
      <p style="margin: 0;">${notes}</p>
    </div>
    
    <p><strong>Mohon untuk melakukan edit pada formulir Anda sesuai catatan di atas.</strong></p>
    
    <center>
      <a href="${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/dashboard/formulir" class="button">
        Edit Formulir Sekarang
      </a>
    </center>
    
    <p>Jika ada pertanyaan, silakan hubungi kami melalui:</p>
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
