import { NextResponse } from 'next/server';

export async function POST() {
  const token = process.env.FONNTE_API_TOKEN;
  console.log('[WhatsApp API] Using token starting with:', token ? token.substring(0, 4) : 'null');
  if (!token) {
    return NextResponse.json({ status: false, message: 'Token not configured' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.fonnte.com/qr', {
      method: 'POST',
      headers: { Authorization: token },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[WhatsApp QR] Error:', err);
    return NextResponse.json({ status: false, message: 'Server error' }, { status: 500 });
  }
}
