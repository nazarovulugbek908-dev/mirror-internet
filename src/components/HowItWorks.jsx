import React from "react";
import { motion } from "framer-motion";
import { Cpu, Globe, Sparkles, Layers, Activity } from "lucide-react";
import { useInteractionProfile } from "../hooks/useInteractionProfile";

export function HowItWorks() {
  const { details } = useInteractionProfile();

  const steps = [
    {
      step: "01",
      title: "Micro-Kinetic Capture",
      desc: "Every sub-pixel pointer coordinate, touch deflection, and scroll velocity is ingested in real-time through an asynchronous kinetic stream.",
      icon: Activity,
    },
    {
      step: "02",
      title: "Entropy Filtering",
      desc: "Mathematical smoothing algorithms calculate instantaneous jitter, dwell stillness, and movement vectors to measure interaction entropy.",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Harmonic Archetype Derivation",
      desc: "Behavioral signals map dynamically to one of six digital reflections (Calm, Curious, Fast, Explorer, Focused, Chaotic) with continuous recalibration.",
      icon: Sparkles,
    },
    {
      step: "04",
      title: "Generative Atmosphere",
      desc: "The visual canvas, particle fields, chromatic glow, and procedural mandala transform instantaneously—crafting a unique reality for every visitor.",
      icon: Globe,
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60 mb-3 sm:mb-4">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>SYSTEM ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          How the Mirror Works
        </h2>
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-white/50 leading-relaxed px-2">
          A four-tier perceptual pipeline that translates organic human presence into generative digital environments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/10 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-5 sm:mb-6 md:mb-8">
                  <span className="font-mono text-xl sm:text-2xl font-black text-white/20 group-hover:text-white/40 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/30 transition-all">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-5 sm:mt-6 md:mt-8 pt-3 sm:pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-white/40">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: details.color }}
                />
                <span>PIPELINE STAGE {item.step}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
