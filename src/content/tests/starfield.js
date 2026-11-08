export default {
  slug: 'starfield',
  order: 920,
  category: 'fun',
  name: 'Starfield',
  shortName: 'Starfield',
  badges: [],
  summary: 'Fly through a field of stars on a black screen. Warp streaks optional.',
  seo: {
    title: 'Starfield Warp — Free Fullscreen Star Screensaver',
    description:
      'Fly through a field of stars in your browser. Set the speed, density, color, and warp streaks. A black screen that shows off deep blacks.',
  },
  testSeo: {
    title: 'Starfield — Fullscreen',
    description: 'Fullscreen flight through a star field.',
  },
  load: () => import('../../pages/tests/StarfieldTest'),
  page: {
    title: 'Starfield',
    intro:
      'Fly straight into a field of stars. This one is **just for fun** — no diagnosis, no pass or fail — but almost the whole screen stays black, which is a nice way to look at a display.',
    startLabel: 'Launch',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'about',
        heading: 'Points or warp',
        blocks: [
          'Each star sits at a depth and drifts toward you. **Points** draws a short streak. **Warp** speeds up and stretches the streaks. The star count goes up to 10,000, and every star starts inside the frame, so the number you set is the number you see. **Field of view** widens or narrows the view. **Mixed** gives each star a slightly different white, from blue-white to orange. Press **W** to switch, **Space** to pause, **↑ / ↓** to change speed, **← / →** for fewer or more stars, and **H** to hide the controls.',
          'The flight covers the same distance per second at any refresh rate. A 144 Hz or 240 Hz panel redraws the motion more often, so it looks smoother. It does not make the stars move faster.',
        ],
      },
      {
        id: 'black',
        heading: 'Why the background matters',
        blocks: [
          'Most of the frame is empty black with a few bright points. On an OLED those gaps are pixels that are actually off. On an LCD the backlight is still on, so the “black” is dark gray, and on a Mini-LED you may see a soft halo around the brighter stars.',
          'For a real check of that, use the [black level](/black-level) and [local dimming](/local-dimming) tests.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Stars stream outward from the center and wrap back in once they pass you.',
        'On OLED, the space between stars looks truly black.',
      ],
      bad: [
        'A gray glow across the background in a dark room — normal for a backlit LCD.',
        'Halos around the brighter stars — local dimming on a Mini-LED or full-array panel.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'The background should disappear. Don’t leave any static taskbar sitting over it for hours.' },
      { panel: 'IPS / VA (LCD)', note: 'The black field glows. VA usually looks deeper than IPS in a dark room.' },
      { panel: 'Mini-LED', note: 'Bright stars can light up a dimming zone and grow a soft halo.' },
    ],
    tips: [
      'Turn the room lights off.',
      'Press H, then W, if you want the warp view with nothing else on screen.',
      'Fewer stars make the black area easier to judge.',
    ],
    related: ['matrix', 'fireworks', 'black-level', 'refresh-rate'],
    disclaimer: 'Purely for entertainment — not a diagnostic test. Contains continuous motion; take a break if it causes discomfort.',
    faqs: [
      {
        question: 'Is this a real monitor test?',
        answer:
          'No. It shows off black level and motion, but it does not measure either. Use the [black level](/black-level), [local dimming](/local-dimming), and [refresh rate](/refresh-rate) tests for that.',
      },
      {
        question: 'Why do the stars look smoother on one monitor than another?',
        answer:
          'The animation advances by time, not by frame. A higher refresh rate draws more in-between positions each second, so the same speed looks smoother. A 60 Hz panel is not “failing” the screensaver.',
      },
      {
        question: 'Can I leave it running on an OLED?',
        answer:
          'The stars keep moving and most of the screen is black, so it is low risk. Hide the controls and use fullscreen so the taskbar and browser bar are not sitting still. See the [OLED burn-in guide](/guides/oled-burn-in).',
      },
    ],
  },
};
