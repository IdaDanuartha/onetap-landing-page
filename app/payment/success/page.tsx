'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Clock, Loader2, ArrowRight, RefreshCw, AlertTriangle, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type InvoiceStatus = 'paid' | 'unpaid' | 'pending' | 'expired' | 'canceled' | 'loading' | 'error';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('invoiceId') || searchParams.get('id') || searchParams.get('mayarInvoiceId');
  const ref = searchParams.get('ref');
  const [status, setStatus] = useState<InvoiceStatus>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const checkStatus = async () => {
    if (!invoiceId && !ref) {
      setStatus('error');
      setErrorMsg('Missing invoiceId or ref');
      return;
    }

    try {
      const params = new URLSearchParams();
      if (invoiceId) params.append('invoiceId', invoiceId);
      if (ref) params.append('ref', ref);
      
      const res = await fetch(`/api/payment/status?${params.toString()}`);
      const data = await res.json();
      
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.message || data.error || 'Failed to check status');
        return;
      }
      
      setStatus(data.status ?? 'error');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown network error');
    }
  };

  useEffect(() => {
    checkStatus();

    // Auto-poll every 5 seconds up to 12 times (1 minute)
    const interval = setInterval(() => {
      setAttempts((a) => {
        if (a >= 12) {
          clearInterval(interval);
          return a;
        }
        checkStatus();
        return a + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, ref, searchParams]);

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center shadow-lg">
            <Image src="/images/logo_simple.png" alt="OneTap" width={20} height={20} className="brightness-0 invert" />
          </div>
          <span className="text-xl font-extrabold text-[#18080F] tracking-tight">OneTap</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-[#FF5FA2]/5 border border-[#F6B7C8]/20 text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#FFF1F7] flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-[#FF5FA2] animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-[#18080F] mb-3">{t('paymentSuccess.loading')}</h1>
            <p className="text-gray-500 text-sm">{t('paymentSuccess.loadingDesc')}</p>
          </>
        )}

        {status === 'paid' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-20 h-20 rounded-full bg-[#FFF1F7] flex items-center justify-center mx-auto mb-6"
            >
              <PartyPopper className="w-10 h-10 text-[#FF5FA2]" />
            </motion.div>
            <h1 className="text-2xl font-black text-[#18080F] mb-3">{t('paymentSuccess.paid')}</h1>
            <p className="text-gray-500 text-sm mb-8">{t('paymentSuccess.paidDesc')}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold shadow-lg shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all"
            >
              {t('paymentSuccess.ctaDashboard')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </>
        )}

        {(status === 'unpaid' || status === 'pending') && (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-black text-[#18080F] mb-3">{t('paymentSuccess.unpaid')}</h1>
            <p className="text-gray-500 text-sm mb-6">{t('paymentSuccess.unpaidDesc')}</p>
            <button
              onClick={checkStatus}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5FA2]/10 text-[#FF5FA2] font-bold hover:bg-[#FF5FA2]/20 transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              {t('paymentSuccess.ctaCheck')}
            </button>
          </>
        )}

        {(status === 'expired' || status === 'canceled') && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-[#18080F] mb-3">{t('paymentSuccess.expired')}</h1>
            <p className="text-gray-500 text-sm mb-8">{t('paymentSuccess.expiredDesc')}</p>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 rounded-2xl bg-[#FF5FA2] text-white font-bold shadow-lg shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all"
            >
              {t('paymentSuccess.ctaPricing')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-[#18080F] mb-3">{t('paymentSuccess.error')}</h1>
            <p className="text-gray-500 text-sm mb-4">{t('paymentSuccess.errorDesc')}</p>
            {errorMsg && (
              <div className="mb-8 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-mono break-all">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={checkStatus} className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all">
                {t('paymentSuccess.ctaRetry')}
              </button>
              <a
                href="https://wa.me/6283114227745"
                className="px-5 py-3 rounded-xl bg-[#FF5FA2] text-white font-bold text-sm hover:bg-[#E8457E] transition-all"
              >
                {t('paymentSuccess.ctaSupport')}
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
