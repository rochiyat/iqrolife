interface AdminNotificationData {
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: string;
  namaOrangTua: string;
  noTelepon: string;
  email: string;
  alamat: string;
  asalSekolah?: string;
  catatan?: string;
  buktiTransferUrl: string;
}

export function getAdminNotificationTemplate(
  data: AdminNotificationData
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
    .header { background: linear-gradient(135deg, #4caade 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
    .label { font-weight: bold; color: #4caade; }
    .button { display: inline-block; padding: 12px 24px; background: #4caade; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Pendaftaran Baru</h1>
      <p>Kelas Siap Sekolah Iqrolife</p>
    </div>
    <div class="content">
      <p>Halo Admin,</p>
      <p>Ada pendaftaran baru yang masuk:</p>
      
      <div class="info-row">
        <span class="label">Nama Anak:</span> ${data.namaLengkap}
      </div>
      <div class="info-row">
        <span class="label">Tanggal Lahir:</span> ${new Date(
          data.tanggalLahir
        ).toLocaleDateString('id-ID')}
      </div>
      <div class="info-row">
        <span class="label">Jenis Kelamin:</span> ${data.jenisKelamin}
      </div>
      ${
        data.asalSekolah
          ? `
      <div class="info-row">
        <span class="label">Asal Sekolah:</span> ${data.asalSekolah}
      </div>
      `
          : ''
      }
      
      <h3 style="margin-top: 30px; color: #4caade;">Data Orang Tua/Wali</h3>
      <div class="info-row">
        <span class="label">Nama:</span> ${data.namaOrangTua}
      </div>
      <div class="info-row">
        <span class="label">No. Telepon:</span> ${data.noTelepon}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${data.email}
      </div>
      <div class="info-row">
        <span class="label">Alamat:</span> ${data.alamat}
      </div>
      
      ${
        data.catatan
          ? `
      <h3 style="margin-top: 30px; color: #4caade;">Catatan Tambahan</h3>
      <div class="info-row">
        ${data.catatan}
      </div>
      `
          : ''
      }
      
      <h3 style="margin-top: 30px; color: #4caade;">Bukti Transfer</h3>
      <div class="info-row">
        <a href="${data.buktiTransferUrl}" target="_blank" class="button">
          Lihat Bukti Transfer
        </a>
      </div>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Silakan login ke dashboard untuk mereview pendaftaran ini.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
