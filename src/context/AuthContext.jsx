import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authAdapter, formatSupabaseUser } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Session Check from Supabase
    async function initSession() {
      try {
        const result = await authAdapter.getSession();
        if (!isMounted) return;

        if (result && result.session && result.user) {
          setSession(result.session);
          setUser(result.user);
        }
      } catch (err) {
        console.warn("[AuthContext] Initialization notice:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // 2. Listen to real Supabase Auth state events
    const subscription = authAdapter.onAuthStateChange((event, sbSession, formattedUser) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        if (sbSession && formattedUser) {
          setSession(sbSession);
          setUser(formattedUser);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      isMounted = false;
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = useCallback(async (credentials) => {
    if (isSubmittingRef.current) return { success: false };
    isSubmittingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAdapter.login(credentials);
      if (response.error || !response.user) {
        const errMsg = response.error || "Authentication failed. Please check your credentials.";
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(response.user);
      setSession(response.session);
      return { success: true, user: response.user };
    } catch (err) {
      const msg = err?.message || "An unexpected error occurred during login.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }, []);

  const register = useCallback(async (credentials) => {
    if (isSubmittingRef.current) return { success: false };
    isSubmittingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAdapter.register(credentials);
      if (response.error || !response.user) {
        const errMsg = response.error || "Registration failed. Please check your details.";
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(response.user);
      setSession(response.session);
      return { success: true, user: response.user, session: response.session };
    } catch (err) {
      const msg = err?.message || "An unexpected error occurred during registration.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authAdapter.logout();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.warn("[AuthContext] Logout notice:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
