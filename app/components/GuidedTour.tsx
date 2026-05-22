"use client";

import { useState, useEffect, useMemo } from "react";
import { Joyride, Step, STATUS, Actions, Events } from "react-joyride";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  PartyPopper,
  User,
  Plus,
  Layers,
  Palette,
  Save,
  Wifi,
  Link as LinkIcon,
  Video,
  Camera,
  Users,
  Download,
  Info
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Map steps to their respective icons
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  profile: User,
  addLink: Plus,
  linksList: Layers,
  themes: Palette,
  save: Save,
  scan: Wifi,
  write: Save,
  linkInput: LinkIcon,
  scanner: Camera,
  bulk: Users,
  export: Download,
};

interface GuidedTourProps {
  pageKey: "builder" | "nfc" | "attendance";
  steps: Step[];
  run: boolean;
  onClose: () => void;
  stepIndex?: number;
  callback?: (data: any) => void;
}

export default function GuidedTour({ pageKey, steps, run, onClose, stepIndex, callback }: GuidedTourProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Custom Tooltip component for React Joyride to match premium styling
  const CustomTooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    isLastStep,
    tooltipProps,
  }: any) => {
    // Extract step custom metadata or ID to find the icon
    const stepId = step.data?.id || "";
    const IconComp = ICON_MAP[stepId] || Info;

    return (
      <div
        {...tooltipProps}
        className="w-[340px] max-w-sm bg-[#2D1020]/95 backdrop-blur-2xl border border-[#FF5FA2]/20 rounded-[2rem] shadow-2xl shadow-[#FF5FA2]/10 p-6 text-white overflow-hidden pointer-events-auto"
      >
        {/* Ambient glow */}
        <div className="absolute -left-12 -top-12 w-28 h-28 rounded-full bg-[#FF5FA2]/10 blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-purple-600/10 blur-2xl pointer-events-none" />

        {/* Top Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
          <div
            className="h-full bg-gradient-to-r from-[#FF5FA2] to-[#FF8EBE] rounded-full"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#FF5FA2]/70" />
            <span className="text-[10px] font-bold text-[#F6B7C8]/60 uppercase tracking-widest">
              {t("onboarding.step")} {index + 1} {t("onboarding.of")} {steps.length}
            </span>
          </div>
          <button
            {...closeProps}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-[#FF5FA2]/10 hover:border-[#FF5FA2]/30 transition-all duration-200 text-white/50 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 relative z-10">
          {/* Icon Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5FA2]/20 to-[#E8457E]/10 border border-[#FF5FA2]/20 flex items-center justify-center text-[#FF5FA2]">
              <IconComp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white leading-tight tracking-tight">
              {step.title}
            </h3>
          </div>

          <p className="text-xs text-[#F6B7C8]/70 leading-relaxed font-medium">
            {step.content}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
          {/* Skip button on first step */}
          {index === 0 ? (
            <button
              {...skipProps}
              className="text-xs font-semibold text-[#F6B7C8]/40 hover:text-[#F6B7C8]/70 transition-colors duration-200 py-1.5 px-3 rounded-xl hover:bg-white/5"
            >
              {t("dashboard.tour.skip")}
            </button>
          ) : (
            <button
              {...backProps}
              className="flex items-center gap-1 text-xs font-semibold text-[#F6B7C8]/60 hover:text-white transition-colors duration-200 py-1.5 px-3 rounded-xl hover:bg-white/5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {t("dashboard.tour.back")}
            </button>
          )}

          {/* Next / Finish button */}
          {isLastStep ? (
            <button
              {...primaryProps}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#E8457E] hover:shadow-lg hover:shadow-[#FF5FA2]/20 hover:-translate-y-0.5 transition-all duration-200 text-xs font-bold text-white cursor-pointer"
            >
              {t("dashboard.tour.finish")}
              <PartyPopper className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
            </button>
          ) : (
            <button
              {...primaryProps}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 text-xs font-bold text-white cursor-pointer"
            >
              {t("dashboard.tour.next")}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleJoyrideCallback = (data: any) => {
    const { status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onClose();
    }
  };

  const stepsWithDisabledBeacons = useMemo(() => {
    return steps.map((step: any) => ({
      ...step,
      disableBeacon: true,
      disableOverlayClose: true,
      spotlightClicks: true,
    }));
  }, [steps]);

  const JoyrideComp = Joyride as any;

  return (
    <JoyrideComp
      steps={stepsWithDisabledBeacons}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      tooltipComponent={CustomTooltip}
      callback={callback || handleJoyrideCallback}
      stepIndex={stepIndex}
      styles={{
        options: {
          arrowColor: "rgba(45, 16, 32, 0.95)",
          overlayColor: "rgba(24, 8, 15, 0.65)",
          zIndex: 10000,
        },
        spotlight: {
          borderRadius: 20,
          border: "2px solid #FF5FA2",
          boxShadow: "0 0 15px rgba(255, 95, 162, 0.5)",
        },
      } as any}
    />
  );
}
