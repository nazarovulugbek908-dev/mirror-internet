import React, { useEffect, useRef } from "react";
import { useMouseInteraction } from "../hooks/useMouseInteraction";

export function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouse = useMouseInteraction();
  
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, speed: 0, isIdle: false });
  const prevClicksRef = useRef(mouse.clicks);

  useEffect(() => {
    mouseRef.current = {
      x: mouse.x,
      y: mouse.y,
      speed: mouse.avgSpeed,
      isIdle: mouse.isIdle,
    };
  }, [mouse.x, mouse.y, mouse.avgSpeed, mouse.isIdle]);

  useEffect(() => {
    if (mouse.clicks > prevClicksRef.current) {
      // Fewer ripples on mobile
      const isMobile = window.innerWidth < 640;
      ripplesRef.current.push({
        x: mouse.x,
        y: mouse.y,
        radius: 5,
        maxRadius: isMobile ? 160 : 280,
        alpha: 0.6,
        speed: isMobile ? 3.5 : 4.5,
      });
      prevClicksRef.current = mouse.clicks;
    }
  }, [mouse.clicks, mouse.x, mouse.y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId;
    let width, height, dpr;

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    const initParticles = () => {
      const isMobile = width < 640;
      const isTablet = width < 1024;
      // Reduce particle count on mobile/tablet for performance
      let maxCount;
      if (isMobile) {
        maxCount = 40;
      } else if (isTablet) {
        maxCount = 70;
      } else {
        maxCount = 120;
      }
      const count = Math.min(Math.floor((width * height) / 14000), maxCount);
      const particles = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const baseAlpha = Math.random() * 0.4 + 0.15;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.8,
          alpha: baseAlpha,
          baseAlpha,
          hue: Math.random() * 40 + 210, // stable indigo/cyan
          layer: Math.random() > 0.6 ? 2 : 1,
        });
      }
      particlesRef.current = particles;
    };

    handleResize();

    // Constant, harmonious indigo/cyan theme that doesn't flash
    const activeColor = "99, 102, 241";

    const render = () => {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      // If user prefers reduced motion, skip most effects
      if (prefersReduced) {
        // Draw static particles only
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${activeColor}, ${p.baseAlpha * 0.5})`;
          ctx.fill();
        }
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const m = mouseRef.current;
      const speedNormalized = Math.min(m.speed / 1200, 1);
      const isMobile = width < 640;

      if (!m.isIdle && m.x > 0 && m.y > 0) {
        const glowRadius = (isMobile ? 150 : 250) + speedNormalized * (isMobile ? 80 : 150);
        const radialGrad = ctx.createRadialGradient(
          m.x,
          m.y,
          0,
          m.x,
          m.y,
          glowRadius
        );
        radialGrad.addColorStop(0, `rgba(${activeColor}, ${0.12 + speedNormalized * 0.08})`);
        radialGrad.addColorStop(0.5, `rgba(${activeColor}, ${0.03 + speedNormalized * 0.03})`);
        radialGrad.addColorStop(1, "rgba(5, 5, 8, 0)");

        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${activeColor}, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (r.radius > r.maxRadius || r.alpha < 0.01) {
          ripplesRef.current.splice(i, 1);
        }
      }

      const particles = particlesRef.current;
      const connectionDist = isMobile ? 70 : 110 + speedNormalized * 40;
      // On mobile, skip expensive connection lines for better perf
      const drawConnections = !isMobile;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const speedMultiplier = m.isIdle ? 0.3 : 1 + speedNormalized * 2.5;
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && !m.isIdle) {
          const force = (180 - dist) / 180;
          p.x -= (dx / dist) * force * (2 + speedNormalized * 4);
          p.y -= (dy / dist) * force * (2 + speedNormalized * 4);
          p.alpha = Math.min(p.baseAlpha + force * 0.6, 0.9);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + speedNormalized * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${activeColor}, ${p.alpha})`;
        // Disable shadowBlur on mobile for performance
        if (!isMobile && p.layer === 2) {
          ctx.shadowColor = `rgba(${activeColor}, 0.8)`;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (drawConnections) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const pdx = p.x - p2.x;
            const pdy = p.y - p2.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

            if (pdist < connectionDist) {
              const lineAlpha = (1 - pdist / connectionDist) * 0.18 * (m.isIdle ? 0.4 : 1);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${activeColor}, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient opacity-80 pointer-events-none" />
    </div>
  );
}
