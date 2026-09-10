export default function Logo({ variant = "light", className = "" }) {
  // variant="light" → for use on dark backgrounds (iber in paper white, ix in brand-light)
  // variant="dark"  → for use on light backgrounds (iber in ink, ix in brand)
  const iber = variant === "light" ? "text-paper" : "text-ink";
  const ix = variant === "light" ? "text-brand-light" : "text-brand";
  return (
    <span className={`font-heading font-medium tracking-[-0.04em] ${iber} ${className}`}>
      iber<span className={ix}>ix</span>
    </span>
  );
}