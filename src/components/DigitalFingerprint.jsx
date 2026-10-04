import React, { useRef, useEffect, useState } from "react";
import { useMouseInteraction } from "../hooks/useMouseInteraction";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { Fingerprint, Copy, Check, Download } from "lucide-react";

export function DigitalFingerprint() {
  const canvasRef = useRef(null);
  const mouse = useMouseInteraction();
  const { fingerprintVector, fingerprintHash, rawData, archetype } = useInteractionProfile();
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fingerprintHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `mirror-fingerprint-${fingerprintHash}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    const size = 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let angleOffset = 0;
    const rgb = "99, 102, 241";

    const render = () => {
      angleOffset += 0.008 + (mouse.avgSpeed / 1200) * 0.02;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      const rings = 8;
      for (let r = 0; r < rings; r++) {
        const radius = 35 + r * 24;
        const nodes = 18 + r * 6;
        const vectorWeight = fingerprintVector[r % fingerprintVector.length] || 0.5;

        ctx.beginPath();
        for (let i = 0; i <= nodes; i++) {
          const theta = (i / nodes) * Math.PI * 2;
          const rotation = angleOffset * (r % 2 === 0 ? 1 : -1) * (1 + r * 0.1);
          const wave =
            Math.sin(theta * (3 + (r % 3)) + rotation + mouse.jitter * 5) *
            (10 + vectorWeight * 20 * (1 + mouse.speed / 500));

          const curRadius = radius + wave;
          const x = cx + Math.cos(theta) * curRadius;
          const y = cy + Math.sin(theta) * curRadius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        const alpha = 0.15 + (r / rings) * 0.6;
        ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
        ctx.lineWidth = r === rings - 1 ? 2 : 1;
        ctx.stroke();

        if (r % 2 === 0) {
          for (let i = 0; i < nodes; i += 3) {
            const theta = (i / nodes) * Math.PI * 2;
            const rotation = angleOffset * (r % 2 === 0 ? 1 : -1);
            const wave =
              Math.sin(theta * (3 + (r % 3)) + rotation) *
              (10 + vectorWeight * 20);
            const curRadius = radius + wave;
            const x = cx + Math.cos(theta) * curRadius;
            const y = cy + Math.sin(theta) * curRadius;

            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, 0.8)`;
            ctx.fill();
          }
        }
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 14 + Math.sin(angleOffset * 4) * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, 0.3)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${rgb}, 0.9)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [fingerprintVector, mouse.avgSpeed, mouse.jitter, mouse.speed]);

  return (
    <section className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        {/* Left Mandala Visual */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] 2xl:max-w-[480px] aspect-square rounded-full glass-panel border border-white/15 p-4 sm:p-6 flex items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none bg-indigo-600/30" />

            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain relative z-10 cursor-pointer"
              title="Touch or move cursor to perturb mandala harmonic rings"
            />

            <div className="absolute top-3 left-4 sm:top-4 sm:left-6 text-[9px] sm:text-[10px] font-mono text-white/40 tracking-wider sm:tracking-widest uppercase">
              DNA: {archetype}
            </div>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60">
            <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
            <span>TRANSIENT DIGITAL SIGNATURE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The Digital Fingerprint
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/60 leading-relaxed">
            Unlike static cryptographic keys, your Mirror Fingerprint is a living harmonic vector.
            It breathes with every millisecond of user presence—bending curves when you accelerate
            and radiating harmonic nodes when you interact.
          </p>

          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-widest">
                SESSION DNA HASH
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400">
                ● SEED ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-3 bg-white/[0.03] p-2.5 sm:p-3 rounded-xl border border-white/[0.06]">
              <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider truncate">
                {fingerprintHash}
              </span>
              <button
                onClick={handleCopyHash}
                className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/15 text-white transition-colors cursor-pointer shrink-0"
                title="Copy Signature Hash"
                id="copy-dna-hash-btn"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={handleDownload}
              className="btn btn-outline w-full sm:w-auto rounded-full text-xs font-mono uppercase tracking-wider text-white border-white/20 hover:bg-white/10 cursor-pointer min-h-[44px]"
              id="download-fingerprint-btn"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Download PNG Signature
            </button>

            <span className="text-[11px] sm:text-xs font-mono text-white/40 text-center sm:text-left">
              Perturbations: {rawData.clickCount + Math.round(rawData.avgSpeed / 100)} nodes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
