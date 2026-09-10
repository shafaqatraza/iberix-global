import { useEffect, useState } from "react";
import { useRegion } from "@/i18n/RegionContext";

const STEPS = [
  { id: "top", key: "command" },
  { id: "capabilities", key: "capabilities" },
  { id: "footprint", key: "footprint" },
  { id: "accountability", key: "partnership" },
];

export default function AccountabilityBar() {
  const [active, setActive] = useState("top");
  const [hidden, setHidden] = useState(false);
  const { t } = useRegion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y < 400);

      let current = "top";
      for (const s of STEPS) {
        const el = document.getElementById(s.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top < window.innerHeight * 0.4) current = s.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = (STEPS.findIndex((s) => s.id === active) / (STEPS.length - 1)) * 100;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="bg-ink/95 backdrop-blur-md border-t border-white/10">
        <div className="px-6 md:px-12 py-3 flex items-center justify-between gap-6">
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
            <span className="eyebrow text-subtle whitespace-nowrap">{t("bar.journey")}</span>
            <div className="relative flex-1 h-px bg-white/10">
              <div
                className="absolute left-0 top-0 h-px bg-brand-light transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="eyebrow text-brand-light whitespace-nowrap">{t(`bar.${active === "top" ? "command" : STEPS.find((s) => s.id === active)?.key || "command"}`)}</span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {STEPS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`px-3 md:px-4 py-2 rounded-full eyebrow border transition-all ${
                  active === s.id
                    ? "border-brand bg-brand text-paper"
                    : "border-white/15 text-subtle hover:text-paper"
                }`}
              >
                {t(`bar.${s.key}`)}
              </a>
            ))}
          </div>

          <a
            href="#accountability"
            className="hidden lg:inline-flex items-center gap-2 bg-brand text-paper rounded-full px-5 py-2 eyebrow font-semibold hover:shadow-[0_8px_28px_-10px_rgba(29,158,117,0.6)] transition-shadow"
          >
            {t("bar.initialize")}
          </a>
        </div>
      </div>
    </div>
  );
}