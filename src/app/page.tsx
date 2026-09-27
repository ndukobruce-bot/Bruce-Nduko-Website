import { Hero } from "@/components/hero";
import { TijaSpotlight } from "@/components/tija-spotlight";
import { SelectedWork } from "@/components/selected-work";
import { Certifications } from "@/components/certifications";
import { WebsitesStrip } from "@/components/websites-strip";
import { LiveStatusGithub } from "@/components/live-status-github";
import { ShipLog } from "@/components/ship-log";
import { AboutTeaser } from "@/components/about-teaser";
import { Contact } from "@/components/contact";
import { getLang } from "@/lib/lang";

export default async function Home() {
  const lang = await getLang();

  return (
    <>
      <Hero lang={lang} />
      <TijaSpotlight lang={lang} />
      <SelectedWork lang={lang} />
      <Certifications lang={lang} />
      <WebsitesStrip lang={lang} />
      <LiveStatusGithub />
      <ShipLog lang={lang} />
      <AboutTeaser lang={lang} />
      <Contact lang={lang} />
    </>
  );
}
