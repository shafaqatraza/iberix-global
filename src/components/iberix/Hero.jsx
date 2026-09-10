import { ArrowUpRight } from "lucide-react";
import LiveStatusTicker from "./LiveStatusTicker";
import SystemMenuButton from "./SystemMenu";
import RegionSwitcher from "./RegionSwitcher";
import Logo from "./Logo";
import { useReveal } from "@/hooks/useReveal";
import { useRegion } from "@/i18n/RegionContext";

const HUBS = [
  { x: 30, y: 38, label: "London" },
  { x: 52, y: 44, label: "Dubai" },
  { x: 74, y: 52, label: "Singapore" },
  { x: 22, y: 40, label: "New York" },
  { x: 62, y: 34, label: "Frankfurt" },
  { x: 80, y: 30, label: "Tokyo" },
];

function WireframeGlobe() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[120vw] md:w-[55vw] max-w-[720px] aspect-square opacity-40">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slower">
          <circle cx="100" cy="100" r="98" fill="none" stroke="#5DCAA5" strokeOpacity="0.25" strokeWidth="0.5" />
          {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((deg) => {
            const rx = Math.abs(Math.cos((deg * Math.PI) / 180)) * 98;
            return (
              <ellipse key={`lon${deg}`} cx="100" cy="100" rx={rx} ry="98" fill="none" stroke="#5DCAA5" strokeOpacity="0.12" strokeWidth="0.4" />
            );
          })}
          {[-60, -40, -20, 0, 20, 40, 60].map((lat) => {
            const cy = 100 - (lat / 90) * 98;
            const rx = Math.cos((lat * Math.PI) / 180) * 98;
            return (
              <ellipse key={`lat${lat}`} cx="100" cy={cy} rx={rx} ry={rx * 0.18} fill="none" stroke="#5DCAA5" strokeOpacity="0.12" strokeWidth="0.4" />
            );
          })}
        </svg>
        {HUBS.map((h) => (
          <div key={h.label} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <span className="relative flex h-2 w-2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-light opacity-50 animate-pulse-brand" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [ref, visible] = useReveal();
  const { t } = useRegion();

  const stats = [
    { k: "40+", v: t("hero.stat1") },
    { k: "1,200+", v: t("hero.stat2") },
    { k: "24/7", v: t("hero.stat3") },
    { k: "1", v: t("hero.stat4") },
  ];

  return (
    <section ref={ref} id="top" className="relative min-h-screen w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/90918cdf1_generated_af2e03a1.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-ink/75" />
      </div>

      <WireframeGlobe />

      <div className="relative z-30">
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          <Logo variant="light" className="text-xl" />
          <div className="flex items-center gap-6">
            <LiveStatusTicker />
            <RegionSwitcher variant="light" />
            <SystemMenuButton />
          </div>
        </header>
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="relative z-10 px-6 md:px-12 pt-20 md:pt-28 pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand-light`}>
              {t("hero.eyebrow")}
            </span>
          </div>

          <div className="col-span-12 md:col-span-10">
            <h1
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-paper leading-[0.98]`}
              style={{ fontSize: "clamp(2.75rem, 8.5vw, 8.5rem)" }}
            >
              {t("hero.h1L1")}
              <br />
              {t("hero.h1L2pre")}
              <span className="text-brand-light">{t("hero.h1L2hi")}</span>
              <br />
              {t("hero.h1L3")}
            </h1>

            <div className="mt-12 grid grid-cols-12 gap-6">
              <p className="col-span-12 md:col-span-6 text-subtle text-lg md:text-xl leading-[1.6] max-w-2xl">
                {t("hero.subhead")}
              </p>
              <div className="col-span-12 md:col-span-6 flex flex-col items-start md:items-end justify-end gap-5">
                <a
                  href="#accountability"
                  className="group inline-flex items-center gap-3 bg-brand text-paper rounded-full px-7 py-4 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-shadow"
                >
                  {t("common.initialize")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#capabilities"
                  className="eyebrow text-subtle hover:text-brand-light transition-colors"
                >
                  {t("common.survey")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
          {stats.map((s, i) => (
            <div
              key={s.v}
              className={`py-8 px-5 ${i < 3 ? "border-r border-white/10" : ""} ${i % 2 === 0 ? "border-b md:border-b-0 border-white/10" : ""}`}
            >
              <div className="font-heading text-3xl md:text-5xl font-medium tracking-tight-display text-paper tabular-nums">
                {s.k}
              </div>
              <div className="mt-2 eyebrow text-subtle">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-px w-full bg-white/10" />
        <div className="px-6 md:px-12 py-4 flex items-center justify-between eyebrow text-subtle/70">
          <span>Lat 51.5074° N / Lon 0.1278° W</span>
          <span className="hidden md:block">{t("common.scroll")}</span>
          <span>Command Center v1.0</span>
        </div>
      </div>
    </section>
  );
}