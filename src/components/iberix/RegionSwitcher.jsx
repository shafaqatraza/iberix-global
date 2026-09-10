import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useRegion } from "@/i18n/RegionContext";

export default function RegionSwitcher({ variant = "light" }) {
  const { region, regions, setRegion, t } = useRegion();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const btnText = variant === "light" ? "text-paper/80 hover:text-paper" : "text-body hover:text-ink";
  const menuBg = variant === "light" ? "bg-ink border-white/10" : "bg-paper border-line";
  const divider = variant === "light" ? "border-white/10" : "border-line";
  const hoverRow = variant === "light" ? "hover:bg-white/5" : "hover:bg-offwhite";
  const activeRow = variant === "light" ? "bg-white/5" : "bg-mint";
  const labelColor = variant === "light" ? "text-paper" : "text-ink";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`group inline-flex items-center gap-2 eyebrow ${btnText} transition-colors`}
        aria-label="Switch region"
      >
        <Globe className="h-4 w-4" />
        {region.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute right-0 mt-3 w-60 rounded-lg border shadow-soft-lg ${menuBg} z-50 overflow-hidden`}>
          <div className={`px-4 py-3 eyebrow text-subtle border-b ${divider}`}>
            {t("common.selectRegion")}
          </div>
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRegion(r.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                region.id === r.id ? activeRow : hoverRow
              }`}
            >
              <div className="flex flex-col">
                <span className={`font-heading text-sm font-medium ${labelColor}`}>{r.label}</span>
                <span className="eyebrow text-subtle">{r.domain}</span>
              </div>
              {region.id === r.id && <Check className="h-4 w-4 text-brand shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}