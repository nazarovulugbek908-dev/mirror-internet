# 🪞 MIRROR INTERNET

> *“The Internet changes when you do.”*

A modern, futuristic, experimental digital world built with **React.js (Vite)**, **JavaScript**, **Tailwind CSS**, and **DaisyUI**.

Rather than serving static interfaces, **MIRROR INTERNET** continuously calculates your interaction kinetics (cursor velocity, angular deflection/jitter, scroll cadence, dwell stillness, and click frequency) to mutate its visual atmosphere, particle fields, chromatic glow, and harmonic mandala in real-time.

---

## ✨ Features

- **Living Interaction Engine**: Real-time client-side calculation of cursor speed, acceleration, stillness factor, and movement entropy.
- **Session Personality Reflection**: Derives a dynamic archetype (`CALM`, `CURIOUS`, `FAST`, `EXPLORER`, `FOCUSED`, `CHAOTIC`) with live confidence ratings and multi-dimensional attribute matrix.
- **Generative Digital Fingerprint**: A live mathematical mandala and DNA signature vector (`MRR-XXXXXX`) that perturbs and evolves with your interaction. Exportable as high-resolution PNG.
- **Experimental Sandbox**: Interactive harmonic laboratory with Gravitational Vortex, Refraction Lens, and Quantum Burst particle simulations.
- **Cinematic Dark Glassmorphic Aesthetic**: Obsidian depth palette, custom cyber grids, delicate glowing borders, and reactive lighting.
- **Decoupled Auth Architecture**: Pure frontend abstraction layer (`useAuth`, `AuthProvider`, `MockAuthAdapter`) designed for immediate 1-step swap to **Supabase Auth** without modifying UI forms.
- **Fully Responsive & Accessible**: Optimized for mobile touch events and respecting `prefers-reduced-motion`.

---

## 🛠️ Technology Stack

- **Core**: React.js (v18) + JavaScript (ES Modules)
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + DaisyUI (Dark theme customized)
- **Animations**: Framer Motion + HTML5 Canvas RequestAnimationFrame physics
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Auth Layer**: Decoupled `MockAuthAdapter` (Supabase-Ready)

---

## 📁 Project Structure

```
src/
  ├── components/
  │   ├── Navbar.jsx
  │   ├── InteractiveBackground.jsx
  │   ├── Hero.jsx
  │   ├── MirrorExperience.jsx
  │   ├── DigitalReflection.jsx
  │   ├── InteractionTelemetry.jsx
  │   ├── DigitalFingerprint.jsx
  │   ├── HowItWorks.jsx
  │   ├── ExperimentSection.jsx
  │   ├── AboutProject.jsx
  │   ├── LoginForm.jsx
  │   ├── RegisterForm.jsx
  │   ├── ProfileDashboard.jsx
  │   └── Footer.jsx
  ├── pages/
  │   ├── Home.jsx
  │   ├── Login.jsx
  │   ├── Register.jsx
  │   └── Profile.jsx
  ├── hooks/
  │   ├── useAuth.js
  │   ├── useMouseInteraction.js
  │   └── useInteractionProfile.js
  ├── context/
  │   └── AuthContext.jsx
  ├── lib/
  │   ├── auth.js
  │   ├── interactionEngine.js
  │   └── utils.js
  ├── App.jsx
  ├── main.jsx
  └── index.css
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔐 Authentication Architecture & Supabase Integration

The authentication layer is decoupled from UI components:

- **Auth Adapter**: `src/lib/auth.js`
- **Context & Hook**: `src/context/AuthContext.jsx` & `src/hooks/useAuth.js`
- **UI Forms**: `src/components/LoginForm.jsx` & `src/components/RegisterForm.jsx`

### Demo Test Accounts

You can test authentication immediately using the 1-click buttons on `/login` or enter any credentials:

- **Explorer Demo**: `explorer@mirror.io` (Password: `password123`)
- **Calm Demo**: `calm@mirror.io` (Password: `password123`)

### Connecting to Supabase Auth (Later Step)

When you are ready to connect Supabase:
1. `npm install @supabase/supabase-js`
2. Replace `MockAuthAdapter` in `src/lib/auth.js` with calls to `supabase.auth.signInWithPassword` and `supabase.auth.signUp`.
3. No component or page code needs to be modified.
