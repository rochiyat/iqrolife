import nodemailer from 'nodemailer';

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true untuk port 465, false untuk port lainnya
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Interface untuk email options
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Fungsi untuk mengirim email
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML untuk text version
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Template email untuk verifikasi user baru
export function getWelcomeEmailTemplate(
  name: string,
  email: string,
  tempPassword: string
) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selamat Datang di IqroLife</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Selamat Datang di IqroLife
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Halo <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Akun Anda telah berhasil dibuat di sistem IqroLife. Berikut adalah informasi login Anda:
              </p>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                      <strong>Email:</strong>
                    </p>
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; font-family: monospace;">
                      ${email}
                    </p>
                    
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                      <strong>Password Sementara:</strong>
                    </p>
                    <p style="margin: 0; color: #333333; font-size: 16px; font-family: monospace; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
                      ${tempPassword}
                    </p>
                  </td>
                </tr>
              </table>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Penting:</strong> Untuk keamanan akun Anda, harap segera ganti password ini setelah login pertama kali.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/login" 
                   style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Login Sekarang
                </a>
              </div>
              
              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Jika Anda mengalami kesulitan, silakan hubungi kami melalui email ini atau hubungi administrator.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                © ${new Date().getFullYear()} IqroLife. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Email ini dikirim secara otomatis, mohon tidak membalas email ini.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Template email untuk reset password
export function getResetPasswordEmailTemplate(
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/dashboard/reset-password?token=${resetToken}`;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - IqroLife</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Reset Password
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Halo <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              
              <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Atau copy dan paste link berikut ke browser Anda:
              </p>
              
              <p style="margin: 0 0 20px; color: #667eea; font-size: 14px; word-break: break-all; font-family: monospace; background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #856404; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Penting:</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.6;">
                  <li>Link ini hanya berlaku selama 1 jam</li>
                  <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                  <li>Password Anda tidak akan berubah sampai Anda membuat yang baru</li>
                </ul>
              </div>
              
              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Jika Anda mengalami kesulitan, silakan hubungi kami melalui email ini atau hubungi administrator.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                © ${new Date().getFullYear()} IqroLife. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Email ini dikirim secara otomatis, mohon tidak membalas email ini.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
