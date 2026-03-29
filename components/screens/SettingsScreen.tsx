"use client";

import { useState } from "react";
import { User, Bell, Database, Globe, Shield, ChevronRight, LogOut, Moon, Zap } from "lucide-react";

const NOTIFICATION_OPTIONS = [
  { id: "critical", label: "Critical Alerts", description: "Immediate push notifications for CRITICAL severity", defaultOn: true },
  { id: "high", label: "High Priority", description: "Push for HIGH severity alerts", defaultOn: true },
  { id: "daily", label: "Daily Digest", description: "Morning summary of top stories", defaultOn: true },
  { id: "earnings", label: "Earnings Reports", description: "Notify on company earnings beats/misses", defaultOn: false },
  { id: "macro", label: "Macro Events", description: "Rate decisions, IMF releases, policy changes", defaultOn: true },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center rounded-full transition-colors shrink-0"
      style={{
        width: 38,
        height: 22,
        backgroundColor: on ? "#8aa8ff" : "#3a3a3a",
      }}
    >
      <span
        className="inline-block rounded-full bg-white transition-transform"
        style={{
          width: 16,
          height: 16,
          transform: on ? "translateX(18px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}

export default function SettingsScreen() {
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_OPTIONS.map((o) => [o.id, o.defaultOn]))
  );
  const [darkMode, setDarkMode] = useState(true);
  const [aiSummary, setAiSummary] = useState(true);

  const toggleNotif = (id: string) => setNotifs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="phone-scroll overflow-y-auto pb-6" style={{ background: "#1a1a1a", height: "100%" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="px-4 mb-5">
        <div className="bg-[#2e2e2e] rounded-xl p-4 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#8aa8ff20" }}
          >
            <User size={22} color="#8aa8ff" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans font-semibold text-[#f0f0f0]">Alex Johnson</p>
            <p className="text-[#6b6b6b] text-xs font-sans">alex@newsflash.io</p>
            <span
              className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded font-sans"
              style={{ backgroundColor: "#8aa8ff20", color: "#8aa8ff" }}
            >
              Pro Plan
            </span>
          </div>
          <ChevronRight size={16} color="#3a3a3a" />
        </div>
      </div>

      {/* App preferences */}
      <div className="px-4 mb-5">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-2 font-sans">Preferences</p>
        <div className="bg-[#2e2e2e] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#333]">
            <Moon size={16} color="#a0a0a0" strokeWidth={1.8} />
            <div className="flex-1">
              <p className="text-sm text-[#f0f0f0] font-sans font-medium">Dark Mode</p>
              <p className="text-[10px] text-[#6b6b6b] font-sans">App appearance</p>
            </div>
            <Toggle on={darkMode} onToggle={() => setDarkMode((v) => !v)} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Zap size={16} color="#a0a0a0" strokeWidth={1.8} />
            <div className="flex-1">
              <p className="text-sm text-[#f0f0f0] font-sans font-medium">AI Summaries</p>
              <p className="text-[10px] text-[#6b6b6b] font-sans">Auto-generate article briefs</p>
            </div>
            <Toggle on={aiSummary} onToggle={() => setAiSummary((v) => !v)} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="px-4 mb-5">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-2 font-sans">Notifications</p>
        <div className="bg-[#2e2e2e] rounded-xl overflow-hidden">
          {NOTIFICATION_OPTIONS.map((opt, i) => (
            <div
              key={opt.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < NOTIFICATION_OPTIONS.length - 1 ? "1px solid #333" : "none" }}
            >
              <Bell size={15} color="#a0a0a0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#f0f0f0] font-sans font-medium">{opt.label}</p>
                <p className="text-[10px] text-[#6b6b6b] font-sans leading-relaxed">{opt.description}</p>
              </div>
              <Toggle on={notifs[opt.id]} onToggle={() => toggleNotif(opt.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Data & privacy links */}
      <div className="px-4 mb-5">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-2 font-sans">Data & Privacy</p>
        <div className="bg-[#2e2e2e] rounded-xl overflow-hidden">
          {[
            { icon: Database, label: "Data Sources", sub: "Manage connected feeds" },
            { icon: Globe, label: "Region Settings", sub: "MENA · English" },
            { icon: Shield, label: "Privacy Policy", sub: "View terms & conditions" },
          ].map(({ icon: Icon, label, sub }, i) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
              style={{ borderBottom: i < 2 ? "1px solid #333" : "none" }}
            >
              <Icon size={16} color="#a0a0a0" strokeWidth={1.8} />
              <div className="flex-1">
                <p className="text-sm text-[#f0f0f0] font-sans font-medium">{label}</p>
                <p className="text-[10px] text-[#6b6b6b] font-sans">{sub}</p>
              </div>
              <ChevronRight size={14} color="#3a3a3a" />
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="px-4">
        <button className="w-full bg-[#2e2e2e] rounded-xl p-3.5 flex items-center justify-center gap-2 border border-[#ef444420]">
          <LogOut size={16} color="#ef4444" strokeWidth={2} />
          <span className="text-[#ef4444] font-sans font-medium text-sm">Sign Out</span>
        </button>
        <p className="text-center text-[#3a3a3a] text-[10px] font-sans mt-3">NewsFlash v2.1.0 · Build 2026.03</p>
      </div>
    </div>
  );
}
