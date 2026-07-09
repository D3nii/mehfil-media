# Catalog niches

Each folder under `public/catalog/` becomes a niche automatically.

## Add a new niche

1. Create a folder: `public/catalog/my-niche-name/`
2. Drop images (and optional videos) into that folder
3. Optionally add `niche.json` for title, description, CTA, and ordering

That’s it. The homepage Sector Specialization section, `/catalog`, and `/catalog/my-niche-name` update on the next refresh/build.

## Folder layout

```text
public/catalog/
  high-jewelry/
    niche.json          # optional metadata
    cover.jpg           # optional featured image (also: hero.*, thumb.*)
    01-ring.jpg         # gallery assets (any order; sorted naturally)
    02-necklace.jpg
    assets/             # optional nested folder — also scanned
      detail-01.webp
  artisanal-textiles/
    ...
```

## `niche.json` fields

```json
{
  "title": "High Jewelry",
  "description": "Short niche description.",
  "cta": "Explore Gems",
  "icon": "diamond",
  "featured": true,
  "order": 1,
  "aspect": "portrait"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | no | Defaults from folder name (`high-jewelry` → `High Jewelry`) |
| `description` | no | Fallback blurb is generated |
| `cta` | no | Button/overlay label |
| `icon` | no | Material Symbol name |
| `featured` | no | Default `true`. Set `false` to hide from listings |
| `order` | no | Lower numbers appear first |
| `aspect` | no | `portrait` \| `square` \| `wide` (homepage card shape) |
| `cover` | no | Filename to force as cover |
| `coverUrl` | no | Remote cover URL if no local cover yet |
| `remoteAssets` | no | Extra remote gallery URLs |

## Cover selection

1. `cover` in `niche.json`, if that file exists
2. Else a file named `cover`, `hero`, `thumbnail`, or `thumb`
3. Else the first local media file (natural sort)
4. Else `coverUrl` from `niche.json`

## Supported media

- Images: `.jpg` `.jpeg` `.png` `.webp` `.avif` `.gif`
- Videos: `.mp4` `.webm` `.mov`
