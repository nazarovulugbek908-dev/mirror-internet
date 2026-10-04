import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export function AuthGate() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 relative z-10 select-none">
      {/* Form Container */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!isRegister ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <LoginForm onSwitchToRegister={() => setIsRegister(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <RegisterForm onSwitchToLogin={() => setIsRegister(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
