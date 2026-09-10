import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useReveal } from "@/hooks/useReveal";
import { SERVICES } from "@/data/services";
import { useRegion } from "@/i18n/RegionContext";

const REGIONS = ["EMEA", "APAC", "Americas", "Global"];

export default function AccountabilityModule({ showHeader = true }) {
  const [ref, visible] = useReveal();
  const { lang, t } = useRegion();
  const L = (v) => v[lang];

  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    region: "Global",
    service: "Multiple",
    scope: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await base44.entities.Lead.create({ ...form, status: "new" });
      setDone(true);
    } catch (err) {
      setError(t("acc.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const promises = [t("acc.promise1"), t("acc.promise2"), t("acc.promise3"), t("acc.promise4")];

  return (
    <section ref={ref} id="accountability" className="relative bg-paper px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto">
        {showHeader && (
          <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
            <div className="col-span-12 md:col-span-2">
              <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>
                {t("acc.eyebrow")}
              </span>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h2
                className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-ink leading-[1.05]`}
                style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
              >
                {t("acc.h2")}
              </h2>
              <p className="mt-6 text-body text-lg max-w-2xl leading-[1.6]">
                {t("acc.intro")}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-offwhite rounded-lg p-8 md:p-12 shadow-soft">
            {done ? (
              <div className="flex flex-col items-start gap-6 py-12">
                <CheckCircle2 className="h-12 w-12 text-brand" />
                <div>
                  <h3 className="font-heading text-3xl font-medium tracking-tight-display text-ink">
                    {t("acc.success.h")}
                  </h3>
                  <p className="mt-3 text-body text-lg leading-[1.6] max-w-md">
                    {t("acc.success.p")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDone(false);
                    setForm({ company: "", contact_name: "", email: "", region: "Global", service: "Multiple", scope: "" });
                  }}
                  className="eyebrow text-brand hover:text-ink transition-colors"
                >
                  {t("acc.logAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label={t("acc.company")} required>
                    <input required value={form.company} onChange={(e) => update("company", e.target.value)} placeholder={t("acc.phCompany")} className="iberix-input" />
                  </Field>
                  <Field label={t("acc.contactName")} required>
                    <input required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} placeholder={t("acc.phContact")} className="iberix-input" />
                  </Field>
                </div>

                <Field label={t("acc.workEmail")} required>
                  <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@company.com" className="iberix-input" />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label={t("acc.targetRegion")}>
                    <select value={form.region} onChange={(e) => update("region", e.target.value)} className="iberix-input">
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t("acc.serviceInterest")}>
                    <select value={form.service} onChange={(e) => update("service", e.target.value)} className="iberix-input">
                      <option value="Multiple">{lang === "es" ? "Varios" : "Multiple"}</option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={L(s.title)}>{L(s.title)}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label={t("acc.projectScope")}>
                  <textarea value={form.scope} onChange={(e) => update("scope", e.target.value)} placeholder={t("acc.phScope")} rows={4} className="iberix-input resize-none" />
                </Field>

                {error && <p className="text-sm text-brand-deep font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center justify-center gap-3 bg-brand text-paper rounded-full px-8 py-4 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("acc.submitting")}
                    </>
                  ) : (
                    <>
                      {t("common.initialize")}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-mint rounded-lg p-8 md:p-12 flex flex-col">
            <span className="eyebrow text-brand-deep">{t("acc.promise")}</span>
            <ul className="mt-8 flex flex-col gap-6">
              {promises.map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="eyebrow text-brand-deep pt-1">0{i + 1}</span>
                  <span className="text-body-dark text-base md:text-lg leading-[1.6]">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <div className="h-px w-full bg-brand-deep/15" />
              <div className="mt-5 eyebrow text-brand-deep leading-relaxed">
                {t("acc.response")}
                <br />
                {t("acc.nda")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-2 group">
      <span className="eyebrow text-subtle group-focus-within:text-brand transition-colors">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      {children}
    </label>
  );
}