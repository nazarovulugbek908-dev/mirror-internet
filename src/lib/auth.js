/**
 * MIRROR INTERNET - Authentication Abstraction Layer (JavaScript)
 * 
 * ARCHITECTURAL NOTICE:
 * This layer decouples authentication logic from UI components.
 * Currently uses a mock/in-memory adapter for preview and prototyping.
 * 
 * To connect Supabase Auth later:
 * 1. npm install @supabase/supabase-js
 * 2. Swap this mock adapter with supabase.auth methods without touching any UI code.
 */

export const DEMO_USERS = [
  {
    id: "usr_mirror_001",
    email: "explorer@mirror.io",
    username: "QuantumEcho",
    avatarUrl: "",
    createdAt: "2026-03-15T08:00:00Z",
    reflectionPersonality: "EXPLORER",
    interactionEntropy: 78,
    totalSessions: 14,
  },
  {
    id: "usr_mirror_002",
    email: "calm@mirror.io",
    username: "ZenWave",
    avatarUrl: "",
    createdAt: "2026-03-20T11:30:00Z",
    reflectionPersonality: "CALM",
    interactionEntropy: 24,
    totalSessions: 22,
  },
];

const STORAGE_KEY = "mirror_auth_session_mock";
const REGISTERED_USERS_KEY = "mirror_registered_users_mock";

export class MockAuthAdapter {
  getStoredUsers() {
    if (typeof window === "undefined") return DEMO_USERS;
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (stored) {
        return [...DEMO_USERS, ...JSON.parse(stored)];
      }
    } catch {
      // ignore
    }
    return DEMO_USERS;
  }

  saveNewUser(user) {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.push(user);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  async getSession() {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) return null;
      const session = JSON.parse(item);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  async login(credentials) {
    // Artificial latency for realistic async feel
    await new Promise((res) => setTimeout(res, 500));

    const email = (credentials.email || "").trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      return { user: null, error: "Please provide both email and password." };
    }

    const users = this.getStoredUsers();
    const matched = users.find((u) => u.email.toLowerCase() === email);

    if (!matched) {
      // Allow demo exploration with any valid email
      if (email.includes("@")) {
        const newUser = {
          id: `usr_${Math.random().toString(36).slice(2, 9)}`,
          email: email,
          username: email.split("@")[0],
          createdAt: new Date().toISOString(),
          reflectionPersonality: "CURIOUS",
          interactionEntropy: 50,
          totalSessions: 1,
        };
        this.saveSession(newUser);
        return { user: newUser, error: null };
      }
      return { user: null, error: "Invalid email or credentials." };
    }

    this.saveSession(matched);
    return { user: matched, error: null };
  }

  async register(credentials) {
    await new Promise((res) => setTimeout(res, 600));

    const { username, email, password, confirmPassword } = credentials;

    if (!username || username.trim().length < 3) {
      return { user: null, error: "Username must be at least 3 characters." };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { user: null, error: "Please enter a valid email address." };
    }

    if (!password || password.length < 6) {
      return { user: null, error: "Password must be at least 6 characters." };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { user: null, error: "Passwords do not match." };
    }

    const users = this.getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { user: null, error: "An account with this email already exists." };
    }

    const newUser = {
      id: `usr_${Math.random().toString(36).slice(2, 9)}`,
      email: email.trim().toLowerCase(),
      username: username.trim(),
      createdAt: new Date().toISOString(),
      reflectionPersonality: "EXPLORER",
      interactionEntropy: 45,
      totalSessions: 1,
    };

    this.saveNewUser(newUser);
    this.saveSession(newUser);

    return { user: newUser, error: null };
  }

  async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  saveSession(user) {
    if (typeof window === "undefined") return;
    const session = {
      user,
      token: `mock_jwt_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
  }
}

export const authAdapter = new MockAuthAdapter();
