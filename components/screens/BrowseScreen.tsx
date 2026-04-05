"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { ARTICLES, COMPANIES, SOURCES, timeAgo, sentimentColor } from "@/lib/data";

const FILTERS = ["All", "Banking", "Energy", "Technology", "Macro", "Trade"];

export default function BrowseScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = ARTICLES.filter((a) => {
    const matchesQuery = query === "" || a.title.toLowerCase().includes(query.toLowerCase()) || a.source.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "All" || a.tag === activeFilter || a.company === activeFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="phone-scroll overflow-y-auto pb-6" style={{ background: "#1a1a1a", height: "100%" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-serif text-2xl font-semibold text-[#f0f0f0] mb-3">Browse</h1>
        <div className="flex items-center gap-2 bg-[#2e2e2e] rounded-xl px-3 py-2.5">
          <Search size={16} color="#6b6b6b" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search articles, sources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#f0f0f0] placeholder-[#6b6b6b] outline-none font-sans"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium font-sans border"
            style={{
              backgroundColor: activeFilter === f ? "#8aa8ff" : "#2e2e2e",
              color: activeFilter === f ? "#111" : "#a0a0a0",
              borderColor: activeFilter === f ? "#8aa8ff" : "#333",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="px-4">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">
          {filtered.length} Articles
        </p>
        <div className="flex flex-col gap-2">
          {filtered.map((a) => (
            <div key={a.id} className="bg-[#2e2e2e] rounded-xl p-3">
              <div className="flex items-start gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: sentimentColor(a.sentiment) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-semibold text-[#f0f0f0] leading-snug line-clamp-2">{a.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[#8aa8ff] text-[10px] font-sans">{a.source}</span>
                    <span className="text-[#3a3a3a]">&middot;</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-sans"
                      style={{ backgroundColor: "#3a3a3a", color: "#a0a0a0" }}
                    >
                      {a.tag}
                    </span>
                    <span className="text-[#6b6b6b] text-[10px] font-sans">{timeAgo(a.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Companies */}
      <div className="px-4 mt-6">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Companies</p>
        <div className="flex flex-col gap-2">
          {COMPANIES.map((c) => (
            <div key={c.id} className="bg-[#2e2e2e] rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-sans font-semibold text-sm text-[#f0f0f0] truncate">{c.name}</p>
                  <span className="text-[10px] font-mono text-[#6b6b6b] shrink-0">{c.ticker}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6b6b6b] font-sans">{c.sector}</span>
                  <span className="text-[#3a3a3a]">&middot;</span>
                  <span className="text-[10px] text-[#6b6b6b] font-sans">{c.articleCount} articles</span>
                </div>
              </div>
              <span
                className="text-xs font-semibold font-mono shrink-0"
                style={{ color: sentimentColor(c.sentimentScore) }}
              >
                {c.sentimentScore > 0 ? "+" : ""}{c.sentimentScore.toFixed(1)}
              </span>
              <ChevronRight size={16} color="#3a3a3a" />
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="px-4 mt-6">
        <p className="text-[#6b6b6b] text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans">Sources</p>
        <div className="flex flex-col gap-1.5">
          {SOURCES.map((s) => (
            <div key={s.id} className="bg-[#2e2e2e] rounded-xl px-3 py-2.5 flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-sm text-[#f0f0f0]">{s.name}</p>
                <p className="text-[10px] text-[#6b6b6b] font-sans">{s.category} &middot; {s.articlesPerDay}/day</p>
              </div>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: s.enabled ? "#10b981" : "#3a3a3a" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
