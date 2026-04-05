"use client";

import { STATS, WATCHLIST, sentimentColor } from "@/lib/data";

function BarChart({ data }: { data: { name: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1.5 h-20 mt-3">
      {data.map((d) => (
        <div key={d.name} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[9px] text-[#a0a0a0] font-mono">{d.count}</span>
          <div
            className="w-full rounded-t"
            style={{
              height: `${Math.max(8, (d.count / max) * 52)}px`,
              backgroundColor: "#8aa8ff",
              opacity: 0.7 + 0.3 * (d.count / max),
            }}
          />
          <span className="text-[8px] text-[#6b6b6b] font-sans text-center leading-tight" style={{ maxWidth: 40 }}>
            {d.name.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 48;
  const h = 20;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const { sentimentBreakdown: sb } = STATS;
const total = sb.positive + sb.negative + sb.neutral;

export default function DashboardsScreen() {
  return (
    <div className="phone-scroll overflow-y-auto pb-6 px-4" style={{ background: "#1a1a1a", height: "100%" }}>
      <div className="pt-4 pb-2">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0]">Analytics</h1>
        <p className="text-[#6b6b6b] text-xs font-sans mt-0.5">MENA market intelligence overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: "Articles", value: STATS.totalArticles.toLocaleString() },
          { label: "Sources", value: "6" },
          { label: "Avg Score", value: `+${STATS.avgSentiment}` },
        ].map((m) => (
          <div key={m.label} className="bg-[#2e2e2e] rounded-xl p-3 text-center">
            <p className="text-[#f0f0f0] text-xl font-semibold font-mono">{m.value}</p>
            <p className="text-[#6b6b6b] text-[10px] font-sans mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Sentiment breakdown */}
      <div className="mt-4 bg-[#2e2e2e] rounded-xl p-4">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Sentiment Distribution</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-px mb-3">
          <div style={{ flex: sb.positive, backgroundColor: "#10b981", borderRadius: "6px 0 0 6px" }} />
          <div style={{ flex: sb.neutral, backgroundColor: "#eab308" }} />
          <div style={{ flex: sb.negative, backgroundColor: "#ef4444", borderRadius: "0 6px 6px 0" }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Positive", pct: sb.positive, color: "#10b981" },
            { label: "Neutral", pct: sb.neutral, color: "#eab308" },
            { label: "Negative", pct: sb.negative, color: "#ef4444" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-semibold font-mono" style={{ color: s.color }}>{s.pct}%</p>
              <p className="text-[10px] text-[#6b6b6b] font-sans">{s.label}</p>
              <p className="text-[9px] text-[#3a3a3a] font-mono">{Math.round((s.pct / total) * STATS.totalArticles).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top sources bar chart */}
      <div className="mt-4 bg-[#2e2e2e] rounded-xl p-4">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest font-sans">Top Sources</p>
        <BarChart data={STATS.topSources} />
      </div>

      {/* Trending topics */}
      <div className="mt-4 bg-[#2e2e2e] rounded-xl p-4">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Topic Pulse</p>
        <div className="flex flex-col gap-2.5">
          {STATS.trendingTopics.map((t, i) => {
            const maxT = STATS.trendingTopics[0].count;
            const pct = Math.round((t.count / maxT) * 100);
            const color = t.trend === "up" ? "#10b981" : t.trend === "down" ? "#ef4444" : "#eab308";
            return (
              <div key={t.topic}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6b6b6b] w-4 font-mono">{i + 1}</span>
                    <span className="text-xs font-medium text-[#f0f0f0] font-sans">{t.topic}</span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color }}>{t.count}</span>
                </div>
                <div className="h-1 rounded-full bg-[#3a3a3a] ml-6 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Watchlist sentiment */}
      <div className="mt-4 bg-[#2e2e2e] rounded-xl p-4">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Watchlist Sentiment</p>
        <div className="flex flex-col divide-y divide-[#2a2a2a]">
          {WATCHLIST.map((item) => {
            const sc = sentimentColor(item.sentiment);
            return (
              <div key={item.id} className="py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f0f0f0] truncate font-sans">{item.name}</p>
                  <p className="text-[10px] text-[#6b6b6b] font-sans">{item.articleCount} articles</p>
                </div>
                <SparkLine data={item.sparkData} color={sc} />
                <span className="text-xs font-semibold font-mono w-10 text-right shrink-0" style={{ color: sc }}>
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
