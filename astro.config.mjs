// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.brianbaldock.net',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      // Only advertise canonical, indexable pages. The legacy-URL redirect
      // stubs (root-level post slugs, /tag/*, /members) exist to catch old
      // Hashnode inbound links and 301 them onward — they must NOT be in the
      // sitemap, or Google files ~190 "Page with redirect" entries and wastes
      // crawl budget. Allowlist by design (fails closed): a new redirect family
      // can never leak in. NOTE: if you add a real top-level page later
      // (e.g. /uses/, /now/), add it to the keep-list below or it won't be
      // listed in the sitemap.
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/') return true;
        if (pathname.startsWith('/posts/')) return true; // archive + all posts
        if (pathname === '/about/' || pathname === '/projects/') return true;
        return false; // root-level slug stubs, /tag/*, /members -> excluded
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Sharp is the default; explicit for clarity.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
