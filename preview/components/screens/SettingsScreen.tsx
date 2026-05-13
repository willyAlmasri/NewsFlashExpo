"use client";

import { useState } from "react";
import {
  Bell, Radio, Users, Info, LogOut, ChevronRight,
  Sun, Moon, Monitor, Shield, UserRound,
} from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-10 h-6 rounded-full relative transition-colors shrink-0"
      style={{ backgroundColor: value ? "#8aa8ff" : "#3a3a3a" }}
      role="switch"
      aria-checked={value}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
        style={{ transform: value ? "translateX(16px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function SettingsRow({
  Icon,
  label,
  value,
  danger,
  right,
  onClick,
}: {
  Icon: typeof Bell;
  label: string;
  value?: string;
  danger?: boolean;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full py-3 px-0 text-left"
      style={{ background: "none", border: "none" }}
    >
      <Icon size={18} color={danger ? "#ef4444" : "#a0a0a0"} strokeWidth={1.8} />
      <span
        className="flex-1 text-sm"
        style={{ fontFamily: "var(--font-inter)", color: danger ? "#ef4444" : "#f0f0f0" }}
      >
        {label}
      </span>
      {value && (
        <span className="text-[10px] text-[#6b6b6b] mr-2" style={{ fontFamily: "var(--font-inter)" }}>{value}</span>
      )}
      {right}
      {onClick && !right && <ChevronRight size={16} color="#6b6b6b" strokeWidth={1.8} />}
    </button>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-[#2e2e2e] rounded-xl px-4 divide-y divide-[#333]"
    >
      {children}
    </div>
  );
}

export default function SettingsScreen() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [pushNotifs, setPushNotifs] = useState(true);
  const [crisisAlerts, setCrisisAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [sessionLock, setSessionLock] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const THEME_OPTIONS: { key: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { key: "light", label: "Light", Icon: Sun },
    { key: "dark", label: "Dark", Icon: Moon },
    { key: "system", label: "System", Icon: Monitor },
  ];

  return (
    <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-6" style={{ background: "#1a1a1a" }}>
      <div className="pt-4 pb-4">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">Settings</h1>
      </div>

      {/* Profile */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mb-2" style={{ fontFamily: "var(--font-inter)" }}>PROFILE</p>
      <div className="bg-[#2e2e2e] rounded-xl p-4 mb-5 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#8aa8ff20" }}
        >
          <span className="font-serif text-xl font-semibold text-[#8aa8ff]">A</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-[#f0f0f0] text-sm">Alex Johnson</p>
          <p className="text-xs text-[#a0a0a0] mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>alex@company.com</p>
          <p className="text-[10px] mt-0.5 text-[#8aa8ff]" style={{ fontFamily: "var(--font-inter)" }}>Asset Manager</p>
          <p className="text-[9px] text-[#6b6b6b] mt-0.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>Africa/Cairo | English</p>
        </div>
        <ChevronRight size={16} color="#6b6b6b" />
      </div>

      {/* Appearance */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mb-2" style={{ fontFamily: "var(--font-inter)" }}>APPEARANCE</p>
      <div className="bg-[#2e2e2e] rounded-xl p-3 mb-5">
        <div className="flex gap-2">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTheme(opt.key)}
              className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-colors"
              style={{
                backgroundColor: theme === opt.key ? "#8aa8ff20" : "#3a3a3a",
                border: `1px solid ${theme === opt.key ? "#8aa8ff50" : "transparent"}`,
              }}
            >
              <opt.Icon size={16} color={theme === opt.key ? "#8aa8ff" : "#a0a0a0"} strokeWidth={2} />
              <span
                className="text-[10px] font-medium"
                style={{ color: theme === opt.key ? "#8aa8ff" : "#a0a0a0", fontFamily: "var(--font-inter)" }}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mb-2" style={{ fontFamily: "var(--font-inter)" }}>NOTIFICATIONS</p>
      <SectionCard>
        <SettingsRow Icon={Bell} label="Push Notifications" right={<Toggle value={pushNotifs} onChange={setPushNotifs} />} />
        <SettingsRow Icon={Bell} label="Crisis Alerts" right={<Toggle value={crisisAlerts} onChange={setCrisisAlerts} />} />
        <SettingsRow Icon={Bell} label="Daily Digest" right={<Toggle value={dailyDigest} onChange={setDailyDigest} />} />
      </SectionCard>

      {/* Delivery */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mt-5 mb-2" style={{ fontFamily: "var(--font-inter)" }}>DELIVERY</p>
      <div className="bg-[#2e2e2e] rounded-xl p-4 mb-5">
        <p className="text-xs font-medium text-[#a0a0a0] mb-0.5" style={{ fontFamily: "var(--font-inter)" }}>Channels</p>
        <p className="text-xs text-[#6b6b6b] mb-2.5" style={{ fontFamily: "var(--font-inter)" }}>push, email, in-app</p>
        <div className="flex gap-2 mb-4">
          {["Push", "Email", "In-App"].map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: "#8aa8ff20", color: "#8aa8ff", fontFamily: "var(--font-inter)" }}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="w-full h-px bg-[#333] mb-3" />
        <p className="text-xs font-medium text-[#a0a0a0] mb-0.5" style={{ fontFamily: "var(--font-inter)" }}>Severity Thresholds</p>
        <p className="text-xs text-[#6b6b6b] mb-2.5" style={{ fontFamily: "var(--font-inter)" }}>CRITICAL, HIGH</p>
        <div className="flex gap-2">
          {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s, i) => (
            <span
              key={s}
              className="px-2 py-1 rounded-full text-[9px] font-semibold uppercase"
              style={{
                backgroundColor: i < 2 ? "#8aa8ff20" : "#3a3a3a",
                color: i < 2 ? "#8aa8ff" : "#6b6b6b",
                fontFamily: "var(--font-inter)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Data */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mb-2" style={{ fontFamily: "var(--font-inter)" }}>DATA</p>
      <SectionCard>
        <SettingsRow Icon={Radio} label="Content Sources" onClick={() => {}} />
        <SettingsRow Icon={Users} label="User Management" onClick={() => {}} />
      </SectionCard>

      {/* Security */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mt-5 mb-2" style={{ fontFamily: "var(--font-inter)" }}>SECURITY</p>
      <SectionCard>
        <SettingsRow Icon={Shield} label="Session Lock" right={<Toggle value={sessionLock} onChange={setSessionLock} />} />
        <SettingsRow Icon={UserRound} label="Biometric Unlock" right={<Toggle value={biometric} onChange={setBiometric} />} />
      </SectionCard>

      {/* About */}
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b6b6b] mt-5 mb-2" style={{ fontFamily: "var(--font-inter)" }}>ABOUT</p>
      <SectionCard>
        <SettingsRow Icon={Info} label="App Version" value="1.0.0" />
      </SectionCard>

      {/* Sign out */}
      <div className="mt-5">
        <SectionCard>
          <SettingsRow Icon={LogOut} label="Sign Out" danger onClick={() => {}} />
        </SectionCard>
      </div>
    </div>
  );
}
