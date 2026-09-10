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
    <section ref={ref} id="accountability" className="relative bg-deepspace px-6 md:px-12 py-32 md:py-44 border-t border-tungsten">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-2">
            <span className={`scan-init ${visible ? "is-visible" : ""} font-mono text-[11px] uppercase tracking-[0.22em] text-signal`}>
              04 / Accountability
            </span>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2
              className={`scan-init ${visible ? "is-visible" : ""} font-heading font-medium tracking-tight-display text-techwhite leading-[1.05]`}
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
            >
              Initialize partnership.
            </h2>
            <p className="mt-6 text-techwhite/60 text-lg max-w-2xl leading-[1.6]">
              One accountable partner starts here. Share your engagement scope and
              our operations team will respond within one business day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-tungsten border border-tungsten">
          {/* Form */}
          <div className="lg:col-span-7 bg-deepspace p-8 md:p-12">
            {done ? (
              <div className="flex flex-col items-start gap-6 py-12">
                <CheckCircle2 className="h-12 w-12 text-signal" />
                <div>
                  <h3 className="font-heading text-3xl font-medium tracking-tight-display text-techwhite">
                    Partnership initialized.
                  </h3>
                  <p className="mt-3 text-techwhite/60 text-lg leading-[1.6] max-w-md">
                    Your request is logged in the Iberix command center. An
                    operations lead will reach out within one business day.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDone(false);
                    setForm({ company: "", contact_name: "", email: "", region: "Global", service: "Multiple", scope: "" });
                  }}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal hover:text-techwhite transition-colors"
                >
                  ← Log another engagement
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Company" required>
                    <input
                      required
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="System integrator / MSP / operator"
                      className="iberix-input"
                    />
                  </Field>
                  <Field label="Contact Name" required>
                    <input
                      required
                      value={form.contact_name}
                      onChange={(e) => update("contact_name", e.target.value)}
                      placeholder="Full name"
                      className="iberix-input"
                    />
                  </Field>
                </div>

                <Field label="Work Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="name@company.com"
                    className="iberix-input"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Target Region">
                    <select
                      value={form.region}
                      onChange={(e) => update("region", e.target.value)}
                      className="iberix-input"
                    >
                      {REGIONS.map((r) => (
                        <option key={r} value={r} className="bg-deepspace text-techwhite">
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Service of Interest">
                    <select
                      value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      className="iberix-input"
                    >
                      {SERVICES.map((s) => (
                        <option key={s} value={s} className="bg-deepspace text-techwhite">
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Project Scope">
                  <textarea
                    value={form.scope}
                    onChange={(e) => update("scope", e.target.value)}
                    placeholder="Countries, scale, timeline, team size..."
                    rows={4}
                    className="iberix-input resize-none"
                  />
                </Field>

                {error && (
                  <p className="font-mono text-[12px] text-signal">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center justify-center gap-3 bg-signal text-deepspace px-8 py-4 font-mono text-[12px] uppercase tracking-[0.2em] font-semibold hover:shadow-[0_0_40px_-8px_rgba(253,184,19,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Sidebar */}
          <div className="lg:col-span-5 bg-[#0c0d0e] p-8 md:p-12 flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              The Accountability Promise
            </span>
            <ul className="mt-8 flex flex-col gap-6">
              {[
                "One single point of contact across every country.",
                "Documented handover and commissioning sign-off.",
                "Engineers vetted, insured and accountable to your SLAs.",
                "Transparent escalation — no layers, no finger-pointing.",
              ].map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-[11px] text-signal pt-1">
                    0{i + 1}
                  </span>
                  <span className="text-techwhite/80 text-base md:text-lg leading-[1.6]">
                    {p}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <div className="h-px w-full hairline" />
              <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/40 leading-relaxed">
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
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-techwhite/50 group-focus-within:text-signal transition-colors">
        {label} {required && <span className="text-signal">*</span>}
      </span>
      {children}
    </label>
  );
}