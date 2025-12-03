interface ResetPasswordData {
  name: string;
  token: string;
}

/**
 * Generate reset password email template
 */
export function getResetPasswordEmailTemplate(
  name: string,
  token: string
): string {
  const resetUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }/dashboard/reset-password?token=${token}`;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - IqroLife</title>
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
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
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
    .reset-button {
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
    .reset-button:hover {
      transform: scale(1.05);
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .alternative-link {
      margin-top: 30px;
      padding: 15px;
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      border-radius: 4px;
    }
    .alternative-link p {
      margin: 5px 0;
      font-size: 14px;
      color: #666;
    }
    .alternative-link a {
      color: #667eea;
      word-break: break-all;
    }
    .warning {
      margin-top: 30px;
      padding: 15px;
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
    }
    .warning p {
      margin: 5px 0;
      font-size: 14px;
      color: #856404;
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
      <h1>🔐 Reset Password</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Halo ${name},
      </div>
      
      <div class="message">
        <p>Kami menerima permintaan untuk mereset password akun dashboard Anda di IqroLife.</p>
        <p>Klik tombol di bawah ini untuk membuat password baru:</p>
      </div>
      
      <div class="button-container">
        <a href="${resetUrl}" class="reset-button">Reset Password Saya</a>
      </div>
      
      <div class="alternative-link">
        <p><strong>Atau salin dan tempel link berikut di browser Anda:</strong></p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
      
      <div class="warning">
        <p><strong>⚠️ Penting:</strong></p>
        <p>• Link ini hanya berlaku selama <strong>1 jam</strong></p>
        <p>• Jika Anda tidak meminta reset password, abaikan email ini</p>
        <p>• Jangan bagikan link ini kepada siapapun</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>IqroLife - Bimbingan Belajar Iqro & Al-Qur'an</strong></p>
      <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
      <p>Jika Anda membutuhkan bantuan, silakan hubungi kami melalui website kami.</p>
    </div>
  </div>
</body>
</html>
  `;
}
