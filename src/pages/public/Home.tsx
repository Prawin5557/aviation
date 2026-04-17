import Hero from "@/src/sections/Hero";
import Stats from "@/src/sections/Stats";
import FeaturedEmployers from "@/src/sections/FeaturedEmployers";
import TrustSection from "@/src/sections/TrustSection";
import GlobalOperations from "@/src/sections/GlobalOperations";
import StrategicPartner from "@/src/sections/StrategicPartner";
import SolutionsSection from "@/src/sections/SolutionsSection";
import TalentTrends from "@/src/sections/TalentTrends";
import DomainsWePower from "@/src/sections/DomainsWePower";
import LatestInsights from "@/src/sections/LatestInsights";
import NewsletterSection from "@/src/sections/NewsletterSection";
import JobOpenings from "@/src/sections/JobOpenings";
import TrustedPartners from "@/src/sections/TrustedPartners";
import VoicesFromFlightDeck from "@/src/sections/VoicesFromFlightDeck";
import NextStepSection from "@/src/sections/NextStepSection";

export default function Home() {
  return (
    <div className="space-y-8 pb-8">
      <div id="hero">
        <Hero />
      </div>
      <div id="stats">
        <Stats />
      </div>
      <div id="featured-employers">
        <FeaturedEmployers />
      </div>
      <div id="trust">
        <TrustSection />
      </div>
      <div id="trusted-partners">
        <TrustedPartners />
      </div>
      <div id="global">
        <GlobalOperations />
      </div>
      <div id="strategic">
        <StrategicPartner />
      </div>
      <div id="solutions">
        <SolutionsSection />
      </div>
      <div id="trends">
        <TalentTrends />
      </div>
      <div id="domains">
        <DomainsWePower />
      </div>
      <div id="insights">
        <LatestInsights />
      </div>
      <div id="newsletter">
        <NewsletterSection />
      </div>
      <div id="job-openings">
        <JobOpenings />
      </div>
      <div id="voices">
        <VoicesFromFlightDeck />
      </div>
      <div id="next-step">
        <NextStepSection />
      </div>
    </div>
  );
}
