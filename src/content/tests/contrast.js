export default {
  slug: 'contrast',
  order: 330,
  category: 'color',
  name: "Checkerboard Contrast Test",
  shortName: "Checkerboard Contrast",
  badges: [],
  summary: "Black and white checkerboards to judge contrast, black depth, and panel glow by eye.",
  seo: {
    title: "Checkerboard Contrast Test | Free Online Monitor Test",
    description: "Black and white checkerboards to judge contrast, black depth, and panel glow by eye.",
  },
  load: () => import('../../pages/tests/ContrastTest'),
  page: {
    title: "Checkerboard Contrast Test",
    intro: "Black and white checkerboards to judge contrast, black depth, and panel glow by eye.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
