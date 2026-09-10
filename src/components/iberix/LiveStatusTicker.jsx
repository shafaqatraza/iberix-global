import { useEffect, useState } from "react";

const REGIONS = [
  { label: "London", tz: "Europe/London" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "New York", tz: "America/New_York" },
];

function timeFor(tz) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(new Date());
}

export default function LiveStatusTicker() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-techwhite/60">
      <span className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 animate-pulse-amber" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
        </span>
        Live
      </span>
      {REGIONS.map((r) => (
        <span key={r.label} className="flex items-center gap-2">
          <span className="text-techwhite/40">{r.label}</span>
          <span className="text-techwhite tabular-nums">{timeFor(r.tz)}</span>
        </span>
      ))}
    </div>
  );
}