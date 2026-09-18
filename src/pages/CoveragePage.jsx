import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/iberix/PageHeader";
import CoverageExplorer from "@/components/iberix/CoverageExplorer";
import Footer from "@/components/iberix/Footer";
import { useRegion } from "@/i18n/RegionContext";

export default function CoveragePage() {
  const { t } = useRegion();

  return (
    <main className="bg-offwhite">
      <PageHeader eyebrow={t("cov.eyebrow")} title={t("cov.title")} tagline={t("cov.tagline")} />

      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <p className="text-body text-lg md:text-xl leading-[1.7]">{t("cov.intro")}</p>
        </div>
      </section>

      <CoverageExplorer />

      <section className="bg-ink px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto bg-ink-soft rounded-lg p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-heading font-medium tracking-tight-display text-paper" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
              {t("cov.ready")}
            </h2>
            <p className="mt-3 text-subtle text-lg max-w-md leading-[1.6]">{t("cov.readyP")}</p>
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