"use client";

import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Plus, Bell } from "lucide-react";
import { ALERTS, timeAgo, severityColor } from "@/lib/data";

const SEVERITY_ICON: Record<string, typeof AlertTriangle> = {
  CRITICAL: AlertTriangle,
  HIGH: AlertCircle,
  MEDIUM: Info,
  LOW: Bell,
};

const FILTER_TABS = ["All", "Active", "Resolved"];

export default function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = ALERTS.filter((a) => {
    if (activeFilter === "Active") return !a.isResolved;
    if (activeFilter === "Resolved") return a.isResolved;
    return true;
  });

  const active = ALERTS.filter((a) => !a.isResolved).length;
  const critical = ALERTS.filter((a) => a.severity === "CRITICAL" && !a.isResolved).length;

  return (
    <div className="phone-scroll overflow-y-auto pb-6" style={{ background: "#1a1a1a", height: "100%" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">Alerts</h1>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#8aa8ff]">
          <Plus size={18} color="#111" strokeWidth={2.5} />
        </button>
      </div>

      {/* Summary cards */}
      <div className="px-4 mb-4 flex gap-2">
        <div className="flex-1 bg-[#2e2e2e] rounded-xl p-3">
          <p className="text-[#6b6b6b] text-[9px] uppercase tracking-widest mb-1 font-sans">Active</p>
          <p className="text-[#f0f0f0] text-2xl font-semibold font-mono">{active}</p>
        </div>
        <div className="flex-1 bg-[#2e2e2e] rounded-xl p-3 border border-[#ef444430]">
          <p className="text-[#6b6b6b] text-[9px] uppercase tracking-widest mb-1 font-sans">Critical</p>
          <p className="text-2xl font-semibold font-mono" style={{ color: critical > 0 ? "#ef4444" : "#f0f0f0" }}>{critical}</p>
        </div>
        <div className="flex-1 bg-[#2e2e2e] rounded-xl p-3">
          <p className="text-[#6b6b6b] text-[9px] uppercase tracking-widest mb-1 font-sans">Total</p>
          <p className="text-[#f0f0f0] text-2xl font-semibold font-mono">{ALERTS.length}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 flex gap-1 bg-[#2e2e2e] rounded-xl p-1 mx-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors"
            style={{
              backgroundColor: activeFilter === tab ? "#3a3a3a" : "transparent",
              color: activeFilter === tab ? "#f0f0f0" : "#6b6b6b",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="px-4 flex flex-col gap-2">
        {filtered.map((alert) => {
          const color = severityColor(alert.severity);
          const Icon = SEVERITY_ICON[alert.severity] || Bell;
          return (
            <div
              key={alert.id}
              className="bg-[#2e2e2e] rounded-xl p-3 border"
              style={{
                borderColor: alert.isResolved ? "#2a2a2a" : `${color}30`,
                opacity: alert.isResolved ? 0.6 : 1,
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${color}20` }}
                >
                  {alert.isResolved
                    ? <CheckCircle size={14} color="#10b981" strokeWidth={2} />
                    : <Icon size={14} color={color} strokeWidth={2} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-sans font-semibold text-sm text-[#f0f0f0] leading-tight line-clamp-1">{alert.title}</p>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 font-sans"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[#a0a0a0] text-xs leading-relaxed font-sans line-clamp-2">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {alert.keywords.slice(0, 2).map((kw) => (
                      <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded font-sans" style={{ backgroundColor: "#3a3a3a", color: "#8aa8ff" }}>
                        {kw}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#6b6b6b] font-sans ml-auto">{timeAgo(alert.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
