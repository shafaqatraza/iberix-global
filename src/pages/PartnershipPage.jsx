import PageHeader from "@/components/iberix/PageHeader";
import AccountabilityModule from "@/components/iberix/AccountabilityModule";
import Footer from "@/components/iberix/Footer";
import { useRegion } from "@/i18n/RegionContext";

export default function PartnershipPage() {
  const { t } = useRegion();

  return (
    <main className="bg-offwhite">
      <PageHeader eyebrow={t("ps.eyebrow")} title={t("ps.title")} tagline={t("ps.tagline")} />
      <AccountabilityModule showHeader={false} />
      <Footer />
    </main>
  );
}