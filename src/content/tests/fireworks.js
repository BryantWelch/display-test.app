export default {
  slug: 'fireworks',
  order: 930,
  category: 'fun',
  name: 'Fireworks',
  shortName: 'Fireworks',
  badges: [],
  summary: 'Fireworks on a black screen. They launch themselves, or you click to fire one.',
  seo: {
    title: 'Fireworks — Free Fullscreen Firework Screensaver',
    description:
      'Watch fireworks on a black screen, or click to launch your own. Set how often they fire, how big each burst is, and the colors.',
  },
  testSeo: {
    title: 'Fireworks — Fullscreen',
    description: 'Fullscreen fireworks you can launch yourself.',
  },
  load: () => import('../../pages/tests/FireworksTest'),
  page: {
    title: 'Fireworks',
    intro:
      'Rockets rise out of the bottom of the screen and burst. Click or tap anywhere to fire one there. This is **just for fun** — the blast fades shortly after it explodes, and the screen never flashes white.',
    startLabel: 'Light the fuse',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'about',
        heading: 'Launching them',
        blocks: [
          '**Auto launch** is how many rockets take off per second. Set it to **Off** if you only want the ones you place yourself. **Burst size** is how many sparks each explosion throws, and **Gravity** is how fast rockets slow down and sparks fall. Sparks also slow down in the air, so a burst blooms out and then drifts.',
          '**Shape** picks **Peony** (a round ball of sparks), **Ring** (a tilted circle), or **Heart**. **Mixed** picks for each burst. **Glitter** makes sparks twinkle as they fade.',
          'Press **Space** to pause, **F** to fire one, **↑ / ↓** to change the launch rate, and **H** to hide the controls. A click on the picture still launches a burst while the controls are hidden. Moving the mouse brings the panel back.',
          'Each frame is redrawn from true black. The short streaks behind each spark come from its speed, not from leftover pixels, so nothing lingers once a burst has faded — at any refresh rate.',
        ],
      },
      {
        id: 'black',
        heading: 'Color on black',
        blocks: [
          'Each burst is a handful of colored points on black, which is a pleasant thing to look at on an OLED and a wide-gamut panel. The colors are ordinary sRGB — they get more saturated on a wide-gamut screen, but they do not get brighter than SDR white. The [HDR test](/hdr-test) explains that limit.',
          'If a burst looks like a stack of flat color bands instead of a smooth fade, that is the same banding the [gradient test](/color-gradient) is for.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Rockets rise, slow down, and burst near the top. The blast fades out shortly after the explosion.',
        'A click puts a burst where you clicked.',
      ],
      bad: [
        'The whole screen flashing white. That should not happen — bursts are capped and fade into black.',
      ],
    },
    tips: [
      'Set auto launch to Off and fire them yourself.',
      'Gold on a black OLED is the classic look.',
      'Stop if the motion bothers you. Nothing here is worth sitting through.',
    ],
    related: ['starfield', 'aurora', 'black-level', 'color-gradient'],
    disclaimer:
      'Purely for entertainment — not a diagnostic test. Bursts are small and fade quickly. Stop if flashing light or motion bothers you.',
    faqs: [
      {
        question: 'Can this trigger photosensitive epilepsy?',
        answer:
          'The bursts are limited in size and they fade into black. The page never flashes the whole screen white. Even so, stop immediately if flickering or motion is uncomfortable.',
      },
      {
        question: 'Why did my click do nothing?',
        answer:
          'Clicks are ignored while the show is paused (Space). There is also a cap on how many sparks can be on screen at once, so a click during a very busy moment waits until some have faded.',
      },
      {
        question: 'Are the colors real HDR?',
        answer:
          'No. They are standard sRGB colors on a black background. A wide-gamut display can make them look more saturated. It cannot make them brighter than the screen’s normal white.',
      },
    ],
  },
};
