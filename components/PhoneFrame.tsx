export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ width: 390, height: 780 }}>
      {/* Outer shell */}
      <div
        className="absolute inset-0 rounded-[52px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(145deg, #2a2a2a, #111)",
          boxShadow: "0 0 0 1.5px #3a3a3a, 0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />
      {/* Side buttons */}
      <div className="absolute left-[-3px] top-[120px] w-[3px] h-[36px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="absolute left-[-3px] top-[172px] w-[3px] h-[60px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="absolute left-[-3px] top-[244px] w-[3px] h-[60px] rounded-l-sm bg-[#2a2a2a]" />
      <div className="absolute right-[-3px] top-[160px] w-[3px] h-[80px] rounded-r-sm bg-[#2a2a2a]" />

      {/* Screen bezel */}
      <div
        className="absolute rounded-[46px] overflow-hidden bg-[#1a1a1a]"
        style={{ inset: "8px" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-[#1a1a1a] shrink-0" style={{ height: 44 }}>
          <span className="text-[#f0f0f0] text-[13px] font-semibold font-mono">9:41</span>
          <div
            className="absolute left-1/2 -translate-x-1/2 top-3 bg-[#111] rounded-full"
            style={{ width: 120, height: 34 }}
          />
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="3" width="3" height="9" rx="1" fill="#f0f0f0" />
              <rect x="4.5" y="2" width="3" height="10" rx="1" fill="#f0f0f0" />
              <rect x="9" y="0" width="3" height="12" rx="1" fill="#f0f0f0" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#f0f0f0" opacity="0.3" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 24 12" fill="none">
              <path d="M12 2.4C9.4 2.4 7 3.4 5.2 5.2L3.2 3.2A12 12 0 0 1 20.8 3.2L18.8 5.2C17 3.4 14.6 2.4 12 2.4Z" fill="#f0f0f0" />
              <path d="M12 6.8C10.6 6.8 9.3 7.4 8.4 8.4L6.4 6.4A8 8 0 0 1 17.6 6.4L15.6 8.4C14.7 7.4 13.4 6.8 12 6.8Z" fill="#f0f0f0" />
              <circle cx="12" cy="11" r="1.5" fill="#f0f0f0" />
            </svg>
            <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
              <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#f0f0f0" strokeOpacity="0.35" />
              <rect x="2" y="2" width="18" height="9" rx="2" fill="#f0f0f0" />
              <path d="M24 4.5V8.5A2 2 0 0 0 24 4.5Z" fill="#f0f0f0" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* App content */}
        <div className="flex flex-col" style={{ height: "calc(100% - 44px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
