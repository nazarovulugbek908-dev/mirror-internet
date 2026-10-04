/**
 * MIRROR INTERNET - Supabase Authentication Adapter
 * 
 * Standard Email/Password Authentication:
 * - Register: supabase.auth.signUp({ email, password, options: { data: { username } } })
 * - Login: supabase.auth.signInWithPassword({ email, password })
 * - Logout: supabase.auth.signOut()
 * - Session: supabase.auth.getSession()
 * - Auth Listener: supabase.auth.onAuthStateChange()
 */

import { supabase } from "./supabase";

export function formatSupabaseUser(sbUser) {
  if (!sbUser) return null;
  return {
    id: sbUser.id,
    email: sbUser.email,
    username:
      sbUser.user_metadata?.username ||
      sbUser.user_metadata?.full_name ||
      sbUser.email?.split("@")[0] ||
      "Explorer",
    createdAt: sbUser.created_at || new Date().toISOString(),
    reflectionPersonality: sbUser.user_metadata?.reflectionPersonality || "EXPLORER",
    interactionEntropy: sbUser.user_metadata?.interactionEntropy || 50,
    totalSessions: sbUser.user_metadata?.totalSessions || 1,
    rawSupabaseUser: sbUser,
  };
}

function formatAuthError(error) {
  if (!error) return "An unexpected error occurred.";
  const msg = typeof error === "string" ? error : error.message || "";
  const lower = msg.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("429") || lower.includes("too many requests")) {
    return "Email yuborish limiti oshib ketdi (Rate limit). Iltimos, biroz kuting yoki mavjud akkauntingiz bilan to'g'ridan-to'g'ri Kirish (Login) qiling.";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Email yoki parol noto'g'ri. Iltimos, qaytadan tekshirib ko'ring.";
  }

  if (lower.includes("user already registered") || lower.includes("already exists")) {
    return "Bu email bilan avval ro'yxatdan o'tilgan. Iltimos, 'Kirish (Login)' tugmasini bosing.";
  }

  if (lower.includes("email not confirmed")) {
    return "Emailingiz tasdiqlanmagan. Iltimos, emailingizdagi havolani bosing yoki Supabase panelida 'Confirm email' sozlamasini o'chiring.";
  }

  return msg;
}

export class SupabaseAuthAdapter {
  constructor() {
    this._isSubmitting = false;
  }

  /**
   * Get the current active session from Supabase
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn("[Supabase Auth] getSession notice:", error.message);
        return null;
      }
      if (!data?.session) return null;

      return {
        session: data.session,
        user: formatSupabaseUser(data.session.user),
      };
    } catch (err) {
      console.warn("[Supabase Auth] getSession exception:", err);
      return null;
    }
  }

  /**
   * Standard Sign in with Email & Password
   */
  async login(credentials) {
    if (this._isSubmitting) {
      return { user: null, session: null, error: "Jarayon bajarilmoqda, kuting..." };
    }

    const email = (credentials.email || "").trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      return { user: null, session: null, error: "Iltimos, email va parolingizni kiriting." };
    }

    this._isSubmitting = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error: formatAuthError(error) };
      }

      const formattedUser = formatSupabaseUser(data.user);
      return {
        user: formattedUser,
        session: data.session,
        error: null,
      };
    } catch (err) {
      return {
        user: null,
        session: null,
        error: formatAuthError(err),
      };
    } finally {
      this._isSubmitting = false;
    }
  }

  /**
   * Standard Register a new user with Email and Password
   */
  async register(credentials) {
    if (this._isSubmitting) {
      return { user: null, session: null, error: "Jarayon bajarilmoqda, kuting..." };
    }

    const { username, email, password, confirmPassword } = credentials;

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split("@")[0] || "Explorer").trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { user: null, session: null, error: "Iltimos, to'g'ri email manzil kiriting." };
    }

    if (!password || password.length < 6) {
      return { user: null, session: null, error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak." };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { user: null, session: null, error: "Kiritilgan parollar bir-biriga mos kelmadi." };
    }

    this._isSubmitting = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            reflectionPersonality: "EXPLORER",
            interactionEntropy: 50,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: formatAuthError(error) };
      }

      const formattedUser = formatSupabaseUser(data.user);
      return {
        user: formattedUser,
        session: data.session,
        error: null,
      };
    } catch (err) {
      return {
        user: null,
        session: null,
        error: formatAuthError(err),
      };
    } finally {
      this._isSubmitting = false;
    }
  }

  /**
   * Sign out the active user
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("[Supabase Auth] signOut notice:", error.message);
      }
    } catch (err) {
      console.warn("[Supabase Auth] signOut exception:", err);
    }
  }

  /**
   * Subscribe to Supabase auth state changes
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const formattedUser = session?.user ? formatSupabaseUser(session.user) : null;
        callback(event, session, formattedUser);
      }
    );
    return subscription;
  }
}

export const authAdapter = new SupabaseAuthAdapter();
