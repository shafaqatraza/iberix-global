import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useRegion } from "@/i18n/RegionContext";

const ZONES = [
  {
    id: "europe",
    label: "Europe",
    coords: { x: 50, y: 28 },
    teams: "800+",
    countries: 30,
    locations: 156,
    note: {
      en: "Primary delivery hub. London and Frankfurt operations centres.",
      es: "Centro de entrega principal. Centros de operaciones en Londres y Frankfurt.",
    },
  },
  {
    id: "north-america",
    label: "North America",
    coords: { x: 22, y: 32 },
    teams: "200+",
    countries: 3,
    locations: 57,
    note: {
      en: "New York dispatch. Data centre commissioning at scale.",
      es: "Dispatch desde Nueva York. Puesta en marcha de centros de datos a escala.",
    },
  },
  {
    id: "apac",
    label: "APAC",
    coords: { x: 78, y: 48 },
    teams: "549",
    countries: 23,
    locations: 58,
    note: {
      en: "Singapore coordination node. High-growth network rollout zone.",
      es: "Nodo de coordinación en Singapur. Zona de despliegue de red de alto crecimiento.",
    },
  },
  {
    id: "mena",
    label: "MENA",
    coords: { x: 55, y: 40 },
    teams: "150+",
    countries: 11,
    locations: 24,
    note: {
      en: "Dubai field hub. Data centre and network deployment across the Gulf.",
      es: "Nodo de campo en Dubái. Despliegue de centros de datos y red en el Golfo.",
    },
  },
  {
    id: "africa",
    label: "Africa",
    coords: { x: 52, y: 55 },
    teams: "180+",
    countries: 11,
    locations: 20,
    note: {
      en: "Nairobi and Johannesburg bases. Field support across the continent.",
      es: "Bases en Nairobi y Johannesburgo. Soporte de campo en todo el continente.",
    },
  },
  {
    id: "latam",
    label: "LATAM",
    coords: { x: 30, y: 58 },
    teams: "300+",
    countries: 9,
    locations: 14,
    note: {
      en: "São Paulo field hub. Multi-country network rollouts.",
      es: "Nodo de campo en São Paulo. Despliegues de red en varios países.",
    },
  },
];

const DOTS = [
  { x: 28, y: 36 }, { x: 30, y: 40 }, { x: 32, y: 44 }, { x: 34, y: 50 },
  { x: 46, y: 30 }, { x: 50, y: 38 }, { x: 52, y: 42 }, { x: 54, y: 46 },
  { x: 58, y: 34 }, { x: 62, y: 40 }, { x: 70, y: 50 }, { x: 74, y: 54 },
  { x: 78, y: 56 }, { x: 80, y: 48 }, { x: 82, y: 40 }, { x: 22, y: 56 },
  { x: 26, y: 60 }, { x: 48, y: 58 }, { x: 52, y: 64 }, { x: 20, y: 44 },
];

export default function GlobalFootprint() {
  const [ref, visible] = useReveal();
  const [active, setActive] = useState("emea");
  const { lang, t } = useRegion();
  const L = (v) => v[lang];
  const zone = ZONES.find((z) => z.id === active);

  const stats = [
    { k: zone.teams, v: t("foot.statEng") },
    { k: zone.countries, v: t("foot.statCountries") },
    { k: zone.locations, v: t("foot.statLive") },
  ];

  return (
    <section ref={ref} id="footprint" className="relative bg-ink px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand-light`}>
              {t("foot.eyebrow")}
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-paper leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              {t("foot.h2")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-ink-soft rounded-lg relative overflow-hidden min-h-[420px] md:min-h-[560px]">
            <div className="absolute inset-0 blueprint-grid opacity-[0.04]" />
            <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              {ZONES.map((z, i) => {
                const next = ZONES[(i + 1) % ZONES.length];
                return (
                  <line
                    key={`line${z.id}`}
                    x1={z.coords.x}
                    y1={z.coords.y * 0.7}
                    x2={next.coords.x}
                    y2={next.coords.y * 0.7}
                    stroke="#5DCAA5"
                    strokeWidth="0.15"
                    strokeDasharray="0.6 0.6"
                    opacity={active === z.id ? 0.85 : 0.25}
                    className="transition-opacity duration-500"
                  />
                );
              })}
              {DOTS.map((d, i) => (
                <circle key={`dot${i}`} cx={d.x} cy={d.y * 0.7} r="0.35" fill="#A2A8A4" opacity="0.4" />
              ))}
              {ZONES.map((z) => (
                <g key={z.id} onClick={() => setActive(z.id)} className="cursor-pointer">
                  <circle cx={z.coords.x} cy={z.coords.y * 0.7} r={active === z.id ? "2.4" : "1.6"} fill="#5DCAA5" className="transition-all duration-300" />
                  <circle cx={z.coords.x} cy={z.coords.y * 0.7} r="3.5" fill="none" stroke="#5DCAA5" strokeWidth="0.2" opacity={active === z.id ? "0.6" : "0"} className="transition-opacity duration-300" />
                  <text
                    x={z.coords.x}
                    y={z.coords.y * 0.7 - 3.5}
                    textAnchor="middle"
                    fill="#F4F6F5"
                    fontSize="2.4"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="500"
                    opacity={active === z.id ? "1" : "0.6"}
                    className="transition-opacity duration-300"
                    style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    {z.label}
                  </text>
                </g>
              ))}
            </svg>

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setActive(z.id)}
                  className={`px-4 py-2 rounded-full eyebrow border transition-all ${
                    active === z.id
                      ? "border-brand bg-brand text-paper"
                      : "border-white/15 text-subtle hover:text-paper"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-ink-soft rounded-lg p-8 md:p-10 flex flex-col">
            <span className="eyebrow text-brand-light">{t("foot.snapshot")}</span>
            <h3 className="mt-3 font-heading text-3xl md:text-4xl font-medium tracking-tight-display text-paper">
              {zone.label}
            </h3>
            <p className="mt-4 text-subtle text-base leading-[1.6]">{L(zone.note)}</p>

            <div className="mt-8 flex flex-col gap-3">
              {stats.map((stat) => (
                <div key={stat.v} className="flex items-baseline justify-between rounded-md bg-ink/40 px-5 py-4">
                  <span className="font-heading text-3xl font-medium tracking-tight-display text-paper tabular-nums">
                    {stat.k}
                  </span>
                  <span className="eyebrow text-subtle text-right max-w-[55%]">{stat.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="h-px w-full bg-white/10" />
              <span className="block mt-4 eyebrow text-subtle">
                {t("foot.coord", { n: ZONES.length })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}