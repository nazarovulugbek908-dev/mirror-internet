import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { ARCHETYPE_DEFINITIONS } from "../lib/interactionEngine";
import { Sparkles, ShieldAlert, Activity, CheckCircle2 } from "lucide-react";

export function DigitalReflection() {
  const { archetype: liveArchetype, details: liveDetails, rawData, entropyScore, reflectionConfidence } = useInteractionProfile();
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  const activeArchetype = selectedArchetype || liveArchetype;
  const activeDetails = ARCHETYPE_DEFINITIONS[activeArchetype] || liveDetails;

  const archetypesList = [
    "CALM",
    "CURIOUS",
    "FAST",
    "EXPLORER",
    "FOCUSED",
    "CHAOTIC",
  ];

  return (
    <section id="reflection" className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] sm:text-xs font-mono tracking-widest text-white/70 mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>SESSION-DERIVED PROFILE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Your Digital Reflection
        </h2>
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-white/60 leading-relaxed px-2">
          Every micro-pause, velocity surge, and click cadence forms a transient digital identity.
          Below is your live behavioral resonance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Main Archetype Glass Card */}
        <motion.div
          layout
          className="lg:col-span-7 glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-white/15 relative overflow-hidden shadow-2xl"
        >
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeDetails.color }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: activeDetails.color,
                  boxShadow: `0 0 15px ${activeDetails.color}`,
                }}
              />
              <span className="text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-[0.25em] text-white/60 uppercase">
                {selectedArchetype ? "PREVIEW ARCHETYPE" : "LIVE DETECTED STATE"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confidence: {reflectionConfidence}%</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeArchetype}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-2 font-sans"
                style={{ color: activeDetails.color }}
              >
                {activeDetails.name}
              </h3>
              <p className="text-sm sm:text-lg md:text-xl font-medium text-white/90 mb-3 sm:mb-4 font-mono">
                {activeDetails.tagline}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-white/65 leading-relaxed mb-6 sm:mb-8">
                {activeDetails.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-3 sm:space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-[10px] sm:text-xs font-mono text-white/50 tracking-widest uppercase mb-3 sm:mb-4">
              Resonance Attributes
            </h4>

            {Object.entries(activeDetails.attributes || {}).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono">
                  <span className="capitalize text-white/80">{key}</span>
                  <span className="text-white/50">{value}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${activeDetails.color}, ${activeDetails.secondaryColor})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-center">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase">Avg Velocity</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                {Math.round(rawData.avgSpeed)} <span className="text-[10px] sm:text-xs font-normal text-white/50">px/s</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase">Click Cadence</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                {rawData.clicksPerMinute} <span className="text-[10px] sm:text-xs font-normal text-white/50">cpm</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase">Entropy Index</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                {entropyScore} <span className="text-[10px] sm:text-xs font-normal text-white/50">/ 100</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Archetype Selector */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-widest">
              Available Archetypes
            </span>
            {selectedArchetype && (
              <button
                onClick={() => setSelectedArchetype(null)}
                className="text-[10px] sm:text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Reset to Live
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            {archetypesList.map((type) => {
              const def = ARCHETYPE_DEFINITIONS[type];
              const isSelected = activeArchetype === type;
              const isLive = liveArchetype === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedArchetype(type)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 relative border cursor-pointer ${
                    isSelected
                      ? "glass-panel bg-white/[0.08] border-white/30 shadow-lg"
                      : "glass-panel-subtle hover:border-white/20 border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: def.color }}
                      />
                      <span className="font-bold text-xs sm:text-sm text-white">{def.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLive && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          LIVE
                        </span>
                      )}
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-white/50 mt-1 sm:mt-1.5 line-clamp-1">{def.tagline}</p>
                </button>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 sm:p-4 rounded-2xl glass-panel-subtle border border-amber-500/20 bg-amber-500/[0.03] flex items-start gap-2.5 sm:gap-3 mt-4 sm:mt-6">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
              <strong className="text-white/80">Experimental Digital Art Notice:</strong> This
              reflection is calculated solely from client-side pointer movement, touch, and scroll
              velocity. It does not constitute psychological or medical analysis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
