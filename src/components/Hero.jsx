import React from "react";
import { motion } from "framer-motion";
import { useMouseInteraction } from "../hooks/useMouseInteraction";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { ChevronDown, ArrowUpRight, Compass, Zap } from "lucide-react";

export function Hero() {
  const mouse = useMouseInteraction();
  const { archetype, rawData } = useInteractionProfile();

  const handleEnterMirror = () => {
    const target = document.getElementById("experience");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-between pt-24 sm:pt-32 md:pt-36 2xl:pt-44 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10 select-none">
      {/* Top Status HUD - Responsive Wrap */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-6 text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-white/50 w-full"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          <span>SESSION: ACTIVE</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>VELOCITY: {Math.round(rawData.avgSpeed)} PX/S</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>STATE: {archetype}</span>
        </div>
      </motion.div>

      {/* Main Title Centerpiece */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-8 sm:py-12 relative w-full">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -inset-10 sm:-inset-20 rounded-full blur-3xl opacity-20 pointer-events-none bg-indigo-600/30" />

        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-[9px] sm:text-[10px] md:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/80">
            THE INTERNET CHANGES WHEN YOU DO.
          </span>
        </motion.div>

        {/* Hero Cinematic Title with Responsive Text Scaling */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl 2xl:text-[10rem] font-extrabold tracking-[-0.04em] leading-[0.95] text-white relative font-sans break-words"
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30 drop-shadow-2xl">
            MIRROR
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-400 to-cyan-400 font-light tracking-[-0.02em]">
            INTERNET
          </span>
        </motion.h1>

        {/* Concept Explanation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="max-w-xs sm:max-w-lg md:max-w-xl 2xl:max-w-2xl mx-auto mt-6 sm:mt-8 text-xs sm:text-sm md:text-base lg:text-lg text-white/60 font-light leading-relaxed tracking-wide px-2"
        >
          An experimental digital reality that morphs in real-time to your cursor velocity,
          focus, and browsing rhythms. No two reflections are identical.
        </motion.p>

        {/* Action Buttons - Full-width on small phones, inline on tablets/desktops */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <button
            onClick={handleEnterMirror}
            className="w-full sm:w-auto relative group px-6 sm:px-8 py-3.5 sm:py-4 rounded-full overflow-hidden text-xs md:text-sm font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white border border-white/25 bg-white/[0.06] hover:border-white/60 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 cursor-pointer min-h-[48px]"
            id="hero-enter-mirror-btn"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              ENTER THE MIRROR
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/30 to-cyan-500/30" />
          </button>

          <a
            href="#reflection"
            className="w-full sm:w-auto text-center px-6 py-3.5 sm:py-4 rounded-full text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60 hover:text-white transition-colors"
          >
            View Live Persona
          </a>
        </motion.div>
      </div>

      {/* Bottom Telemetry Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-white/40 pt-6 sm:pt-8 border-t border-white/[0.05]"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>RESONANCE: {archetype}</span>
        </div>

        <button
          onClick={handleEnterMirror}
          className="flex items-center gap-1.5 sm:gap-2 text-white/50 hover:text-white transition-colors group cursor-pointer"
        >
          <span>SCROLL TO DIVE</span>
          <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform animate-bounce" />
        </button>

        <div className="hidden sm:block">
          <span>COORDS: [{Math.round(mouse.x)}, {Math.round(mouse.y)}]</span>
        </div>
      </motion.div>
    </section>
  );
}
