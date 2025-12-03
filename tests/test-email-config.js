const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

async function testEmailConfiguration() {
  console.log('🔍 Testing Email Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || '❌ NOT SET');
  console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || '❌ NOT SET');
  console.log('  EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
  console.log('  EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NOT SET');
  console.log('');

  // Validate required variables
  const missingVars = [];
  if (!process.env.EMAIL_HOST) missingVars.push('EMAIL_HOST');
  if (!process.env.EMAIL_PORT) missingVars.push('EMAIL_PORT');
  if (!process.env.EMAIL_USER) missingVars.push('EMAIL_USER');
  if (!process.env.EMAIL_PASSWORD) missingVars.push('EMAIL_PASSWORD');

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.log('\n📝 Please add these to your .env file:');
    console.log('EMAIL_HOST=smtp.gmail.com');
    console.log('EMAIL_PORT=587');
    console.log('EMAIL_USER=iqrolife@gmail.com');
    console.log('EMAIL_PASSWORD=your_gmail_app_password');
    console.log('EMAIL_FROM="IqroLife <iqrolife@gmail.com>"');
    process.exit(1);
  }

  // Create transporter
  console.log('🔧 Creating email transporter...');
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Test connection
  console.log('🔌 Testing SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\n💡 Common issues:');
    console.log('  1. Wrong EMAIL_HOST (should be smtp.gmail.com)');
    console.log('  2. Wrong EMAIL_PASSWORD (use Gmail App Password, not regular password)');
    console.log('  3. 2-Step Verification not enabled on Gmail account');
    console.log('  4. Firewall blocking port 587');
    process.exit(1);
  }

  // Send test email
  console.log('📧 Sending test email...');
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Iqrolife Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '✅ Test Email - Iqrolife Registration System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4caade;">Email Configuration Test</h2>
          <p>This is a test email from the Iqrolife registration system.</p>
          <p><strong>Status:</strong> ✅ Email system is working correctly!</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('id-ID')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            If you received this email, your SMTP configuration is correct.
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', info.accepted.join(', '));
    console.log('\n🎉 Email configuration is working correctly!');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    process.exit(1);
  }
}

testEmailConfiguration();
