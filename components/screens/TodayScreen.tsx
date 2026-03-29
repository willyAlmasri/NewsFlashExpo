"use client";

import { Bell, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ARTICLES, ALERTS, WATCHLIST, STATS, timeAgo, sentimentColor } from "@/lib/data";

function SentimentDot({ val }: { val: number }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0 mt-0.5"
      style={{ backgroundColor: sentimentColor(val) }}
    />
  );
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 56;
  const h = 24;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TREND_META: Record<string, { label: string; Icon: typeof TrendingUp }> = {
  up: { label: "Rising", Icon: TrendingUp },
  down: { label: "Cooling", Icon: TrendingDown },
  stable: { label: "Holding", Icon: Minus },
};

const totalTopics = STATS.trendingTopics.reduce((s, t) => s + t.count, 0);
const maxCount = Math.max(...STATS.trendingTopics.map((t) => t.count));

const topics = STATS.trendingTopics.map((t, i) => ({
  ...t,
  rank: i + 1,
  share: Math.round((t.count / totalTopics) * 100),
  barPct: Math.max(14, Math.round((t.count / maxCount) * 100)),
}));

const criticalAlerts = ALERTS.filter((a) => a.severity === "CRITICAL" && !a.isResolved);

export default function TodayScreen() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="phone-scroll overflow-y-auto px-4 pb-6" style={{ background: "#1a1a1a", height: "100%" }}>
      {/* Header */}
      <div className="flex items-start justify-between pt-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">{greeting}, Alex</h1>
          <p className="text-[#6b6b6b] text-xs mt-0.5 font-sans">{todayStr}</p>
        </div>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#2e2e2e]">
          <Bell size={20} color="#a0a0a0" strokeWidth={1.8} />
        </button>
      </div>

      {/* Crisis Banner */}
      {criticalAlerts.length > 0 && (
        <div className="mt-3 rounded-xl border border-[#ef444440] bg-[#2e2e2e] p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} color="#ef4444" strokeWidth={2} />
            <span className="text-[#ef4444] text-[10px] font-semibold uppercase tracking-wider font-sans">Active Crisis</span>
          </div>
          <p className="text-[#f0f0f0] text-xs mt-1.5 leading-relaxed font-sans">{criticalAlerts[0].title}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="mt-5">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Key Metrics</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "ARTICLES TODAY", value: "1,247", trend: "+12.5%", up: true },
            { label: "AVG SENTIMENT", value: "+0.8", trend: "-3.2%", up: false },
            { label: "POSITIVE", value: "42%", trend: "+5.1%", up: true },
            { label: "SOURCES ACTIVE", value: "6", trend: "", up: true },
          ].map((m) => (
            <div key={m.label} className="bg-[#2e2e2e] rounded-xl p-3">
              <p className="text-[#6b6b6b] text-[9px] uppercase tracking-widest mb-1.5 font-sans">{m.label}</p>
              <p className="text-[#f0f0f0] text-xl font-semibold leading-tight font-mono">{m.value}</p>
              {m.trend && (
                <p className="text-[10px] mt-0.5 font-sans" style={{ color: m.up ? "#10b981" : "#ef4444" }}>{m.trend}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Bar */}
      <div className="mt-5">
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          <div style={{ flex: 42, backgroundColor: "#10b981", borderRadius: "6px 0 0 6px" }} />
          <div style={{ flex: 30, backgroundColor: "#eab308" }} />
          <div style={{ flex: 28, backgroundColor: "#ef4444", borderRadius: "0 6px 6px 0" }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] font-semibold text-[#10b981] font-sans">Pos 42%</span>
          <span className="text-[10px] font-semibold text-[#eab308] font-sans">Neu 30%</span>
          <span className="text-[10px] font-semibold text-[#ef4444] font-sans">Neg 28%</span>
        </div>
      </div>

      {/* Top Stories */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest font-sans">Top Stories</p>
          <span className="text-[#8aa8ff] text-xs font-sans">See all</span>
        </div>
        <div className="flex flex-col gap-2">
          {ARTICLES.slice(0, 5).map((a) => (
            <div key={a.id} className="bg-[#2e2e2e] rounded-xl p-3">
              <div className="flex items-start gap-2">
                <SentimentDot val={a.sentiment} />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-semibold text-[#f0f0f0] leading-snug line-clamp-2">{a.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[#8aa8ff] text-[10px] font-sans">{a.source}</span>
                    <span className="text-[#3a3a3a]">·</span>
                    <span className="text-[#6b6b6b] text-[10px] font-sans">{a.tag}</span>
                    <span className="text-[#3a3a3a]">·</span>
                    <span className="text-[#6b6b6b] text-[10px] font-sans">{timeAgo(a.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mt-5">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Trending Topics</p>

        {/* Lead topic */}
        {(() => {
          const lead = topics[0];
          const meta = TREND_META[lead.trend];
          const trendColor = lead.trend === "up" ? "#10b981" : lead.trend === "down" ? "#ef4444" : "#a0a0a0";
          return (
            <div className="bg-[#2e2e2e] rounded-xl p-4 mb-3 border border-[#333]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#8aa8ff] text-[9px] font-semibold uppercase tracking-widest font-sans">Lead Signal</span>
                <span className="text-[10px] text-[#6b6b6b] font-mono">{lead.share}% share</span>
              </div>
              <p className="font-serif text-xl font-semibold text-[#f0f0f0] mt-1 mb-3">{lead.topic}</p>
              <div className="flex gap-6 mb-3">
                <div>
                  <p className="text-[9px] text-[#6b6b6b] uppercase tracking-wider mb-0.5 font-sans">Coverage</p>
                  <p className="text-[#f0f0f0] text-lg font-semibold font-mono">{lead.count}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#6b6b6b] uppercase tracking-wider mb-0.5 font-sans">Momentum</p>
                  <div className="flex items-center gap-1">
                    <meta.Icon size={13} color={trendColor} strokeWidth={2.2} />
                    <span className="text-xs font-medium font-sans" style={{ color: trendColor }}>{meta.label}</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-[#3a3a3a] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${lead.barPct}%`, backgroundColor: trendColor }} />
              </div>
            </div>
          );
        })()}

        <div className="flex flex-col divide-y divide-[#2a2a2a]">
          {topics.slice(1).map((t) => {
            const meta = TREND_META[t.trend];
            const trendColor = t.trend === "up" ? "#10b981" : t.trend === "down" ? "#ef4444" : "#a0a0a0";
            return (
              <div key={t.topic} className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-[#6b6b6b] w-5 shrink-0 font-mono">{String(t.rank).padStart(2, "0")}</span>
                  <span className="font-sans font-semibold text-sm text-[#f0f0f0] flex-1">{t.topic}</span>
                  <div className="flex items-center gap-1">
                    <meta.Icon size={12} color={trendColor} strokeWidth={2.2} />
                    <span className="text-[10px] font-medium font-sans" style={{ color: trendColor }}>{meta.label}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1.5 pl-7">
                  <span className="text-xs text-[#a0a0a0] font-sans">{t.count} mentions</span>
                  <span className="text-xs text-[#6b6b6b] font-sans">{t.share}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#3a3a3a] ml-7 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.barPct}%`, backgroundColor: trendColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Watchlist Highlights */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest font-sans">Watchlist</p>
          <span className="text-[#8aa8ff] text-xs font-sans">See all</span>
        </div>
        <div className="flex flex-col gap-2">
          {WATCHLIST.slice(0, 4).map((item) => {
            const sc = sentimentColor(item.sentiment);
            return (
              <div key={item.id} className="bg-[#2e2e2e] rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm text-[#f0f0f0] truncate">{item.name}</p>
                  <p className="text-[10px] text-[#6b6b6b] mt-0.5 font-sans">{item.articleCount} articles</p>
                </div>
                <SparkLine data={item.sparkData} color={sc} />
                <span className="text-xs w-9 text-right shrink-0 font-mono" style={{ color: sc }}>
                  {item.sentiment > 0 ? "+" : ""}{item.sentiment.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
