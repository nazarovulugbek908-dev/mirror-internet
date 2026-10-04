import React from "react";
import { ProfileDashboard } from "../components/ProfileDashboard";
import { Footer } from "../components/Footer";

export function Profile() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1">
        <ProfileDashboard />
      </div>
      <Footer />
    </div>
  );
}
