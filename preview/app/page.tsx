"use client";

import { useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import TodayScreen from "@/components/screens/TodayScreen";
import BrowseScreen from "@/components/screens/BrowseScreen";
import AlertsScreen from "@/components/screens/AlertsScreen";
import DashboardsScreen from "@/components/screens/DashboardsScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import TabBar from "@/components/TabBar";

export type Tab = "today" | "browse" | "alerts" | "dashboards" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  const screens: Record<Tab, React.ReactNode> = {
    today: <TodayScreen />,
    browse: <BrowseScreen />,
    alerts: <AlertsScreen />,
    dashboards: <DashboardsScreen />,
    settings: <SettingsScreen />,
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0e0e0e] py-10 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#8aa8ff] animate-pulse" />
          <span className="text-[#8aa8ff] font-mono text-xs tracking-widest uppercase">Live Preview</span>
          <div className="w-2 h-2 rounded-full bg-[#8aa8ff] animate-pulse" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[#f0f0f0] mb-1">NewsFlash</h1>
        <p className="text-[#6b6b6b] text-sm font-sans">MENA Financial Intelligence · iOS/Android App</p>
      </div>

      {/* Phone */}
      <PhoneFrame>
        <div className="flex flex-col h-full">
          <div className="flex-1 phone-scroll overflow-y-auto">
            {screens[activeTab]}
          </div>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </PhoneFrame>

      {/* Tab labels */}
      <p className="mt-6 text-[#3a3a3a] text-xs font-sans tracking-wide">
        Tap the tabs inside the phone to navigate between screens
      </p>
    </main>
  );
}
