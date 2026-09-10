import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { SERVICES } from "@/data/services";
import { useRegion } from "@/i18n/RegionContext";

function ServiceTile({ service, visible }) {
  const [hovered, setHovered] = useState(false);
  const { lang, t } = useRegion();
  const L = (v) => v[lang];

  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-paper shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 ${service.span} ${visible ? "reveal-init is-visible" : "reveal-init"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.image}
          alt={L(service.title)}
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
          {L(service.title)}
        </h3>
        <p className="mt-3 text-body text-base md:text-lg max-w-md leading-[1.6]">
          {L(service.tagline)}
        </p>

        <div
          className={`grid grid-cols-1 gap-3 overflow-hidden transition-all duration-500 ${
            hovered ? "mt-6 max-h-72 opacity-100" : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <div className="h-px w-full bg-line" />
          <p className="text-body text-sm md:text-base leading-[1.6] pt-2">{L(service.desc)}</p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {service.specs.slice(0, 3).map((s) => (
              <div key={L(s.k)} className="flex flex-col">
                <span className="eyebrow text-subtle">{L(s.k)}</span>
                <span className="text-[13px] text-body-dark mt-1 leading-snug font-medium">
                  {L(s.v)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          to={`/services/${service.id}`}
          className="mt-6 inline-flex items-center gap-2 eyebrow text-brand hover:text-brand-deep transition-colors"
        >
          {t("common.viewSpec")}
          <ArrowUpRight
            className={`h-4 w-4 transition-transform duration-500 ${
              hovered ? "-translate-y-0.5 translate-x-0.5" : ""
            }`}
          />
        </Link>
      </div>
    </div>
  );
}

export default function CapabilitiesMatrix() {
  const [ref, visible] = useReveal();
  const { t } = useRegion();

  return (
    <section ref={ref} id="capabilities" className="relative bg-offwhite px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>
              {t("cap.eyebrow")}
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-ink leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              {t("cap.h2")}
            </h2>
            <p className="mt-6 text-body text-lg max-w-2xl leading-[1.6]">
              {t("cap.intro")}
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