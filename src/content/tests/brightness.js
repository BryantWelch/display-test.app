export default {
  slug: 'brightness',
  order: 230,
  category: 'defects',
  name: "Brightness & White Window Test",
  shortName: "White Window",
  badges: [],
  summary: "White windows of any size on black to check brightness behavior, ABL, and blooming.",
  seo: {
    title: "Brightness & White Window Test | Free Online Monitor Test",
    description: "White windows of any size on black to check brightness behavior, ABL, and blooming.",
  },
  load: () => import('../../pages/tests/BrightnessTest'),
  page: {
    title: "Brightness & White Window Test",
    intro: "White windows of any size on black to check brightness behavior, ABL, and blooming.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
