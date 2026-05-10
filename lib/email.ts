import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  planName: string;
  daysLeft?: number;
  type: 'confirmation' | 'reminder';
}

interface ResetEmailParams {
  to: string;
  subject: string;
  resetLink: string;
}

export async function sendPlanEmail({ to, subject, planName, daysLeft, type }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not set. Email not sent:', { to, subject });
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onetap-charm.com';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #FFF8F2; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px rgba(255, 95, 162, 0.05); border: 1px solid #F6B7C8; }
    .header { background-color: #ffffff; padding: 40px; text-align: center; border-bottom: 1px solid #F6B7C8; }
    .header img { width: 48px; height: 48px; }
    .header h1 { color: #FF5FA2; margin: 12px 0 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; }
    .content { padding: 40px; color: #18080F; line-height: 1.6; }
    .content h2 { font-size: 20px; font-weight: 800; margin-bottom: 16px; color: #18080F; }
    .content p { font-size: 15px; color: #6b7280; margin-bottom: 24px; }
    .plan-badge { display: inline-block; padding: 6px 16px; background-color: #FFF1F7; color: #FF5FA2; border-radius: 99px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; }
    .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #FF5FA2 0%, #E8457E 100%); color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; box-shadow: 0 10px 20px rgba(255, 95, 162, 0.2); }
    .footer { padding: 40px; text-align: center; border-top: 1px solid #f3f4f6; background-color: #fafafa; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
    .social-links { margin-top: 16px; }
    .social-links a { color: #FF5FA2; text-decoration: none; font-size: 13px; font-weight: 700; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://onetap-charm.com/images/logo_simple.png" alt="OneTap" width="48" height="48">
      <h1>OneTap</h1>
    </div>
    <div class="content">
      <div class="plan-badge">${planName} Plan</div>
      
      ${type === 'confirmation' ? `
        <h2>Pembayaran Berhasil!</h2>
        <p>Halo! Pembayaran kamu untuk plan <strong>${planName}</strong> telah berhasil kami terima. Sekarang kamu bisa menikmati semua fitur premium OneTap.</p>
        <p>Akses dashboard kamu sekarang untuk mengatur profil digital dan fitur lainnya.</p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${appUrl}/dashboard" class="cta-button">Buka Dashboard</a>
        </div>
      ` : `
        <h2>Plan Kamu Akan Berakhir</h2>
        <p>Halo! Kami ingin menginformasikan bahwa langganan plan <strong>${planName}</strong> kamu akan berakhir dalam <strong>${daysLeft} hari</strong>.</p>
        <p>Untuk tetap bisa menggunakan fitur premium tanpa gangguan, silakan lakukan perpanjangan plan kamu.</p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${appUrl}/#pricing" class="cta-button">Perpanjang Plan</a>
        </div>
      `}

      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px dashed #F6B7C8;">
        <p style="font-size: 13px;">Punya pertanyaan? Balas email ini atau hubungi kami via WhatsApp.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 OneTap. All rights reserved.</p>
      <p>Banjarmasin, Indonesia</p>
      <div class="social-links">
        <a href="https://instagram.com/onetap.charm">Instagram</a>
        <a href="https://wa.me/6283114227745?text=Halo%20OneTap%2C%20saya%20ingin%20bertanya%20mengenai%20detail%20produk%20NFC%20OneTap%20yang%20tersedia.">WhatsApp</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'OneTap <noreply@onetap-charm.com>',
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('[email] Error sending email:', error);
    throw error;
  }
}

export async function sendResetPasswordEmail({ to, subject, resetLink }: ResetEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not set. Reset email not sent:', { to, subject });
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onetap-charm.com';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #FFF8F2; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px rgba(255, 95, 162, 0.05); border: 1px solid #F6B7C8; }
    .header { background-color: #ffffff; padding: 40px; text-align: center; border-bottom: 1px solid #F6B7C8; }
    .header img { width: 48px; height: 48px; }
    .header h1 { color: #FF5FA2; margin: 12px 0 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; }
    .content { padding: 40px; color: #18080F; line-height: 1.6; }
    .content h2 { font-size: 20px; font-weight: 800; margin-bottom: 16px; color: #18080F; }
    .content p { font-size: 15px; color: #6b7280; margin-bottom: 24px; }
    .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #FF5FA2 0%, #E8457E 100%); color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; box-shadow: 0 10px 20px rgba(255, 95, 162, 0.2); }
    .footer { padding: 40px; text-align: center; border-top: 1px solid #f3f4f6; background-color: #fafafa; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://onetap-charm.com/images/logo_simple.png" alt="OneTap" width="48" height="48">
      <h1>OneTap</h1>
    </div>
    <div class="content">
      <h2>Atur Ulang Password Kamu</h2>
      <p>Halo! Kami menerima permintaan untuk mengatur ulang password akun OneTap kamu. Jika kamu tidak melakukan permintaan ini, abaikan saja email ini.</p>
      <p>Klik tombol di bawah ini untuk melanjutkan proses pengaturan ulang password:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" class="cta-button">Atur Ulang Password</a>
      </div>
      <p style="font-size: 13px; color: #9ca3af;">Link ini akan kadaluarsa dalam 1 jam demi keamanan akun kamu.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 OneTap. All rights reserved.</p>
      <p>Banjarmasin, Indonesia</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'OneTap <noreply@onetap-charm.com>',
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('[email] Error sending reset email:', error);
    throw error;
  }
}
