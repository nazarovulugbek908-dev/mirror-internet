import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { InteractiveBackground } from "./components/InteractiveBackground";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { AuthGate } from "./pages/AuthGate";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-white font-mono text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-white/60 tracking-widest uppercase">
            Synchronizing Reflection Matrix...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Route: If authenticated -> Home, If NOT authenticated -> AuthGate */}
      <Route
        path="/"
        element={user ? <Home /> : <AuthGate />}
      />

      {/* Direct Login and Register routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Profile dashboard */}
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#050508] text-[#f0f0f5] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
          {/* Dynamic Reactive Canvas Particle Field */}
          <InteractiveBackground />

          {/* Minimalist Futuristic Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 w-full relative z-10">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
