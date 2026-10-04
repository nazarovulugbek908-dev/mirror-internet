import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setClientError("Iltimos, email manzilingizni kiriting.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setClientError("Iltimos, to'g'ri email format kiriting.");
      return;
    }

    if (!password) {
      setClientError("Iltimos, parolingizni kiriting.");
      return;
    }

    const res = await login({ email: cleanEmail, password });
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="absolute -inset-4 rounded-3xl blur-3xl opacity-20 pointer-events-none bg-indigo-600/30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/15 relative z-10 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-white/60 mb-2">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>MIRROR PORTAL ACCESS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WELCOME BACK
          </h1>

          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            O&apos;z profilingizga kiring va raqamli aksingizni davom ettiring.
          </p>
        </div>

        {(clientError || authError) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-error bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs py-2.5 rounded-2xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{clientError || authError}</span>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-success bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs py-2.5 rounded-2xl"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Tizimga kirildi! Mirror Internet ochilmoqda...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-mono text-white/70 tracking-wider uppercase"
            >
              Email Manzil
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="login-email"
                name="mirror_login_user_email"
                type="email"
                placeholder="ismingiz@email.com"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSuccess}
                className="input input-bordered w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-mono text-white/70 tracking-wider uppercase"
              >
                Parol
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="login-password"
                name="mirror_login_user_password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isSuccess}
                className="input input-bordered w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="btn btn-primary w-full rounded-2xl text-xs font-mono uppercase tracking-[0.2em] text-white shadow-xl mt-2 flex items-center justify-center gap-2 cursor-pointer"
            id="login-submit-btn"
          >
            {isLoading ? "CALIBRATING..." : "ENTER THE MIRROR"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-white/50">
            Akkauntingiz yo&apos;qmi?{" "}
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-4 cursor-pointer"
              >
                Ro&apos;yxatdan o&apos;tish
              </button>
            ) : (
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-4 cursor-pointer"
                id="login-to-register-link"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
