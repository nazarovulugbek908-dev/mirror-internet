import React, { useRef, useState, useEffect } from "react";
import { FlaskConical, Zap } from "lucide-react";

export function ExperimentSection() {
  const canvasRef = useRef(null);
  
  const [mode, setMode] = useState("vortex");
  const [resonanceIntensity, setResonanceIntensity] = useState(50);
  const [bursts, setBursts] = useState(0);

  const particlesRef = useRef([]);

  const triggerQuantumBurst = () => {
    setBursts((b) => b + 1);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = (canvas.width / dpr) / 2;
    const cy = (canvas.height / dpr) / 2;

    const burstCount = window.innerWidth < 640 ? 20 : 40;
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: "#6366f1",
      });
    }
  };

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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let time = 0;
    const rgb = "99, 102, 241"; // Stable harmonic indigo
    const isMobile = window.innerWidth < 640;

    const render = () => {
      time += 0.03;
      ctx.fillStyle = "rgba(6, 7, 12, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const intensityMod = resonanceIntensity / 50;

      if (mode === "vortex") {
        const spirals = isMobile ? 3 : 4;
        for (let s = 0; s < spirals; s++) {
          ctx.beginPath();
          const spiralOffset = (s / spirals) * Math.PI * 2;
          const maxPoints = isMobile ? 120 : 180;
          for (let i = 0; i < maxPoints; i++) {
            const angle = 0.08 * i + time * 0.8 + spiralOffset;
            const dist = (i * 1.6) * intensityMod;
            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${rgb}, ${0.25 + (s / spirals) * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      } else if (mode === "refraction") {
        const gridStep = isMobile ? 40 : 30;
        for (let x = 30; x < width; x += gridStep) {
          for (let y = 30; y < height; y += gridStep) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const warp = Math.sin(dist * 0.03 - time * 2) * (12 * intensityMod);

            ctx.beginPath();
            ctx.arc(x + (dx / (dist || 1)) * warp, y + (dy / (dist || 1)) * warp, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, 0.45)`;
            ctx.fill();
          }
        }
      } else if (mode === "echo") {
        const echoes = isMobile ? 5 : 8;
        for (let e = 0; e < echoes; e++) {
          const radius = (Math.sin(time * 0.5 + e * 0.5) * 0.5 + 0.5) * (Math.min(width, height) * 0.38) * intensityMod;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(5, radius), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgb}, ${0.15 + (1 - e / echoes) * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.life})`;
        ctx.fill();

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mode, resonanceIntensity]);

  return (
    <section id="experiment" className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60 mb-3 sm:mb-4">
            <FlaskConical className="w-3 h-3 text-purple-400" />
            <span>INTERACTIVE LABORATORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Experimental Mirror Sandbox
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-white/50 max-w-xl leading-relaxed">
            Distort the digital fabric, oscillate harmonic vectors, and trigger quantum energy bursts.
          </p>
        </div>

        <button
          onClick={triggerQuantumBurst}
          className="btn btn-outline rounded-2xl border-white/20 text-white hover:bg-white/10 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xl w-full sm:w-auto justify-center min-h-[44px]"
          id="quantum-burst-btn"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Trigger Quantum Burst ({bursts})</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-white/15 shadow-2xl space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono text-white/50 uppercase mr-1 sm:mr-2">Mode:</span>
            {["vortex", "refraction", "echo"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all cursor-pointer min-h-[36px] ${
                  mode === m
                    ? "bg-white/20 text-white border border-white/40 shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase whitespace-nowrap">Flux:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={resonanceIntensity}
                onChange={(e) => setResonanceIntensity(Number(e.target.value))}
                className="range range-xs range-primary flex-1 sm:w-28 cursor-pointer"
              />
              <span className="text-xs font-mono text-white/80 w-8 text-right">{resonanceIntensity}%</span>
            </div>
          </div>
        </div>

        <div className="relative h-[240px] sm:h-[320px] md:h-[380px] lg:h-[440px] 2xl:h-[500px] w-full bg-[#05060b] rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.06]">
          <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair touch-none" />
        </div>
      </div>
    </section>
  );
}
