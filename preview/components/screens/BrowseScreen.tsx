"use client";

import { useState } from "react";
import { Search, BookmarkPlus, TrendingUp, TrendingDown } from "lucide-react";
import { ARTICLES, WATCHLIST, sentimentColor, timeAgo } from "@/lib/data";

type Tab = "browse" | "watchlist";

const TAGS = ["All", "Banking", "Macro", "Earnings", "Technology", "Energy", "Trade", "M&A"];

export default function BrowseScreen() {
  const [tab, setTab] = useState<Tab>("browse");
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = ARTICLES.filter((a) => {
    const matchTag = activeTag === "All" || a.tag === activeTag || a.company.toLowerCase().includes(activeTag.toLowerCase());
    const matchQuery = !query || a.title.toLowerCase().includes(query.toLowerCase()) || a.company.toLowerCase().includes(query.toLowerCase());
    return matchTag && matchQuery;
  });

  return (
    <div className="flex flex-col h-full" style={{ background: "#1a1a1a" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-0">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0] mb-3">Browse</h1>

        {/* Swipe tabs */}
        <div className="flex border-b border-[#333]">
          {(["browse", "watchlist"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 pb-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                color: tab === t ? "#8aa8ff" : "#6b6b6b",
                borderColor: tab === t ? "#8aa8ff" : "transparent",
                background: "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "browse" ? (
        <div className="flex-1 overflow-y-auto phone-scroll">
          {/* Search */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2 bg-[#252525] rounded-xl px-3 py-2.5">
              <Search size={16} color="#6b6b6b" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, companies..."
                className="flex-1 bg-transparent text-[#f0f0f0] text-sm outline-none placeholder-[#6b6b6b]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>
          </div>

          {/* Tag chips */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  fontFamily: "var(--font-inter)",
                  backgroundColor: activeTag === tag ? "#8aa8ff20" : "#2e2e2e",
                  color: activeTag === tag ? "#8aa8ff" : "#a0a0a0",
                  border: `1px solid ${activeTag === tag ? "#8aa8ff50" : "transparent"}`,
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Articles */}
          <div className="px-4 flex flex-col gap-2 pb-4">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#6b6b6b] text-sm" style={{ fontFamily: "var(--font-inter)" }}>No articles found</p>
              </div>
            ) : (
              filtered.map((a) => {
                const sc = sentimentColor(a.sentiment);
                return (
                  <div key={a.id} className="bg-[#2e2e2e] rounded-xl p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1 self-stretch rounded-full shrink-0 mt-0.5" style={{ backgroundColor: sc }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-semibold text-[#f0f0f0] leading-snug line-clamp-2 mb-1.5">
                          {a.title}
                        </p>
                        <p className="text-xs text-[#a0a0a0] line-clamp-2 mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                          {a.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#8aa8ff] text-[10px] font-medium" style={{ fontFamily: "var(--font-inter)" }}>{a.source}</span>
                            <span className="text-[#3a3a3a] text-xs">·</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#3a3a3a] text-[#a0a0a0]" style={{ fontFamily: "var(--font-inter)" }}>{a.tag}</span>
                            <span className="text-[#3a3a3a] text-xs">·</span>
                            <span className="text-[10px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>{timeAgo(a.date)}</span>
                          </div>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: sc, fontFamily: "var(--font-inconsolata)" }}
                          >
                            {a.sentiment > 0 ? "+" : ""}{a.sentiment.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4">
          <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mt-4 mb-3" style={{ fontFamily: "var(--font-inter)" }}>
            Your Watchlist
          </p>
          <div className="flex flex-col gap-2">
            {WATCHLIST.map((item) => {
              const sc = sentimentColor(item.sentiment);
              const positive = item.sentiment > 1;
              const negative = item.sentiment < -1;
              return (
                <div key={item.id} className="bg-[#2e2e2e] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-semibold text-sm text-[#f0f0f0] truncate">{item.name}</p>
                      {"symbol" in item && (
                        <p className="text-[10px] text-[#6b6b6b] mt-0.5" style={{ fontFamily: "var(--font-inconsolata)" }}>{(item as typeof item & { symbol: string }).symbol}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {positive ? <TrendingUp size={14} color="#10b981" /> : negative ? <TrendingDown size={14} color="#ef4444" /> : null}
                      <span className="text-sm font-semibold" style={{ color: sc, fontFamily: "var(--font-inconsolata)" }}>
                        {item.sentiment > 0 ? "+" : ""}{item.sentiment.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor: "#8aa8ff15",
                          color: "#8aa8ff",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-[#6b6b6b]" style={{ fontFamily: "var(--font-inter)" }}>
                        {item.articleCount} articles
                      </span>
                    </div>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#3a3a3a]">
                      <BookmarkPlus size={13} color="#a0a0a0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
