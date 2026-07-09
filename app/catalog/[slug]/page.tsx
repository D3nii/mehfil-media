import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogDetail } from "@/components/catalog";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getAllNiches, getNicheBySlug, getNicheSlugs } from "@/lib/catalog";

type CatalogNichePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getNicheSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CatalogNichePageProps): Promise<Metadata> {
  const { slug } = await params;
  const niche = getNicheBySlug(slug);

  if (!niche) {
    return { title: "Niche Not Found | Mehfil Media" };
  }

  return {
    title: `${niche.title} | Mehfil Media Catalog`,
    description: niche.description,
  };
}

export default async function CatalogNichePage({
  params,
}: CatalogNichePageProps) {
  const { slug } = await params;
  const niche = getNicheBySlug(slug);

  if (!niche) notFound();

  const related = getAllNiches()
    .filter((item) => item.slug !== niche.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <CatalogDetail niche={niche} related={related} />
      <Footer />
    </>
  );
}
