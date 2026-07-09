import type { Metadata } from "next";

import { CatalogIndex } from "@/components/catalog";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getAllNiches } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog | Mehfil Media",
  description:
    "Explore Mehfil Media sector specializations — jewelry, textiles, fragrance, and more AI-crafted niche galleries.",
};

export default function CatalogPage() {
  const niches = getAllNiches();

  return (
    <>
      <Navbar />
      <CatalogIndex niches={niches} />
      <Footer />
    </>
  );
}
