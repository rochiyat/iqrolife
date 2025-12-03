import nodemailer from 'nodemailer';
import { getAdminNotificationTemplate } from './email-templates/admin-notification';
import { getParentConfirmationTemplate } from './email-templates/parent-confirmation';
import { getResetPasswordEmailTemplate } from './email-templates/reset-password';
import { getWelcomeEmailTemplate } from './email-templates/welcome';

// Re-export the template functions
export { getResetPasswordEmailTemplate, getWelcomeEmailTemplate };

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

interface RegistrationData {
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

/**
 * Send notification email to admin about new registration
 */
export async function sendAdminNotification(
  registrationData: RegistrationData
): Promise<void> {
  const adminEmail = process.env.STAFF_EMAIL;

  if (!adminEmail) {
    console.error('❌ Admin email not configured');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Iqrolife" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🎓 Pendaftaran Baru - ${registrationData.namaLengkap}`,
      html: getAdminNotificationTemplate(registrationData),
    });

    console.log('✅ Admin notification email sent');
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    throw error;
  }
}

/**
 * Send confirmation email to parent
 */
export async function sendParentConfirmation(
  email: string,
  registrationData: RegistrationData
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Iqrolife" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Pendaftaran Berhasil - Kelas Siap Sekolah Iqrolife',
      html: getParentConfirmationTemplate({
        namaLengkap: registrationData.namaLengkap,
        tanggalLahir: registrationData.tanggalLahir,
        namaOrangTua: registrationData.namaOrangTua,
        email: registrationData.email,
        noTelepon: registrationData.noTelepon,
      }),
    });

    console.log('✅ Parent confirmation email sent');
  } catch (error) {
    console.error('❌ Failed to send parent confirmation:', error);
    throw error;
  }
}

/**
 * Generic email sending function
 */
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: options.from || `"Iqrolife" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`✅ Email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}
