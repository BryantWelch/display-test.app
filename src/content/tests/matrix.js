export default {
  slug: 'matrix',
  order: 900,
  category: 'fun',
  name: 'Matrix Digital Rain',
  shortName: 'Matrix',
  badges: [],
  summary: 'Customizable Matrix-style digital rain. Not a test — just looks great on a good panel.',
  seo: {
    title: 'Matrix Digital Rain — Free Fullscreen Falling Code Screensaver',
    description:
      'Full-screen Matrix-style digital rain in your browser. Pick colors, speed, density, trail length, and katakana, hex, or binary characters. Looks best on OLED in a dark room.',
  },
  testSeo: {
    title: 'Matrix Digital Rain — Fullscreen',
    description: 'Full-screen customizable Matrix-style falling code.',
  },
  load: () => import('../../pages/tests/MatrixTest'),
  page: {
    title: 'Matrix Digital Rain',
    intro:
      'Fill your screen with falling green code. This one is **just for fun** — no diagnosis, no pass or fail — but it does make a good-looking showcase for a display with deep blacks.',
    startLabel: 'Enter the Matrix',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'about',
        heading: 'Blue pill or red pill?',
        blocks: [
          'A tribute to the famous “digital rain” from the 1999 film: columns of half-width katakana, digits, and symbols streaming down the screen, each led by a bright character that leaves a fading trail.',
          'In the fullscreen view you can change the rain and background colors, speed, density, trail length, character size, and character set (katakana, Latin, hex, or binary). Press **Space** to pause and **H** to hide the controls for a clean screen.',
        ],
      },
      {
        id: 'black-level',
        heading: 'Why it looks so good on OLED',
        blocks: [
          'Every trail fades to the background color, so most of the screen is black at any moment, with small bright characters scattered across it. That’s a tough scene for an LCD and an easy one for an OLED:',
          {
            ul: [
              '**OLED:** each pixel turns fully off, so the space between the streams is truly black and the characters look like they float in the dark.',
              '**IPS / VA LCD:** the backlight is always on, so the black background glows dark gray (IPS more than VA), especially in a dark room or at the corners.',
              '**Mini-LED:** local dimming zones light up around the falling streams, so you may see soft halos (blooming) following the characters.',
            ],
          },
          'Want to check this properly? Use the [black level](/black-level) and [local dimming](/local-dimming) tests.',
        ],
      },
      {
        id: 'ideas',
        heading: 'Ideas for using it',
        blocks: [
          {
            ul: [
              'A sci-fi backdrop for a stream, desk setup photo, or party screen.',
              'A quick “look at these blacks” demo for a new OLED.',
              'Ambient motion on a second monitor — but don’t leave the same static setup running for hours on an OLED; see the [burn-in guide](/guides/oled-burn-in).',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'Smooth, steady falling streams with fading trails.',
        'On OLED: a truly black background between the streams.',
      ],
      bad: [
        'A gray, glowing background in a dark room — normal for LCDs, not a fault.',
        'Halos following the characters — local dimming blooming on Mini-LED and FALD displays.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'The best case: true black between the streams. Avoid leaving it running unattended for hours.' },
      { panel: 'IPS / VA (LCD)', note: 'Background shows backlight glow; VA looks deeper than IPS in a dark room.' },
      { panel: 'Mini-LED', note: 'Expect some blooming halos as zones light up around the bright characters.' },
    ],
    tips: [
      'Turn the room lights off for maximum effect.',
      'Press H to hide the controls and Space to pause.',
      'Try amber or cyan for a retro terminal look.',
    ],
    related: ['black-level', 'local-dimming', 'burn-in', 'refresh-rate'],
    affiliates: 'matrix',
    disclaimer:
      'Purely for entertainment — not a diagnostic test. Contains continuous motion; take a break if it causes discomfort.',
    faqs: [
      {
        question: 'Is this a real monitor test?',
        answer:
          'No — it’s just for fun. It does show off black level nicely, but for real checks use the [black level](/black-level), [local dimming](/local-dimming), and [response time](/response-time) tests.',
      },
      {
        question: 'Can I use it as a screensaver?',
        answer:
          'It works well as a browser-based screensaver: go fullscreen and press H to hide the controls. It runs until you close it, but it doesn’t keep the screen awake — your OS may still dim, lock, or turn off the display after its usual timeout.',
      },
      {
        question: 'Will it cause burn-in on my OLED?',
        answer:
          'The rain itself is constantly moving and mostly black, so it’s low risk. The real risk is static elements left on screen for long periods. Modern OLEDs also run pixel-refresh routines; see the [OLED burn-in guide](/guides/oled-burn-in).',
      },
      {
        question: 'What are the characters in the Matrix rain?',
        answer:
          'The film’s code used mirrored half-width Japanese katakana mixed with digits and a few Latin letters. The Katakana option here uses half-width katakana and digits; you can also switch to Latin, hex, or binary.',
      },
    ],
  },
};
