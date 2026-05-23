'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, ArrowLeft, Loader2, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PLANS, PlanId, BillingCycle, getChargeAmount } from '@/lib/plans';

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') as PlanId;
  const billingCycle = (searchParams.get('cycle') as BillingCycle) || 'monthly';

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        // Redirect to login if not authenticated
        router.push(`/auth/login?redirect=/checkout?plan=${planId}&cycle=${billingCycle}`);
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('users_profile')
        .select('display_name, email, whatsapp')
        .eq('id', authUser.id)
        .single();

      setUser(authUser);
      setForm({
        name: profile?.display_name || '',
        email: authUser.email || profile?.email || '',
        mobile: profile?.whatsapp || '',
      });
      setLoading(false);
    }

    if (planId && PLANS[planId]) {
      checkAuth();
    } else {
      router.push('/pricing');
    }
  }, [planId, billingCycle, router, supabase]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) return;
    if (form.mobile.length < 10) {
      setError('Nomor WhatsApp minimal 10 digit');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const plan = PLANS[planId] || PLANS.starter;
      const amount = getChargeAmount(planId, billingCycle);
      const finalAmount = discountPercent > 0 ? amount * (1 - discountPercent / 100) : amount;
      const cycleText = billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan';

      const message = `Halo Admin OneTap, saya ingin membeli paket subscription:

📋 *RINGKASAN PESANAN*
*Paket*: ${plan.nameId} (${cycleText})
*Harga*: Rp ${finalAmount.toLocaleString('id-ID')}
${appliedPromo ? `*Kode Promo*: ${appliedPromo} (Diskon ${discountPercent}%)\n` : ''}
👤 *DATA DIRI*
*Nama Lengkap*: ${form.name}
*Email*: ${form.email}
*No. WhatsApp*: ${form.mobile}

Mohon bantuannya untuk mengaktifkan paket saya secara manual. Terima kasih!`;

      const waNumber = '6283114227745';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      
      window.location.href = waUrl;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoError('');

    // Voucher validation via Supabase
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('code, discount_percent')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setPromoError('Kode promo tidak valid atau sudah kadaluarsa');
      } else {
        setDiscountPercent(data.discount_percent);
        setAppliedPromo(data.code);
        setPromoCode('');
      }
    } catch (err) {
      setPromoError('Terjadi kesalahan saat mengecek voucher');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setAppliedPromo('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FF5FA2] animate-spin" />
      </div>
    );
  }

  const plan = PLANS[planId] || PLANS.starter;
  const amount = getChargeAmount(planId, billingCycle);
  const rawFeatures = t(`products.plans.${planId}.features`);
  const planFeatures = Array.isArray(rawFeatures) ? rawFeatures : [];

  return (
    <div className="min-h-screen bg-[#FFF8F2] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/pricing" className="flex items-center gap-2 text-gray-500 hover:text-[#FF5FA2] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5FA2] to-[#E8457E] flex items-center justify-center">
              <Image src="/images/logo_simple.png" alt="OneTap" width={16} height={16} className="brightness-0 invert" />
            </div>
            <span className="text-lg font-black text-[#18080F]">OneTap</span>
          </Link>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F6B7C8]/20 sticky top-12">
              <h2 className="text-xl font-black text-[#18080F] mb-6">{t('checkout.summary')}</h2>
              
              <div className="p-4 rounded-2xl bg-[#FFF8F2] border border-[#F6B7C8]/30 mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#FF5FA2] uppercase tracking-wider">{plan.nameId}</span>
                  <span className="text-xs font-bold text-gray-400">
                    {billingCycle === 'yearly' ? t('checkout.billing.yearly') : t('checkout.billing.monthly')}
                  </span>
                </div>
                <div className="text-2xl font-black text-[#18080F]">
                  {discountPercent > 0 ? (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400 line-through font-bold">
                        Rp {(amount).toLocaleString('id-ID')}
                      </div>
                      <div className="text-[#FF5FA2]">
                        Rp {(amount * (1 - discountPercent / 100)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ) : (
                    `Rp ${(amount).toLocaleString('id-ID')}`
                  )}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mb-6">
                {!appliedPromo ? (
                  <div className="space-y-2">
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Kode Promo"
                        className="w-full pl-4 pr-20 py-3.5 rounded-2xl border border-[#F6B7C8]/20 bg-white text-sm font-bold placeholder:text-gray-300 focus:border-[#FF5FA2] focus:ring-4 focus:ring-[#FF5FA2]/5 outline-none transition-all shadow-sm group-hover:border-[#FF5FA2]/30"
                      />
                      <button 
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoCode}
                        className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-[#18080F] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5FA2] transition-all disabled:opacity-30 active:scale-95"
                      >
                        {isApplyingPromo ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {promoError && (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-bold text-red-500 ml-2"
                      >
                        {promoError}
                      </motion.p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{appliedPromo}</p>
                        <p className="text-[10px] text-emerald-500 font-bold">Hemat {discountPercent}%</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[10px] font-black text-red-400 hover:text-red-500 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {planFeatures.slice(0, 5).map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#18080F]">Pembayaran Aman</p>
                  <p className="text-[10px] text-gray-400">Enkripsi SSL 256-bit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-[#FF5FA2]/5 border border-[#F6B7C8]/10"
            >
              <div className="mb-10">
                <h1 className="text-3xl font-black text-[#18080F] mb-3">{t('checkout.title')}</h1>
                <p className="text-gray-500">{t('checkout.description')}</p>
              </div>

              <form onSubmit={handlePayment} className="grid sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-[#18080F] mb-2">{t('checkout.form.name')}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('checkout.form.placeholderName')}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#FF5FA2] focus:ring-4 focus:ring-[#FF5FA2]/5 transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#18080F] mb-2">{t('checkout.form.email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('checkout.form.placeholderEmail')}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed text-sm font-medium"
                    disabled
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic">Email disesuaikan dengan akun login kamu.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#18080F] mb-2">{t('checkout.form.mobile')}</label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder={t('checkout.form.placeholderMobile')}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#FF5FA2] focus:ring-4 focus:ring-[#FF5FA2]/5 transition-all text-sm font-medium"
                    required
                    minLength={10}
                  />
                </div>

                {error && (
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="sm:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-black text-lg shadow-xl shadow-[#FF5FA2]/20 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {t('checkout.form.processing')}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        {t('checkout.form.submit')}
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {locale === 'id' ? 'Mengarahkan ke WhatsApp untuk penyelesaian pembayaran...' : 'Redirecting to WhatsApp for payment completion...'}
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* <img src="/icons/visa.png" alt="Visa" className="h-4 object-contain" />
              <img src="/icons/mastercard.png" alt="Mastercard" className="h-7 object-contain" /> */}
              <img src="/icons/qris.png" alt="QRIS" className="h-6 object-contain" />
              <img src="/icons/gopay.png" alt="GoPay" className="h-7 object-contain" />
              <img src="/icons/shopeepay.png" alt="ShopeePay" className="h-6 object-contain" />
              <img src="/icons/dana.png" alt="Dana" className="h-7 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
