export default {
  slug: 'gamma',
  order: 300,
  category: 'color',
  name: "Gamma Test",
  shortName: "Gamma",
  badges: [],
  summary: "Match dithered and solid patches to estimate your display gamma (1.8–2.6).",
  seo: {
    title: "Gamma Test | Free Online Monitor Test",
    description: "Match dithered and solid patches to estimate your display gamma (1.8–2.6).",
  },
  load: () => import('../../pages/tests/GammaTest'),
  page: {
    title: "Gamma Test",
    intro: "Match dithered and solid patches to estimate your display gamma (1.8–2.6).",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
