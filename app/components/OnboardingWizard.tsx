"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Layout,
  Wifi,
  Users,
  ChevronRight,
  ChevronLeft,
  Rocket,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  PartyPopper,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PlanId } from "@/lib/plans";

const STORAGE_KEY = "onetap_onboarding_completed";

interface Props {
  plan?: PlanId;
  forceOpen?: boolean;
  onClose?: () => void;
}

type StepId = "welcome" | "profile" | "nfc" | "attendance" | "done";

interface Step {
  id: StepId;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  gradient: string;
  href?: string;
  educationOnly?: boolean;
}

const STEPS: Step[] = [
  {
    id: "welcome",
    icon: Rocket,
    iconBg: "from-[#FF5FA2]/20 to-[#E8457E]/10",
    iconColor: "text-[#FF5FA2]",
    gradient: "from-[#FF5FA2] to-[#E8457E]",
  },
  {
    id: "profile",
    icon: Layout,
    iconBg: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
    gradient: "from-purple-500 to-purple-700",
    href: "/dashboard/linktree",
  },
  {
    id: "nfc",
    icon: Wifi,
    iconBg: "from-sky-500/20 to-sky-600/10",
    iconColor: "text-sky-400",
    gradient: "from-sky-500 to-sky-700",
    href: "/dashboard/nfc",
  },
  {
    id: "attendance",
    icon: Users,
    iconBg: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
    gradient: "from-emerald-500 to-emerald-700",
    href: "/dashboard/attendance",
    educationOnly: true,
  },
  {
    id: "done",
    icon: CheckCircle2,
    iconBg: "from-yellow-400/20 to-amber-500/10",
    iconColor: "text-yellow-400",
    gradient: "from-yellow-400 to-amber-500",
    href: "/dashboard",
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.97,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.97,
  }),
};

export default function OnboardingWizard({ plan = "starter", forceOpen = false, onClose }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Filter steps based on plan
  const activeSteps = STEPS.filter(
    (s) => !s.educationOnly || plan === "education"
  );

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentIndex(0);
      return;
    }
    const done = localStorage.getItem(STORAGE_KEY);
    if (done !== "true") {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const markDone = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const closeWizard = useCallback(() => {
    markDone();
    setIsOpen(false);
    onClose?.();
  }, [markDone, onClose]);

  const goNext = useCallback(() => {
    if (currentIndex < activeSteps.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      closeWizard();
      router.push("/dashboard");
    }
  }, [currentIndex, activeSteps.length, closeWizard, router]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleCTA = useCallback(() => {
    const step = activeSteps[currentIndex];
    markDone();
    setIsOpen(false);
    onClose?.();
    if (step.href) {
      router.push(step.href);
    }
  }, [activeSteps, currentIndex, markDone, onClose, router]);

  const currentStep = activeSteps[currentIndex];
  const isLastStep = currentIndex === activeSteps.length - 1;
  const stepData = t(`onboarding.steps.${currentStep.id}` as any) as any;
  const IconComp = currentStep.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#18080F]/80 backdrop-blur-md"
            onClick={closeWizard}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-md bg-[#2D1020]/95 backdrop-blur-2xl border border-[#FF5FA2]/15 rounded-[2.5rem] shadow-2xl shadow-[#FF5FA2]/10 overflow-hidden"
          >
            {/* Ambient glow blobs */}
            <div className="absolute -left-24 -top-24 w-56 h-56 rounded-full bg-[#FF5FA2]/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-24 -bottom-24 w-56 h-56 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

            {/* Progress bar at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
              <motion.div
                className={`h-full bg-gradient-to-r ${currentStep.gradient} rounded-full`}
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentIndex + 1) / activeSteps.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-7 pt-8 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FF5FA2]/70" />
                <span className="text-[11px] font-bold text-[#F6B7C8]/60 uppercase tracking-widest">
                  {t("onboarding.step")} {currentIndex + 1} {t("onboarding.of")} {activeSteps.length}
                </span>
              </div>
              <button
                onClick={closeWizard}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[#FF5FA2]/10 hover:border-[#FF5FA2]/30 transition-all duration-200 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step progress dots */}
            <div className="relative z-10 flex items-center justify-center gap-2 mt-1 mb-2">
              {activeSteps.map((step, idx) => (
                <motion.button
                  key={step.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  animate={{
                    width: idx === currentIndex ? 28 : 8,
                    opacity: idx === currentIndex ? 1 : idx < currentIndex ? 0.6 : 0.25,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-2 rounded-full ${
                    idx <= currentIndex
                      ? `bg-gradient-to-r ${currentStep.gradient}`
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Step Content — animated per step */}
            <div className="relative overflow-hidden px-7 pb-2">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  {/* Icon */}
                  <div className="flex justify-center mt-4 mb-6">
                    <div className="relative">
                      {/* Outer pulse ring */}
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${currentStep.iconBg} blur-md`}
                      />
                      <div
                        className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${currentStep.iconBg} border border-white/10 flex items-center justify-center shadow-xl`}
                      >
                        <IconComp className={`w-12 h-12 ${currentStep.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-black text-center text-white tracking-tight leading-tight mb-3">
                    {stepData?.title ?? ""}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-[#F6B7C8]/70 text-center leading-relaxed font-medium mb-4 px-1">
                    {stepData?.desc ?? ""}
                  </p>

                  {/* Hint pill (for profile/nfc/attendance steps) */}
                  {stepData?.hint && (
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] mb-5">
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-400/80 mt-0.5 shrink-0" />
                      <span className="text-xs text-[#F6B7C8]/60 leading-relaxed font-medium">
                        {stepData.hint}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="relative z-10 px-7 pb-8 space-y-3 mt-2">
              {/* Primary CTA button */}
              {currentStep.href && (
                <button
                  onClick={handleCTA}
                  className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r ${currentStep.gradient} text-white font-bold hover:shadow-lg hover:shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all duration-200 text-sm`}
                >
                  {stepData?.cta}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Navigation row */}
              <div className="flex gap-3">
                {currentIndex > 0 && (
                  <button
                    onClick={goBack}
                    className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold text-white/60 hover:text-white transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t("onboarding.back")}
                  </button>
                )}
                <button
                  onClick={isLastStep ? closeWizard : goNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold text-white/80 hover:text-white transition-all duration-200"
                >
                  {isLastStep ? (
                    <>
                      {t("onboarding.finish")}
                      <PartyPopper className="w-4 h-4 text-yellow-400" />
                    </>
                  ) : (
                    <>
                      {t("onboarding.next")}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Skip link */}
              {!isLastStep && (
                <button
                  onClick={closeWizard}
                  className="w-full text-center text-xs font-semibold text-[#F6B7C8]/40 hover:text-[#F6B7C8]/70 transition-colors duration-200 py-1"
                >
                  {t("onboarding.skip")}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
