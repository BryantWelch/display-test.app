export default {
  slug: 'viewing-angle',
  order: 240,
  category: 'defects',
  name: "Viewing Angle Test",
  shortName: "Viewing Angle",
  badges: [],
  summary: "Check color, gamma, and contrast shift as you move off-axis.",
  seo: {
    title: "Viewing Angle Test | Free Online Monitor Test",
    description: "Check color, gamma, and contrast shift as you move off-axis.",
  },
  load: () => import('../../pages/tests/ViewingAngleTest'),
  page: {
    title: "Viewing Angle Test",
    intro: "Check color, gamma, and contrast shift as you move off-axis.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
