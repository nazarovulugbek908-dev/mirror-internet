import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";

export function LoginForm({ onSwitchToRegister }) {
  const navigate = useNavigate();
  const { login, isLoading, error: authError, switchDemoUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError(null);

    if (!email.trim()) {
      setClientError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setClientError("Please enter a valid email format.");
      return;
    }

    if (!password) {
      setClientError("Please enter your password.");
      return;
    }

    const res = await login({ email: email.trim(), password });
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  const handleFillDemo = (index) => {
    switchDemoUser(index);
    setIsSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 400);
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
            Return to your digital reflection.
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
            <span>Authenticated. Entering Mirror Internet...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-mono text-white/60 tracking-wider uppercase"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="login-email"
                type="email"
                placeholder="explorer@mirror.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSuccess}
                className="input input-bordered w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-mono text-white/60 tracking-wider uppercase"
              >
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("For development demo: You can log in with any email and password or use the 1-click demo buttons below.");
                }}
                className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isSuccess}
                className="input input-bordered w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm"
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

        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center">
            Demo Instant Exploration
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo(0)}
              className="btn btn-sm btn-ghost bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-mono text-white/70 hover:text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Explorer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo(1)}
              className="btn btn-sm btn-ghost bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-mono text-white/70 hover:text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Calm Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-white/50">
            Don&apos;t have an account?{" "}
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-4 cursor-pointer"
              >
                Create one
              </button>
            ) : (
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-4 cursor-pointer"
                id="login-to-register-link"
              >
                Create one
              </Link>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
