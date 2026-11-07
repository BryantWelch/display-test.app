export default {
  slug: 'response-time',
  order: 410,
  category: 'motion',
  name: "Motion Blur & Ghosting Test",
  shortName: "Ghosting",
  badges: ["Popular"],
  summary: "Frame-locked moving objects to judge ghosting, overshoot, and motion blur.",
  seo: {
    title: "Motion Blur & Ghosting Test | Free Online Monitor Test",
    description: "Frame-locked moving objects to judge ghosting, overshoot, and motion blur.",
  },
  load: () => import('../../pages/tests/ResponseTimeTest'),
  page: {
    title: "Motion Blur & Ghosting Test",
    intro: "Frame-locked moving objects to judge ghosting, overshoot, and motion blur.",
    lastReviewed: '2026-11-07',
    sections: [],
  },
};
