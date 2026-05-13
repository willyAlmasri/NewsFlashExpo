"use client";

import { useState } from "react";
import { Plus, X, AlertTriangle, TrendingUp, DollarSign, Tag, Bell } from "lucide-react";
import { ALERTS, severityColor } from "@/lib/data";

type Filter = "All" | "Crisis" | "Active" | "Resolved";
type AlertItem = typeof ALERTS[number];

const TYPE_ICONS: Record<string, typeof AlertTriangle> = {
  crisis: AlertTriangle,
  macro: TrendingUp,
  earnings: DollarSign,
  brand_mention: Tag,
};

function AlertRow({ alert }: { alert: AlertItem }) {
  const color = severityColor(alert.severity);
  const Icon = TYPE_ICONS[alert.type] ?? Bell;
  return (
    <div className="bg-[#2e2e2e] rounded-xl p-3.5 flex gap-3 items-start">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon size={16} color={color} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{ color, backgroundColor: color + "18", fontFamily: "var(--font-inter)" }}
          >
            {alert.severity}
          </span>
          {alert.isResolved && (
            <span className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#3a3a3a] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>
              RESOLVED
            </span>
          )}
        </div>
        <p className="font-sans font-semibold text-sm text-[#f0f0f0] leading-snug mb-1.5">{alert.title}</p>
        <p className="text-xs text-[#a0a0a0] line-clamp-2 mb-2" style={{ fontFamily: "var(--font-inter)" }}>{alert.message}</p>
        <div className="flex flex-wrap gap-1.5">
          {alert.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[9px] px-2 py-0.5 rounded-full bg-[#3a3a3a] text-[#6b6b6b]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const FILTERS: Filter[] = ["All", "Crisis", "Active", "Resolved"];

export default function AlertsScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = ALERTS.filter((a) => {
    if (filter === "Crisis") return a.type === "crisis" || a.severity === "CRITICAL";
    if (filter === "Active") return !a.isResolved;
    if (filter === "Resolved") return a.isResolved;
    return true;
  });

  const activeCount = ALERTS.filter((a) => !a.isResolved).length;
  const criticalCount = ALERTS.filter((a) => a.severity === "CRITICAL" && !a.isResolved).length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#1a1a1a" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">Alerts</h1>
          <p className="text-[#6b6b6b] text-xs mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
            {activeCount} active{criticalCount > 0 ? ` | ${criticalCount} critical` : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "#8aa8ff" }}
        >
          <Plus size={18} color="#1a1a1a" strokeWidth={2.5} />
        </button>
      </div>

      {/* Segmented control */}
      <div className="px-4 pb-3">
        <div className="flex bg-[#252525] rounded-xl p-1 gap-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                backgroundColor: filter === f ? "#2e2e2e" : "transparent",
                color: filter === f ? "#f0f0f0" : "#6b6b6b",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
            style={{ borderColor: "#333", color: "#a0a0a0", fontFamily: "var(--font-inter)" }}
          >
            <span>Type: All Types</span>
          </div>
          <span className="text-[10px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>
            {filtered.length} showing
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4 flex flex-col gap-2">
        {filtered.map((alert) => <AlertRow key={alert.id} alert={alert} />)}
      </div>

      {/* Create sheet overlay */}
      {showCreate && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-[#1e1e1e] rounded-t-3xl p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-serif text-lg font-semibold text-[#f0f0f0]">Create Alert Rule</p>
              <button onClick={() => setShowCreate(false)}>
                <X size={20} color="#a0a0a0" />
              </button>
            </div>
            <p className="text-xs text-[#6b6b6b] mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              Define scope, delivery, and escalation without leaving the mobile workflow.
            </p>
            <div className="mb-3">
              <label className="text-[10px] font-medium text-[#a0a0a0] uppercase tracking-wider block mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>Rule Title</label>
              <input
                placeholder="CBE liquidity watch"
                className="w-full bg-[#252525] text-[#f0f0f0] text-sm rounded-xl px-3 py-2.5 outline-none placeholder-[#6b6b6b]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-medium text-[#a0a0a0] uppercase tracking-wider block mb-1.5" style={{ fontFamily: "var(--font-inter)" }}>Keywords</label>
              <input
                placeholder="CBE, liquidity, rates"
                className="w-full bg-[#252525] text-[#f0f0f0] text-sm rounded-xl px-3 py-2.5 outline-none placeholder-[#6b6b6b]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <p className="text-[10px] text-[#6b6b6b] mt-1" style={{ fontFamily: "var(--font-inter)" }}>Separate keywords with commas.</p>
            </div>
            <button
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#8aa8ff", color: "#1a1a1a", fontFamily: "var(--font-inter)" }}
              onClick={() => setShowCreate(false)}
            >
              Create alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
