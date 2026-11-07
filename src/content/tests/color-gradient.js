export default {
  slug: 'color-gradient',
  order: 310,
  category: 'color',
  name: "Color Banding & Gradient Test",
  shortName: "Banding",
  badges: [],
  summary: "Pixel-exact gradients to spot banding, posterization, and dithering.",
  seo: {
    title: "Color Banding & Gradient Test | Free Online Monitor Test",
    description: "Pixel-exact gradients to spot banding, posterization, and dithering.",
  },
  load: () => import('../../pages/tests/ColorGradientTest'),
  page: {
    title: "Color Banding & Gradient Test",
    intro: "Pixel-exact gradients to spot banding, posterization, and dithering.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
