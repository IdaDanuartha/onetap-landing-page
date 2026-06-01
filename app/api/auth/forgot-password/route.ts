import { createAdminClient } from '@/lib/supabase/admin';
import { sendResetPasswordEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Check if user exists
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (listError || !user) {
      // Return success even if user not found for security reasons
      return NextResponse.json({ message: 'If an account exists with this email, you will receive a reset link.' });
    }

    // Generate recovery link
    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?next=/auth/reset-password`
      }
    });

    if (linkError || !data.properties?.hashed_token) {
      console.error('[forgot-password] Error generating link:', linkError);
      return NextResponse.json({ error: 'Failed to generate reset link' }, { status: 500 });
    }

    // Instead of using action_link directly (which is consumed by email pre-fetchers), 
    // we use token_hash on a client-side confirm page to safely verify the user
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const actionLink = `${appUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery&next=/auth/reset-password`;

    // Send email via Resend
    await sendResetPasswordEmail({
      to: email,
      subject: 'Atur Ulang Password OneTap Kamu',
      resetLink: actionLink
    });

    return NextResponse.json({ message: 'If an account exists with this email, you will receive a reset link.' });
  } catch (error) {
    console.error('[forgot-password] System error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
