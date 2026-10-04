import React, { useRef, useEffect, useState } from "react";
import { useMouseInteraction } from "../hooks/useMouseInteraction";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { Sparkles, Waves, Activity } from "lucide-react";

export function MirrorExperience() {
  const canvasRef = useRef(null);
  const mouse = useMouseInteraction();
  const { rawData } = useInteractionProfile();
  const [activePreset, setActivePreset] = useState("adaptive");

  const mouseStateRef = useRef({
    x: 0,
    y: 0,
    speed: 0,
    clicks: 0,
    isIdle: false,
    scrollDepth: 0,
  });

  useEffect(() => {
    mouseStateRef.current = {
      x: mouse.x,
      y: mouse.y,
      speed: mouse.avgSpeed,
      clicks: mouse.clicks,
      isIdle: mouse.isIdle,
      scrollDepth: mouse.scrollDepth,
    };
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let time = 0;
    const colorRgb = "99, 102, 241";

    const render = () => {
      time += 0.02;
      const m = mouseStateRef.current;
      const speedFactor = Math.min(m.speed / 800, 1.5);
      const isIdle = m.isIdle;

      ctx.fillStyle = "rgba(7, 8, 14, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      const rect = canvas.getBoundingClientRect();
      const localMouseX = m.x - rect.left;
      const localMouseY = m.y - rect.top;

      const lineCount = width < 640 ? 14 : isIdle ? 16 : 24;
      const amplitude = isIdle ? 14 : (width < 640 ? 22 : 35) + speedFactor * 35;
      const frequency = 0.008 + speedFactor * 0.006;

      for (let i = 0; i < lineCount; i++) {
        const offset = (i / lineCount) * Math.PI * 2;
        const spacing = width < 640 ? 12 : 16;
        const yBase = centerY + (i - lineCount / 2) * spacing;

        ctx.beginPath();
        for (let x = 0; x < width; x += (width < 640 ? 8 : 6)) {
          const distToMouse = Math.hypot(x - localMouseX, yBase - localMouseY);
          const mouseDistortion = Math.max(0, (1 - distToMouse / 220)) * 40;

          const y =
            yBase +
            Math.sin(x * frequency + time * (1 + speedFactor) + offset) * amplitude +
            Math.cos((x * 0.01) - time * 0.5) * 8 -
            mouseDistortion;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const alpha = isIdle ? 0.15 : 0.2 + (i / lineCount) * 0.35 + speedFactor * 0.15;
        ctx.strokeStyle = `rgba(${colorRgb}, ${alpha})`;
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      const ringCount = width < 640 ? 3 : isIdle ? 3 : 5;
      for (let r = 0; r < ringCount; r++) {
        const radius = (width < 640 ? 40 : 60) + r * (width < 640 ? 25 : 35) + Math.sin(time + r) * (10 + speedFactor * 20);
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(10, radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${colorRgb}, ${0.12 / (r + 1)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (localMouseX >= 0 && localMouseX <= width && localMouseY >= 0 && localMouseY <= height) {
        ctx.beginPath();
        ctx.arc(localMouseX, localMouseY, 16 + speedFactor * 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb}, ${0.1 + speedFactor * 0.15})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${colorRgb}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="experience" className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60 mb-3 sm:mb-4">
            <Waves className="w-3 h-3 text-cyan-400" />
            <span>INTERACTIVE MIRROR ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            The Living Reflection Field
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-white/50 max-w-xl leading-relaxed">
            Move gently, touch, drag, accelerate, or rest. The field modulates tension, frequency, and harmonic resonance to match your exact presence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-panel px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-3 border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-indigo-500 animate-pulse" />
            <div className="text-left font-mono">
              <div className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest">
                Field Equilibrium
              </div>
              <div className="text-xs text-white font-semibold">
                {mouse.isIdle
                  ? "Quiet Stasis"
                  : rawData.avgSpeed > 500
                  ? "Hypervelocity Flow"
                  : "Harmonic Synchrony"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl p-1">
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/[0.02] gap-3">
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span>SENSITIVITY: 100%</span>
            </span>
            <span className="text-white/20">|</span>
            <span>DWELL: {rawData.sessionDurationSec}s</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {["adaptive", "quantum", "fluid"].map((preset) => (
              <button
                key={preset}
                onClick={() => setActivePreset(preset)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono capitalize transition-all cursor-pointer ${
                  activePreset === preset
                    ? "bg-white/15 text-white border border-white/30"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] 2xl:h-[620px] w-full bg-[#07080e] overflow-hidden cursor-crosshair touch-none">
          <canvas ref={canvasRef} className="w-full h-full block" />

          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-none glass-panel-subtle px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[9px] sm:text-[11px] font-mono text-white/60 border border-white/10 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
            <span>Touch or hover to bend mirror topology</span>
          </div>
        </div>
      </div>
    </section>
  );
}
