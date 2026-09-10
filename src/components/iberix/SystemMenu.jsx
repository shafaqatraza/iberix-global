import { useEffect, useState } from "react";
import { X } from "lucide-react";

const NAV = [
  {
    group: "Services",
    items: [
      { label: "Data Centre Deployment", href: "#capabilities" },
      { label: "Network Deployment", href: "#capabilities" },
      { label: "Field Support", href: "#capabilities" },
      { label: "Dedicated Engineering Teams", href: "#capabilities" },
    ],
  },
  {
    group: "Regions",
    items: [
      { label: "EMEA", href: "#footprint" },
      { label: "APAC", href: "#footprint" },
      { label: "Americas", href: "#footprint" },
    ],
  },
  {
    group: "Company",
    items: [
      { label: "Global Footprint", href: "#footprint" },
      { label: "Accountability", href: "#accountability" },
      { label: "Initialize Partnership", href: "#accountability" },
    ],
  },
];

export default function SystemMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-techwhite/80 hover:text-signal transition-colors"
        aria-label="Open system menu"
      >
        <span className="flex flex-col gap-[3px]">
          <span className="block h-px w-5 bg-current transition-all group-hover:w-6" />
          <span className="block h-px w-5 bg-current transition-all group-hover:w-6" />
        </span>
        System
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-deepspace/98 backdrop-blur-md flex flex-col">
          <div className="h-px w-full hairline" />
          <div className="flex items-center justify-between px-6 md:px-12 py-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-techwhite/50">
              Iberix / System Navigation
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-techwhite/80 hover:text-signal transition-colors"
              aria-label="Close system menu"
            >
              Close
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-px w-full hairline" />

          <nav className="flex-1 overflow-y-auto px-6 md:px-12 py-10 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-6xl">
              {NAV.map((section) => (
                <div key={section.group} className="flex flex-col">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal mb-6">
                    {section.group}
                  </span>
                  <ul className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-3 py-2 text-2xl md:text-3xl font-heading font-medium tracking-tight-display text-techwhite/70 hover:text-techwhite transition-colors"
                        >
                          <span className="font-mono text-[11px] text-techwhite/30 group-hover:text-signal transition-colors">
                            0{section.items.indexOf(item) + 1}
                          </span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div className="h-px w-full hairline" />
          <div className="px-6 md:px-12 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-techwhite/40">
              One Accountable Partner — Wherever the Work Happens
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-techwhite/40">
              Iberix Global / Command Center
            </span>
          </div>
        </div>
      )}
    </>
  );
}