import { useMemo, useState } from "react";
import { Search, ChevronDown, Check, X, Globe2, MapPin, Users } from "lucide-react";
import { COVERAGE, COVERAGE_REGION_STATS, COVERAGE_ENGINEERS, COVERAGE_TOTAL } from "@/data/coverage";
import { useRegion } from "@/i18n/RegionContext";

const REGION_ORDER = ["APAC", "Europe", "North America", "MENA", "Africa", "LATAM", "Global"];

export default function CoverageExplorer() {
  const { t } = useRegion();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [open, setOpen] = useState({});

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filtered = useMemo(() => {
    return COVERAGE.filter((r) => {
      if (region !== "All" && r.region !== region) return false;
      if (!q) return true;
      return (
        r.country.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q)
      );
    });
  }, [query, region]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      if (!map[r.region]) map[r.region] = {};
      if (!map[r.region][r.country]) map[r.region][r.country] = [];
      map[r.region][r.country].push(r);
    });
    return map;
  }, [filtered]);

  const regions = REGION_ORDER.filter((r) => grouped[r]);
  const pillRegions = ["All", ...REGION_ORDER];

  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const isOpen = (key) => isSearching || !!open[key];

  const summary = [
    { icon: Globe2, k: COVERAGE_TOTAL.countries, v: t("cov.totalCountries") },
    { icon: MapPin, k: COVERAGE_TOTAL.cities, v: t("cov.totalCities") },
    { icon: Users, k: REGION_ORDER.length, v: t("cov.totalZones") },
  ];

  return (
    <section className="px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-[1600px] mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {summary.map((s) => (
            <div key={s.v} className="bg-paper rounded-lg p-7 shadow-soft flex items-center gap-5">
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-mint text-brand-deep shrink-0">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <span className="font-heading text-3xl font-medium tracking-tight-display text-ink tabular-nums">{s.k}</span>
                <span className="block eyebrow text-subtle mt-1">{s.v}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {pillRegions.map((r) => {
              const count = r === "All" ? COVERAGE.length : COVERAGE_REGION_STATS.find((s) => s.region === r)?.locations || 0;
              const activePill = region === r;
              return (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full eyebrow border transition-all ${
                    activePill
                      ? "border-brand bg-brand text-paper"
                      : "border-line bg-paper text-body hover:border-brand hover:text-ink"
                  }`}
                >
                  {r === "All" ? t("cov.all") : r}
                  <span className={`tabular-nums ${activePill ? "text-paper/70" : "text-subtle"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("cov.searchPh")}
              className="w-full bg-paper rounded-full border border-line pl-11 pr-10 py-3 text-ink placeholder:text-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
            />
            {isSearching && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full flex items-center justify-center text-subtle hover:text-ink hover:bg-offwhite transition-colors"
                aria-label={t("cov.clear")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 mb-8 eyebrow text-subtle">
          <Legend tag={t("cov.sbd")} label={t("cov.sbdFull")} />
          <Legend tag={t("cov.nbd")} label={t("cov.nbdFull")} />
          <Legend tag={t("cov.fte")} label={t("cov.fteFull")} />
        </div>

        {/* Results */}
        {regions.length === 0 ? (
          <div className="bg-paper rounded-lg p-12 text-center shadow-soft">
            <p className="text-body text-lg">{t("cov.noResults")}</p>
            <button
              onClick={() => { setQuery(""); setRegion("All"); }}
              className="mt-4 eyebrow text-brand hover:text-ink transition-colors"
            >
              {t("cov.clear")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {regions.map((reg) => {
              const countries = Object.keys(grouped[reg]).sort();
              const eng = COVERAGE_ENGINEERS[reg];
              const locCount = COVERAGE_REGION_STATS.find((s) => s.region === reg)?.locations || 0;
              return (
                <div key={reg} className="bg-paper rounded-lg shadow-soft overflow-hidden">
                  <div className="flex items-center justify-between px-6 md:px-8 py-5 bg-offwhite border-b border-line">
                    <div className="flex items-baseline gap-4">
                      <h3 className="font-heading text-2xl font-medium tracking-tight-display text-ink">{reg}</h3>
                      <span className="eyebrow text-subtle">
                        {isSearching ? filtered.filter((r) => r.region === reg).length : locCount} {t("cov.locations")}
                      </span>
                    </div>
                    {eng && (
                      <span className="eyebrow text-brand-deep bg-mint rounded-full px-3 py-1">
                        {eng} {t("cov.engineers")}
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-line">
                    {countries.map((country) => {
                      const cities = grouped[reg][country];
                      const key = `${reg}|${country}`;
                      const expanded = isOpen(key);
                      return (
                        <div key={country}>
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex items-center justify-between px-6 md:px-8 py-4 text-left hover:bg-offwhite/60 transition-colors"
                          >
                            <span className="font-heading text-lg font-medium text-ink">{country}</span>
                            <span className="flex items-center gap-3">
                              <span className="eyebrow text-subtle tabular-nums">
                                {cities.length} {t("cov.cities").toLowerCase()}
                              </span>
                              <ChevronDown className={`h-4 w-4 text-subtle transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </span>
                          </button>
                          {expanded && (
                            <div className="px-6 md:px-8 pb-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {cities.map((c) => (
                                  <div key={c.id} className="flex items-center justify-between gap-3 rounded-md bg-offwhite/70 px-4 py-3">
                                    <span className="text-ink text-sm font-medium truncate">{c.city}</span>
                                    <span className="flex items-center gap-1.5 shrink-0">
                                      <Badge on={c.sbd} label={t("cov.sbd")} title={t("cov.sbdFull")} />
                                      <Badge on={c.nbd} label={t("cov.nbd")} title={t("cov.nbdFull")} />
                                      <Badge on={c.fte} label={t("cov.fte")} title={t("cov.fteFull")} />
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function Legend({ tag, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-brand text-paper">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="text-ink font-semibold">{tag}</span>
      <span className="text-subtle normal-case tracking-normal">{label}</span>
    </span>
  );
}

function Badge({ on, label, title }) {
  if (!on) {
    return <span className="h-5 w-5 rounded-full border border-line" title={`${label}: —`} />;
  }
  return (
    <span
      title={title}
      className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-brand text-paper"
    >
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}