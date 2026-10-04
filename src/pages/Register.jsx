import React from "react";
import { RegisterForm } from "../components/RegisterForm";
import { Footer } from "../components/Footer";

export function Register() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-between pt-20 sm:pt-24 pb-8">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <RegisterForm />
      </div>
      <Footer />
    </div>
  );
}

