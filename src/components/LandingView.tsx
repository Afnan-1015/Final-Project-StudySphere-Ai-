import React, { useState } from "react";
import { ViewMode } from "../types";
import { FooterPolicyModal, PolicyType } from "./FooterPolicyModal";

interface LandingViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff]">
      {/* Policy Modal Pop-up */}
      <FooterPolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Hero Section */}
      <main className="flex-1 pt-12 pb-12 px-4 max-w-lg mx-auto flex flex-col items-center justify-center text-center">
        {/* Tablet Image Visual with floating chips */}
        <div className="relative w-full max-w-[280px] aspect-square mx-auto mb-8">
          <div className="absolute inset-0 bg-[#0058be]/10 rounded-3xl rotate-6 animate-pulse"></div>
          <div className="absolute inset-0 bg-[#6b38d4]/10 rounded-3xl -rotate-3"></div>
          <div className="relative rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md h-full flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWzTOThHi-mat-zXOejTW5nrgC2U8ZyogTCb6xEdqUR0oE0YqDcAf4FyDEqWt21SvMKzawhVPWhrpcXukKOyUh-3TlWouj6HQ1zJwaINlZhiwSZcTHD5UWY4JTDeMzmEDRC68dESL1VG7nlrgfIxsQlM_priMlmUDS4p0cu8iwHMvoEpkVVMgHppJ9VBc4tdxikvEqRIRKsnDb-rtUMF03PYE1JB9ix2zEFz6BK-hlgBMwchpB_fEV0duC565XaURDDroJh1RboTDn"
              alt="Digital Study Tablet Illustration"
              className="w-full h-full object-cover"
            />

            {/* Floating UI Chips */}
            <div className="absolute top-5 left-5 bg-white/95 shadow-md rounded-xl p-2.5 flex items-center gap-2 border border-slate-100 text-left">
              <span
                className="material-symbols-outlined text-[#8455ef] text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="text-[11px] font-bold text-[#0b1c30]">
                AI Draft Ready
              </span>
            </div>

            <div className="absolute bottom-6 right-5 bg-white/95 shadow-md rounded-xl p-2.5 flex items-center gap-2 border border-slate-100 text-left">
              <span
                className="material-symbols-outlined text-[#0058be] text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                timer
              </span>
              <span className="text-[11px] font-bold text-[#0b1c30]">
                Focus: 45m
              </span>
            </div>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="space-y-3 mb-8">
          <h1 className="font-bold text-4xl sm:text-5xl text-[#0b1c30] tracking-tight leading-tight">
            Learn{" "}
            <span className="bg-gradient-to-r from-[#0058be] to-[#8455ef] bg-clip-text text-transparent">
              Smarter
            </span>
            .<br />
            Achieve More.
          </h1>
          <p className="text-sm md:text-base text-[#424754] max-w-sm mx-auto leading-relaxed">
            The ultimate AI-powered ecosystem for students. Master your curriculum
            with intelligent study flows and deep-work tools.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs mb-10">
          <button
            onClick={() => onNavigate("signup")}
            className="w-full bg-[#0058be] text-white py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#004395] active:scale-98 transition-all"
          >
            Get Started
          </button>
          <button
            onClick={() => onNavigate("signin")}
            className="w-full bg-white border border-[#c2c6d6] text-[#0b1c30] py-3.5 rounded-xl font-bold text-base hover:bg-[#eff4ff] active:scale-98 transition-all"
          >
            Log In
          </button>
        </div>

        {/* Social Proof */}
        <div className="pt-6 border-t border-slate-200/60 w-full">
          <p className="text-[11px] font-bold text-[#727785] uppercase tracking-widest mb-3">
            Trusted by 50k+ Students
          </p>
          <div className="flex justify-center gap-6 text-slate-400 opacity-60">
            <span className="material-symbols-outlined text-2xl">school</span>
            <span className="material-symbols-outlined text-2xl">
              auto_stories
            </span>
            <span className="material-symbols-outlined text-2xl">
              psychology
            </span>
            <span className="material-symbols-outlined text-2xl">
              architecture
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/80 bg-white text-center text-xs text-[#727785] space-y-3">
        <div className="flex items-center justify-center gap-2 text-[#0058be] font-bold text-sm">
          <span className="material-symbols-outlined text-lg">
            auto_awesome
          </span>
          <span>StudySphere AI</span>
        </div>
        <div className="flex justify-center gap-5">
          <button
            onClick={() => setActivePolicy("privacy")}
            className="hover:text-[#0058be] hover:underline transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActivePolicy("terms")}
            className="hover:text-[#0058be] hover:underline transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActivePolicy("help")}
            className="hover:text-[#0058be] hover:underline transition-colors"
          >
            Help Center
          </button>
        </div>
        <p>© 2026 StudySphere AI. Designed for Deep Work.</p>
      </footer>
    </div>
  );
};
