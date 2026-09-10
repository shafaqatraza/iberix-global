import { ArrowUpRight } from "lucide-react";
import LiveStatusTicker from "./LiveStatusTicker";
import SystemMenuButton from "./SystemMenu";
import { useReveal } from "@/hooks/useReveal";

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
      <div className="relative w-[120vw] md:w-[60vw] max-w-[760px] aspect-square opacity-[0.22]">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slower">
          <defs>
            <radialGradient id="globeFade" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#FDB813" stopOpacity="0" />
              <stop offset="100%" stopColor="#FDB813" stopOpacity="0.25" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#globeFade)" stroke="#2A2D30" strokeWidth="0.5" />
          {/* Longitude lines */}
          {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((deg) => {
            const rx = Math.abs(Math.cos((deg * Math.PI) / 180)) * 98;
            return (
              <ellipse
                key={`lon${deg}`}
                cx="100"
                cy="100"
                rx={rx}
                ry="98"
                fill="none"
                stroke="#3a3d40"
                strokeWidth="0.4"
              />
            );
          })}
          {/* Latitude lines */}
          {[-60, -40, -20, 0, 20, 40, 60].map((lat) => {
            const cy = 100 - (lat / 90) * 98;
            const rx = Math.cos((lat * Math.PI) / 180) * 98;
            return (
              <ellipse
                key={`lat${lat}`}
                cx="100"
                cy={cy}
                rx={rx}
                ry={rx * 0.18}
                fill="none"
                stroke="#3a3d40"
                strokeWidth="0.4"
              />
            );
          })}
        </svg>
        {/* Pulse hubs */}
        {HUBS.map((h) => (
          <div
            key={h.label}
            className="absolute"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <span className="relative flex h-2 w-2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-50 animate-pulse-amber" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} id="top" className="relative min-h-screen w-full overflow-hidden bg-deepspace">
      {/* Backdrop image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/90918cdf1_generated_af2e03a1.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deepspace/70 via-deepspace/85 to-deepspace" />
        <div className="absolute inset-0 bg-gradient-to-r from-deepspace via-transparent to-deepspace/60" />
      </div>

      <WireframeGlobe />

      {/* Top bar */}
      <div className="relative z-10">
        <div className="h-px w-full hairline" />
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="font-heading text-xl font-semibold tracking-tight-display text-techwhite">
              IBERIX
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal border-l border-tungsten pl-3">
              Global
            </span>
          </a>
          <div className="flex items-center gap-8">
            <LiveStatusTicker />
            <SystemMenuButton />
          </div>
        </header>
        <div className="h-px w-full hairline" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 px-6 md:px-12 pt-20 md:pt-28 pb-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-signal`}>
              01 / Global Command
            </span>
          </div>

          <div className="col-span-12 md:col-span-10">
            <h1
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-techwhite leading-[0.95]`}
              style={{ fontSize: "clamp(2.75rem, 9vw, 9rem)" }}
            >
              One accountable
              <br />
              partner,{" "}
              <span className="text-signal text-glow-amber">wherever</span>
              <br />
              the work happens.
            </h1>

            <div className="mt-12 grid grid-cols-12 gap-6">
              <p className="col-span-12 md:col-span-6 text-techwhite/70 text-lg md:text-xl leading-[1.6] max-w-2xl">
                Iberix Global partners with system integrators, managed service
                providers and telecom operators to deliver on-site engineering
                across borders — from data centre and network deployments to
                field support and dedicated engineering teams.
              </p>
              <div className="col-span-12 md:col-span-6 flex flex-col items-start md:items-end justify-end gap-5">
                <a
                  href="#accountability"
                  className="group inline-flex items-center gap-3 bg-signal text-deepspace px-7 py-4 font-mono text-[12px] uppercase tracking-[0.2em] font-semibold hover:shadow-[0_0_40px_-8px_rgba(253,184,19,0.7)] transition-shadow"
                >
                  Initialize Partnership
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#capabilities"
                  className="font-mono text-[12px] uppercase tracking-[0.2em] text-techwhite/60 hover:text-signal transition-colors"
                >
                  Survey Capabilities ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 border-t border-tungsten">
          {[
            { k: "40+", v: "Countries Deployed" },
            { k: "1,200+", v: "Field Engineers" },
            { k: "24/7", v: "Operations Coverage" },
            { k: "1", v: "Accountable Partner" },
          ].map((s, i) => (
            <div
              key={s.v}
              className={`py-8 px-5 border-r border-tungsten last:border-r-0 ${i > 0 ? "border-l-0 md:border-l md:border-l-tungsten" : ""}`}
            >
              <div className="font-heading text-3xl md:text-5xl font-medium tracking-tight-display text-techwhite">
                {s.k}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/50">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom hairline + scroll cue */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-px w-full hairline" />
        <div className="px-6 md:px-12 py-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-techwhite/40">
          <span>Lat 51.5074° N / Lon 0.1278° W</span>
          <span className="hidden md:block">Scroll to initialize ↓</span>
          <span>Command Center v1.0</span>
        </div>
      </div>
    </section>
  );
}