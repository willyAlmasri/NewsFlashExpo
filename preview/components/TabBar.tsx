"use client";

import { Newspaper, Search, Bell, BarChart3, Settings } from "lucide-react";
import type { Tab } from "@/app/page";

const TABS: { id: Tab; label: string; Icon: typeof Newspaper }[] = [
  { id: "today", label: "Today", Icon: Newspaper },
  { id: "browse", label: "Browse", Icon: Search },
  { id: "alerts", label: "Alerts", Icon: Bell },
  { id: "dashboards", label: "Analytics", Icon: BarChart3 },
  { id: "settings", label: "Settings", Icon: Settings },
];

export default function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <div
      className="flex items-center justify-around shrink-0 border-t"
      style={{
        backgroundColor: "#111111",
        borderColor: "#2a2a2a",
        paddingTop: 6,
        paddingBottom: 20,
        height: 74,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-0.5 cursor-pointer bg-transparent border-none"
            style={{ flex: 1, outline: "none" }}
          >
            <Icon
              size={22}
              color={active ? "#8aa8ff" : "#666666"}
              strokeWidth={active ? 2.2 : 1.9}
            />
            <span
              className="text-[10px] font-medium tracking-wide"
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                color: active ? "#8aa8ff" : "#666666",
                letterSpacing: "0.2px",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
