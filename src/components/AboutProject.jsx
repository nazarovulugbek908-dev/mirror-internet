import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Globe2, ArrowRight } from "lucide-react";

export function AboutProject() {
  return (
    <section id="about" className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 items-start">
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60">
            <Globe2 className="w-3 h-3 text-cyan-400" />
            <span>MANIFESTO &amp; ARCHITECTURE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The Digital World That Gazes Back
          </h2>

          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base text-white/65 leading-relaxed font-light">
            <p>
              Traditional websites are rigid catalogs: static matrices of buttons and text that treat every visitor identically.
            </p>
            <p>
              <strong className="text-white font-medium">Mirror Internet</strong> is an experimental digital world born from the premise that software should be conscious of its observer. By observing subtle micro-kinetic behaviors—velocity bursts, contemplative pauses, directional entropy—the interface subtly reorganizes its frequency, luminosity, and visual harmony.
            </p>
            <p>
              No cookies, no intrusive tracking scripts. All kinetic telemetry is computed purely on the client side in real-time.
            </p>
          </div>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              to="/register"
              className="btn btn-primary rounded-full text-xs font-mono uppercase tracking-wider text-white gap-2 w-full sm:w-auto justify-center min-h-[44px]"
            >
              <span>Create Your Reflection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/profile"
              className="btn btn-outline rounded-full text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border-white/20 hover:bg-white/10 w-full sm:w-auto justify-center min-h-[44px]"
            >
              Inspect Telemetry Dashboard
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/15 space-y-4 sm:space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-widest border-b border-white/10 pb-3 sm:pb-4">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Technology Stack</span>
          </div>

          <div className="space-y-3 sm:space-y-4 font-mono text-[11px] sm:text-xs">
            <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-white/60">Frontend Core:</span>
              <span className="text-white font-semibold text-right">React.js + Vite</span>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-white/60">Design &amp; UI:</span>
              <span className="text-white font-semibold text-right">Tailwind CSS + DaisyUI</span>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-white/60">Motion System:</span>
              <span className="text-white font-semibold text-right">Framer Motion + Canvas</span>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-white/60 shrink-0">Auth Layer:</span>
              <span className="text-cyan-400 font-semibold text-right text-[10px] sm:text-xs">Supabase Auth</span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 text-[10px] sm:text-[11px] text-white/70 leading-relaxed font-sans">
            <strong className="text-indigo-300 font-semibold block mb-1">Supabase Live Integration:</strong>
            Authentication UI and hooks are connected to Supabase Auth with real-time session persistence, registration, login, and secure tokens.
          </div>
        </div>
      </div>
    </section>
  );
}
