import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const ZONES = [
  {
    id: "emea",
    label: "EMEA",
    coords: { x: 50, y: 38 },
    teams: 480,
    countries: 18,
    active: 12,
    note: "Primary delivery hub. London & Frankfurt operations centres.",
  },
  {
    id: "apac",
    label: "APAC",
    coords: { x: 78, y: 56 },
    teams: 360,
    countries: 11,
    active: 8,
    note: "Singapore coordination node. High-growth network rollout zone.",
  },
  {
    id: "americas",
    label: "Americas",
    coords: { x: 24, y: 46 },
    teams: 290,
    countries: 9,
    active: 6,
    note: "New York dispatch. Data centre commissioning at scale.",
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
  const zone = ZONES.find((z) => z.id === active);

  return (
    <section ref={ref} id="footprint" className="relative bg-deepspace px-6 md:px-12 py-32 md:py-44 border-t border-tungsten">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} font-mono text-[11px] uppercase tracking-[0.22em] text-signal`}>
              03 / Footprint
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-techwhite leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
            >
              Wherever the work happens.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-tungsten border border-tungsten">
          {/* Map */}
          <div className="lg:col-span-8 bg-deepspace relative overflow-hidden min-h-[420px] md:min-h-[560px]">
            <div className="absolute inset-0 blueprint-grid opacity-20" />
            <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Connection lines between hubs */}
              {ZONES.map((z, i) => {
                const next = ZONES[(i + 1) % ZONES.length];
                return (
                  <line
                    key={`line${z.id}`}
                    x1={z.coords.x}
                    y1={z.coords.y * 0.7}
                    x2={next.coords.x}
                    y2={next.coords.y * 0.7}
                    stroke="#FDB813"
                    strokeWidth="0.15"
                    strokeDasharray="0.6 0.6"
                    opacity={active === z.id ? 0.8 : 0.25}
                    className="transition-opacity duration-500"
                  />
                );
              })}
              {/* Field dots */}
              {DOTS.map((d, i) => (
                <circle
                  key={`dot${i}`}
                  cx={d.x}
                  cy={d.y * 0.7}
                  r="0.35"
                  fill="#3a3d40"
                />
              ))}
              {/* Hub markers */}
              {ZONES.map((z) => (
                <g
                  key={z.id}
                  onClick={() => setActive(z.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={z.coords.x}
                    cy={z.coords.y * 0.7}
                    r={active === z.id ? "2.4" : "1.6"}
                    fill="#FDB813"
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={z.coords.x}
                    cy={z.coords.y * 0.7}
                    r="3.5"
                    fill="none"
                    stroke="#FDB813"
                    strokeWidth="0.2"
                    opacity={active === z.id ? "0.6" : "0"}
                    className="transition-opacity duration-300"
                  />
                  <text
                    x={z.coords.x}
                    y={z.coords.y * 0.7 - 3.5}
                    textAnchor="middle"
                    fill="#F4F4F5"
                    fontSize="2.4"
                    fontFamily="JetBrains Mono, monospace"
                    opacity={active === z.id ? "1" : "0.6"}
                    className="transition-opacity duration-300 uppercase"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {z.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Zone selector (mobile-friendly) */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setActive(z.id)}
                  className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-all ${
                    active === z.id
                      ? "border-signal text-signal bg-signal/10"
                      : "border-tungsten text-techwhite/50 hover:text-techwhite"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deployment snapshot */}
          <div className="lg:col-span-4 bg-deepspace p-8 md:p-10 flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Deployment Snapshot
            </span>
            <h3 className="mt-3 font-heading text-3xl md:text-4xl font-medium tracking-tight-display text-techwhite">
              {zone.label}
            </h3>
            <p className="mt-4 text-techwhite/60 text-base leading-[1.6]">{zone.note}</p>

            <div className="mt-8 grid grid-cols-1 gap-px bg-tungsten border border-tungsten">
              {[
                { k: zone.teams, v: "Engineers Active" },
                { k: zone.countries, v: "Countries Covered" },
                { k: zone.active, v: "Live Deployments" },
              ].map((stat) => (
                <div key={stat.v} className="bg-deepspace p-5 flex items-baseline justify-between">
                  <span className="font-heading text-3xl font-medium tracking-tight-display text-techwhite tabular-nums">
                    {stat.k}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-techwhite/50 text-right max-w-[50%]">
                    {stat.v}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="h-px w-full hairline" />
              <span className="block mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/40">
                Real-time coordination across {ZONES.length} zones
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}