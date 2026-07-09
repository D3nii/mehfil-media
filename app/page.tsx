import { HomepageNiches } from "@/components/catalog";
import {
  Features,
  FinalCta,
  Stats,
  Testimonials,
} from "@/components/content-sections";
import { Footer } from "@/components/footer";
import {
  Hero,
  Methodology,
  Philosophy,
  Preview,
} from "@/components/hero-sections";
import { Navbar } from "@/components/navbar";
import { getAllNiches } from "@/lib/catalog";

export default function Home() {
  const niches = getAllNiches();

  return (
    <>
      <Navbar />
      <main className="digital-silk-bg pt-32">
        <Hero />
        <Preview />
        <Methodology />
        <Philosophy />
        <HomepageNiches niches={niches} />
        <Features />
        <Testimonials />
        <Stats />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
