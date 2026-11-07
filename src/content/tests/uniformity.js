export default {
  slug: 'uniformity',
  order: 210,
  category: 'defects',
  name: "Uniformity & Backlight Bleed Test",
  shortName: "Uniformity",
  badges: ["Popular"],
  summary: "Solid fields and grids to reveal backlight bleed, IPS glow, clouding, and dirty-screen effect.",
  seo: {
    title: "Uniformity & Backlight Bleed Test | Free Online Monitor Test",
    description: "Solid fields and grids to reveal backlight bleed, IPS glow, clouding, and dirty-screen effect.",
  },
  load: () => import('../../pages/tests/UniformityTest'),
  page: {
    title: "Uniformity & Backlight Bleed Test",
    intro: "Solid fields and grids to reveal backlight bleed, IPS glow, clouding, and dirty-screen effect.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
