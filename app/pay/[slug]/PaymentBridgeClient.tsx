'use client';

import { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PaymentBridgeClientProps {
  merchantName: string;
  paymentApps: {
    name: string;
    color: string;
    scheme: string;
  }[];
  qrisData: string;
  isProtected: boolean;
  correctPassword?: string;
}

export default function PaymentBridgeClient({
  merchantName,
  paymentApps,
  qrisData,
  isProtected,
  correctPassword
}: PaymentBridgeClientProps) {
  const { dict } = useLanguage();
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!isProtected);
  const [error, setError] = useState('');
  const [showQrisImage, setShowQrisImage] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError(dict.protection.error);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-8 border border-slate-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-[#FF5FA2]" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">{dict.protection.paymentTitle}</h2>
        <p className="text-sm text-slate-500 mb-8 px-4">
          {dict.protection.paymentDesc.replace('{name}', merchantName)}
        </p>

        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <div className="relative group">
            <input
              type="password"
              placeholder={dict.protection.placeholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-6 py-4 bg-slate-50 border ${error ? 'border-red-200 focus:ring-red-100' : 'border-slate-100 focus:ring-[#FF5FA2]/10'} rounded-2xl outline-none focus:ring-4 transition-all text-center font-bold tracking-widest placeholder:tracking-normal placeholder:font-medium`}
              autoFocus
            />
            {error && <p className="text-[10px] font-bold text-red-500 mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {dict.protection.button}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-[10px] font-medium text-slate-400">
          Gunakan password yang diberikan oleh merchant atau OneTap card owner.
        </p>
      </div>
    );
  }

  return (
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
          <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
             <ShieldCheck className="w-8 h-8 text-[#FF5FA2]" />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-[#18080F] tracking-tight mb-1">{merchantName}</h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
          <QrCode className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 tracking-wide">Standard QRIS Payment</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">{dict.paymentBridge.chooseApp}</p>
        
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
                  <span className="text-[9px] font-medium text-slate-400">{dict.paymentBridge.directOpen}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF5FA2] group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50">
          <button 
            onClick={() => setShowQrisImage(!showQrisImage)}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-slate-800"
          >
            <QrCode className="w-5 h-5" />
            {showQrisImage ? dict.paymentBridge.hideQris : dict.paymentBridge.showQris}
          </button>
          
          {showQrisImage && (
            <div className="mt-6 p-4 bg-slate-50 rounded-3xl flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-3">
                {/* QR Code would go here, simplified for now */}
                <div className="w-48 h-48 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 text-center px-4 font-bold uppercase tracking-widest">
                  {dict.paymentBridge.manualScan.replace('{name}', merchantName)}
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 text-center leading-relaxed max-w-[200px]">
                {dict.paymentBridge.screenshotInfo}
              </p>
            </div>
          )}
          
          <p className="text-center text-[9px] font-medium text-slate-400 mt-4 leading-relaxed px-6">
            {dict.paymentBridge.fallbackInfo}
          </p>
        </div>
      </div>
    </div>
  );
}
