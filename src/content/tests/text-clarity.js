export default {
  slug: 'text-clarity',
  order: 500,
  category: 'clarity',
  name: "Text Clarity Test",
  shortName: "Text Clarity",
  badges: [],
  summary: "Check font sharpness, color fringing, and readability at any size.",
  seo: {
    title: "Text Clarity Test | Free Online Monitor Test",
    description: "Check font sharpness, color fringing, and readability at any size.",
  },
  load: () => import('../../pages/tests/TextClarityTest'),
  page: {
    title: "Text Clarity Test",
    intro: "Check font sharpness, color fringing, and readability at any size.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
