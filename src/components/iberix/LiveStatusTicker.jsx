import { useEffect, useState } from "react";
import { useRegion } from "@/i18n/RegionContext";

const REGIONS = [
  { label: "London", tz: "Europe/London" },
  { label: "Dubai", tz: "Asia/Dubai" },
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
  const [, setNow] = useState(Date.now());
  const { t } = useRegion();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-6 eyebrow text-subtle">
      <span className="flex items-center gap-2 text-brand-light">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-light opacity-60 animate-pulse-brand" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light" />
        </span>
        {t("hero.live")}
      </span>
      {REGIONS.map((r) => (
        <span key={r.label} className="flex items-center gap-2">
          <span className="text-subtle/70">{r.label}</span>
          <span className="text-paper/80 tabular-nums">{timeFor(r.tz)}</span>
        </span>
      ))}
    </div>
  );
}