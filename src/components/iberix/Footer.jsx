import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { useRegion } from "@/i18n/RegionContext";
import { SERVICES } from "@/data/services";

export default function Footer() {
  const { lang, t } = useRegion();
  const L = (v) => v[lang];

  const serviceLinks = SERVICES.map((s) => ({ label: L(s.title), to: `/services/${s.id}` }));
  const regionLinks = [
    { label: "EMEA", to: "/regions/emea" },
    { label: "APAC", to: "/regions/apac" },
    { label: "Americas", to: "/regions/americas" },
    { label: t("f.globalCoord"), to: "/regions/global" },
  ];
  const companyLinks = [
    { label: t("f.footprint"), to: "/footprint" },
    { label: t("f.coverage"), to: "/coverage" },
    { label: t("f.accountability"), to: "/accountability" },
    { label: t("f.partnership"), to: "/partnership" },
  ];

  const cols = [
    { title: t("f.colServices"), links: serviceLinks },
    { title: t("f.colRegions"), links: regionLinks },
    { title: t("f.colCompany"), links: companyLinks },
  ];

  return (
    <footer className="relative bg-ink">
      <div className="h-px w-full bg-white/10" />
      <div className="px-6 md:px-12 py-20 md:py-28 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <Logo variant="light" className="text-2xl" />
            <p className="mt-6 text-subtle text-lg leading-[1.6] max-w-md">
              {t("f.desc")}
            </p>
            <Link
              to="/partnership"
              className="group mt-8 inline-flex items-center gap-3 eyebrow text-brand-light hover:text-paper transition-colors"
            >
              {t("common.initialize")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <div className="mt-10 pt-6 border-t border-white/10 max-w-xs">
              <span className="eyebrow text-subtle">{t("f.registeredOffice")}</span>
              <p className="mt-3 text-subtle text-sm leading-relaxed">
                Office 674, 18 Young St, UNIT LGE<br />
                Edinburgh, EH2 4JB, Scotland
              </p>
              <a
                href="tel:+447473950424"
                className="mt-4 inline-flex items-center gap-2 text-subtle hover:text-brand-light transition-colors text-sm"
              >
                <span className="eyebrow text-subtle/70">{t("f.contact")}</span>
                <span>{t("f.phone")}</span>
              </a>
              <a
                href="mailto:info@iberix.global"
                className="inline-flex items-center gap-2 text-subtle hover:text-brand-light transition-colors text-sm"
              >
                <span className="eyebrow text-subtle/70">Email</span>
                <span>{t("f.email")}</span>
              </a>
              <p className="mt-3 eyebrow text-subtle/70 leading-relaxed">{t("f.legalName")}</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {cols.map((c) => (
              <div key={c.title} className="flex flex-col">
                <span className="eyebrow text-subtle mb-5">{c.title}</span>
                <ul className="flex flex-col gap-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-subtle hover:text-brand-light transition-colors text-base">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="eyebrow text-subtle">
            {t("f.rights", { year: new Date().getFullYear() })}
          </span>
          <div className="flex items-center gap-6 eyebrow text-subtle">
            <Link to="/privacy" className="hover:text-brand-light transition-colors">{t("f.privacy")}</Link>
            <Link to="/terms" className="hover:text-brand-light transition-colors">{t("f.terms")}</Link>
            <span>Operations Hub v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}