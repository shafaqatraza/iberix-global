import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/iberix/PageHeader";
import Footer from "@/components/iberix/Footer";
import { LEGAL } from "@/data/legal";
import { useRegion } from "@/i18n/RegionContext";

export default function LegalPage({ doc }) {
  const { lang, t } = useRegion();
  const L = (v) => v[lang];
  const data = LEGAL[doc];

  if (!data) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-6 px-6">
        <span className="font-heading text-2xl font-medium tracking-tight-display text-paper">iberix</span>
        <p className="text-subtle text-lg">{t("legal.notFound")}</p>
        <Link to="/" className="eyebrow text-brand-light hover:text-paper transition-colors">{t("common.return")}</Link>
      </div>
    );
  }

  return (
    <main className="bg-offwhite">
      <PageHeader eyebrow={t(`legal.${doc}`)} title={L(data.title)} tagline={L(data.tagline)} />

      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <span className="eyebrow text-subtle">{t("legal.updated")}: {data.updated}</span>
          <div className="mt-10 flex flex-col gap-10">
            {data.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-heading text-2xl font-medium tracking-tight-display text-ink">{L(s.title)}</h2>
                <p className="mt-3 text-body text-lg leading-[1.7]">{L(s.body)}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t border-line">
            <Link to="/" className="inline-flex items-center gap-2 eyebrow text-brand hover:text-ink transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("common.return")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}