import { useState, useEffect, useMemo, useRef } from "react";
import { useMouseInteraction } from "./useMouseInteraction";
import {
  ARCHETYPE_DEFINITIONS,
  calculatePersonality,
  generateFingerprintVector,
} from "../lib/interactionEngine";
import { generateSeedHash } from "../lib/utils";

export function useInteractionProfile() {
  const mouse = useMouseInteraction();
  const [sessionDurationSec, setSessionDurationSec] = useState(0);
  const sessionStartRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDurationSec(Math.floor((Date.now() - sessionStartRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rawData = useMemo(() => {
    return {
      cursorSpeed: mouse.speed,
      avgSpeed: mouse.avgSpeed,
      peakSpeed: mouse.peakSpeed,
      clickCount: mouse.clicks,
      clicksPerMinute: mouse.clicksPerMinute,
      scrollDepthPercentage: mouse.scrollDepth,
      scrollVelocity: mouse.scrollVelocity,
      totalDistancePx: mouse.totalDistance,
      idleDurationMs: mouse.idleDurationMs,
      sessionDurationSec: sessionDurationSec,
      directionChanges: Math.round(mouse.jitter * 50),
      jitterFactor: mouse.jitter,
    };
  }, [mouse, sessionDurationSec]);

  const archetype = useMemo(() => {
    return calculatePersonality(rawData);
  }, [rawData]);

  const details = useMemo(() => {
    return ARCHETYPE_DEFINITIONS[archetype] || ARCHETYPE_DEFINITIONS.CURIOUS;
  }, [archetype]);

  const fingerprintVector = useMemo(() => {
    return generateFingerprintVector(rawData, archetype);
  }, [rawData, archetype]);

  const fingerprintHash = useMemo(() => {
    const rawString = `${archetype}_${rawData.totalDistancePx}_${rawData.clickCount}_${fingerprintVector.join("")}`;
    return `MRR-${generateSeedHash(rawString)}`;
  }, [archetype, rawData.totalDistancePx, rawData.clickCount, fingerprintVector]);

  const entropyScore = useMemo(() => {
    const speedPart = Math.min(rawData.avgSpeed / 800, 1) * 35;
    const clickPart = Math.min(rawData.clicksPerMinute / 30, 1) * 25;
    const jitterPart = rawData.jitterFactor * 40;
    return Math.round(Math.min(100, Math.max(5, speedPart + clickPart + jitterPart)));
  }, [rawData.avgSpeed, rawData.clicksPerMinute, rawData.jitterFactor]);

  const reflectionConfidence = useMemo(() => {
    const distanceWeight = Math.min(rawData.totalDistancePx / 5000, 1) * 45;
    const timeWeight = Math.min(sessionDurationSec / 60, 1) * 35;
    const clickWeight = Math.min(rawData.clickCount / 5, 1) * 20;
    return Math.round(distanceWeight + timeWeight + clickWeight);
  }, [rawData.totalDistancePx, sessionDurationSec, rawData.clickCount]);

  return {
    archetype,
    details,
    fingerprintVector,
    fingerprintHash,
    rawData,
    entropyScore,
    reflectionConfidence,
    mouse,
  };
}
