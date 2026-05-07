import { NextResponse } from 'next/server';
import { getWhatsAppStatus } from '@/lib/whatsapp';

export async function GET() {
  const status = await getWhatsAppStatus();
  return NextResponse.json(status);
}
