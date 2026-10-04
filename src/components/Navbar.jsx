import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useInteractionProfile } from "../hooks/useInteractionProfile";
import { 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Activity 
} from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { archetype, rawData } = useInteractionProfile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleClickOutside = () => setProfileDropdownOpen(false);
    setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/#experience" },
    { label: "Reflection", href: "/#reflection" },
    { label: "Sandbox", href: "/#experiment" },
    { label: "About", href: "/#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050508]/85 backdrop-blur-xl border-b border-white/[0.08] py-2.5 sm:py-3.5 shadow-2xl"
          : "bg-transparent py-3 sm:py-6"
      }`}
      style={{ paddingTop: `max(${scrolled ? '0.625rem' : '0.75rem'}, env(safe-area-inset-top))` }}
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 sm:gap-3 text-white font-mono tracking-widest text-base sm:text-lg font-bold shrink-0"
          id="nav-brand-logo"
        >
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.05] border border-white/15 group-hover:border-white/40 transition-colors">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight tracking-[0.2em] sm:tracking-[0.25em] text-white/95 group-hover:text-white transition-colors text-sm sm:text-base">
              MIRROR
            </span>
            <span className="text-[8px] sm:text-[9px] text-white/40 tracking-[0.3em] sm:tracking-[0.35em] font-sans uppercase">
              Internet
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) - Visible when authenticated */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3 lg:px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 lg:px-4 py-1.5 text-[10px] lg:text-xs uppercase tracking-wider font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300 rounded-full whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Live Persona Badge */}
          <div className="flex items-center gap-2 px-2.5 lg:px-3 py-1 rounded-full text-[10px] lg:text-[11px] font-mono border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md">
            <Activity className="w-3 h-3 animate-pulse text-indigo-400" />
            <span className="font-semibold tracking-wider">{archetype}</span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen((prev) => !prev);
                }}
                className="flex items-center gap-2 lg:gap-2.5 px-2.5 lg:px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/15 hover:border-white/30 text-white transition-all text-xs font-mono cursor-pointer"
                id="nav-profile-btn"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white bg-indigo-600">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="font-medium max-w-[80px] lg:max-w-[100px] truncate">{user.username}</span>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/15"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                        Digital Entity
                      </p>
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/80 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors min-h-[40px]"
                      id="nav-dropdown-profile-link"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Reflection Profile
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-left min-h-[40px]"
                      id="nav-dropdown-logout-btn"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                to="/login"
                className="px-3 lg:px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors min-h-[36px] flex items-center"
                id="nav-login-link"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-sm rounded-full btn-outline border-white/20 text-white hover:bg-white/10 text-xs font-mono uppercase tracking-wider min-h-[36px]"
                id="nav-register-link"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2.5 text-white/80 hover:text-white rounded-lg bg-white/[0.05] border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Toggle navigation menu"
          id="nav-mobile-toggle"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer - Full screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 top-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 right-0 top-0 z-50 glass-panel border-b border-white/10 shadow-2xl overflow-y-auto"
              style={{
                maxHeight: "100dvh",
                paddingTop: "env(safe-area-inset-top, 0px)",
              }}
            >
              {/* Mobile header with close button */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06]">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-white font-mono tracking-widest font-bold"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                  <span className="text-sm tracking-[0.2em]">MIRROR</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 text-white/80 hover:text-white rounded-lg bg-white/[0.05] border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 px-4 sm:px-6 py-4">
                {/* Live persona indicator */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Reflection: {archetype}</span>
                  </div>
                  <span className="text-[10px] text-white/60">{Math.round(rawData.avgSpeed)} px/s</span>
                </div>

                {/* Nav links */}
                {user &&
                  navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors min-h-[44px] flex items-center"
                    >
                      {link.label}
                    </a>
                  ))}

                {/* Auth section */}
                <div className="pt-3 mt-1 border-t border-white/10 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-indigo-400 bg-indigo-500/10 rounded-xl min-h-[48px]"
                      >
                        <UserIcon className="w-4 h-4" />
                        Profile ({user.username})
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 bg-rose-500/10 rounded-xl text-left cursor-pointer min-h-[48px]"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-3 text-center text-xs font-mono uppercase tracking-wider rounded-xl bg-white/[0.05] border border-white/10 text-white min-h-[48px] flex items-center justify-center"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-3 text-center text-xs font-mono uppercase tracking-wider rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 min-h-[48px] flex items-center justify-center"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
