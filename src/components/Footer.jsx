import React from "react";
import { Link } from "react-router-dom";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const { archetype, details } = useInteractionProfile();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#030306]/90 backdrop-blur-xl z-10 text-white/50 text-xs font-mono">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12">
          <div className="sm:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: details.color }}
              />
              <span className="text-white font-bold tracking-[0.25em] text-sm">
                MIRROR INTERNET
              </span>
            </div>
            <p className="text-white/45 max-w-sm text-xs leading-relaxed font-sans">
              An experimental digital world that dynamically mutates to match visitor presence, velocity, and focus.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              <span className="badge badge-ghost badge-sm font-mono text-[10px] text-white/60">
                STATUS: ONLINE
              </span>
              <span className="badge badge-ghost badge-sm font-mono text-[10px] text-white/60">
                ACTIVE STATE: {archetype}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-white/80 font-bold uppercase tracking-widest text-[11px]">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/#" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Home Portal
                </a>
              </li>
              <li>
                <a href="/#experience" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Interactive Mirror
                </a>
              </li>
              <li>
                <a href="/#reflection" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Digital Reflection
                </a>
              </li>
              <li>
                <a href="/#experiment" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Sandbox Experiment
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-white/80 font-bold uppercase tracking-widest text-[11px]">
              Digital Access
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Enter Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Create Reflection
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors py-1 inline-block min-h-[32px]">
                  Profile Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-[10px] sm:text-[11px]">
            <span>MIRROR INTERNET © 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>EXPERIMENTAL DIGITAL WORLD</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] cursor-pointer min-h-[36px]"
          >
            <span>RETURN TO SUMMIT</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
