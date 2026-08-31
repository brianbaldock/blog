/**
 * Shared page metadata for pages that exist at more than one URL.
 *
 * /about/ is also served at the legacy Hashnode URL /members/ as a redirect
 * stub, and the stub mirrors the real page's title and description so the
 * indexed URL has an honest search snippet. Hardcoding the same string in two
 * files means they drift -- which they did, and CI caught it. Single source.
 */

export const ABOUT_META = {
  title: 'About',
  description:
    'About Brian Baldock, Senior Software Engineer at Microsoft in Seattle. ' +
    'Identity, security, and AI infrastructure, plus the line-cook habits that still run the workshop.',
} as const;
