import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import PageHeader from "@/components/iberix/PageHeader";
import Footer from "@/components/iberix/Footer";
import { useReveal } from "@/hooks/useReveal";
import { useRegion } from "@/i18n/RegionContext";

export default function AccountabilityPage() {
  const [ref, visible] = useReveal();
  const { t } = useRegion();

  const promises = [t("acc.promise1"), t("acc.promise2"), t("acc.promise3"), t("acc.promise4")];
  const gov = [
    { t: t("acp.gov1t"), d: t("acp.gov1d") },
    { t: t("acp.gov2t"), d: t("acp.gov2d") },
    { t: t("acp.gov3t"), d: t("acp.gov3d") },
    { t: t("acp.gov4t"), d: t("acp.gov4d") },
    { t: t("acp.gov5t"), d: t("acp.gov5d") },
    { t: t("acp.gov6t"), d: t("acp.gov6d") },
  ];

  return (
    <main className="bg-offwhite">
      <PageHeader eyebrow={t("acp.eyebrow")} title={t("acp.title")} tagline={t("acp.tagline")} />

      {/* Promise */}
      <section ref={ref} className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>{t("acp.promiseH")}</span>
          <h2 className={`scan-init ${visible ? "is-visible" : ""} mt-4 font-heading font-medium tracking-tight-display text-ink`} style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
            {t("acp.promiseIntro")}
          </h2>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {promises.map((p, i) => (
              <li key={i} className="flex items-start gap-4 bg-paper rounded-lg px-6 py-5 shadow-soft">
                <span className="eyebrow text-brand pt-1">0{i + 1}</span>
                <span className="text-body-dark text-lg leading-[1.6]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Governance */}
      <section className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className="eyebrow text-brand">{t("acp.govH")}</span>
          <h2 className="mt-4 font-heading font-medium tracking-tight-display text-ink" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
            {t("acp.govIntro")}
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gov.map((g, i) => (
              <div key={i} className="bg-offwhite rounded-lg p-7 shadow-soft">
                <Check className="h-6 w-6 text-brand" />
                <h3 className="mt-4 font-heading text-xl font-medium text-ink">{g.t}</h3>
                <p className="mt-2 text-body leading-[1.6]">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA */}
      <section className="bg-ink px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto max-w-3xl">
          <span className="eyebrow text-brand-light">{t("acp.slaH")}</span>
          <h2 className="mt-4 font-heading font-medium tracking-tight-display text-paper" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
            {t("acp.slaH")}
          </h2>
          <p className="mt-6 text-subtle text-lg md:text-xl leading-[1.7]">{t("acp.slaP")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto bg-mint rounded-lg p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-heading font-medium tracking-tight-display text-ink" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
              {t("acp.ready")}
            </h2>
            <p className="mt-3 text-body-dark text-lg max-w-md leading-[1.6]">{t("acp.readyP")}</p>
          </div>
          <Link to="/partnership" className="group inline-flex items-center gap-3 bg-brand text-paper rounded-full px-8 py-4 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-shadow shrink-0">
            {t("common.initialize")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}