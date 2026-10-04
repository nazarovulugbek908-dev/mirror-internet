import { useEffect, useState, useRef, useCallback } from "react";

export function useMouseInteraction() {
  const [state, setState] = useState({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    normalizedX: 0,
    normalizedY: 0,
    speed: 0,
    avgSpeed: 0,
    peakSpeed: 0,
    clicks: 0,
    clicksPerMinute: 0,
    scrollDepth: 0,
    scrollVelocity: 0,
    totalDistance: 0,
    idleDurationMs: 0,
    isIdle: false,
    jitter: 0.2,
    isTouch: false,
    prefersReducedMotion: false,
  });

  const prevPosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const prevAngleRef = useRef(null);
  const clickTimestampsRef = useRef([]);
  const lastActiveTimeRef = useRef(Date.now());
  const distanceRef = useRef(0);
  const peakSpeedRef = useRef(0);
  const avgSpeedRef = useRef(0);
  const jitterSamplesRef = useRef([]);
  const prevScrollRef = useRef({ top: 0, time: Date.now() });

  const recordActivity = useCallback(() => {
    lastActiveTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      setState((prev) => ({ ...prev, prefersReducedMotion: motionQuery.matches }));
    };
    updateReducedMotion();
    motionQuery.addEventListener("change", updateReducedMotion);

    prevPosRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      time: Date.now(),
    };

    const handlePointerMove = (e) => {
      recordActivity();
      let clientX = 0;
      let clientY = 0;
      let isTouch = false;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        isTouch = true;
      } else if (e.clientX !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const now = Date.now();
      const dt = Math.max((now - prevPosRef.current.time) / 1000, 0.008);
      const dx = clientX - prevPosRef.current.x;
      const dy = clientY - prevPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      distanceRef.current += dist;

      const currentSpeed = Math.min(dist / dt, 3500);
      avgSpeedRef.current = avgSpeedRef.current * 0.85 + currentSpeed * 0.15;
      if (currentSpeed > peakSpeedRef.current) {
        peakSpeedRef.current = currentSpeed;
      }

      if (dist > 3) {
        const currentAngle = Math.atan2(dy, dx);
        if (prevAngleRef.current !== null) {
          let angleDiff = Math.abs(currentAngle - prevAngleRef.current);
          if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
          const normalizedJitter = angleDiff / Math.PI;
          jitterSamplesRef.current.push(normalizedJitter);
          if (jitterSamplesRef.current.length > 20) jitterSamplesRef.current.shift();
        }
        prevAngleRef.current = currentAngle;
      }

      const avgJitter =
        jitterSamplesRef.current.length > 0
          ? jitterSamplesRef.current.reduce((a, b) => a + b, 0) / jitterSamplesRef.current.length
          : 0.2;

      prevPosRef.current = { x: clientX, y: clientY, time: now };

      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const normX = (clientX / w) * 2 - 1;
      const normY = (clientY / h) * 2 - 1;

      setState((prev) => ({
        ...prev,
        x: clientX,
        y: clientY,
        normalizedX: normX,
        normalizedY: normY,
        speed: currentSpeed,
        avgSpeed: avgSpeedRef.current,
        peakSpeed: peakSpeedRef.current,
        totalDistance: Math.round(distanceRef.current),
        jitter: avgJitter,
        isTouch,
        idleDurationMs: 0,
        isIdle: false,
      }));
    };

    const handleClick = () => {
      recordActivity();
      const now = Date.now();
      clickTimestampsRef.current.push(now);
      clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t < 60000);
      const cpm = clickTimestampsRef.current.length;

      setState((prev) => ({
        ...prev,
        clicks: prev.clicks + 1,
        clicksPerMinute: cpm,
        idleDurationMs: 0,
        isIdle: false,
      }));
    };

    const handleScroll = () => {
      recordActivity();
      const now = Date.now();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100) : 0;

      const dt = Math.max((now - prevScrollRef.current.time) / 1000, 0.01);
      const dScroll = Math.abs(scrollTop - prevScrollRef.current.top);
      const scrollVel = dScroll / dt;

      prevScrollRef.current = { top: scrollTop, time: now };

      setState((prev) => ({
        ...prev,
        scrollDepth: Math.round(depth),
        scrollVelocity: Math.round(scrollVel),
        idleDurationMs: 0,
        isIdle: false,
      }));
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const interval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActiveTimeRef.current;
      const isIdle = idleTime > 3500;

      avgSpeedRef.current = Math.max(0, avgSpeedRef.current * 0.9);
      clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t < 60000);
      const cpm = clickTimestampsRef.current.length;

      setState((prev) => ({
        ...prev,
        speed: isIdle ? 0 : prev.speed * 0.8,
        avgSpeed: avgSpeedRef.current,
        clicksPerMinute: cpm,
        idleDurationMs: idleTime,
        isIdle,
      }));
    }, 200);

    return () => {
      motionQuery.removeEventListener("change", updateReducedMotion);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [recordActivity]);

  return state;
}
