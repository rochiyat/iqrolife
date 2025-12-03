/**
 * Generate welcome email template for new users
 */
export function getWelcomeEmailTemplate(
  name: string,
  email: string,
  tempPassword: string
): string {
  const loginUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }/dashboard/login`;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selamat Datang di IqroLife</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .message {
      margin-bottom: 30px;
      color: #555;
    }
    .credentials {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .credentials h3 {
      margin-top: 0;
      color: #667eea;
      font-size: 18px;
    }
    .credentials p {
      margin: 10px 0;
      font-size: 15px;
    }
    .credentials .value {
      font-weight: bold;
      color: #2c3e50;
      background-color: #e9ecef;
      padding: 8px 12px;
      border-radius: 4px;
      display: inline-block;
      margin-left: 10px;
      font-family: 'Courier New', monospace;
    }
    .login-button {
      display: inline-block;
      padding: 15px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      transition: transform 0.3s;
    }
    .login-button:hover {
      transform: scale(1.05);
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .important-notes {
      margin-top: 30px;
      padding: 20px;
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
    }
    .important-notes h3 {
      margin-top: 0;
      color: #856404;
      font-size: 16px;
    }
    .important-notes ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .important-notes li {
      margin: 8px 0;
      color: #856404;
      font-size: 14px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Selamat Datang!</h1>
      <p>Akun Dashboard Anda Sudah Siap</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Halo ${name},
      </div>
      
      <div class="message">
        <p>Selamat datang di <strong>IqroLife Dashboard</strong>! Akun Anda telah berhasil dibuat oleh administrator.</p>
        <p>Berikut adalah informasi login Anda:</p>
      </div>
      
      <div class="credentials">
        <h3>📧 Informasi Login</h3>
        <p>
          <strong>Email:</strong>
          <span class="value">${email}</span>
        </p>
        <p>
          <strong>Password Sementara:</strong>
          <span class="value">${tempPassword}</span>
        </p>
      </div>
      
      <div class="button-container">
        <a href="${loginUrl}" class="login-button">Login ke Dashboard</a>
      </div>
      
      <div class="important-notes">
        <h3>⚠️ Catatan Penting:</h3>
        <ul>
          <li><strong>Password Sementara:</strong> Segera ganti password Anda setelah login pertama kali untuk keamanan akun Anda</li>
          <li><strong>Keamanan:</strong> Jangan bagikan password Anda kepada siapapun</li>
          <li><strong>Simpan Email Ini:</strong> Simpan email ini sebagai referensi informasi login Anda</li>
          <li><strong>Lupa Password?</strong> Gunakan fitur "Lupa Password" di halaman login jika Anda lupa password</li>
        </ul>
      </div>
      
      <div class="message" style="margin-top: 30px;">
        <p>Jika Anda memiliki pertanyaan atau kendala dalam mengakses dashboard, silakan hubungi administrator.</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>IqroLife - Bimbingan Belajar Iqro & Al-Qur'an</strong></p>
      <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
      <p>Jika Anda merasa tidak seharusnya menerima email ini, silakan hubungi kami.</p>
    </div>
  </div>
</body>
</html>
  `;
}
