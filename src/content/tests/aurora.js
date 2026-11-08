export default {
  slug: 'aurora',
  order: 940,
  category: 'fun',
  name: 'Aurora',
  shortName: 'Aurora',
  badges: [],
  summary: 'Slow curtains of color on a black screen. A calm one, and an easy place to see banding.',
  seo: {
    title: 'Aurora — Free Fullscreen Northern Lights Screensaver',
    description:
      'Slow curtains of northern-lights color on a black screen. Set the speed, brightness, and palette. Smooth sheets on a good panel, visible steps if it bands.',
  },
  testSeo: {
    title: 'Aurora — Fullscreen',
    description: 'Fullscreen northern-lights curtains.',
  },
  load: () => import('../../pages/tests/AuroraTest'),
  page: {
    title: 'Aurora',
    intro:
      'Slow sheets of color drift down a black screen. This is **just for fun** — there is no pass or fail — though a sheet that breaks into hard stripes is the same banding a gradient would show.',
    startLabel: 'Watch the lights',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'about',
        heading: 'What you are looking at',
        blocks: [
          'Each band is a soft curtain with a bright lower edge that fades up into a second color at the top, like the real thing. **Borealis** is green with a violet fringe, **Twilight** purple and pink, **Ember** orange and red, **Arctic** blue, **Meadow** green and lime, and **Rose** pink.',
          '**Bands** sets how many curtains there are. **Height** is how far up they reach, **Wave** is how much they ripple, and **Rays** adds the vertical streaks. **Stars** adds a still star field behind them. **Brightness** only raises how strongly the curtains glow. It does not make the display itself brighter.',
          'Press **Space** to pause, **↑ / ↓** to change speed, **← / →** to change palette, **S** for stars, and **H** to hide the controls. The motion is slow on purpose. The picture updates 30 times a second and is drawn at a reduced size, then scaled up, so it stays light on the CPU. The curtains are soft anyway, so this costs no detail you would see.',
        ],
      },
      {
        id: 'banding',
        heading: 'Smooth sheet, or steps',
        blocks: [
          'A curtain should melt from one color into the next. The folds in the shape and the vertical rays are supposed to be there. What is not supposed to be there are hard edges inside the color, like a ramp cut into strips. Set **Rays** to 0 for the cleanest look. That is banding, and the [color gradient test](/color-gradient) is the place to look at it properly.',
          'A little banding on an ordinary 8-bit panel is normal, especially in the darker parts of a curtain. It gets worse if the browser, the operating system, or a heavy color profile is reprocessing the page. Turning Windows HDR off, or testing in a plain SDR window, is worth a try before blaming the panel.',
          'On a wide-gamut display the same sRGB colors can look more saturated. They still are not HDR, and they cannot exceed the screen’s normal white. See the [HDR test](/hdr-test).',
        ],
      },
    ],
    lookFor: {
      good: [
        'Curtains drift slowly and the color inside each one changes gradually.',
        'The black around the curtains stays black, or as black as the panel can manage.',
      ],
      bad: [
        'Clear steps or contour lines inside a curtain — banding. Confirm it on the gradient test.',
        'A gray haze over the whole background in a dark room — backlight glow on an LCD.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'The black around the curtains should drop away. QD-OLED can look slightly lifted in a bright room because the panel reflects light.' },
      { panel: '8-bit LCD', note: 'Faint steps in the darker part of a curtain are common. Wide, smooth areas show them off.' },
      { panel: 'Wide gamut', note: 'Colors look richer. That is the gamut, not a brighter image.' },
    ],
    tips: [
      'Dim the room and hide the controls.',
      'Lower the brightness slider and set Rays to 0 if you want to look for banding. Darker blends show it sooner.',
      'Twilight is the easiest palette in which to see steps.',
    ],
    related: ['color-gradient', 'fireworks', 'hdr-test', 'matrix'],
    disclaimer: 'Purely for entertainment — not a diagnostic test. The motion is slow. Take a break if it causes discomfort.',
    faqs: [
      {
        question: 'Is this a banding test?',
        answer:
          'No. Banding can show up here, and the page says so, but the [color gradient test](/color-gradient) is the one that draws every 8-bit step on purpose. Treat anything you notice here as a hint, then confirm it there.',
      },
      {
        question: 'Why do the colors look different on my other monitor?',
        answer:
          'The curtains are the same sRGB colors everywhere. A wide-gamut panel displays them more saturated, and a warm or cool color preset shifts the whole palette. Brightness in the panel only changes the drawing, not the display’s backlight.',
      },
      {
        question: 'Can I leave it on an OLED overnight?',
        answer:
          'The curtains keep moving, so it is gentler than a static image, but it is still a bright shape in the same band of the screen for a long time. It is a screensaver, not something to park for hours. See the [OLED burn-in guide](/guides/oled-burn-in).',
      },
    ],
  },
};
