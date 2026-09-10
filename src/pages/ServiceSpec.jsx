import { useParams, Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import Logo from "@/components/iberix/Logo";
import { SERVICES } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";

export default function ServiceSpec() {
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id);
  const [ref, visible] = useReveal();

  if (!service) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-6 px-6">
        <Logo variant="light" className="text-2xl" />
        <p className="text-subtle text-lg">Spec sheet not found.</p>
        <Link to="/" className="eyebrow text-brand-light hover:text-paper transition-colors">
          ← Return to command center
        </Link>
      </div>
    );
  }

  const related = SERVICES.filter((s) => s.id !== service.id);

  return (
    <main className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-ink/75" />
        </div>
        <div className="relative z-10">
          <header className="flex items-center justify-between px-6 md:px-12 py-6">
            <Link to="/"><Logo variant="light" className="text-xl" /></Link>
            <Link to="/" className="inline-flex items-center gap-2 eyebrow text-subtle hover:text-brand-light transition-colors">
              <ArrowLeft className="h-4 w-4" /> Command Center
            </Link>
          </header>
          <div className="h-px w-full bg-white/10" />
        </div>
        <div className="relative z-10 px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-28 max-w-[1600px] mx-auto">
          <span className="eyebrow text-brand-light">{service.index} / Service Spec</span>
          <h1
            className="mt-5 font-heading font-medium tracking-tight-display text-paper leading-[1.0]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            {service.title}
          </h1>
          <p className="mt-6 text-subtle text-xl md:text-2xl max-w-2xl leading-[1.5]">{service.tagline}</p>
          <p className="mt-8 text-body text-lg max-w-2xl leading-[1.7]">{service.overview}</p>
          <Link
            to="/#accountability"
            className="group mt-10 inline-flex items-center gap-3 bg-brand text-paper rounded-full px-7 py-4 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-shadow"
          >
            Initialize Partnership
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      {/* Specs grid */}
      <section ref={ref} className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className={`scan-init ${visible ? "is-visible" : ""} eyebrow text-brand`}>
            Technical Specification
          </span>
          <h2
            className={`scan-init ${visible ? "is-visible" : ""} mt-4 font-heading font-medium tracking-tight-display text-ink`}
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
          >
            Operating parameters.
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.specs.map((s) => (
              <div key={s.k} className="bg-paper rounded-lg p-6 shadow-soft">
                <span className="eyebrow text-subtle">{s.k}</span>
                <p className="mt-3 text-ink font-heading text-xl font-medium leading-snug">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables + Process */}
      <section className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <span className="eyebrow text-brand">Deliverables</span>
            <h2
              className="mt-4 font-heading font-medium tracking-tight-display text-ink"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              What we hand over.
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-4 bg-offwhite rounded-lg px-5 py-4">
                  <Check className="h-5 w-5 text-brand mt-0.5 shrink-0" />
                  <span className="text-body-dark text-lg leading-[1.6]">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow text-brand">Engagement Process</span>
            <h2
              className="mt-4 font-heading font-medium tracking-tight-display text-ink"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              How it runs.
            </h2>
            <ol className="mt-8 flex flex-col gap-6">
              {service.process.map((p) => (
                <li key={p.n} className="flex gap-5">
                  <span className="eyebrow text-brand pt-1 shrink-0">{p.n}</span>
                  <div>
                    <h3 className="font-heading text-xl font-medium text-ink">{p.t}</h3>
                    <p className="mt-1 text-body leading-[1.6]">{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-ink px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto">
          <span className="eyebrow text-brand-light">Related Capabilities</span>
          <h2
            className="mt-4 font-heading font-medium tracking-tight-display text-paper"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
          >
            Other disciplines.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/services/${r.id}`}
                className="group bg-ink-soft rounded-lg p-7 hover:bg-[#243029] transition-colors"
              >
                <span className="eyebrow text-brand-light">{r.index}</span>
                <h3 className="mt-4 font-heading text-2xl font-medium tracking-tight-display text-paper">{r.title}</h3>
                <p className="mt-2 text-subtle leading-[1.6]">{r.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 eyebrow text-brand-light">
                  View spec sheet
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto bg-mint rounded-lg p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2
              className="font-heading font-medium tracking-tight-display text-ink"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              Ready to deploy?
            </h2>
            <p className="mt-3 text-body-dark text-lg max-w-md leading-[1.6]">
              Share your engagement scope — an operations lead responds within one business day.
            </p>
          </div>
          <Link
            to="/#accountability"
            className="group inline-flex items-center gap-3 bg-brand text-paper rounded-full px-8 py-4 eyebrow font-semibold hover:shadow-[0_10px_36px_-10px_rgba(29,158,117,0.6)] transition-shadow shrink-0"
          >
            Initialize Partnership
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}