/**
 * MIRROR INTERNET - Interaction Engine & Personality Analysis (JavaScript)
 */

export const ARCHETYPE_DEFINITIONS = {
  CALM: {
    name: "CALM",
    tagline: "Serene & Deliberate Observer",
    description: "Your movements are smooth, steady, and measured. You absorb the digital space with patient contemplation.",
    color: "#38bdf8", // Sky Blue
    glowRgb: "56, 189, 248",
    secondaryColor: "#818cf8",
    attributes: {
      stillness: 92,
      curiosity: 65,
      velocity: 25,
      exploration: 45,
      focus: 88,
      entropy: 18,
    },
  },
  CURIOUS: {
    name: "CURIOUS",
    tagline: "Inquisitive Digital Wanderer",
    description: "You probe interactive boundaries, hovering attentively over details and discovering concealed dimensions.",
    color: "#a855f7", // Purple
    glowRgb: "168, 85, 247",
    secondaryColor: "#ec4899",
    attributes: {
      stillness: 54,
      curiosity: 95,
      velocity: 58,
      exploration: 82,
      focus: 64,
      entropy: 48,
    },
  },
  FAST: {
    name: "FAST",
    tagline: "High-Velocity Navigator",
    description: "You sweep through the digital atmosphere with swift, decisive bursts, processing visual nodes at rapid tempo.",
    color: "#f59e0b", // Amber / Gold
    glowRgb: "245, 158, 11",
    secondaryColor: "#ef4444",
    attributes: {
      stillness: 22,
      curiosity: 70,
      velocity: 94,
      exploration: 78,
      focus: 60,
      entropy: 55,
    },
  },
  EXPLORER: {
    name: "EXPLORER",
    tagline: "Boundless Dimensional Cartographer",
    description: "You map the entire digital surface, traversing depths, scanning perimeters, and leaving no corner unexamined.",
    color: "#10b981", // Emerald
    glowRgb: "16, 185, 129",
    secondaryColor: "#06b6d4",
    attributes: {
      stillness: 40,
      curiosity: 90,
      velocity: 68,
      exploration: 98,
      focus: 75,
      entropy: 38,
    },
  },
  FOCUSED: {
    name: "FOCUSED",
    tagline: "Laser-Direct Architect",
    description: "Minimal excess motion. Every click and trajectory is purposeful, direct, and geometrically efficient.",
    color: "#6366f1", // Indigo
    glowRgb: "99, 102, 241",
    secondaryColor: "#3b82f6",
    attributes: {
      stillness: 72,
      curiosity: 50,
      velocity: 48,
      exploration: 50,
      focus: 96,
      entropy: 12,
    },
  },
  CHAOTIC: {
    name: "CHAOTIC",
    tagline: "Quantum Storm Catalyst",
    description: "Unpredictable, highly dynamic, and experimental. You push the mirror's harmonic boundaries with rapid fluctuations.",
    color: "#f43f5e", // Rose / Crimson
    glowRgb: "244, 63, 94",
    secondaryColor: "#d946ef",
    attributes: {
      stillness: 15,
      curiosity: 88,
      velocity: 90,
      exploration: 85,
      focus: 32,
      entropy: 94,
    },
  },
};

export function calculatePersonality(data) {
  const {
    avgSpeed = 0,
    clicksPerMinute = 0,
    scrollDepthPercentage = 0,
    idleDurationMs = 0,
    jitterFactor = 0.2,
    totalDistancePx = 0,
  } = data || {};

  // If idle for a while or low speed + low clicks -> CALM
  if (idleDurationMs > 4000 || (avgSpeed < 180 && clicksPerMinute < 8 && jitterFactor < 0.3)) {
    return "CALM";
  }

  // If high jitter + bursts of clicks + erratic speed -> CHAOTIC
  if (jitterFactor > 0.65 || (avgSpeed > 650 && clicksPerMinute > 25)) {
    return "CHAOTIC";
  }

  // If high speed but low jitter -> FAST
  if (avgSpeed > 500 && jitterFactor <= 0.65) {
    return "FAST";
  }

  // If deep scroll + moderate/high distance -> EXPLORER
  if (scrollDepthPercentage > 60 || totalDistancePx > 15000) {
    return "EXPLORER";
  }

  // If moderate speed, focused clicks, low jitter -> FOCUSED
  if (jitterFactor < 0.35 && clicksPerMinute > 4 && avgSpeed < 450) {
    return "FOCUSED";
  }

  // Default intuitive state
  return "CURIOUS";
}

export function generateFingerprintVector(data, personality) {
  const seedBase = (data.totalDistancePx || 0) + (data.clickCount || 0) * 137 + (data.sessionDurationSec || 0) * 43;
  const count = 16;
  const vector = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const wave = Math.sin(angle * 3 + seedBase * 0.001) * 0.5 + 0.5;
    const speedMod = Math.min((data.avgSpeed || 0) / 1000, 1) * 0.3;
    const jitterMod = (data.jitterFactor || 0.2) * 0.2;
    const value = Math.max(0.1, Math.min(1.0, wave * 0.6 + speedMod + jitterMod));
    vector.push(Number(value.toFixed(3)));
  }

  return vector;
}
