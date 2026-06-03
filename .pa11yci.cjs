module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 60000,
    wait: 500,
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    ignore: [
      // Astro view-transitions inject duplicate ids in dev; harmless and a known false positive.
      'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77',
    ],
  },
  urls: [
    'http://localhost:4321/',
    'http://localhost:4321/posts/',
    'http://localhost:4321/projects/',
    'http://localhost:4321/about/',
    'http://localhost:4321/404',
  ],
};
