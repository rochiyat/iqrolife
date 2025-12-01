interface ParentConfirmationData {
  namaLengkap: string;
  tanggalLahir: string;
  namaOrangTua: string;
  email: string;
  noTelepon: string;
}

export function getParentConfirmationTemplate(
  data: ParentConfirmationData
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #22c55e 0%, #4caade 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .success-icon { font-size: 48px; margin-bottom: 10px; }
    .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #22c55e; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Pendaftaran Berhasil!</h1>
      <p>Terima kasih telah mendaftar</p>
    </div>
    <div class="content">
      <p>Yth. Bapak/Ibu <strong>${data.namaOrangTua}</strong>,</p>
      
      <p>Terima kasih telah mendaftarkan putra/putri Anda di <strong>Kelas Siap Sekolah Iqrolife</strong>.</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #22c55e;">Data Pendaftaran</h3>
        <p><strong>Nama Anak:</strong> ${data.namaLengkap}</p>
        <p><strong>Tanggal Lahir:</strong> ${new Date(
          data.tanggalLahir
        ).toLocaleDateString('id-ID')}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>No. Telepon:</strong> ${data.noTelepon}</p>
      </div>
      
      <h3 style="color: #4caade;">Langkah Selanjutnya</h3>
      <ol>
        <li>Tim kami akan mereview pendaftaran Anda dalam 1-2 hari kerja</li>
        <li>Kami akan menghubungi Anda melalui WhatsApp atau email untuk konfirmasi</li>
        <li>Setelah disetujui, Anda akan mendapatkan informasi lebih lanjut tentang jadwal dan persiapan</li>
      </ol>
      
      <div class="info-box" style="border-left-color: #4caade;">
        <h3 style="margin-top: 0; color: #4caade;">Informasi Kontak</h3>
        <p>Jika ada pertanyaan, silakan hubungi kami:</p>
        <p>📧 Email: iqrolife@gmail.com</p>
        <p>📱 WhatsApp: 6281315225557</p>
      </div>
      
      <div class="footer">
        <p>Salam hangat,<br><strong>Tim Iqrolife</strong></p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Email ini dikirim otomatis, mohon tidak membalas email ini.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
