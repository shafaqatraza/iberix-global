import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/iberix/PageHeader";
import GlobalFootprint from "@/components/iberix/GlobalFootprint";
import Footer from "@/components/iberix/Footer";
import { REGIONS_DATA } from "@/data/regions";
import { useReveal } from "@/hooks/useReveal";
import { useRegion } from "@/i18n/RegionContext";

export default function FootprintPage() {
  const [ref, visible] = useReveal();
  const { lang, t } = useRegion();
  const L = (v) => v[lang];

  const zones = REGIONS_DATA.filter((r) => r.id !== "global");

  return (
    <main className="bg-offwhite">
      <PageHeader eyebrow={t("fp.eyebrow")} title={t("fp.title")} tagline={t("fp.tagline")} />

      {/* Overview */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <p className="text-body text-lg md:text-xl leading-[1.7]">{t("fp.overview")}</p>
        </div>
      </section>

      {/* Interactive map */}
      <GlobalFootprint />

      {/* Zone snapshot */}
      <section ref={ref} className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>{t("fp.zones")}</span>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map((r) => (
              <Link key={r.id} to={`/regions/${r.id}`} className="group bg-offwhite rounded-lg p-7 shadow-soft hover:shadow-soft-lg transition-all">
                <span className="eyebrow text-subtle">{r.label}</span>
                <h3 className="mt-3 font-heading text-2xl font-medium tracking-tight-display text-ink">{L(r.title)}</h3>
                <p className="mt-2 text-body leading-[1.6]">{L(r.tagline)}</p>
                <div className="mt-5 flex items-center gap-4">
                  {r.stats.slice(0, 3).map((s) => (
                    <div key={L(s.k)}>
                      <span className="font-heading text-xl font-medium text-ink tabular-nums">{s.v}</span>
                      <span className="block eyebrow text-subtle mt-1">{L(s.k)}</span>
                    </div>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-2 eyebrow text-brand">
                  {t("common.viewSpec")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto bg-ink-soft rounded-lg p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-heading font-medium tracking-tight-display text-paper" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
              {t("fp.ready")}
            </h2>
            <p className="mt-3 text-subtle text-lg max-w-md leading-[1.6]">{t("fp.readyP")}</p>
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