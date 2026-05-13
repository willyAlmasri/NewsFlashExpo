export const ARTICLES = [
  { id: "1", title: "Central Bank of Egypt Raises Interest Rates by 200 Basis Points", source: "Reuters", date: "2026-03-22T08:30:00Z", company: "CBE", tag: "Monetary Policy", sentiment: -2.3, importance: 9 },
  { id: "2", title: "QNB Group Reports Record Q4 2025 Earnings, Beats Expectations", source: "Bloomberg", date: "2026-03-22T07:15:00Z", company: "QNB", tag: "Earnings", sentiment: 4.2, importance: 8 },
  { id: "3", title: "Suez Canal Revenue Drops 40% Amid Red Sea Shipping Disruptions", source: "Financial Times", date: "2026-03-22T06:00:00Z", company: "SUEZ", tag: "Trade", sentiment: -3.8, importance: 10 },
  { id: "4", title: "ADIB Launches AI-Powered Islamic Banking Platform", source: "TechCrunch", date: "2026-03-21T18:45:00Z", company: "ADIB", tag: "Technology", sentiment: 3.5, importance: 7 },
  { id: "5", title: "Telecom Egypt Signs $200M 5G Infrastructure Deal", source: "Mubasher", date: "2026-03-21T15:20:00Z", company: "Telecom Egypt", tag: "5G", sentiment: 2.8, importance: 7 },
  { id: "6", title: "Egyptian Pound Stabilizes After IMF Tranche Disbursement", source: "Alborsa News", date: "2026-03-21T12:00:00Z", company: "CBE", tag: "Macro", sentiment: 1.5, importance: 8 },
  { id: "7", title: "Saudi Aramco Eyes Expansion into Egyptian Downstream Market", source: "Reuters", date: "2026-03-21T09:30:00Z", company: "Aramco", tag: "Energy", sentiment: 2.1, importance: 6 },
  { id: "8", title: "Commercial International Bank Faces Regulatory Scrutiny", source: "Bloomberg", date: "2026-03-20T16:00:00Z", company: "CIB", tag: "Regulation", sentiment: -1.8, importance: 7 },
  { id: "9", title: "Emirates NBD Expands African Operations with Kenya Acquisition", source: "Financial Times", date: "2026-03-20T11:00:00Z", company: "Emirates NBD", tag: "M&A", sentiment: 3.1, importance: 6 },
  { id: "10", title: "Egypt Tourism Revenue Hits Record $18.2B in 2025", source: "Alborsa News", date: "2026-03-20T08:00:00Z", company: "Egypt Tourism", tag: "Tourism", sentiment: 4.5, importance: 5 },
  { id: "11", title: "Orascom Construction Wins $1.2B Saudi Infrastructure Contract", source: "Mubasher", date: "2026-03-19T14:30:00Z", company: "Orascom", tag: "Infrastructure", sentiment: 3.7, importance: 7 },
  { id: "12", title: "MENA Tech Startups Raise $2.3B in Q1 2026", source: "TechCrunch", date: "2026-03-19T10:00:00Z", company: "MENA VC", tag: "Venture Capital", sentiment: 3.9, importance: 5 },
];

export const ALERTS = [
  { id: "a1", title: "Suez Canal Crisis — Revenue Collapse", severity: "CRITICAL", message: "Suez Canal revenue has dropped 40% due to Red Sea disruptions. Immediate market impact expected.", keywords: ["Suez Canal", "shipping", "Red Sea"], source: "System", createdAt: "2026-03-22T06:30:00Z", isResolved: false, type: "crisis" },
  { id: "a2", title: "CBE Interest Rate Hike — 200bps", severity: "HIGH", message: "Central Bank of Egypt raised rates by 200 basis points. Bond and equity markets may react significantly.", keywords: ["CBE", "interest rates", "monetary policy"], source: "Reuters", createdAt: "2026-03-22T08:45:00Z", isResolved: false, type: "macro" },
  { id: "a3", title: "QNB Record Earnings Beat", severity: "MEDIUM", message: "QNB Group posted record Q4 earnings, beating consensus by 12%. Positive sentiment expected for banking sector.", keywords: ["QNB", "earnings", "banking"], source: "Bloomberg", createdAt: "2026-03-22T07:30:00Z", isResolved: false, type: "earnings" },
  { id: "a4", title: "CIB Regulatory Review", severity: "HIGH", message: "Commercial International Bank is facing regulatory scrutiny over AML compliance. Stock may face downward pressure.", keywords: ["CIB", "regulation", "AML"], source: "Bloomberg", createdAt: "2026-03-20T16:30:00Z", isResolved: false, type: "brand_mention" },
  { id: "a5", title: "Telecom Egypt 5G Partnership", severity: "LOW", message: "Telecom Egypt signed a $200M 5G deal with Ericsson. Long-term positive for the company.", keywords: ["Telecom Egypt", "5G", "Ericsson"], source: "Mubasher", createdAt: "2026-03-21T15:45:00Z", isResolved: true, type: "brand_mention" },
  { id: "a6", title: "EGP Stabilization Signal", severity: "MEDIUM", message: "Egyptian pound showing stability post-IMF disbursement. FX risk may be easing for MENA-exposed portfolios.", keywords: ["EGP", "IMF", "forex"], source: "System", createdAt: "2026-03-21T12:30:00Z", isResolved: true, type: "macro" },
];

export const WATCHLIST = [
  { id: "w1", type: "company", name: "Commercial International Bank", symbol: "COMI.CA", sentiment: 1.2, articleCount: 24, sparkData: [1.0, 1.5, 1.2, 1.8, 1.4, 1.1, 1.2] },
  { id: "w2", type: "company", name: "QNB Group", symbol: "QNBK.QA", sentiment: 3.8, articleCount: 31, sparkData: [2.1, 2.5, 3.0, 3.2, 3.5, 3.6, 3.8] },
  { id: "w3", type: "company", name: "Telecom Egypt", symbol: "ETEL.CA", sentiment: 2.1, articleCount: 15, sparkData: [1.5, 1.8, 2.0, 1.9, 2.2, 2.0, 2.1] },
  { id: "w4", type: "sector", name: "MENA Banking", sentiment: 1.5, articleCount: 87, sparkData: [1.0, 1.2, 1.6, 1.3, 1.8, 1.4, 1.5] },
  { id: "w5", type: "market", name: "Egyptian Exchange (EGX)", sentiment: -0.3, articleCount: 42, sparkData: [0.5, 0.2, -0.1, 0.1, -0.2, -0.4, -0.3] },
  { id: "w6", type: "company", name: "Abu Dhabi Islamic Bank", symbol: "ADIB.AD", sentiment: 2.9, articleCount: 12, sparkData: [2.0, 2.3, 2.5, 2.4, 2.7, 2.8, 2.9] },
];

export const STATS = {
  totalArticles: 1247,
  avgSentiment: 0.8,
  topSources: [
    { name: "Reuters", count: 312 },
    { name: "Bloomberg", count: 289 },
    { name: "Alborsa News", count: 198 },
    { name: "Financial Times", count: 167 },
    { name: "Mubasher", count: 145 },
  ],
  sentimentBreakdown: { positive: 42, negative: 28, neutral: 30 },
  trendingTopics: [
    { topic: "Interest Rates", count: 89, trend: "up" },
    { topic: "Red Sea Crisis", count: 76, trend: "up" },
    { topic: "Banking Earnings", count: 65, trend: "stable" },
    { topic: "5G Rollout", count: 43, trend: "up" },
    { topic: "IMF Program", count: 38, trend: "down" },
    { topic: "Tourism Recovery", count: 34, trend: "up" },
  ],
};

export const COMPANIES = [
  { id: "c1", name: "Commercial International Bank", ticker: "COMI.CA", sector: "Banking", sentiment: "neutral", articleCount: 156, sentimentScore: -0.8 },
  { id: "c2", name: "QNB Group", ticker: "QNBK.QA", sector: "Banking", sentiment: "positive", articleCount: 198, sentimentScore: 4.2 },
  { id: "c3", name: "Telecom Egypt", ticker: "ETEL.CA", sector: "Telecommunications", sentiment: "positive", articleCount: 89, sentimentScore: 2.8 },
];

export const SOURCES = [
  { id: "s1", name: "Reuters", category: "International Wire", enabled: true, articlesPerDay: 45 },
  { id: "s2", name: "Bloomberg", category: "Financial News", enabled: true, articlesPerDay: 38 },
  { id: "s3", name: "Financial Times", category: "Financial News", enabled: true, articlesPerDay: 22 },
  { id: "s4", name: "Alborsa News", category: "Egypt Local", enabled: true, articlesPerDay: 30 },
  { id: "s5", name: "Mubasher", category: "MENA Finance", enabled: true, articlesPerDay: 25 },
  { id: "s6", name: "TechCrunch", category: "Technology", enabled: true, articlesPerDay: 15 },
  { id: "s7", name: "Wall Street Journal", category: "Financial News", enabled: false, articlesPerDay: 20 },
];

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function sentimentColor(val: number): string {
  if (val > 1) return "#10b981";
  if (val < -1) return "#ef4444";
  return "#eab308";
}

export function severityColor(sev: string): string {
  switch (sev) {
    case "CRITICAL": return "#ef4444";
    case "HIGH": return "#f97316";
    case "MEDIUM": return "#eab308";
    default: return "#8aa8ff";
  }
}
