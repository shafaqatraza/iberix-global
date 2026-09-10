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
    desc: "Dedicated, in-country engineering pods operating under your standards — managed, scaled and accounted for by iberix.",
    span: "md:col-span-7",
  },
];

function ServiceTile({ service, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-paper shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 ${service.span} ${visible ? "reveal-init is-visible" : "reveal-init"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className={`h-full w-full object-cover transition-all duration-700 ${
            hovered ? "scale-105" : "scale-100"
          }`}
        />
        <div
          className={`absolute inset-0 blueprint-grid transition-opacity duration-700 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute top-5 left-5">
          <span className="eyebrow text-paper bg-ink/40 backdrop-blur-sm rounded-full px-3 py-1">
            {service.index} / Service
          </span>
        </div>
      </div>

      <div className="p-7 md:p-9">
        <h3 className="font-heading text-2xl md:text-3xl font-medium tracking-tight-display text-ink leading-tight">
          {service.title}
        </h3>
        <p className="mt-3 text-body text-base md:text-lg max-w-md leading-[1.6]">
          {service.tagline}
        </p>

        <div
          className={`grid grid-cols-1 gap-3 overflow-hidden transition-all duration-500 ${
            hovered ? "mt-6 max-h-72 opacity-100" : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <div className="h-px w-full bg-line" />
          <p className="text-body text-sm md:text-base leading-[1.6] pt-2">{service.desc}</p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {service.specs.map((s) => (
              <div key={s.k} className="flex flex-col">
                <span className="eyebrow text-subtle">{s.k}</span>
                <span className="text-[13px] text-body-dark mt-1 leading-snug font-medium">
                  {s.v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 eyebrow text-brand">
          View spec sheet
          <ArrowUpRight
            className={`h-4 w-4 transition-transform duration-500 ${
              hovered ? "-translate-y-0.5 translate-x-0.5" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default function CapabilitiesMatrix() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} id="capabilities" className="relative bg-offwhite px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>
              02 / Capabilities
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-ink leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              The capabilities matrix.
            </h2>
            <p className="mt-6 text-body text-lg max-w-2xl leading-[1.6]">
              Four interlocking engineering disciplines. One accountable partner.
              Hover any module to open its technical specification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {SERVICES.map((s) => (
            <ServiceTile key={s.id} service={s} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}