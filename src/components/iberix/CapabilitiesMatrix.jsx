import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const SERVICES = [
  {
    id: "datacentre",
    index: "02",
    title: "Data Centre Deployment",
    tagline: "Rack, stack and commission at scale.",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/d511ece48_generated_e23d89db.jpg",
    specs: [
      { k: "Discipline", v: "Civil, Mechanical, Electrical" },
      { k: "Scope", v: "Greenfield & retrofit" },
      { k: "SLA", v: "Commissioning sign-off" },
    ],
    desc: "Full lifecycle data centre build — from power and cooling commissioning to rack-level infrastructure and structured cabling.",
    span: "md:col-span-7",
  },
  {
    id: "network",
    index: "03",
    title: "Network Deployment",
    tagline: "Edge to core, across borders.",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/6455a70d6_generated_b67c6955.jpg",
    specs: [
      { k: "Layer", v: "L1–L3 field engineering" },
      { k: "Footprint", v: "Multi-country rollouts" },
      { k: "Turnaround", v: "Site-ready in 72h" },
    ],
    desc: "Cross-border network rollouts — fibre splicing, patching, RAN and transport activation with documented handover.",
    span: "md:col-span-5",
  },
  {
    id: "field",
    index: "04",
    title: "Field Support",
    tagline: "Boots on the ground, on call.",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/3cd71edaf_generated_f79545e1.jpg",
    specs: [
      { k: "Coverage", v: "EMEA / APAC / Americas" },
      { k: "Response", v: "4-hour on-site" },
      { k: "Model", v: "Per-incident or retained" },
    ],
    desc: "Break-fix and proactive field support — dispatch, diagnose and resolve on-site with a single accountable escalation path.",
    span: "md:col-span-5",
  },
  {
    id: "dedicated",
    index: "05",
    title: "Dedicated Engineering Teams",
    tagline: "Your force, our accountability.",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/ce9b6bc0a_generated_8c8e82bd.jpg",
    specs: [
      { k: "Model", v: "Embedded / managed" },
      { k: "Sizing", v: "1 to 50+ engineers" },
      { k: "Governance", v: "Single SPOC" },
    ],
    desc: "Dedicated, in-country engineering pods operating under your standards — managed, scaled and accounted for by Iberix.",
    span: "md:col-span-7",
  },
];

function ServiceTile({ service, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`group relative overflow-hidden border-tungsten bg-[#0c0d0e] ${service.span} ${visible ? "reveal-init is-visible" : "reveal-init"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minHeight: "440px" }}
    >
      {/* Image with blueprint overlay */}
      <div className="absolute inset-0">
        <img
          src={service.image}
          alt={service.title}
          className={`h-full w-full object-cover transition-all duration-700 ${
            hovered ? "blur-0 scale-105 opacity-60" : "blur-sm scale-100 opacity-30"
          }`}
        />
        <div className="absolute inset-0 bg-deepspace/70" />
        <div
          className={`absolute inset-0 blueprint-grid transition-opacity duration-700 ${
            hovered ? "opacity-10" : "opacity-60"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deepspace via-deepspace/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-9">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            {service.index} / Service
          </span>
          <ArrowUpRight
            className={`h-5 w-5 transition-all duration-500 ${
              hovered ? "text-signal -translate-y-0.5 translate-x-0.5" : "text-techwhite/40"
            }`}
          />
        </div>

        <div className="mt-auto">
          <h3 className="font-heading text-2xl md:text-4xl font-medium tracking-tight-display text-techwhite leading-tight">
            {service.title}
          </h3>
          <p className="mt-3 text-techwhite/60 text-base md:text-lg max-w-md leading-[1.6]">
            {service.tagline}
          </p>

          {/* Spec sheet reveal */}
          <div
            className={`grid grid-cols-1 gap-3 overflow-hidden transition-all duration-500 ${
              hovered ? "mt-6 max-h-72 opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <div className="h-px w-full hairline" />
            <p className="text-techwhite/70 text-sm md:text-base leading-[1.6] pt-2">
              {service.desc}
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {service.specs.map((s) => (
                <div key={s.k} className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-techwhite/40">
                    {s.k}
                  </span>
                  <span className="font-mono text-[11px] text-techwhite/90 mt-1 leading-snug">
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CapabilitiesMatrix() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} id="capabilities" className="relative bg-deepspace px-6 md:px-12 py-32 md:py-44">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} font-mono text-[11px] uppercase tracking-[0.22em] text-signal`}>
              02 / Capabilities
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-techwhite leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
            >
              The capabilities matrix.
            </h2>
            <p className="mt-6 text-techwhite/60 text-lg max-w-2xl leading-[1.6]">
              Four interlocking engineering disciplines. One accountable partner.
              Hover any module to open its technical specification.
            </p>
          </div>
        </div>

        {/* Interlocking grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-tungsten border border-tungsten">
          {SERVICES.map((s) => (
            <ServiceTile key={s.id} service={s} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}