export default {
  slug: 'test-patterns',
  order: 510,
  category: 'clarity',
  name: "Test Patterns",
  shortName: "Test Patterns",
  badges: [],
  summary: "Pixel-exact calibration patterns for sharpness, geometry, convergence, and scaling.",
  seo: {
    title: "Test Patterns | Free Online Monitor Test",
    description: "Pixel-exact calibration patterns for sharpness, geometry, convergence, and scaling.",
  },
  load: () => import('../../pages/tests/TestPatternsTest'),
  page: {
    title: "Test Patterns",
    intro: "Pixel-exact calibration patterns for sharpness, geometry, convergence, and scaling.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
