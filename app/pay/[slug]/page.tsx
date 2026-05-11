import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Wallet, QrCode, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('linktree_pages')
    .select('title, user_id')
    .eq('slug', slug)
    .single();

  if (!page) return { title: 'Payment Not Found' };

  const { data: profile } = await supabase
    .from('users_profile')
    .select('display_name')
    .eq('id', page.user_id)
    .single();

  const name = profile?.display_name || page.title || 'Merchant';

  return {
    title: `Pay ${name} | OneTap Pay`,
    description: `Selesaikan pembayaran ke ${name} dengan mudah via OneTap NFC.`,
  };
}

export default async function PayBridgePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Page and QRIS Data
  const { data: page } = await supabase
    .from('linktree_pages')
    .select('id, user_id, title, qris_data, password')
    .eq('slug', slug)
    .single();

  if (!page || !page.qris_data) return notFound();

  // 2. Fetch Merchant Profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('display_name, avatar_url')
    .eq('id', page.user_id)
    .single();

  const merchantName = profile?.display_name || page.title || 'Merchant';
  const qrisData = page.qris_data;

  // Indonesian Payment Apps Deep Links (Optimized for QRIS payloads)
  const paymentApps = [
    { name: 'GoPay', color: 'bg-[#00AED6]', scheme: `gojek://gopay/qr?payload=${encodeURIComponent(qrisData)}` },
    { name: 'OVO', color: 'bg-[#4D2A86]', scheme: `ovo://qris?data=${encodeURIComponent(qrisData)}` },
    { name: 'DANA', color: 'bg-[#118EEA]', scheme: `dana://qr?payload=${encodeURIComponent(qrisData)}` },
    { name: 'ShopeePay', color: 'bg-[#EE4D2D]', scheme: `shopeepay://pay?payload=${encodeURIComponent(qrisData)}` },
    { name: 'LinkAja', color: 'bg-[#E1251B]', scheme: `linkaja://qr?payload=${encodeURIComponent(qrisData)}` },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#FF5FA2]/20">
      {/* Ambient background blur */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF5FA2]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <PaymentBridgeClient 
        merchantName={merchantName}
        paymentApps={paymentApps}
        qrisData={qrisData}
        isProtected={!!page.password}
        correctPassword={page.password}
      />

      <footer className="mt-8 text-center opacity-40 grayscale hover:grayscale-0 transition-all cursor-default flex items-center justify-center gap-1.5">
        <Image src="/images/logo_simple.png" alt="OneTap" width={16} height={16} />
        <span className="text-[10px] font-bold text-slate-600 tracking-tight">OneTap Digital Bridge</span>
      </footer>
    </div>
  );
}

// Add import at the top
import PaymentBridgeClient from './PaymentBridgeClient';

