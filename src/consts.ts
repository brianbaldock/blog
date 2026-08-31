export const SITE = {
  title: 'Brian Baldock',
  tagline: 'Notes from the workshop. Security, AI, and the occasional alligator with a taco.',
  // Short, front-loaded differentiator used in the <title> of the home page.
  // There is another Brian Baldock who ranks for the bare name; leading with the
  // domain rather than the joke is what distinguishes the two in a SERP.
  seoTagline: 'Identity, Security, and AI Infrastructure',
  description:
    'Personal blog by Brian Baldock on security, AI/ML infrastructure, and the lessons that come from building in the open.',
  url: 'https://blog.brianbaldock.net',
  author: 'Brian Baldock',
  authorUrl: 'https://www.linkedin.com/in/brianbaldock/',
  locale: 'en-US',
  navLinks: [
    { href: '/', label: 'Home' },
    { href: '/posts/', label: 'Posts' },
    { href: '/projects/', label: 'Projects' },
    { href: '/about/', label: 'About' },
  ],
  social: {
    linkedin: 'https://www.linkedin.com/in/brianbaldock/',
    github: 'https://github.com/brianbaldock',
    bluesky: 'https://bsky.app/profile/brianbaldock.net',
    credly: 'https://www.credly.com/users/brian-baldock',
  },
  // Entity disambiguation. There is at least one other Brian Baldock who ranks
  // for the bare name, so the Person node below is what tells a search engine
  // which one this site is about. `sameAs` only carries weight when the
  // profiles it names link back here, so keep this list to verified profiles.
  person: {
    jobTitle: 'Senior Software Engineer',
    worksFor: 'Microsoft',
    knowsAbout: [
      'identity and access management',
      'cybersecurity',
      'AI infrastructure',
      'Microsoft Entra ID',
      'Microsoft Defender',
      'machine learning operations',
    ],
    locality: 'Seattle',
    region: 'WA',
    country: 'US',
    image: '/images/about/brian-portrait.jpg',
  },
  postsPerPage: 10,
};
