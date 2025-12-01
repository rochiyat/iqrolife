/**
 * Test Reset Password Email
 * Run: node test-reset-password-email.js
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testResetPasswordEmail() {
  console.log('📧 Testing Reset Password Email\n');
  console.log('=' .repeat(50));

  // Check email configuration
  console.log('\n🔍 Checking email configuration...');
  console.log('-'.repeat(50));
  
  const config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET',
    from: process.env.EMAIL_FROM,
  };

  console.log('Email Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password}`);
  console.log(`   From: ${config.from}`);

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Email configuration incomplete!');
    console.log('Please check your .env file');
    process.exit(1);
  }

  console.log('\n✅ Email configuration complete');

  // Create transporter
  console.log('\n🔌 Creating email transporter...');
  console.log('-'.repeat(50));
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log('✅ Transporter created');

  // Verify connection
  console.log('\n🔐 Verifying SMTP connection...');
  console.log('-'.repeat(50));
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.log('❌ SMTP connection failed:', error.message);
    process.exit(1);
  }

  // Generate test token
  const crypto = require('crypto');
  const testToken = crypto.randomBytes(32).toString('hex');
  const resetUrl = `${process.env.NEXTAUTH_URL}/dashboard/reset-password?token=${testToken}`;

  // Create email template
  console.log('\n📝 Creating email template...');
  console.log('-'.repeat(50));
  
  const emailHtml = `
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
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Reset Password - TEST
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Halo <strong>Test User</strong>,
              </p>
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Ini adalah email test untuk reset password. Klik tombol di bawah ini:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Link: ${resetUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #666666; font-size: 14px;">
                © ${new Date().getFullYear()} IqroLife - Test Email
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

  console.log('✅ Email template created');
  console.log(`   Reset URL: ${resetUrl.substring(0, 60)}...`);

  // Ask for confirmation
  console.log('\n⚠️  WARNING: This will send a test email!');
  console.log(`   From: ${process.env.EMAIL_FROM}`);
  console.log(`   To: ${process.env.EMAIL_USER}`);
  console.log('\n   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Send test email
  console.log('📤 Sending test email...');
  console.log('-'.repeat(50));
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'TEST - Reset Password - IqroLife',
      html: emailHtml,
    });

    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${process.env.EMAIL_USER}`);
    console.log(`   Subject: TEST - Reset Password - IqroLife`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Email Test Completed Successfully!');
    console.log('\n📧 Check your inbox at: ' + process.env.EMAIL_USER);
    console.log('   (Also check spam/junk folder)');
    console.log('\n🎉 Reset password email is working!\n');

  } catch (error) {
    console.log('❌ Failed to send email:', error.message);
    console.log('\nPossible issues:');
    console.log('   1. Gmail app password is incorrect');
    console.log('   2. Less secure app access is disabled');
    console.log('   3. Network/firewall blocking SMTP');
    console.log('\nPlease check your Gmail settings and .env configuration\n');
    process.exit(1);
  }
}

testResetPasswordEmail();
