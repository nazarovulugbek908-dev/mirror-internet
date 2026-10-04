import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authAdapter, DEMO_USERS } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initSession() {
      try {
        const existingSession = await authAdapter.getSession();
        if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
        }
      } catch (err) {
        console.error("Failed to restore session", err);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAdapter.login(credentials);
      if (response.error || !response.user) {
        setError(response.error || "Authentication failed");
        return { success: false, error: response.error || "Authentication failed" };
      }
      const newSession = {
        user: response.user,
        token: `mock_jwt_${Math.random().toString(36).substring(2)}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };
      setUser(response.user);
      setSession(newSession);
      return { success: true };
    } catch (err) {
      const msg = err?.message || "An unexpected error occurred.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAdapter.register(credentials);
      if (response.error || !response.user) {
        setError(response.error || "Registration failed");
        return { success: false, error: response.error || "Registration failed" };
      }
      const newSession = {
        user: response.user,
        token: `mock_jwt_${Math.random().toString(36).substring(2)}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };
      setUser(response.user);
      setSession(newSession);
      return { success: true };
    } catch (err) {
      const msg = err?.message || "An unexpected error occurred.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authAdapter.logout();
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchDemoUser = useCallback((index) => {
    const demo = DEMO_USERS[index % DEMO_USERS.length];
    if (demo) {
      const newSession = {
        user: demo,
        token: `mock_demo_${demo.id}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };
      setUser(demo);
      setSession(newSession);
      if (typeof window !== "undefined") {
        localStorage.setItem("mirror_auth_session_mock", JSON.stringify(newSession));
      }
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
        switchDemoUser,
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
