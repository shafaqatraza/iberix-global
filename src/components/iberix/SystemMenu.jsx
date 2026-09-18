import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Logo from "./Logo";
import { useRegion } from "@/i18n/RegionContext";
import { SERVICES } from "@/data/services";

export default function SystemMenu() {
  const [open, setOpen] = useState(false);
  const { lang, t } = useRegion();
  const L = (v) => v[lang];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const NAV = [
    {
      group: t("sys.groupServices"),
      items: SERVICES.map((s) => ({ label: L(s.title), href: `/services/${s.id}` })),
    },
    {
      group: t("sys.groupRegions"),
      items: [
        { label: "EMEA", href: "/regions/emea" },
        { label: "APAC", href: "/regions/apac" },
        { label: "Americas", href: "/regions/americas" },
        { label: t("f.globalCoord"), href: "/regions/global" },
      ],
    },
    {
      group: t("sys.groupCompany"),
      items: [
        { label: t("f.footprint"), href: "/footprint" },
        { label: t("f.coverage"), href: "/coverage" },
        { label: t("f.accountability"), href: "/accountability" },
        { label: t("f.partnership"), href: "/partnership" },
      ],
    },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 eyebrow text-paper/80 hover:text-brand-light transition-colors"
        aria-label="Open system menu"
      >
        <span className="flex flex-col gap-[3px]">
          <span className="block h-px w-5 bg-current transition-all group-hover:w-6" />
          <span className="block h-px w-5 bg-current transition-all group-hover:w-6" />
        </span>
        {t("sys.system")}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100] bg-ink flex flex-col">
          <div className="h-px w-full bg-white/10" />
          <div className="flex items-center justify-between px-6 md:px-12 py-6">
            <Logo variant="light" className="text-xl" />
            <div className="flex items-center gap-6">
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 eyebrow text-paper/80 hover:text-brand-light transition-colors"
                aria-label="Close system menu"
              >
                {t("sys.close")}
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="h-px w-full bg-white/10" />

          <nav className="flex-1 overflow-y-auto px-6 md:px-12 py-10 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-6xl">
              {NAV.map((section) => (
                <div key={section.group} className="flex flex-col">
                  <span className="eyebrow text-brand-light mb-6">{section.group}</span>
                  <ul className="flex flex-col gap-1">
                    {section.items.map((item, i) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-3 py-2 font-heading font-medium tracking-tight-display text-paper/70 hover:text-paper transition-colors"
                          style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}
                        >
                          <span className="eyebrow text-subtle group-hover:text-brand-light transition-colors">
                            0{i + 1}
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div className="h-px w-full bg-white/10" />
          <div className="px-6 md:px-12 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <span className="eyebrow text-subtle">
              {t("sys.tagline")}
            </span>
            <span className="eyebrow text-subtle">iberix / Operations Hub</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}