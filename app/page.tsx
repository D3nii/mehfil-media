import {
  Features,
  FinalCta,
  Niches,
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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="digital-silk-bg pt-32">
        <Hero />
        <Preview />
        <Methodology />
        <Philosophy />
        <Niches />
        <Features />
        <Testimonials />
        <Stats />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
