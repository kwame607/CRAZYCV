import { SiteNav } from "@/components/experience/SiteNav";
import { IntroStage } from "@/components/experience/IntroStage";
import { Hero } from "@/components/sections/Hero";
import { WorkSection } from "@/components/sections/WorkSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { LiveSections } from "@/components/sections/LiveSections";
import { JourneySection } from "@/components/sections/JourneySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { cvPdfAvailable } from "@/lib/server/cv-file";

export default function Home() {
  const cvAvailable = cvPdfAvailable();
  return (
    <>
      <SiteNav />
      <IntroStage />
      {/* Everything below is ordinary server-rendered HTML, so it works without JavaScript or the animation. */}
      <main id="main">
        <Hero cvAvailable={cvAvailable} />
        <WorkSection />
        <AboutSection />
        <SkillsSection />
        <SecuritySection />
        <LiveSections />
        <JourneySection cvAvailable={cvAvailable} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
