export default {
  slug: 'color-distance',
  order: 340,
  category: 'color',
  name: "Color Distinction Test",
  shortName: "Color Distinction",
  badges: [],
  summary: "Compare two nearly identical colors to see how fine a difference your display shows.",
  seo: {
    title: "Color Distinction Test | Free Online Monitor Test",
    description: "Compare two nearly identical colors to see how fine a difference your display shows.",
  },
  load: () => import('../../pages/tests/ColorDistanceTest'),
  page: {
    title: "Color Distinction Test",
    intro: "Compare two nearly identical colors to see how fine a difference your display shows.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
