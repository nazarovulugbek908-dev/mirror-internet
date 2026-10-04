import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { Sparkles, KeyRound, UserPlus } from "lucide-react";

export function AuthGate() {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 relative z-10 select-none">
      {/* Top Welcome Indicator */}
      <div className="text-center max-w-md mx-auto mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md mb-2 sm:mb-3 text-[10px] sm:text-xs font-mono text-white/70">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
          <span>MIRROR INTERNET PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          AUTHENTICATE ACCESS
        </h1>
        <p className="text-[11px] sm:text-xs md:text-sm text-white/50 mt-1 sm:mt-1.5 px-2">
          Sign in or create your digital reflection to enter the living world.
        </p>
      </div>

      {/* Switcher Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md mb-6 sm:mb-8 font-mono text-[11px] sm:text-xs">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer min-h-[40px] ${
            activeTab === "login"
              ? "bg-indigo-600/40 text-white border border-indigo-500/50 shadow-lg font-bold"
              : "text-white/50 hover:text-white"
          }`}
          id="gate-tab-login"
        >
          <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Sign In</span>
        </button>

        <button
          onClick={() => setActiveTab("register")}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer min-h-[40px] ${
            activeTab === "register"
              ? "bg-indigo-600/40 text-white border border-indigo-500/50 shadow-lg font-bold"
              : "text-white/50 hover:text-white"
          }`}
          id="gate-tab-register"
        >
          <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Create Account</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
            </motion.div>
          ) : (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
