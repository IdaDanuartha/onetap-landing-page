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
    .select('id, user_id, title, qris_data')
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

  // Indonesian Payment Apps Deep Links
  const paymentApps = [
    { name: 'GoPay', color: 'bg-[#00AED6]', scheme: `gopay://pay?data=${qrisData}` },
    { name: 'OVO', color: 'bg-[#4D2A86]', scheme: `ovo://pay?data=${qrisData}` },
    { name: 'DANA', color: 'bg-[#118EEA]', scheme: `dana://pay?data=${qrisData}` },
    { name: 'ShopeePay', color: 'bg-[#EE4D2D]', scheme: `shopeepay://pay?data=${qrisData}` },
    { name: 'LinkAja', color: 'bg-[#E1251B]', scheme: `linkaja://pay?data=${qrisData}` },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#FF5FA2]/20">
      {/* Ambient background blur */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF5FA2]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100 flex flex-col">
        {/* Merchant Header */}
        <div className="p-8 pb-6 text-center bg-gradient-to-b from-slate-50/50 to-white relative">
          <div className="absolute top-6 right-6">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full border border-green-100">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter">Verified</span>
            </div>
          </div>

          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-[#FF5FA2]/20 blur-xl rounded-full scale-150 animate-pulse" />
            {profile?.avatar_url ? (
              <Image 
                src={profile.avatar_url} 
                alt={merchantName} 
                width={84} 
                height={84} 
                className="relative rounded-full border-4 border-white shadow-xl object-cover" 
              />
            ) : (
              <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-xl">
                <CreditCard className="w-8 h-8 text-[#FF5FA2]" />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-black text-[#18080F] tracking-tight mb-1">{merchantName}</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
            <QrCode className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 tracking-wide">Standard QRIS Payment</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Pilih Aplikasi Pembayaran</p>
          
          <div className="grid gap-3">
            {paymentApps.map((app) => (
              <a
                key={app.name}
                href={app.scheme}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#FF5FA2]/30 hover:bg-[#FF5FA2]/5 hover:shadow-lg hover:shadow-[#FF5FA2]/5 transition-all group active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${app.color} flex items-center justify-center shadow-inner relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white font-black text-xs tracking-tighter">{app.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-sm">{app.name}</span>
                    <span className="text-[9px] font-medium text-slate-400">Langsung buka aplikasi</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF5FA2] group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50">
            <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-slate-800">
              <QrCode className="w-5 h-5" />
              Tampilkan Gambar QRIS
            </button>
            <p className="text-center text-[9px] font-medium text-slate-400 mt-4 leading-relaxed px-6">
              Jika aplikasi tidak terbuka otomatis, silakan pilih "Tampilkan Gambar QRIS" dan scan secara manual.
            </p>
          </div>
        </div>

        <footer className="p-6 text-center bg-slate-50/50">
          <div className="flex items-center justify-center gap-1.5 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
            <Image src="/images/logo_simple.png" alt="OneTap" width={16} height={16} />
            <span className="text-[10px] font-bold text-slate-600 tracking-tight">OneTap Digital Bridge</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
