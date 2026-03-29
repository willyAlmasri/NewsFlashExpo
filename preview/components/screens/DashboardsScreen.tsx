"use client";

import { useState } from "react";
import { TrendingUp, PieChart, BarChart3, Activity, Radio, Target, ArrowRight } from "lucide-react";
import { STATS, ALERTS, sentimentColor } from "@/lib/data";

const PERIODS = ["24h", "7d", "30d", "90d"];

const TILES = [
  { id: "sentiment", title: "Sentiment Trends", description: "Track sentiment over time", Icon: TrendingUp, color: "#8aa8ff" },
  { id: "sources", title: "Source Distribution", description: "Article volume by source", Icon: PieChart, color: "#00f700" },
  { id: "topics", title: "Topic Popularity", description: "Trending topics analysis", Icon: BarChart3, color: "#00eff0" },
  { id: "crisis", title: "Crisis Detection", description: "Anomaly monitoring", Icon: Activity, color: "#ff6b6b" },
  { id: "coverage", title: "Coverage Share", description: "Company coverage analysis", Icon: Radio, color: "#ff9f43" },
  { id: "performance", title: "Topic Performance", description: "Impact scoring", Icon: Target, color: "#8aa8ff" },
];

const activeCrisis = ALERTS.find((a) => a.severity === "CRITICAL" && !a.isResolved);
const topTrigger = ALERTS.find((a) => a.severity === "HIGH" && !a.isResolved);

function MiniLineChart({ color }: { color: string }) {
  const points = [40, 55, 45, 65, 52, 70, 60, 75, 68, 80, 72, 85];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min;
  const w = 280;
  const h = 80;
  const pts = points
    .map((v, i) => `${(i / (points.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`)
    .join(" ");
  const areaPath = `M ${pts.split(" ")[0]} L ${pts.split(" ").join(" L ")} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lineGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniBarChart() {
  const data = STATS.topSources.slice(0, 5);
  const max = data[0].count;
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((s, i) => (
        <div key={s.name} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm"
            style={{
              height: `${Math.round((s.count / max) * 100)}%`,
              backgroundColor: `#8aa8ff${i === 0 ? "ff" : "60"}`,
              minHeight: 4,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function DashboardsScreen() {
  const [period, setPeriod] = useState("7d");

  return (
    <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4" style={{ background: "#1a1a1a" }}>
      <div className="pt-4 pb-2 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">Analytics</h1>
      </div>

      {/* Period chips */}
      <div className="flex gap-2 mb-4">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: period === p ? "#8aa8ff20" : "#2e2e2e",
              color: period === p ? "#8aa8ff" : "#a0a0a0",
              border: `1px solid ${period === p ? "#8aa8ff50" : "transparent"}`,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats card */}
      <div className="bg-[#2e2e2e] rounded-xl p-4 mb-4 border border-[#333]">
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-[#f0f0f0] text-xl font-semibold" style={{ fontFamily: "var(--font-inconsolata)" }}>
              {STATS.totalArticles.toLocaleString()}
            </p>
            <p className="text-[9px] text-[#a0a0a0] uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>ARTICLES</p>
          </div>
          <div className="w-px bg-[#404040]" />
          <div className="text-center">
            <p className="text-xl font-semibold text-[#10b981]" style={{ fontFamily: "var(--font-inconsolata)" }}>
              +{STATS.avgSentiment.toFixed(1)}
            </p>
            <p className="text-[9px] text-[#a0a0a0] uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>AVG SENTIMENT</p>
          </div>
          <div className="w-px bg-[#404040]" />
          <div className="text-center">
            <p className="text-[#f0f0f0] text-xl font-semibold" style={{ fontFamily: "var(--font-inconsolata)" }}>
              {STATS.topSources.length}
            </p>
            <p className="text-[9px] text-[#a0a0a0] uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>SOURCES</p>
          </div>
        </div>
      </div>

      {/* Live Intelligence */}
      <div className="mb-4">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)" }}>
          Live Intelligence
        </p>
        {activeCrisis && (
          <div className="bg-[#2e2e2e] rounded-xl p-3.5 border border-[#ef444435] mb-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ef444414" }}>
                <Activity size={12} color="#ef4444" strokeWidth={2.2} />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#ef4444]" style={{ fontFamily: "var(--font-inter)" }}>ACTIVE CRISIS</span>
              </div>
              <ArrowRight size={14} color="#6b6b6b" strokeWidth={2} />
            </div>
            <p className="font-sans font-semibold text-sm text-[#f0f0f0] leading-snug mb-1">{activeCrisis.title}</p>
            <p className="text-xs text-[#a0a0a0] line-clamp-2" style={{ fontFamily: "var(--font-inter)" }}>{activeCrisis.message}</p>
          </div>
        )}
        {topTrigger && (
          <div className="bg-[#2e2e2e] rounded-xl p-3.5 border border-[#333]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#8aa8ff10" }}>
                <Radio size={12} color="#8aa8ff" strokeWidth={2.2} />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#8aa8ff]" style={{ fontFamily: "var(--font-inter)" }}>TOP TRIGGER</span>
              </div>
              <ArrowRight size={14} color="#6b6b6b" strokeWidth={2} />
            </div>
            <p className="font-sans font-semibold text-sm text-[#f0f0f0] leading-snug mb-1">{topTrigger.title}</p>
            <p className="text-xs text-[#a0a0a0] line-clamp-2" style={{ fontFamily: "var(--font-inter)" }}>{topTrigger.message}</p>
          </div>
        )}
      </div>

      {/* Sentiment chart card */}
      <div className="bg-[#2e2e2e] rounded-xl p-4 mb-3">
        <p className="text-[#8aa8ff] text-[9px] font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)" }}>
          SIGNAL TREND — {period}
        </p>
        <MiniLineChart color="#8aa8ff" />
        <div className="flex justify-between mt-2">
          <span className="text-[9px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>Mon</span>
          <span className="text-[9px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>Wed</span>
          <span className="text-[9px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>Fri</span>
          <span className="text-[9px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>Sun</span>
        </div>
      </div>

      {/* Coverage bar */}
      <div className="bg-[#2e2e2e] rounded-xl p-4 mb-4">
        <p className="text-[#8aa8ff] text-[9px] font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)" }}>
          TOP SOURCES
        </p>
        {STATS.topSources.map((s, i) => (
          <div key={s.name} className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#f0f0f0] w-24 shrink-0 truncate" style={{ fontFamily: "var(--font-inter)" }}>{s.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-[#3a3a3a] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(s.count / STATS.topSources[0].count) * 100}%`,
                  backgroundColor: `#8aa8ff${i === 0 ? "ff" : "70"}`,
                }}
              />
            </div>
            <span className="text-[10px] text-[#6b6b6b] w-7 text-right shrink-0" style={{ fontFamily: "var(--font-inconsolata)" }}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Dashboard tiles */}
      <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-inter)" }}>
        Dashboards
      </p>
      <div className="grid grid-cols-2 gap-2 pb-4">
        {TILES.map((tile) => (
          <div key={tile.id} className="bg-[#2e2e2e] rounded-xl p-3.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: tile.color + "18" }}>
              <tile.Icon size={18} color={tile.color} strokeWidth={1.8} />
            </div>
            <p className="font-sans font-semibold text-sm text-[#f0f0f0] leading-snug mb-1">{tile.title}</p>
            <p className="text-[10px] text-[#6b6b6b] leading-snug" style={{ fontFamily: "var(--font-inter)" }}>{tile.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
