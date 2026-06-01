import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { email, password, name, username } = await request.json();

    if (!email || !password || !name || !username) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Create the user as unconfirmed using Supabase Admin Client
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Must confirm email before they can login!
      user_metadata: {
        display_name: name,
        username: username
      }
    });

    if (createError) {
      // Map common error messages
      let friendlyError = createError.message;
      if (friendlyError.toLowerCase().includes("unique constraint") || friendlyError.toLowerCase().includes("username")) {
        friendlyError = 'Username sudah dipakai. Pilih yang lain.';
      } else if (friendlyError.toLowerCase().includes("already registered") || friendlyError.toLowerCase().includes("email_exists")) {
        friendlyError = 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.';
      }
      return NextResponse.json({ error: friendlyError }, { status: 400 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
    }

    // 2. Generate the confirmation action link using Supabase Admin Client
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (linkError) {
      return NextResponse.json({ error: 'Gagal membuat link konfirmasi: ' + linkError.message }, { status: 500 });
    }

    const actionLink = linkData.properties.action_link;

    // 3. Send welcome/confirmation email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'OneTap <no-reply@onetap-charm.com>', // Resend verified domain sender
          to: email,
          subject: 'Verifikasi Akun OneTap Anda',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #FF5FA2, #E8457E); border-radius: 14px; color: #ffffff; text-align: center; line-height: 56px; font-size: 24px; font-weight: bold;">
                  OT
                </div>
              </div>
              <h2 style="color: #18080F; font-size: 22px; font-weight: bold; margin-bottom: 16px; text-align: center;">Konfirmasi Akun OneTap</h2>
              <p style="color: #666666; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Halo <strong>${name}</strong>, terima kasih telah mendaftar di OneTap! Akun Anda telah berhasil dibuat, namun memerlukan konfirmasi email sebelum Anda dapat masuk.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${actionLink}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #FF5FA2, #E8457E); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(255, 95, 162, 0.25);">
                  Konfirmasi Akun Saya
                </a>
              </div>

              <div style="background-color: #FFF8F2; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #F6B7C8/20;">
                <h3 style="color: #FF5FA2; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 12px;">Detail Akun Anda</h3>
                <table style="width: 100%; font-size: 14px; color: #444444;">
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold; width: 100px;">Username:</td>
                    <td style="padding: 4px 0; color: #18080F; font-weight: 600;">@${username}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Email:</td>
                    <td style="padding: 4px 0; color: #18080F; font-weight: 600;">${email}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin dan menempelkan tautan berikut ke peramban Anda:
                <br />
                <a href="${actionLink}" style="color: #FF5FA2; word-break: break-all; font-size: 13px;">${actionLink}</a>
              </p>

              <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0;" />
              <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
                Email ini dikirimkan secara otomatis oleh sistem OneTap menggunakan integrasi Resend.
              </p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Failed to send welcome email via Resend:', emailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Registrasi berhasil!' });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
