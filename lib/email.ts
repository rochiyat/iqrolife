import nodemailer from 'nodemailer';
import { getAdminNotificationTemplate } from './email-templates/admin-notification';
import { getParentConfirmationTemplate } from './email-templates/parent-confirmation';

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
  const adminEmail = process.env.EMAIL_USER || 'iqrolife@gmail.com';

  try {
    await transporter.sendMail({
      from: `"Iqrolife" <${process.env.SMTP_USER}>`,
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
      from: `"Iqrolife" <${process.env.SMTP_USER}>`,
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
