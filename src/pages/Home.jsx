import Hero from "@/components/iberix/Hero";
import CapabilitiesMatrix from "@/components/iberix/CapabilitiesMatrix";
import GlobalFootprint from "@/components/iberix/GlobalFootprint";
import AccountabilityModule from "@/components/iberix/AccountabilityModule";
import AccountabilityBar from "@/components/iberix/AccountabilityBar";
import Footer from "@/components/iberix/Footer";

export default function Home() {
  return (
    <div className="bg-deepspace">
      <Hero />
      <CapabilitiesMatrix />
      <GlobalFootprint />
      <AccountabilityModule />
      <Footer />
      <AccountabilityBar />
    </div>
  );
}