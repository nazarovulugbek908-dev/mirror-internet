import React from "react";
import { Hero } from "../components/Hero";
import { MirrorExperience } from "../components/MirrorExperience";
import { DigitalReflection } from "../components/DigitalReflection";
import { InteractionTelemetry } from "../components/InteractionTelemetry";
import { DigitalFingerprint } from "../components/DigitalFingerprint";
import { HowItWorks } from "../components/HowItWorks";
import { ExperimentSection } from "../components/ExperimentSection";
import { AboutProject } from "../components/AboutProject";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="relative w-full overflow-hidden">
      <Hero />
      <MirrorExperience />
      <DigitalReflection />
      <InteractionTelemetry />
      <DigitalFingerprint />
      <HowItWorks />
      <ExperimentSection />
      <AboutProject />
      <Footer />
    </div>
  );
}
