"use client";

import { useState } from "react";
import {
  Newspaper,
  Search,
  Bell,
  BarChart2,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Star,
  Clock,
  Activity,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "today" | "browse" | "alerts" | "dashboards" | "settings";

interface Article {
  id: string;
  title: string;
  source: string;
  date: string;
  company: string;
  tag: string;
  sentiment: number;
  importance: number;
  summary: string;
}

interface AlertItem {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  message: string;
  source: string;
  createdAt: string;
  isResolved: boolean;
  type: string;
}

interface WatchlistItem {
  id: string;
  type: string;
  name: string;
  symbol?: string;
  sentiment: number;
  articleCount: number;
  sparkData: number[];
}

interface TrendingTopic {
  topic: string;
  count: number;
  trend: "up" | "down" | "stable";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  { id: "1", title: "Central Bank of Egypt Raises Interest Rates by 200 Basis Points", source: "Reuters", date: "2026-03-22T08:30:00Z", company: "CBE", tag: "Monetary Policy", sentiment: -2.3, importance: 9, summary: "The Central Bank of Egypt raised its overnight lending rate to 19.25%, citing persistent inflationary pressures and currency volatility." },
  { id: "2", title: "QNB Group Reports Record Q4 2025 Earnings, Beats Expectations", source: "Bloomberg", date: "2026-03-22T07:15:00Z", company: "QNB", tag: "Earnings", sentiment: 4.2, importance: 8, summary: "Qatar National Bank posted net profit of QR 4.8 billion in Q4, surpassing analyst estimates by 12%." },
  { id: "3", title: "Suez Canal Revenue Drops 40% Amid Red Sea Shipping Disruptions", source: "Financial Times", date: "2026-03-22T06:00:00Z", company: "SUEZ", tag: "Trade", sentiment: -3.8, importance: 10, summary: "Revenue from the Suez Canal fell dramatically as major shipping lines continue to reroute around the Cape of Good Hope." },
  { id: "4", title: "ADIB Launches AI-Powered Islamic Banking Platform", source: "TechCrunch", date: "2026-03-21T18:45:00Z", company: "ADIB", tag: "Technology", sentiment: 3.5, importance: 7, summary: "Abu Dhabi Islamic Bank unveils a new AI-driven digital banking experience, targeting younger demographics across the GCC." },
  { id: "5", title: "Telecom Egypt Signs $200M 5G Infrastructure Deal", source: "Mubasher", date: "2026-03-21T15:20:00Z", company: "Telecom Egypt", tag: "5G", sentiment: 2.8, importance: 7, summary: "Telecom Egypt partners with Ericsson to deploy 5G infrastructure across Cairo and Alexandria." },
  { id: "6", title: "Egyptian Pound Stabilizes After IMF Tranche Disbursement", source: "Alborsa News", date: "2026-03-21T12:00:00Z", company: "CBE", tag: "Macro", sentiment: 1.5, importance: 8, summary: "The Egyptian pound showed signs of stabilization following the IMF's latest $820M disbursement under the Extended Fund Facility." },
  { id: "7", title: "Saudi Aramco Eyes Expansion into Egyptian Downstream Market", source: "Reuters", date: "2026-03-21T09:30:00Z", company: "Aramco", tag: "Energy", sentiment: 2.1, importance: 6, summary: "Saudi Aramco is in advanced talks to acquire a stake in Egyptian refining assets as part of its downstream diversification strategy." },
  { id: "8", title: "Commercial International Bank Faces Regulatory Scrutiny", source: "Bloomberg", date: "2026-03-20T16:00:00Z", company: "CIB", tag: "Regulation", sentiment: -1.8, importance: 7, summary: "CIB is under review by Egyptian financial regulators over compliance concerns related to anti-money laundering procedures." },
];

const ALERTS: AlertItem[] = [
  { id: "a1", title: "Suez Canal Crisis - Revenue Collapse", severity: "CRITICAL", message: "Suez Canal revenue has dropped 40% due to Red Sea disruptions. Immediate market impact expected.", source: "System", createdAt: "2026-03-22T06:30:00Z", isResolved: false, type: "crisis" },
  { id: "a2", title: "CBE Interest Rate Hike - 200bps", severity: "HIGH", message: "Central Bank of Egypt raised rates by 200 basis points. Bond and equity markets may react significantly.", source: "Reuters", createdAt: "2026-03-22T08:45:00Z", isResolved: false, type: "macro" },
  { id: "a3", title: "QNB Record Earnings Beat", severity: "MEDIUM", message: "QNB Group posted record Q4 earnings, beating consensus by 12%. Positive sentiment expected for banking sector.", source: "Bloomberg", createdAt: "2026-03-22T07:30:00Z", isResolved: false, type: "earnings" },
  { id: "a4", title: "CIB Regulatory Review", severity: "HIGH", message: "Commercial International Bank is facing regulatory scrutiny over AML compliance. Stock may face downward pressure.", source: "Bloomberg", createdAt: "2026-03-20T16:30:00Z", isResolved: false, type: "regulatory" },
  { id: "a5", title: "Telecom Egypt 5G Partnership", severity: "LOW", message: "Telecom Egypt signed a $200M 5G deal with Ericsson. Long-term positive for the company.", source: "Mubasher", createdAt: "2026-03-21T15:45:00Z", isResolved: true, type: "deal" },
  { id: "a6", title: "EGP Stabilization Signal", severity: "MEDIUM", message: "Egyptian pound showing stability post-IMF disbursement. FX risk may be easing for MENA-exposed portfolios.", source: "System", createdAt: "2026-03-21T12:30:00Z", isResolved: true, type: "macro" },
];

const WATCHLIST: WatchlistItem[] = [
  { id: "w1", type: "company", name: "Commercial International Bank", symbol: "COMI.CA", sentiment: 1.2, articleCount: 24, sparkData: [1.0, 1.5, 1.2, 1.8, 1.4, 1.1, 1.2] },
  { id: "w2", type: "company", name: "QNB Group", symbol: "QNBK.QA", sentiment: 3.8, articleCount: 31, sparkData: [2.1, 2.5, 3.0, 3.2, 3.5, 3.6, 3.8] },
  { id: "w3", type: "company", name: "Telecom Egypt", symbol: "ETEL.CA", sentiment: 2.1, articleCount: 15, sparkData: [1.5, 1.8, 2.0, 1.9, 2.2, 2.0, 2.1] },
  { id: "w4", type: "sector", name: "MENA Banking", sentiment: 1.5, articleCount: 87, sparkData: [1.0, 1.2, 1.6, 1.3, 1.8, 1.4, 1.5] },
  { id: "w5", type: "market", name: "Egyptian Exchange (EGX)", sentiment: -0.3, articleCount: 42, sparkData: [0.5, 0.2, -0.1, 0.1, -0.2, -0.4, -0.3] },
];

const TRENDING: TrendingTopic[] = [
  { topic: "Interest Rates", count: 89, trend: "up" },
  { topic: "Red Sea Crisis", count: 76, trend: "up" },
  { topic: "Banking Earnings", count: 65, trend: "stable" },
  { topic: "5G Rollout", count: 43, trend: "up" },
  { topic: "IMF Program", count: 38, trend: "down" },
];

const SENTIMENT_BREAKDOWN = { positive: 42, negative: 28, neutral: 30 };
const TOP_SOURCES = [
  { name: "Reuters", count: 312 },
  { name: "Bloomberg", count: 289 },
  { name: "Alborsa News", count: 198 },
  { name: "Financial Times", count: 167 },
  { name: "Mubasher", count: 145 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sentimentColor(s: number) {
  if (s >= 2) return "#4ade80";
  if (s >= 0.5) return "#86efac";
  if (s > -0.5) return "#94a3b8";
  if (s > -2) return "#fca5a5";
  return "#f87171";
}

function sentimentLabel(s: number) {
  if (s >= 2) return "Positive";
  if (s >= 0.5) return "Slightly Positive";
  if (s > -0.5) return "Neutral";
  if (s > -2) return "Slightly Negative";
  return "Negative";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function severityConfig(severity: AlertItem["severity"]) {
  switch (severity) {
    case "CRITICAL": return { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: XCircle };
    case "HIGH": return { color: "#f97316", bg: "rgba(249,115,22,0.12)", icon: AlertTriangle };
    case "MEDIUM": return { color: "#eab308", bg: "rgba(234,179,8,0.12)", icon: Info };
    case "LOW": return { color: "#8aa8ff", bg: "rgba(138,168,255,0.12)", icon: CheckCircle };
  }
}

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 48, h = 20;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const last = data[data.length - 1];
  const stroke = last >= 0 ? "#4ade80" : "#f87171";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Screen: Today ────────────────────────────────────────────────────────────

function TodayScreen() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const avgSentiment = ARTICLES.reduce((a, b) => a + b.sentiment, 0) / ARTICLES.length;
  const posCount = ARTICLES.filter((a) => a.sentiment > 0.5).length;
  const negCount = ARTICLES.filter((a) => a.sentiment < -0.5).length;
  const neuCount = ARTICLES.length - posCount - negCount;

  if (selectedArticle) {
    return (
      <div className="flex flex-col h-full" style={{ background: "#111318" }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/5">
          <button onClick={() => setSelectedArticle(null)} className="text-[#8aa8ff] text-sm">← Back</button>
          <span className="text-[#6b7280] text-xs">{selectedArticle.source}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: "rgba(138,168,255,0.15)", color: "#8aa8ff" }}>{selectedArticle.tag}</span>
            <span className="text-xs text-[#4b5563]">{timeAgo(selectedArticle.date)}</span>
          </div>
          <h2 className="text-white font-semibold text-base leading-snug">{selectedArticle.title}</h2>
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sentimentColor(selectedArticle.sentiment) }} />
            <div>
              <p className="text-xs text-[#6b7280]">Sentiment Score</p>
              <p className="text-sm font-medium" style={{ color: sentimentColor(selectedArticle.sentiment) }}>
                {selectedArticle.sentiment > 0 ? "+" : ""}{selectedArticle.sentiment.toFixed(1)} — {sentimentLabel(selectedArticle.sentiment)}
              </p>
            </div>
          </div>
          <p className="text-[#9ca3af] text-sm leading-relaxed">{selectedArticle.summary}</p>
          <div className="p-3 rounded-xl" style={{ background: "rgba(138,168,255,0.06)", border: "1px solid rgba(138,168,255,0.15)" }}>
            <p className="text-xs text-[#8aa8ff] font-medium mb-1">Company / Entity</p>
            <p className="text-white text-sm">{selectedArticle.company}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-xs text-[#6b7280] mb-2">Importance Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${selectedArticle.importance * 10}%`, background: "#8aa8ff" }} />
              </div>
              <span className="text-white text-xs font-mono">{selectedArticle.importance}/10</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ background: "#111318" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[#6b7280] text-xs">Saturday, March 22</p>
            <h1 className="text-white text-xl font-semibold">Today</h1>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(138,168,255,0.1)", border: "1px solid rgba(138,168,255,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#8aa8ff] animate-pulse" />
            <span className="text-[#8aa8ff] text-xs font-mono">LIVE</span>
          </div>
        </div>
      </div>

      {/* Sentiment bar */}
      <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#9ca3af] text-xs">Market Sentiment</p>
          <p className="text-xs font-mono" style={{ color: sentimentColor(avgSentiment) }}>
            {avgSentiment > 0 ? "+" : ""}{avgSentiment.toFixed(2)}
          </p>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          <div style={{ width: `${(posCount / ARTICLES.length) * 100}%`, background: "#4ade80", borderRadius: 4 }} />
          <div style={{ width: `${(neuCount / ARTICLES.length) * 100}%`, background: "#6b7280", borderRadius: 4 }} />
          <div style={{ width: `${(negCount / ARTICLES.length) * 100}%`, background: "#f87171", borderRadius: 4 }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-[#4ade80]">{posCount} positive</span>
          <span className="text-[10px] text-[#9ca3af]">{neuCount} neutral</span>
          <span className="text-[10px] text-[#f87171]">{negCount} negative</span>
        </div>
      </div>

      {/* Trending topics */}
      <div className="px-4 mb-3">
        <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">Trending Topics</p>
        <div className="flex gap-2 flex-wrap">
          {TRENDING.map((t) => (
            <div key={t.topic} className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              {t.trend === "up" && <TrendingUp size={10} className="text-[#4ade80]" />}
              {t.trend === "down" && <TrendingDown size={10} className="text-[#f87171]" />}
              {t.trend === "stable" && <Minus size={10} className="text-[#9ca3af]" />}
              <span className="text-white text-[11px]">{t.topic}</span>
              <span className="text-[#6b7280] text-[10px]">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="px-4 mb-3">
        <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">Watchlist</p>
        <div className="space-y-2">
          {WATCHLIST.slice(0, 3).map((w) => (
            <div key={w.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{w.name}</p>
                {w.symbol && <p className="text-[#6b7280] text-[10px] font-mono">{w.symbol}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Sparkline data={w.sparkData} />
                <div className="text-right">
                  <p className="text-xs font-mono" style={{ color: sentimentColor(w.sentiment) }}>
                    {w.sentiment > 0 ? "+" : ""}{w.sentiment.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-[#6b7280]">{w.articleCount} arts.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Stories */}
      <div className="px-4 mb-4">
        <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">Top Stories</p>
        <div className="space-y-2">
          {ARTICLES.sort((a, b) => b.importance - a.importance).map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full text-left p-3 rounded-xl transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-white text-xs font-medium leading-snug flex-1">{article.title}</p>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: sentimentColor(article.sentiment) }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(138,168,255,0.12)", color: "#8aa8ff" }}>{article.tag}</span>
                <span className="text-[10px] text-[#6b7280]">{article.source}</span>
                <span className="text-[10px] text-[#4b5563]">{timeAgo(article.date)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Browse ───────────────────────────────────────────────────────────

function BrowseScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Banking", "Energy", "Technology", "Macro", "Trade"];
  const filtered = ARTICLES.filter((a) => {
    const matchesQuery = query === "" || a.title.toLowerCase().includes(query.toLowerCase()) || a.company.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "All" || a.tag === activeFilter || a.company === activeFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="flex flex-col" style={{ background: "#111318" }}>
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-white text-xl font-semibold mb-3">Browse</h1>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
          <Search size={14} className="text-[#6b7280]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, companies..."
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#4b5563]"
          />
        </div>
      </div>

      <div className="px-4 mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors"
            style={activeFilter === f
              ? { background: "#8aa8ff", color: "#0d0f14" }
              : { background: "rgba(255,255,255,0.06)", color: "#9ca3af" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 mb-2">
        <p className="text-[#6b7280] text-xs">{filtered.length} articles</p>
      </div>

      <div className="px-4 space-y-2 pb-4">
        {filtered.map((article) => (
          <div key={article.id} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-start gap-2 mb-1.5">
              <div className="flex-1">
                <p className="text-white text-xs font-medium leading-snug">{article.title}</p>
              </div>
              <div className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: "rgba(255,255,255,0.08)", color: sentimentColor(article.sentiment) }}>
                {article.sentiment > 0 ? "+" : ""}{article.sentiment.toFixed(1)}
              </div>
            </div>
            <p className="text-[#6b7280] text-[11px] leading-relaxed mb-2">{article.summary}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(138,168,255,0.1)", color: "#8aa8ff" }}>{article.tag}</span>
              <span className="text-[10px] text-[#4b5563]">{article.source}</span>
              <span className="text-[10px] text-[#374151]">{timeAgo(article.date)}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[#4b5563] text-sm">No articles match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: Alerts ───────────────────────────────────────────────────────────

function AlertsScreen() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const filtered = ALERTS.filter((a) => filter === "all" || (filter === "active" && !a.isResolved) || (filter === "resolved" && a.isResolved));

  return (
    <div className="flex flex-col" style={{ background: "#111318" }}>
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white text-xl font-semibold">Alerts</h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.12)" }}>
            <Bell size={11} className="text-[#f87171]" />
            <span className="text-[#f87171] text-xs">{ALERTS.filter((a) => !a.isResolved).length} active</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-3 flex gap-2">
        {(["all", "active", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-1 text-xs py-1.5 rounded-full capitalize transition-colors"
            style={filter === f
              ? { background: "#8aa8ff", color: "#0d0f14" }
              : { background: "rgba(255,255,255,0.06)", color: "#9ca3af" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-2 pb-4">
        {filtered.map((alert) => {
          const cfg = severityConfig(alert.severity);
          const Icon = cfg.icon;
          return (
            <div
              key={alert.id}
              className="p-3 rounded-xl"
              style={{ background: alert.isResolved ? "rgba(255,255,255,0.03)" : cfg.bg, border: `1px solid ${alert.isResolved ? "rgba(255,255,255,0.05)" : cfg.color + "33"}`, opacity: alert.isResolved ? 0.65 : 1 }}
            >
              <div className="flex items-start gap-2.5 mb-1.5">
                <Icon size={14} style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono font-bold" style={{ color: cfg.color }}>{alert.severity}</span>
                    {alert.isResolved && <span className="text-[10px] text-[#6b7280]">Resolved</span>}
                  </div>
                  <p className="text-white text-xs font-medium leading-snug">{alert.title}</p>
                </div>
              </div>
              <p className="text-[#9ca3af] text-[11px] leading-relaxed mb-2">{alert.message}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#4b5563]">{alert.source}</span>
                <span className="text-[10px] text-[#374151]">·</span>
                <span className="text-[10px] text-[#4b5563]">{timeAgo(alert.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Screen: Dashboards ───────────────────────────────────────────────────────

function DashboardsScreen() {
  const maxSource = Math.max(...TOP_SOURCES.map((s) => s.count));

  return (
    <div className="flex flex-col" style={{ background: "#111318" }}>
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-white text-xl font-semibold">Analytics</h1>
        <p className="text-[#6b7280] text-xs">Last 30 days</p>
      </div>

      {/* KPI cards */}
      <div className="px-4 grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Total Articles", value: "1,247", icon: Newspaper, color: "#8aa8ff" },
          { label: "Avg Sentiment", value: "+0.8", icon: Activity, color: "#4ade80" },
          { label: "Active Alerts", value: String(ALERTS.filter((a) => !a.isResolved).length), icon: Bell, color: "#f97316" },
          { label: "Sources", value: "7", icon: Star, color: "#eab308" },
        ].map((kpi) => (
          <div key={kpi.label} className="p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <kpi.icon size={14} style={{ color: kpi.color, marginBottom: 6 }} />
            <p className="text-white text-lg font-semibold font-mono">{kpi.value}</p>
            <p className="text-[#6b7280] text-[10px]">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Sentiment breakdown */}
      <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[#9ca3af] text-xs mb-3">Sentiment Breakdown</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-2">
          <div style={{ width: `${SENTIMENT_BREAKDOWN.positive}%`, background: "#4ade80", borderRadius: 4 }} />
          <div style={{ width: `${SENTIMENT_BREAKDOWN.neutral}%`, background: "#6b7280", borderRadius: 4 }} />
          <div style={{ width: `${SENTIMENT_BREAKDOWN.negative}%`, background: "#f87171", borderRadius: 4 }} />
        </div>
        <div className="flex justify-between">
          {[
            { label: "Positive", value: SENTIMENT_BREAKDOWN.positive, color: "#4ade80" },
            { label: "Neutral", value: SENTIMENT_BREAKDOWN.neutral, color: "#6b7280" },
            { label: "Negative", value: SENTIMENT_BREAKDOWN.negative, color: "#f87171" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-semibold" style={{ color: s.color }}>{s.value}%</p>
              <p className="text-[10px] text-[#6b7280]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top sources */}
      <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[#9ca3af] text-xs mb-3">Top Sources</p>
        <div className="space-y-2.5">
          {TOP_SOURCES.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <p className="text-white text-xs w-28 truncate">{s.name}</p>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${(s.count / maxSource) * 100}%`, background: "#8aa8ff" }} />
              </div>
              <p className="text-[#6b7280] text-[10px] font-mono w-7 text-right">{s.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending topics */}
      <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[#9ca3af] text-xs mb-3">Topic Pulse</p>
        <div className="space-y-2">
          {TRENDING.map((t) => (
            <div key={t.topic} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {t.trend === "up" && <TrendingUp size={11} className="text-[#4ade80]" />}
                {t.trend === "down" && <TrendingDown size={11} className="text-[#f87171]" />}
                {t.trend === "stable" && <Minus size={11} className="text-[#9ca3af]" />}
                <p className="text-white text-xs">{t.topic}</p>
              </div>
              <p className="text-[#6b7280] text-xs font-mono">{t.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────

function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}>
      {value
        ? <ToggleRight size={24} className="text-[#8aa8ff]" />
        : <ToggleLeft size={24} className="text-[#4b5563]" />
      }
    </button>
  );

  return (
    <div className="flex flex-col" style={{ background: "#111318" }}>
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-white text-xl font-semibold">Settings</h1>
      </div>

      {/* Profile */}
      <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #8aa8ff, #5c7aff)" }}>WA</div>
          <div>
            <p className="text-white text-sm font-medium">Willy Almasri</p>
            <p className="text-[#6b7280] text-xs">willy@newsflash.io</p>
          </div>
          <ChevronRight size={14} className="text-[#4b5563] ml-auto" />
        </div>
      </div>

      {/* Notifications */}
      <div className="px-4 mb-2">
        <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">Notifications</p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Push Notifications", sub: "Receive alerts on device", value: notifications, onToggle: () => setNotifications(!notifications) },
            { label: "Critical Alerts Only", sub: "Only severity: CRITICAL", value: criticalOnly, onToggle: () => setCriticalOnly(!criticalOnly) },
          ].map((row, i) => (
            <div key={row.label} className="flex items-center justify-between px-3 py-3" style={{ background: "rgba(255,255,255,0.04)", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div>
                <p className="text-white text-xs">{row.label}</p>
                <p className="text-[#6b7280] text-[10px]">{row.sub}</p>
              </div>
              <Toggle value={row.value} onToggle={row.onToggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="px-4 mb-2 mt-3">
        <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">Preferences</p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Dark Mode", sub: "Use dark theme", value: darkMode, onToggle: () => setDarkMode(!darkMode) },
            { label: "Auto-Refresh", sub: "Refresh news every 15 min", value: autoRefresh, onToggle: () => setAutoRefresh(!autoRefresh) },
          ].map((row, i) => (
            <div key={row.label} className="flex items-center justify-between px-3 py-3" style={{ background: "rgba(255,255,255,0.04)", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div>
                <p className="text-white text-xs">{row.label}</p>
                <p className="text-[#6b7280] text-[10px]">{row.sub}</p>
              </div>
              <Toggle value={row.value} onToggle={row.onToggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="px-4 mb-4 mt-3">
        <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">Account</p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {["Manage Watchlist", "Data Sources", "About NewsFlash", "Sign Out"].map((item, i) => (
            <button key={item} className="w-full flex items-center justify-between px-3 py-3 text-left" style={{ background: "rgba(255,255,255,0.04)", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <p className={`text-xs ${item === "Sign Out" ? "text-[#f87171]" : "text-white"}`}>{item}</p>
              {item !== "Sign Out" && <ChevronRight size={12} className="text-[#4b5563]" />}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[#374151] text-[10px] pb-4">NewsFlash v1.0.0 · MENA Financial Intelligence</p>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size: number; className?: string }> }[] = [
  { id: "today", label: "Today", Icon: Clock },
  { id: "browse", label: "Browse", Icon: Search },
  { id: "alerts", label: "Alerts", Icon: Bell },
  { id: "dashboards", label: "Analytics", Icon: BarChart2 },
  { id: "settings", label: "Settings", Icon: Settings },
];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex border-t" style={{ background: "#0d0f14", borderColor: "rgba(255,255,255,0.07)" }}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-opacity"
            style={{ opacity: isActive ? 1 : 0.4 }}
          >
            <Icon size={18} className={isActive ? "text-[#8aa8ff]" : "text-[#9ca3af]"} />
            <span className="text-[10px]" style={{ color: isActive ? "#8aa8ff" : "#9ca3af" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-[44px] overflow-hidden shadow-2xl"
      style={{
        width: 375,
        height: 680,
        background: "#0d0f14",
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-10" style={{ background: "#0d0f14", border: "2px solid rgba(255,255,255,0.08)", borderTop: "none" }} />
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-2 pb-1" style={{ background: "#0d0f14" }}>
        <span className="text-white text-[10px] font-mono">9:41</span>
        <div className="w-28" />
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 rounded-sm border border-white/40 flex items-center justify-end pr-0.5">
            <div className="w-2 h-1 rounded-sm bg-white/80" />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col" style={{ height: "calc(100% - 40px)" }}>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
    <main
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{ background: "#080a0f" }}
    >
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8aa8ff] animate-pulse" />
          <span className="text-[#8aa8ff] font-mono text-[11px] tracking-widest uppercase">Interactive Preview</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#8aa8ff] animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">NewsFlash</h1>
        <p className="text-[#4b5563] text-sm">MENA Financial Intelligence Platform</p>
      </div>

      <PhoneFrame>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {screens[activeTab]}
          </div>
          <TabBar active={activeTab} onChange={setActiveTab} />
        </div>
      </PhoneFrame>

      <p className="mt-5 text-[#1f2937] text-xs">Tap the tabs to navigate between screens</p>
    </main>
  );
}
