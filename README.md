# blog.brianbaldock.net

Personal blog by Brian Baldock — security, AI/ML infrastructure, and the
lessons that come from building in the open.

Live site: **https://blog.brianbaldock.net**

## Stack

- **[Astro](https://astro.build/)** — static site generator
- **MDX** for posts that need components
- **GitHub Pages** for hosting (free tier; public repo)
- **GitHub Actions** for build + a11y checks + deploy
- **Tailwind v4** + CSS custom properties for the theme (light / dark / system)

## Local development

Requires Node 22+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build into ./dist
npm run preview    # serve the built output locally
npm run check      # astro check + type check
```

## Repo layout

```
src/
├── components/   Header, Footer, ThemeToggle
├── content/
│   └── posts/    Markdown / MDX posts (the actual writing)
├── layouts/      BaseLayout, PostLayout
├── pages/        Routes: /, /posts/, /projects/, /about/, /rss.xml
├── styles/       global.css with design tokens
├── consts.ts     Site metadata (title, nav, social, etc.)
└── content.config.ts   Content collection schema
public/           Static assets served as-is
```

## Writing a post

Create `src/content/posts/<slug>.md` (or `.mdx`) with frontmatter:

```yaml
---
title: "A descriptive title"
description: "One-line summary for cards and meta tags."
pubDate: 2026-06-15
tags: ["security", "ai"]
cover: ../../assets/images/cover.png   # local file (recommended)
coverAlt: "Alt text for the cover image"
draft: false
---
```

Set `draft: true` to keep a post out of the build, sitemap, and RSS feed.

## License

- **Code** (everything that builds the site, plus snippets in posts):
  MIT — see [`LICENSE`](./LICENSE).
- **Content** (prose, images, mascot, illustrations): CC BY 4.0 — see
  [`LICENSE-content.md`](./LICENSE-content.md).

## Accessibility

The site targets **WCAG 2.2 AA**. Accessibility regressions fail CI via
pa11y-ci. If you spot something broken, please open an issue.
