import { Footer } from "@/components/footer";
import { Cursor } from "@/components/experience/cursor";
import { Finale } from "@/components/experience/finale";
import { Hero } from "@/components/experience/hero";
import { LenisProvider } from "@/components/experience/lenis-provider";
import { Loader } from "@/components/experience/loader";
import { Manifesto } from "@/components/experience/manifesto";
import { ExperienceNav } from "@/components/experience/nav";
import { Pipeline } from "@/components/experience/pipeline";
import { ReelStrip } from "@/components/experience/reel-strip";
import { Worlds } from "@/components/experience/worlds";

export default function Home() {
  return (
    <LenisProvider>
      <Loader />
      <Cursor />
      <ExperienceNav />
      <main>
        <Hero />
        <Manifesto />
        <Pipeline />
        <ReelStrip />
        <Worlds />
        <Finale />
      </main>
      <Footer />
    </LenisProvider>
  );
}
