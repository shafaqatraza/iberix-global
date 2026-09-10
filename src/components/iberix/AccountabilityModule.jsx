import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useReveal } from "@/hooks/useReveal";

const SERVICES = [
  "Data Centre Deployment",
  "Network Deployment",
  "Field Support",
  "Dedicated Engineering Teams",
  "Multiple",
];
const REGIONS = ["EMEA", "APAC", "Americas", "Global"];

export default function AccountabilityModule() {
  const [ref, visible] = useReveal();
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
      setError("Initialization failed. Please retry or contact ops@iberix.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="accountability" className="relative bg-paper px-6 md:px-12 py-28 md:py-40">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>
              04 / Accountability
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-ink leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              Initialize partnership.
            </h2>
            <p className="mt-6 text-body text-lg max-w-2xl leading-[1.6]">
              One accountable partner starts here. Share your engagement scope and
              our operations team will respond within one business day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-offwhite rounded-lg p-8 md:p-12 shadow-soft">
            {done ? (
              <div className="flex flex-col items-start gap-6 py-12">
                <CheckCircle2 className="h-12 w-12 text-brand" />
                <div>
                  <h3 className="font-heading text-3xl font-medium tracking-tight-display text-ink">
                    Partnership initialized.
                  </h3>
                  <p className="mt-3 text-body text-lg leading-[1.6] max-w-md">
                    Your request is logged in the iberix command center. An
                    operations lead will reach out within one business day.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDone(false);
                    setForm({ company: "", contact_name: "", email: "", region: "Global", service: "Multiple", scope: "" });
                  }}
                  className="eyebrow text-brand hover:text-ink transition-colors"
                >
                  ← Log another engagement
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Company" required>
                    <input required value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="System integrator / MSP / operator" className="iberix-input" />
                  </Field>
                  <Field label="Contact Name" required>
                    <input required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} placeholder="Full name" className="iberix-input" />
                  </Field>
                </div>

                <Field label="Work Email" required>
                  <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@company.com" className="iberix-input" />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Target Region">
                    <select value={form.region} onChange={(e) => update("region", e.target.value)} className="iberix-input">
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Service of Interest">
                    <select value={form.service} onChange={(e) => update("service", e.target.value)} className="iberix-input">
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Project Scope">
                  <textarea value={form.scope} onChange={(e) => update("scope", e.target.value)} placeholder="Countries, scale, timeline, team size..." rows={4} className="iberix-input resize-none" />
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
                      Initializing…
                    </>
                  ) : (
                    <>
                      Initialize Partnership
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-mint rounded-lg p-8 md:p-12 flex flex-col">
            <span className="eyebrow text-brand-deep">The Accountability Promise</span>
            <ul className="mt-8 flex flex-col gap-6">
              {[
                "One single point of contact across every country.",
                "Documented handover and commissioning sign-off.",
                "Engineers vetted, insured and accountable to your SLAs.",
                "Transparent escalation — no layers, no finger-pointing.",
              ].map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="eyebrow text-brand-deep pt-1">0{i + 1}</span>
                  <span className="text-body-dark text-base md:text-lg leading-[1.6]">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <div className="h-px w-full bg-brand-deep/15" />
              <div className="mt-5 eyebrow text-brand-deep leading-relaxed">
                Response within 1 business day
                <br />
                NDA on request — ops@iberix.global
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