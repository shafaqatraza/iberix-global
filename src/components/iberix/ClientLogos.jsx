import { useReveal } from "@/hooks/useReveal";
import { useRegion } from "@/i18n/RegionContext";

const CATEGORIES = [
  { key: "clients.catTech", members: ["Microsoft", "Google", "Siemens"] },
  { key: "clients.catFinance", members: ["Santander Bank", "Barclays", "BlackRock", "PayPal", "TF Bank"] },
  { key: "clients.catLife", members: ["Roche", "Cencora", "Abbott"] },
  { key: "clients.catGov", members: ["Qatar Embassy"] },
  { key: "clients.catIndustry", members: ["Mercedes-Benz", "Primark", "BM Supermercado"] },
];

export default function ClientLogos() {
  const [ref, visible] = useReveal();
  const { t } = useRegion();

  return (
    <section ref={ref} className="px-6 md:px-12 py-20 md:py-28 bg-offwhite">
      <div className="max-w-[1600px] mx-auto">
        <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>{t("clients.eyebrow")}</span>
        <h2
          className={`scan-init ${visible ? "is-visible" : ""} mt-4 font-heading font-medium tracking-tight-display text-ink`}
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
        >
          {t("clients.h2")}
        </h2>
        <p className="mt-5 text-body text-lg max-w-2xl leading-[1.6]">{t("clients.intro")}</p>

        <div className="mt-12 flex flex-col gap-10">
          {CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <span className="eyebrow text-subtle">{t(cat.key)}</span>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {cat.members.map((m) => (
                  <div
                    key={m}
                    className="group flex items-center justify-center rounded-lg border border-line bg-paper px-4 py-8 transition-all hover:border-brand hover:shadow-soft"
                  >
                    <span className="font-heading text-lg md:text-xl font-medium tracking-tight-display text-ink/80 group-hover:text-brand transition-colors text-center">
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 eyebrow text-subtle">{t("clients.note")}</p>
      </div>
    </section>
  );
}