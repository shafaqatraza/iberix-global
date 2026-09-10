import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";
import RegionSwitcher from "./RegionSwitcher";
import { useRegion } from "@/i18n/RegionContext";

export default function PageHeader({ eyebrow, title, tagline, image }) {
  const { t } = useRegion();

  return (
    <section className="relative bg-ink overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-ink/75" />
        </div>
      )}
      <div className="relative z-30">
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          <Link to="/"><Logo variant="light" className="text-xl" /></Link>
          <div className="flex items-center gap-6">
            <RegionSwitcher variant="light" />
            <Link to="/" className="inline-flex items-center gap-2 eyebrow text-subtle hover:text-brand-light transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("common.commandCenter")}
            </Link>
          </div>
        </header>
        <div className="h-px w-full bg-white/10" />
      </div>
      <div className="relative z-10 px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-28 max-w-[1600px] mx-auto">
        {eyebrow && <span className="eyebrow text-brand-light">{eyebrow}</span>}
        <h1
          className="mt-5 font-heading font-medium tracking-tight-display text-paper leading-[1.0]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
        >
          {title}
        </h1>
        {tagline && (
          <p className="mt-6 text-subtle text-xl md:text-2xl max-w-2xl leading-[1.5]">{tagline}</p>
        )}
      </div>
    </section>
  );
}