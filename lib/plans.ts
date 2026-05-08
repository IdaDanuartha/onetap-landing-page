export type PlanId = 'starter' | 'professional' | 'education';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanConfig {
  id: PlanId;
  nameId: string;
  nameEn: string;
  priceMonthly: number; // in Rupiah
  priceYearly: number;  // in Rupiah (per month, billed annually)
  amountYearly: number; // total annual charge
  mayarLink?: string;
  features: Record<string, boolean>;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  starter: {
    id: 'starter',
    nameId: 'Starter',
    nameEn: 'Starter',
    priceMonthly: 0,
    priceYearly: 0,
    amountYearly: 0,
    features: {
      linktree: true,
      nfcConnect: true,
      analytics: true, // Analitik Dasar
      attendance: false,
      customBranding: true,
      passwordLinks: true,
    },
  },
  professional: {
    id: 'professional',
    nameId: 'Professional',
    nameEn: 'Professional',
    priceMonthly: 25000,
    priceYearly: 20000,
    amountYearly: 240000, // 20K × 12
    mayarLink: 'https://codewithdanu.myr.id/m/onetap-professional-plan',
    features: {
      linktree: true,
      nfcConnect: true,
      analytics: true,
      attendance: false,
      customBranding: true,
      passwordLinks: true,
    },
  },
  education: {
    id: 'education',
    nameId: 'Education',
    nameEn: 'Education',
    priceMonthly: 79000,
    priceYearly: 63000,
    amountYearly: 756000, // 63K × 12
    mayarLink: 'https://codewithdanu.myr.id/m/onetap-education-plan',
    features: {
      linktree: true,
      nfcConnect: true,
      analytics: true,
      attendance: true,
      customBranding: true,
      passwordLinks: true,
    },
  },
};

export type FeatureKey = keyof (typeof PLANS)['starter']['features'];

/** Check if a plan has access to a specific feature */
export function canAccess(plan: string | null | undefined, feature: FeatureKey): boolean {
  const resolvedPlan = (plan && PLANS[plan as PlanId]) ? (plan as PlanId) : 'starter';
  return PLANS[resolvedPlan].features[feature] ?? false;
}

/** Get plan config */
export function getPlan(plan: string | null | undefined): PlanConfig {
  const resolvedPlan = (plan && PLANS[plan as PlanId]) ? (plan as PlanId) : 'starter';
  return PLANS[resolvedPlan];
}

/** Get amount to charge given plan + billing cycle */
export function getChargeAmount(plan: PlanId, cycle: BillingCycle): number {
  const config = PLANS[plan];
  if (cycle === 'yearly') return config.amountYearly;
  return config.priceMonthly;
}

/** Days until expiry given billing cycle */
export function getDaysForCycle(cycle: BillingCycle): number {
  return cycle === 'yearly' ? 365 : 30;
}

export const PLAN_BADGE_COLORS: Record<PlanId, string> = {
  starter: 'bg-gray-100 text-gray-600',
  professional: 'bg-[#FFF1F7] text-[#FF5FA2]',
  education: 'bg-purple-50 text-purple-600',
};
