/**
 * Test Email Configuration
 * 
 * Script untuk test apakah email configuration sudah benar
 * 
 * Usage:
 *   node test-email.js [email@example.com]
 *   Jika tidak ada email, akan kirim ke xxx@gmail.com
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

// Get email from command line argument or use default
const testEmail = process.argv[2] || 'xxx@gmail.com';

console.log(`📬 Target email: ${testEmail}\n`);

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(testEmail)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

// Check environment variables
console.log('🔍 Checking email configuration...\n');

const requiredEnvVars = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM'
];

let hasError = false;
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing: ${varName}`);
    hasError = true;
  } else {
    // Mask password for security
    const value = varName === 'EMAIL_PASSWORD' 
      ? '****' + process.env[varName].slice(-4)
      : process.env[varName];
    console.log(`✅ ${varName}: ${value}`);
  }
});

if (hasError) {
  console.error('\n❌ Please configure all email environment variables in .env file');
  process.exit(1);
}

console.log('\n📧 Sending test email...\n');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email HTML
const testEmailHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">✅ Test Email Berhasil!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Halo,</p>
    
    <p style="font-size: 16px;">
      Ini adalah test email dari sistem <strong>IqroLife</strong>. 
      Jika Anda menerima email ini, berarti konfigurasi email sudah bekerja dengan baik! 🎉
    </p>
    
    <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Informasi Test:</h3>
      <ul style="list-style: none; padding: 0;">
        <li>📧 <strong>Email Tujuan:</strong> ${testEmail}</li>
        <li>🕐 <strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
        <li>🖥️ <strong>Server:</strong> ${process.env.EMAIL_HOST}</li>
        <li>👤 <strong>From:</strong> ${process.env.EMAIL_FROM}</li>
      </ul>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Email ini dikirim secara otomatis untuk testing konfigurasi email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} IqroLife. All rights reserved.</p>
  </div>
</body>
</html>
`;

// Send email
async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: '✅ Test Email - Iqrolife System',
      html: testEmailHtml,
      text: `Test Email dari Iqrolife \n\nJika Anda menerima email ini, berarti konfigurasi email sudah bekerja dengan baik!\n\nEmail Tujuan: ${testEmail}\nWaktu: ${new Date().toLocaleString('id-ID')}\nServer: ${process.env.EMAIL_HOST}`
    });

    console.log('✅ Email berhasil dikirim!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Dikirim ke: ${testEmail}`);
    console.log('\n🎉 Silakan cek inbox email Anda!');
    console.log('💡 Jika tidak ada di inbox, cek folder Spam/Junk');
    
  } catch (error) {
    console.error('❌ Error mengirim email:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Tips: Periksa username dan password email Anda');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n💡 Tips: Periksa koneksi internet dan host email');
    }
    
    process.exit(1);
  }
}

// Run the test
sendTestEmail();