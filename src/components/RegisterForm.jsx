import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Bo'sh", color: "#64748b" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 30, label: "Oddiy", color: "#f43f5e" };
    if (score <= 4) return { score: 70, label: "Yaxshi", color: "#f59e0b" };
    return { score: 100, label: "Juda kuchli", color: "#10b981" };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError(null);
    setConfirmationNotice(false);

    const cleanEmail = email.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setClientError("Iltimos, to'g'ri email manzil kiriting (masalan: ismingiz@email.com).");
      return;
    }

    if (!password || password.length < 6) {
      setClientError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (password !== confirmPassword) {
      setClientError("Kiritilgan parollar bir-biriga mos kelmadi.");
      return;
    }

    const res = await register({
      email: cleanEmail,
      password,
      confirmPassword,
    });

    if (res.success) {
      if (res.session) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setConfirmationNotice(true);
      }
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
            <span>INITIATE IDENTITY MATRIX</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            CREATE YOUR REFLECTION
          </h1>

          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            Ro&apos;yxatdan o&apos;ting va Mirror Internet dunyosiga kiring.
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

        {confirmationNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 leading-relaxed"
          >
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Akkaunt yaratildi!</span>
            </div>
            <p>
              Supabase emailingizga tasdiqlash xati yubordi. Xatingizdagi havolani bosing yoki Supabase panelida <strong>Confirm email</strong> sozlamasini o&apos;chirib to&apos;g&apos;ridan-to&apos;g&apos;ri kiring.
            </p>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-success bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs py-2.5 rounded-2xl"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Akkaunt yaratildi! Mirror Internetga kiritilmoqda...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="block text-xs font-mono text-white/70 tracking-wider uppercase"
            >
              Email Manzil
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="register-email"
                name="mirror_reg_email"
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
            <label
              htmlFor="register-password"
              className="block text-xs font-mono text-white/70 tracking-wider uppercase"
            >
              Parol
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="register-password"
                name="mirror_reg_password"
                type="password"
                placeholder="kamida 6 ta belgi"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isSuccess}
                className="input input-bordered w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-white/20"
              />
            </div>

            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/40">KUCHLILIK DARAJASI:</span>
                  <span style={{ color: passwordStrength.color }} className="font-semibold">
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="register-confirm-password"
              className="block text-xs font-mono text-white/70 tracking-wider uppercase"
            >
              Parolni Tasdiqlang
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="register-confirm-password"
                name="mirror_reg_confirm_password"
                type="password"
                placeholder="parolni qayta kiriting"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || isSuccess}
                className="input input-bordered w-full glass-input rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="btn btn-primary w-full rounded-2xl text-xs font-mono uppercase tracking-[0.2em] text-white shadow-xl mt-4 flex items-center justify-center gap-2 cursor-pointer"
            id="register-submit-btn"
          >
            {isLoading ? "INITIALIZING..." : "CREATE ACCOUNT"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-white/50">
            Akkauntingiz bormi?{" "}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-4 cursor-pointer"
              >
                Kirish (Login)
              </button>
            ) : (
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-4 cursor-pointer"
                id="register-to-login-link"
              >
                Kirish (Login)
              </Link>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
