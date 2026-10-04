import React, { useState, useEffect } from "react";
import { useMouseInteraction } from "../hooks/useMouseInteraction";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { formatTime } from "../lib/utils";
import {
  Activity,
  Gauge,
  MousePointer,
  Clock,
  Navigation,
  Flame,
  Radio,
} from "lucide-react";

export function InteractionTelemetry() {
  const mouse = useMouseInteraction();
  const { details, rawData, entropyScore } = useInteractionProfile();
  const [speedHistory, setSpeedHistory] = useState([20, 45, 80, 50, 30, 90, 60, 40]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeedHistory((prev) => {
        const next = [...prev.slice(-24), Math.min(Math.round(mouse.speed / 10), 100)];
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [mouse.speed]);

  const stillnessPercentage = Math.max(
    5,
    Math.min(95, Math.round((1 - rawData.avgSpeed / 800) * 100))
  );

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60 mb-3 sm:mb-4">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>REAL-TIME STREAM TELEMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Your Interaction Kinetics
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-white/50 max-w-xl">
            Live behavioral sensors capturing velocity, angular deflections, click frequency, and spatial displacement.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs text-white/60">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
          <span>Active Session: {formatTime(rawData.sessionDurationSec)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Velocity Flux */}
        <div className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-white/50 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                VELOCITY FLUX
              </span>
              <span>LIVE</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {Math.round(mouse.speed)}{" "}
              <span className="text-xs font-normal text-white/50">px/s</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/40 mt-1">
              Peak: {Math.round(rawData.peakSpeed)} px/s
            </p>
          </div>

          <div className="h-14 sm:h-16 flex items-end gap-1 mt-5 sm:mt-6 pt-2 border-t border-white/[0.06]">
            {speedHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-sm transition-all duration-300"
                style={{
                  height: `${Math.max(val, 8)}%`,
                  backgroundColor: details.color,
                  opacity: 0.3 + (idx / speedHistory.length) * 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* Card 2: Total Displacement */}
        <div className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-white/50 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                DISPLACEMENT
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {rawData.totalDistancePx.toLocaleString()}{" "}
              <span className="text-xs font-normal text-white/50">px</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/40 mt-1">
              Scroll Depth: {rawData.scrollDepthPercentage}%
            </p>
          </div>

          <div className="space-y-1.5 mt-5 sm:mt-6">
            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-white/40">
              <span>EXPLORATION DEPTH</span>
              <span>{rawData.scrollDepthPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${rawData.scrollDepthPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Click Cadence */}
        <div className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-white/50 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4">
              <span className="flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                CLICK CADENCE
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {rawData.clickCount}{" "}
              <span className="text-xs font-normal text-white/50">clicks</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/40 mt-1">
              Frequency: {rawData.clicksPerMinute} clicks/min
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-5 sm:mt-6">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
              <span className="text-[9px] sm:text-[10px] font-mono text-white/40 block">INTERVAL</span>
              <span className="text-xs font-bold text-white font-mono">
                {rawData.clicksPerMinute > 0 ? (60 / rawData.clicksPerMinute).toFixed(1) : 0}s
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
              <span className="text-[9px] sm:text-[10px] font-mono text-white/40 block">STATE</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {mouse.clicksPerMinute > 15 ? "BURST" : "STEADY"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Stillness Equilibrium */}
        <div className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-white/50 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                STILLNESS
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stillnessPercentage}%
            </div>
            <p className="text-[11px] sm:text-xs text-white/40 mt-1">
              Entropy Rating: {entropyScore} / 100
            </p>
          </div>

          <div className="space-y-2 mt-5 sm:mt-6">
            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-white/50">
              <span>CONTEMPLATION</span>
              <span>ENERGY</span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${stillnessPercentage}%` }}
              />
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${100 - stillnessPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
