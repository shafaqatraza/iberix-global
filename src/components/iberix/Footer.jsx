import { ArrowUpRight } from "lucide-react";

const COLS = [
  {
    title: "Services",
    links: [
      "Data Centre Deployment",
      "Network Deployment",
      "Field Support",
      "Dedicated Engineering Teams",
    ],
  },
  {
    title: "Regions",
    links: ["EMEA", "APAC", "Americas", "Global Coordination"],
  },
  {
    title: "Company",
    links: ["Global Footprint", "Accountability", "Partnership", "Command Center"],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-deepspace border-t border-tungsten">
      <div className="h-px w-full hairline" />
      <div className="px-6 md:px-12 py-20 md:py-28 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="font-heading text-2xl font-semibold tracking-tight-display text-techwhite">
                IBERIX
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal border-l border-tungsten pl-3">
                Global
              </span>
            </div>
            <p className="mt-6 text-techwhite/60 text-lg leading-[1.6] max-w-md">
              IT infrastructure services and technical workforce. One accountable
              partner for on-site engineering across borders.
            </p>
            <a
              href="#accountability"
              className="group mt-8 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-signal hover:text-techwhite transition-colors"
            >
              Initialize Partnership
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="col-span-12 md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {COLS.map((c) => (
              <div key={c.title} className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-techwhite/40 mb-5">
                  {c.title}
                </span>
                <ul className="flex flex-col gap-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#accountability"
                        className="text-techwhite/70 hover:text-signal transition-colors text-base"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-tungsten flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/40">
            © {new Date().getFullYear()} Iberix Global. All rights reserved.
          </span>
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/40">
            <a href="#top" className="hover:text-signal transition-colors">Privacy</a>
            <a href="#top" className="hover:text-signal transition-colors">Terms</a>
            <span>Command Center v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}