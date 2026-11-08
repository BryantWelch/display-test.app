export default {
  slug: 'screen-size-calculator',
  order: 645,
  category: 'utilities',
  name: 'Screen Size & Viewing Distance Calculator',
  shortName: 'Screen Size Calculator',
  badges: [],
  summary: 'Width, height, and area from diagonal and aspect ratio — compare two screens and find the right viewing distance.',
  seo: {
    title: 'Screen Size Calculator — Width, Height & Viewing Distance',
    description:
      'Convert a TV or monitor’s diagonal and aspect ratio to width, height, and area in inches or cm. Compare two screens to scale and get THX and SMPTE viewing distances.',
  },
  inlineTool: () => import('../../tools/ScreenSizeCalculator'),
  page: {
    title: 'Screen Size & Viewing Distance Calculator',
    intro:
      'Screen sizes are sold by the diagonal, which says little about how big a screen actually is — a 34″ ultrawide is about as tall as a 27″ monitor. Enter two screens to see their real width, height, and area side by side, then find how far to sit from them.',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'how-it-works',
        heading: 'From diagonal to width and height',
        blocks: [
          'For a screen with aspect ratio *r* (width ÷ height) and diagonal *d*: **height = d ÷ √(r² + 1)** and **width = height × r**. For 16:9, that works out to width ≈ 0.872 × diagonal and height ≈ 0.490 × diagonal.',
          {
            table: {
              head: ['Screen', 'Width', 'Height'],
              rows: [
                ['24″ 16:9', '53.1 cm / 20.9″', '29.9 cm / 11.8″'],
                ['27″ 16:9', '59.8 cm / 23.5″', '33.6 cm / 13.2″'],
                ['32″ 16:9', '70.8 cm / 27.9″', '39.8 cm / 15.7″'],
                ['34″ 21:9 (3440 × 1440)', '79.7 cm / 31.4″', '33.3 cm / 13.1″'],
                ['49″ 32:9', '119.8 cm / 47.2″', '33.7 cm / 13.3″'],
                ['55″ 16:9 TV', '121.8 cm / 47.9″', '68.5 cm / 27.0″'],
                ['65″ 16:9 TV', '143.9 cm / 56.7″', '80.9 cm / 31.9″'],
                ['77″ 16:9 TV', '170.5 cm / 67.1″', '95.9 cm / 37.8″'],
              ],
            },
          },
          'Advertised sizes are rounded and measure the visible area only, so a “27-inch” panel can be 26.9″, and a TV’s bezel adds a few centimeters to the outside dimensions.',
        ],
      },
      {
        id: 'ultrawide',
        heading: 'Ultrawide vs 16:9: compare by height',
        blocks: [
          'Because the diagonal grows with width, wider screens look bigger on paper than they are. Height is a better comparison for how large text and windows look:',
          {
            ul: [
              'A **34″ 21:9** ultrawide is as tall as a **26.8″ 16:9** — think “a 27″ monitor with extra width on both sides.”',
              'A **49″ 32:9** super ultrawide is as tall as a **27.1″ 16:9** — two 27″ monitors side by side, without the bezel in the middle.',
              'A **38″ 21:9** (3840 × 1600) is about as tall as a **30″ 16:9**.',
              'At the same diagonal, **16:10** is about 8% taller than 16:9 — more vertical room for documents and code.',
            ],
          },
          'Compare a 34″ 21:9 with a 27″ 16:9 and choose **Overlap** in the calculator to see how much extra width you get at nearly the same height.',
        ],
      },
      {
        id: 'viewing-distance',
        heading: 'How far to sit from a TV or monitor',
        blocks: [
          'Recommendations are based on how much of your field of view the screen fills horizontally:',
          {
            ul: [
              '**THX: about 40°.** Immersive, cinema-like. For a 16:9 screen this is roughly **1.2 × the diagonal** — about 1.7 m from a 55″ TV or 2 m from a 65″.',
              '**SMPTE: at least 30°.** The long-standing minimum for film and TV, roughly **1.6 × the diagonal** — about 2.3 m from a 55″ or 2.7 m from a 65″.',
              '**Desk monitors** are usually viewed much wider — 40–60° is normal at arm’s length (50–75 cm for 24–27″). Larger monitors push you back: a 32″ is comfortable around 65–100 cm.',
            ],
          },
          {
            table: {
              head: ['16:9 TV', 'THX 40°', 'SMPTE 30°'],
              rows: [
                ['50″', '1.5 m / 5.0 ft', '2.1 m / 6.8 ft'],
                ['55″', '1.7 m / 5.5 ft', '2.3 m / 7.5 ft'],
                ['65″', '2.0 m / 6.5 ft', '2.7 m / 8.8 ft'],
                ['77″', '2.3 m / 7.7 ft', '3.2 m / 10.4 ft'],
                ['85″', '2.6 m / 8.5 ft', '3.5 m / 11.5 ft'],
              ],
            },
          },
          'Resolution sets the other limit: sit too close and you see pixels. Use the [PPI calculator](/ppi-calculator) to get the “retina distance” for a given resolution — for a 65″ 4K TV it’s about 1.3 m, so 4K is sharp at any THX or SMPTE distance.',
        ],
      },
      {
        id: 'choosing',
        heading: 'Picking a size for your room',
        blocks: [
          {
            ol: [
              'Measure from your seat to the wall or desk position where the screen will go.',
              'Set **Your distance** in the calculator and try screen sizes until the field of view lands between 30° and 40° for a TV, or around 40–60° for a desk monitor.',
              'Check physical fit: compare the width against your TV stand or desk, and leave space for the stand and bezel.',
            ],
          },
          'Using a TV as a desktop monitor? Sit farther back than you think and see [using a TV as a monitor](/guides/tv-as-monitor) for settings.',
        ],
      },
    ],
    tips: [
      'Diagonal is measured corner to corner of the visible picture, not the frame.',
      'Compare screens of different shapes by height, not diagonal.',
      'Field of view matters more than size — a smaller screen up close can feel bigger.',
      'For desk monitors, the top of the screen should sit at or slightly below eye level.',
    ],
    related: ['ppi-calculator', 'screen-ruler', 'screen-resolution', 'text-clarity'],
    faqs: [
      {
        question: 'How do I calculate a TV or monitor’s width and height from its size?',
        answer:
          'Divide the diagonal by √(r² + 1), where r is the aspect ratio as width ÷ height, to get the height; multiply the height by r for the width. For 16:9, width ≈ 0.872 × diagonal and height ≈ 0.490 × diagonal. A 65″ TV is about 56.7″ × 31.9″ (144 × 81 cm).',
      },
      {
        question: 'How far should I sit from a 65-inch TV?',
        answer:
          'About 2.0 m (6.5 ft) for a THX-style 40° immersive view, up to about 2.7 m (8.8 ft) for SMPTE’s 30° minimum. With 4K, you won’t see individual pixels at either distance.',
      },
      {
        question: 'Is a 34-inch ultrawide bigger than a 27-inch monitor?',
        answer:
          'It’s wider but about the same height. A 34″ 21:9 is as tall as a 26.8″ 16:9, so text and windows look the same size as on a 27″ — you just get roughly a third more width.',
      },
      {
        question: 'How far should I sit from my computer monitor?',
        answer:
          'Roughly arm’s length: 50–75 cm (20–30″) for 24–27″ monitors, and a bit farther — 65–100 cm — for 32″ and larger. You should be able to see the whole screen without moving your head much.',
      },
      {
        question: 'What’s the difference between the THX and SMPTE recommendations?',
        answer:
          'Both are based on the horizontal angle the screen fills. SMPTE recommends at least 30° as a minimum for a good viewing experience; THX recommends about 40° for a more immersive, cinema-like picture. Anywhere between the two is a good target for a TV.',
      },
    ],
  },
};
