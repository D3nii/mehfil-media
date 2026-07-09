import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import path from "path";

export type NicheAspect = "portrait" | "square" | "wide";

export type CatalogAsset = {
  src: string;
  alt: string;
  type: "image" | "video";
  filename: string;
};

export type CatalogNiche = {
  slug: string;
  title: string;
  description: string;
  cta: string;
  icon?: string;
  featured: boolean;
  order: number;
  aspect: NicheAspect;
  cover: CatalogAsset;
  assets: CatalogAsset[];
  href: string;
};

type NicheMeta = {
  title?: string;
  description?: string;
  cta?: string;
  icon?: string;
  featured?: boolean;
  order?: number;
  aspect?: NicheAspect;
  cover?: string;
  /** Remote cover fallback when no local cover file exists yet */
  coverUrl?: string;
  /** Extra remote gallery URLs (optional; local files are preferred) */
  remoteAssets?: string[];
};

const CATALOG_ROOT = path.join(process.cwd(), "public", "catalog");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
const META_FILE = "niche.json";
const COVER_NAMES = new Set(["cover", "hero", "thumbnail", "thumb"]);

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isMediaFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
}

function mediaType(filename: string): "image" | "video" {
  return VIDEO_EXT.has(path.extname(filename).toLowerCase())
    ? "video"
    : "image";
}

function publicUrl(slug: string, filename: string): string {
  return `/catalog/${slug}/${filename.split(path.sep).join("/")}`;
}

function readMeta(dir: string): NicheMeta {
  const metaPath = path.join(dir, META_FILE);
  if (!existsSync(metaPath)) return {};

  try {
    return JSON.parse(readFileSync(metaPath, "utf8")) as NicheMeta;
  } catch {
    return {};
  }
}

function collectLocalMedia(dir: string, slug: string): CatalogAsset[] {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir, { withFileTypes: true });
  const files: CatalogAsset[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      // Nested folders (e.g. assets/) are included recursively
      const nested = collectLocalMedia(path.join(dir, entry.name), slug);
      for (const asset of nested) {
        files.push({
          ...asset,
          // nested paths already encoded via relative walk below
        });
      }
      continue;
    }

    if (!entry.isFile() || !isMediaFile(entry.name)) continue;

    const relativeFromNiche = path.relative(path.join(CATALOG_ROOT, slug), path.join(dir, entry.name));
    files.push({
      src: publicUrl(slug, relativeFromNiche),
      alt: titleFromSlug(path.parse(entry.name).name),
      type: mediaType(entry.name),
      filename: relativeFromNiche,
    });
  }

  return files.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));
}

function pickCover(
  slug: string,
  meta: NicheMeta,
  localMedia: CatalogAsset[],
): CatalogAsset {
  if (meta.cover) {
    const match = localMedia.find(
      (asset) =>
        asset.filename === meta.cover ||
        asset.filename.endsWith(`/${meta.cover}`) ||
        path.basename(asset.filename) === meta.cover,
    );
    if (match) return match;
  }

  const namedCover = localMedia.find((asset) => {
    const base = path.parse(path.basename(asset.filename)).name.toLowerCase();
    return COVER_NAMES.has(base);
  });
  if (namedCover) return namedCover;

  if (localMedia[0]) return localMedia[0];

  if (meta.coverUrl) {
    return {
      src: meta.coverUrl,
      alt: meta.title ?? titleFromSlug(slug),
      type: "image",
      filename: "coverUrl",
    };
  }

  return {
    src: "/catalog/_placeholder.svg",
    alt: meta.title ?? titleFromSlug(slug),
    type: "image",
    filename: "_placeholder",
  };
}

function loadNiche(slug: string): CatalogNiche | null {
  const dir = path.join(CATALOG_ROOT, slug);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return null;
  if (slug.startsWith("_") || slug.startsWith(".")) return null;

  const meta = readMeta(dir);
  const localMedia = collectLocalMedia(dir, slug);
  const cover = pickCover(slug, meta, localMedia);

  const localGallery = localMedia.filter(
    (asset) => asset.filename !== cover.filename,
  );

  const remoteGallery: CatalogAsset[] = (meta.remoteAssets ?? []).map(
    (src, index) => ({
      src,
      alt: `${meta.title ?? titleFromSlug(slug)} ${index + 1}`,
      type: "image" as const,
      filename: `remote-${index + 1}`,
    }),
  );

  const assets = [...localGallery, ...remoteGallery];

  // Always include cover in gallery if gallery would otherwise be empty
  const gallery =
    assets.length > 0
      ? assets
      : cover.filename !== "_placeholder"
        ? [cover]
        : [];

  return {
    slug,
    title: meta.title ?? titleFromSlug(slug),
    description:
      meta.description ??
      `Editorial AI content specializing in ${meta.title ?? titleFromSlug(slug).toLowerCase()}.`,
    cta: meta.cta ?? `Explore ${meta.title ?? titleFromSlug(slug)}`,
    icon: meta.icon,
    featured: meta.featured ?? true,
    order: meta.order ?? 999,
    aspect: meta.aspect ?? "portrait",
    cover,
    assets: gallery,
    href: `/catalog/${slug}`,
  };
}

function listNicheDirectories(): string[] {
  if (!existsSync(CATALOG_ROOT)) return [];

  return readdirSync(CATALOG_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("_") && !name.startsWith("."));
}

/** Featured niches for homepage + catalog index */
export function getAllNiches(): CatalogNiche[] {
  return listNicheDirectories()
    .map((slug) => loadNiche(slug))
    .filter((niche): niche is CatalogNiche => niche !== null)
    .filter((niche) => niche.featured)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getNicheBySlug(slug: string): CatalogNiche | null {
  return loadNiche(slug);
}

/** All niche folder slugs (including unlisted) for static routes */
export function getNicheSlugs(): string[] {
  return listNicheDirectories()
    .map((slug) => loadNiche(slug))
    .filter((niche): niche is CatalogNiche => niche !== null)
    .map((niche) => niche.slug);
}

export function aspectClass(aspect: NicheAspect): string {
  switch (aspect) {
    case "square":
      return "aspect-square";
    case "wide":
      return "aspect-[16/10]";
    case "portrait":
      return "aspect-[3/4]";
    default: {
      const _exhaustive: never = aspect;
      return _exhaustive;
    }
  }
}
