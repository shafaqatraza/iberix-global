import { useParams, Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, MapPin } from "lucide-react";
import PageHeader from "@/components/iberix/PageHeader";
import Footer from "@/components/iberix/Footer";
import { REGIONS_DATA } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";
import { useRegion } from "@/i18n/RegionContext";

export default function RegionPage() {
  const { id } = useParams();
  const region = REGIONS_DATA.find((r) => r.id === id);
  const [ref, visible] = useReveal();
  const { lang, t } = useRegion();
  const L = (v) => v[lang];

  if (!region) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-6 px-6">
        <Link to="/"><span className="font-heading text-2xl font-medium tracking-tight-display text-paper">iberix</span></Link>
        <p className="text-subtle text-lg">{t("reg.notFound")}</p>
        <Link to="/" className="eyebrow text-brand-light hover:text-paper transition-colors">
          {t("common.return")}
        </Link>
      </div>
    );
  }

  const others = REGIONS_DATA.filter((r) => r.id !== region.id);
  const coverageServices = SERVICES.filter((s) => region.coverage.includes(s.id));

  return (
    <main className="bg-offwhite">
      <PageHeader eyebrow={t("reg.eyebrow")} title={L(region.title)} tagline={L(region.tagline)} image={region.image} />

      {/* Overview */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <p className="text-body text-lg md:text-xl leading-[1.7]">{L(region.overview)}</p>
        </div>
      </section>

      {/* Stats */}
      <section ref={ref} className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>{t("reg.stats")}</span>
          <h2 className={`scan-init ${visible ? "is-visible" : ""} mt-4 font-heading font-medium tracking-tight-display text-ink`} style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
            {t("reg.statsDesc")}
          </h2>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {region.stats.map((s) => (
              <div key={L(s.k)} className="bg-offwhite rounded-lg p-6 shadow-soft">
                <span className="eyebrow text-subtle">{L(s.k)}</span>
                <p className="mt-3 text-ink font-heading text-3xl font-medium tabular-nums leading-snug">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hubs */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className="eyebrow text-brand">{t("reg.hubs")}</span>
          <h2 className="mt-4 font-heading font-medium tracking-tight-display text-ink" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
            {t("reg.hubsDesc")}
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {region.hubs.map((h) => (
              <div key={h.city} className="bg-paper rounded-lg p-6 shadow-soft flex items-start gap-4">
                <MapPin className="h-5 w-5 text-brand mt-1 shrink-0" />
                <div>
                  <h3 className="font-heading text-xl font-medium text-ink">{h.city}</h3>
                  <p className="mt-1 text-body leading-[1.6]">{L(h.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="bg-ink px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className="eyebrow text-brand-light">{t("reg.coverage")}</span>
          <h2 className="mt-4 font-heading font-medium tracking-tight-display text-paper" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
            {t("reg.coverageDesc")}
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coverageServices.map((s) => (
              <Link key={s.id} to={`/services/${s.id}`} className="group bg-ink-soft rounded-lg p-7 hover:bg-[#243029] transition-colors">
                <span className="eyebrow text-brand-light">{s.index}</span>
                <h3 className="mt-4 font-heading text-xl font-medium tracking-tight-display text-paper">{L(s.title)}</h3>
                <p className="mt-2 text-subtle leading-[1.6]">{L(s.tagline)}</p>
                <span className="mt-5 inline-flex items-center gap-2 eyebrow text-brand-light">
                  {t("common.viewSpec")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other zones */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className="eyebrow text-brand">{t("reg.otherRegions")}</span>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((r) => (
              <Link key={r.id} to={`/regions/${r.id}`} className="group bg-paper rounded-lg p-7 shadow-soft hover:shadow-soft-lg transition-all">
                <span className="eyebrow text-subtle">{r.label}</span>
                <h3 className="mt-3 font-heading text-2xl font-medium tracking-tight-display text-ink">{L(r.title)}</h3>
                <p className="mt-2 text-body leading-[1.6]">{L(r.tagline)}</p>
                <span className="mt-5 inline-flex items-center gap-2 eyebrow text-brand">
                  {t("common.viewSpec")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto bg-mint rounded-lg p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-heading font-medium tracking-tight-display text-ink" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
              {t("reg.ready")}
            </h2>
            <p className="mt-3 text-body-dark text-lg max-w-md leading-[1.6]">{t("reg.readyP")}</p>
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