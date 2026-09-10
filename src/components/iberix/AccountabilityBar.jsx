import { useEffect, useState } from "react";

const STEPS = [
  { id: "top", label: "Command" },
  { id: "capabilities", label: "Capabilities" },
  { id: "footprint", label: "Footprint" },
  { id: "accountability", label: "Partnership" },
];

export default function AccountabilityBar() {
  const [active, setActive] = useState("top");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y < 400);

      // Determine active section
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
      <div className="h-px w-full hairline" />
      <div className="bg-deepspace/95 backdrop-blur-md border-t border-tungsten">
        <div className="px-6 md:px-12 py-3 flex items-center justify-between gap-6">
          {/* Progress */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/40 whitespace-nowrap">
              Journey
            </span>
            <div className="relative flex-1 h-px bg-tungsten">
              <div
                className="absolute left-0 top-0 h-px bg-signal transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal whitespace-nowrap">
              {active}
            </span>
          </div>

          {/* Step shortcuts */}
          <div className="flex items-center gap-1 md:gap-2">
            {STEPS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`px-3 md:px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] border transition-all ${
                  active === s.id
                    ? "border-signal text-signal"
                    : "border-tungsten text-techwhite/50 hover:text-techwhite"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>

          <a
            href="#accountability"
            className="hidden lg:inline-flex items-center gap-2 bg-signal text-deepspace px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold hover:shadow-[0_0_30px_-6px_rgba(253,184,19,0.7)] transition-shadow"
          >
            Initialize →
          </a>
        </div>
      </div>
    </div>
  );
}