import { Hero } from "@/components/hero";
import { TijaSpotlight } from "@/components/tija-spotlight";
import { SelectedWork } from "@/components/selected-work";
import { Certifications } from "@/components/certifications";
import { WebsitesStrip } from "@/components/websites-strip";
import { LiveStatusGithub } from "@/components/live-status-github";
import { ShipLog } from "@/components/ship-log";
import { AboutTeaser } from "@/components/about-teaser";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TijaSpotlight />
      <SelectedWork />
      <Certifications />
      <WebsitesStrip />
      <LiveStatusGithub />
      <ShipLog />
      <AboutTeaser />
      <Contact />
    </>
  );
}
