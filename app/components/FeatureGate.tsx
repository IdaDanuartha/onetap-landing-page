'use client';

import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { PlanId } from '@/lib/plans';
import { PLANS } from '@/lib/plans';

interface FeatureGateProps {
  /** Minimum plan required to access the feature */
  requiredPlan: PlanId;
  /** Current user's plan */
  userPlan: PlanId | null | undefined;
  /** Content to render when user has access */
  children: React.ReactNode;
  /** Optional custom message */
  message?: string;
}

const PLAN_ORDER: PlanId[] = ['starter', 'professional', 'education'];

function meetsRequirement(userPlan: PlanId | null | undefined, requiredPlan: PlanId): boolean {
  const userIdx = PLAN_ORDER.indexOf(userPlan ?? 'starter');
  const reqIdx = PLAN_ORDER.indexOf(requiredPlan);
  return userIdx >= reqIdx;
}

export default function FeatureGate({ requiredPlan, userPlan, children, message }: FeatureGateProps) {
  const hasAccess = meetsRequirement(userPlan, requiredPlan);

  if (hasAccess) return <>{children}</>;

  const requiredPlanConfig = PLANS[requiredPlan];

  return (
    <div className="relative rounded-[2rem] overflow-hidden">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none blur-[3px] opacity-40">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl shadow-[#FF5FA2]/10 border border-[#F6B7C8]/30 max-w-sm mx-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF1F7] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#FF5FA2]" />
          </div>
          <h3 className="text-lg font-black text-[#18080F] mb-2">
            Fitur {requiredPlanConfig.nameId}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {message ?? `Fitur ini membutuhkan plan ${requiredPlanConfig.nameId} atau lebih tinggi.`}
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] text-white font-bold text-sm shadow-lg shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Upgrade Plan
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
