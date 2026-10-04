import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { formatTime } from "../lib/utils";
import {
  Fingerprint,
  History,
  Copy,
  Check,
  Sparkles,
  LogOut,
} from "lucide-react";

export function ProfileDashboard() {
  const { user, logout, switchDemoUser } = useAuth();
  const { archetype, details, rawData, fingerprintHash, entropyScore, reflectionConfidence } = useInteractionProfile();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("telemetry");

  const currentIdentity = user || {
    id: "guest_matrix_node",
    username: "Transient Observer",
    email: "guest.transient@mirror.io",
    createdAt: "2026-10-01T00:00:00Z",
    reflectionPersonality: archetype,
    interactionEntropy: entropyScore,
    totalSessions: 1,
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fingerprintHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockSessionHistory = [
    {
      id: "sess_099",
      date: "Today, Live Session",
      duration: formatTime(rawData.sessionDurationSec),
      archetype: archetype,
      avgSpeed: `${Math.round(rawData.avgSpeed)} px/s`,
      entropy: `${entropyScore}%`,
      status: "Active",
    },
    {
      id: "sess_098",
      date: "Yesterday, 22:40",
      duration: "08:14",
      archetype: "CALM",
      avgSpeed: "194 px/s",
      entropy: "22%",
      status: "Archived",
    },
    {
      id: "sess_097",
      date: "Oct 02, 14:15",
      duration: "14:32",
      archetype: "EXPLORER",
      avgSpeed: "420 px/s",
      entropy: "68%",
      status: "Archived",
    },
  ];

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 border-b border-white/10">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center font-bold text-xl sm:text-2xl text-black shadow-2xl relative shrink-0"
            style={{ backgroundColor: details.color }}
          >
            <span>{currentIdentity.username ? currentIdentity.username.charAt(0).toUpperCase() : "U"}</span>
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-md opacity-50 -z-10"
              style={{ backgroundColor: details.color }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white truncate">
                {currentIdentity.username}
              </h1>
              {user ? (
                <span className={`badge badge-sm font-mono text-[9px] sm:text-[10px] shrink-0 ${
                  user.isDemo ? "badge-warning" : "badge-success"
                }`}>
                  {user.isDemo ? "DEMO PREVIEW" : "SUPABASE AUTHENTICATED"}
                </span>
              ) : (
                <span className="badge badge-ghost badge-sm font-mono text-[9px] sm:text-[10px] shrink-0">
                  GUEST OBSERVER
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-white/50 mt-0.5 sm:mt-1 truncate">{currentIdentity.email}</p>
            {user?.id && !user?.isDemo && (
              <p className="text-[9px] font-mono text-white/30 truncate mt-0.5">UID: {user.id}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              to="/login"
              className="btn btn-primary btn-sm rounded-2xl text-xs font-mono uppercase tracking-wider w-full sm:w-auto justify-center min-h-[40px]"
            >
              Sign In to Save Reflection
            </Link>
          ) : (
            <button
              onClick={() => logout()}
              className="btn btn-outline btn-error btn-sm rounded-2xl text-xs font-mono flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center min-h-[40px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs - Scrollable on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 font-mono text-[11px] sm:text-xs border-b border-white/[0.06] pb-3 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
            activeTab === "telemetry"
              ? "bg-white/15 text-white border border-white/20 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Kinetic Telemetry
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
            activeTab === "history"
              ? "bg-white/15 text-white border border-white/20 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Session Archive
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
            activeTab === "settings"
              ? "bg-white/15 text-white border border-white/20 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          Reflection Settings
        </button>
      </div>

      {/* Tab 1: Live Telemetry */}
      {activeTab === "telemetry" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 md:gap-8">
          <div className="lg:col-span-7 glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/15 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-widest">
                ACTIVE DIGITAL PERSONALITY
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400">
                Confidence: {reflectionConfidence}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-tight"
                style={{ color: details.color }}
              >
                {archetype}
              </h2>
              <span className="text-[11px] sm:text-xs font-mono text-white/50">/ {details.tagline}</span>
            </div>

            <p className="text-[11px] sm:text-xs md:text-sm text-white/60 leading-relaxed">
              {details.description}
            </p>

            <div className="pt-4 border-t border-white/10 space-y-2.5 sm:space-y-3">
              {Object.entries(details.attributes || {}).map(([attr, val]) => (
                <div key={attr} className="space-y-1">
                  <div className="flex justify-between text-[11px] sm:text-xs font-mono">
                    <span className="capitalize text-white/70">{attr}</span>
                    <span className="text-white/40">{val}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-1.5"
                    value={val}
                    max="100"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-white/15 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-widest">
                  SIGNATURE HASH
                </span>
                <Fingerprint className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider truncate">
                  {fingerprintHash}
                </span>
                <button
                  onClick={handleCopyHash}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  id="profile-copy-hash-btn"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/40 block">DISTANCE</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">
                    {rawData.totalDistancePx.toLocaleString()} px
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/40 block">DWELL TIME</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">
                    {formatTime(rawData.sessionDurationSec)}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel-subtle rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-white/10 space-y-3">
              <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-widest block">
                Session Telemetry Stream
              </span>

              <div className="space-y-2 text-[11px] sm:text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-white/40">Current Speed:</span>
                  <span className="text-white font-semibold">{Math.round(rawData.cursorSpeed)} px/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-white/40">Smoothed Velocity:</span>
                  <span className="text-white font-semibold">{Math.round(rawData.avgSpeed)} px/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-white/40">Total Clicks:</span>
                  <span className="text-white font-semibold">{rawData.clickCount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/40">Entropy Score:</span>
                  <span className="text-amber-400 font-semibold">{entropyScore} / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: History */}
      {activeTab === "history" && (
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/15 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Historical Reflections</h3>
              <p className="text-[11px] sm:text-xs text-white/50 mt-1">
                Archived kinetic snapshots from past presence sessions.
              </p>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/40">3 Sessions Total</span>
          </div>

          <div className="space-y-3">
            {mockSessionHistory.map((sess) => (
              <div
                key={sess.id}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex flex-col gap-3 sm:gap-4 transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-mono text-xs text-indigo-400 shrink-0">
                    <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{sess.archetype}</span>
                      <span className="badge badge-ghost badge-xs font-mono">
                        {sess.status}
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-white/40 font-mono">{sess.date}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-[11px] sm:text-xs font-mono text-white/60 pl-11 sm:pl-[52px]">
                  <div>
                    <span className="text-white/30 block text-[9px] sm:text-[10px]">SPEED</span>
                    <span>{sess.avgSpeed}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block text-[9px] sm:text-[10px]">ENTROPY</span>
                    <span>{sess.entropy}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block text-[9px] sm:text-[10px]">DURATION</span>
                    <span>{sess.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Settings */}
      {activeTab === "settings" && (
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/15 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">System Calibration</h3>
            <p className="text-[11px] sm:text-xs text-white/50 mt-1">
              Adjust how the Mirror interprets your client-side interactions.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 pt-2">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/20 text-[11px] sm:text-xs text-white/70 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Supabase Live Auth Connected</span>
              </div>
              <p className="leading-relaxed">
                Authentication is powered by official <code className="text-indigo-200">@supabase/supabase-js</code> with active session persistence, secure token refresh, and real-time auth event listeners.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
