'use client';

import { Info, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AttendanceDisabledPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl shadow-[#FF5FA2]/5 border border-[#F6B7C8]/20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FF5FA2]/10 flex items-center justify-center mx-auto mb-8 text-[#FF5FA2]">
          <Info className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-[#18080F] mb-4">Fitur Dipindahkan</h1>
        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
          Pencatatan kehadiran individu via link/QR sekarang dinonaktifkan. Silakan gunakan fitur <strong>"Scan Massal"</strong> di Dashboard untuk mencatat kehadiran yang lebih cepat dan aman.
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-3 py-5 bg-[#FF5FA2] text-white rounded-3xl font-black text-lg hover:bg-[#E8457E] transition-all shadow-xl shadow-[#FF5FA2]/20"
          >
            <LayoutDashboard className="w-6 h-6" />
            Buka Dashboard
          </Link>
          
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-[#FF5FA2] transition-colors pt-2 underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 opacity-30 grayscale">
          <Image src="/images/logo_simple.png" alt="OneTap" width={24} height={24} />
          <span className="text-xs font-black uppercase tracking-widest text-[#18080F]">OneTap</span>
        </div>
      </div>
    </div>
  );
}
