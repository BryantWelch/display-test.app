export default {
  slug: 'bouncing-logo',
  order: 910,
  category: 'fun',
  name: 'Bouncing Logo',
  shortName: 'Bouncing Logo',
  badges: [],
  summary: 'The Display Test logo bounces around the screen. Switch it for DVD, VHS, 4K, OLED, or HDR.',
  seo: {
    title: 'Bouncing Logo — Free Fullscreen Corner-Hit Screensaver',
    description:
      'The Display Test logo bounces around your screen and changes color when it hits an edge. Switch to a DVD wordmark and others. The counter goes up only for a real corner hit.',
  },
  testSeo: {
    title: 'Bouncing Logo — Fullscreen',
    description: 'Fullscreen bouncing logo that counts corner hits.',
  },
  load: () => import('../../pages/tests/BouncingLogoTest'),
  page: {
    title: 'Bouncing Logo',
    intro:
      'A logo drifts around the screen until it hits a corner. It starts as the Display Test mark from the site header. You can switch it to **DVD**, **VHS**, **4K**, **OLED**, or **HDR**. This one is **just for fun** — no diagnosis, no pass or fail.',
    startLabel: 'Start bouncing',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'about',
        heading: 'How the corner count works',
        blocks: [
          'The logo moves one pixel at a time on a diagonal, at the speed you pick. Touching a single edge flips that direction and, unless you choose **Hold color**, switches to the next color. A **corner** counts only when both edges are hit on the same step. That is uncommon on purpose, which is the whole game.',
          'The bounce box hugs the visible letters, so when the counter says corner, the logo really is touching both edges.',
          '**Next corner** works out when the logo will next hit both edges at once, from its position, its direction, and the window size. Some sizes never line up. If it says **never**, nudge the size slider or resize the window and it usually finds one.',
          'Press **Space** to pause, **↑ / ↓** to change speed, **← / →** to switch logos, and **H** to hide the controls. Speed is in pixels per second, so it travels the same distance at 60 Hz and at 240 Hz. A higher refresh rate just makes the motion look smoother.',
        ],
      },
      {
        id: 'motion',
        heading: 'What it shows off',
        blocks: [
          'Nothing here is a measurement. It is an easy way to see whether motion on your display looks smooth or juddery, which is the same thing the [response time](/response-time) and [refresh rate](/refresh-rate) tests are for.',
          'On an OLED the black background should look truly black around the logo. On a backlit LCD it will glow a little, especially in a dark room.',
        ],
      },
    ],
    lookFor: {
      good: [
        'The logo reverses cleanly at each edge and the color changes with it.',
        'The corner counter stays still until the logo actually strikes two edges at once.',
      ],
      bad: [
        'The logo visibly stutters while the rest of the desktop is smooth — something else on the machine is dropping frames.',
      ],
    },
    tips: [
      'Hide the controls with H so the panel is not in the way.',
      'Hold color if you want one shade the whole time.',
      'A corner can take a while. Watch the Next corner readout, or change the size until it is only a minute away.',
    ],
    related: ['starfield', 'matrix', 'response-time', 'refresh-rate'],
    disclaimer: 'Purely for entertainment — not a diagnostic test. Contains continuous motion; take a break if it causes discomfort.',
    faqs: [
      {
        question: 'Is this the DVD screensaver?',
        answer:
          'Same idea. The default mark is the Display Test logo. Choose DVD and the letters DVD bounce instead. That wordmark is drawn for this page — it is not the DVD Video logo.',
      },
      {
        question: 'Why does a corner almost never happen?',
        answer:
          'The logo only moves on a diagonal, one pixel at a time. A corner counts when the horizontal and vertical edges are both due on the same step. On most window sizes that lines up only once in a long while, and on some it never does. The Next corner readout tells you which case you are in.',
      },
      {
        question: 'Will it keep my screen awake?',
        answer:
          'No. It runs until you leave, but your operating system can still dim, lock, or turn the display off on its usual timer.',
      },
    ],
  },
};
