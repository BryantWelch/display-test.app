export default {
  slug: 'local-dimming',
  order: 250,
  category: 'defects',
  name: 'Local Dimming & Blooming Test',
  shortName: 'Local Dimming',
  badges: [],
  summary: 'Small bright objects on pure black to reveal blooming, halos, and slow zone transitions on FALD and Mini-LED displays.',
  seo: {
    title: 'Local Dimming Test — Check Blooming & Halo on Mini-LED / FALD | Free',
    description:
      'Free full-screen blooming test for Mini-LED, FALD, and edge-lit monitors and TVs. Move a white square, star field, or subtitles over black to spot halos and zone lag.',
  },
  testSeo: {
    title: 'Local Dimming Test — Fullscreen',
    description: 'Moving bright objects on black to reveal blooming and zone transitions.',
  },
  load: () => import('../../pages/tests/LocalDimmingTest'),
  page: {
    title: 'Local Dimming & Blooming Test',
    intro:
      'Mini-LED and full-array local dimming (FALD) displays turn their backlight down behind dark areas. A small bright object on black shows how well that works — and how much glow (“blooming”) leaks around it.',
    startLabel: 'Start local dimming test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How local dimming works',
        blocks: [
          'An LCD panel can’t make light, only block it, so black on a normal LCD is really “backlight leaking through”. Local dimming splits the backlight into **zones** — from a handful of edge-lit strips on budget HDR monitors to several thousand on high-end Mini-LED monitors and TVs — and dims each zone to match the picture behind it.',
          'Each zone is far larger than a pixel. When a small bright object sits inside a zone, the whole zone has to light up, and the LCD can’t fully block the extra light around the object. That gray or colored glow is **blooming** (or a halo).',
          {
            ul: [
              '**Edge-lit dimming** — zones are vertical or horizontal strips. Blooming shows as bright columns or bands across the screen.',
              '**FALD** — a grid of LEDs behind the panel. Blooming is a soft glow or a blocky square around bright objects.',
              '**Mini-LED** — FALD with much smaller LEDs, so hundreds to thousands of zones. Halos are tighter but still visible on stars, cursors, and subtitles.',
              '**OLED** — every pixel is its own light, so there is no blooming at all. A white dot on black stays a white dot.',
            ],
          },
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Darken the room. Blooming is much easier to see — and matters more — at night.',
              'Set the display to its HDR or local dimming mode. On monitors this is often “Local Dimming”, “Mini-LED zones”, or tied to HDR presets.',
              'Start the test and hide the panel with **H** (the panel itself lights zones).',
              'With the **Square** still, look at the black around it: is it pure black, a soft glow, or a visible block?',
              'Switch to **Star field** and **Subtitles** — the real-world cases. Watch whether small stars dim (zones turning down too far) or carry halos.',
              'Lower **Size** and **Brightness** to see how tiny or dim highlights are handled. Some displays barely light a zone for them.',
              'Turn on **Sweep**, **Bounce**, or **Follow** and watch the glow: does it trail behind, step from zone to zone, or pulse? In **Follow**, the panel and cursor stay hidden while you move, so they don’t light zones of their own.',
              'Repeat for each local dimming level (Off / Low / Medium / High) and pick the one you like best.',
            ],
          },
        ],
      },
      {
        id: 'reading',
        heading: 'Reading the results',
        blocks: [
          {
            ul: [
              '**Halo size** — smaller and fainter is better. A soft glow a little larger than the object is typical of good Mini-LED.',
              '**Zone lag** — the glow should follow moving objects closely. A halo that trails, jumps between blocks, or “breathes” is slow dimming logic.',
              '**Highlight suppression** — some displays dim small objects to hide blooming. If stars look gray or vanish with local dimming on, the algorithm is trading highlight brightness for black depth.',
              '**Raised blacks** — if the whole screen looks gray with a small object, the display may be keeping zones up to avoid visible stepping.',
            ],
          },
          'There’s no single right answer: high settings give deeper blacks and more halo; low settings give less halo and grayer blacks. Choose what looks best on the content you actually watch.',
        ],
      },
      {
        id: 'limits',
        heading: 'What a browser can and can’t tell you',
        blocks: [
          'This is purely visual — a browser can’t see the backlight or count zones. Many monitors only enable local dimming in HDR mode, or use a different, gentler dimming curve in SDR, so Windows may need HDR turned on for the display’s HDR dimming to engage.',
          'The white here is SDR white. With HDR on, the OS shows it at its SDR content brightness, well below the display’s HDR peak, so blooming around real HDR highlights is usually stronger than what you see here. A phone camera at fixed exposure can help compare settings side by side, but cameras exaggerate blooming compared with your eyes.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Black stays black around the object, or a soft glow only slightly bigger than it.',
        'The glow follows moving objects smoothly without visible blocks.',
        'Small stars keep their brightness. OLED: no glow at all.',
      ],
      bad: [
        'A large gray square or columns of light around the object (big zones or edge-lit dimming).',
        'The halo trails, jumps, or pulses as the object moves (slow zone transitions).',
        'Stars or subtitles dim noticeably, or the entire background turns gray.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'No backlight, so no blooming. A faint glow is reflection or your eyes, not the panel.' },
      { panel: 'Mini-LED', note: 'Hundreds to thousands of zones. Expect a soft halo on stars and cursors; the best sets keep it tight and stable.' },
      { panel: 'FALD (non-Mini-LED)', note: 'Dozens to a few hundred zones. Visible blocks around small objects are normal; compare dimming levels.' },
      { panel: 'Edge-lit', note: 'Strips, not a grid. Bright vertical or horizontal bands through the object are expected.' },
    ],
    whenToReturn: [
      'Blooming is far worse than reviews of the same model, or one area of the screen behaves very differently from the rest (a failed zone).',
      'A zone stays lit, flickers, or stays dark regardless of content.',
    ],
    tips: [
      'Test in a dark room; that’s where blooming shows.',
      'Hide the controls with H — the panel can light zones.',
      'Enable HDR if your monitor only dims locally in HDR mode.',
      'Compare each local dimming level with the same shape and motion.',
    ],
    related: ['brightness', 'black-level', 'uniformity', 'hdr-test', 'contrast'],
    affiliates: 'contrast',
    disclaimer:
      'A visual aid for comparing local dimming behavior. It doesn’t measure luminance or zone counts; reviews with a meter give objective numbers.',
    faqs: [
      {
        question: 'What is blooming on a monitor?',
        answer:
          'Blooming is a glow or halo around bright objects on a dark background. It happens on local-dimming LCDs because each backlight zone is much larger than a pixel, so light spills into dark areas next to bright ones.',
      },
      {
        question: 'Should I turn local dimming on or off?',
        answer:
          'For dark films and HDR games, on (often Medium or High) gives much deeper blacks. For desktop work with a mouse cursor and white text on dark themes, Low or Off can be less distracting. Run this test at each setting and decide.',
      },
      {
        question: 'Do OLED displays have blooming?',
        answer:
          'No. Each OLED pixel makes its own light and turns fully off for black, so there is no halo. OLEDs have different trade-offs, such as automatic brightness limiting and burn-in risk.',
      },
      {
        question: 'Why does the glow lag behind a moving object?',
        answer:
          'The display analyzes each frame and ramps zones up and down gradually to avoid flicker. Slower algorithms leave a visible trail or step between zones. Some monitors offer a faster or “game” dimming option.',
      },
      {
        question: 'Can blooming be fixed?',
        answer:
          'Not completely — it’s a physical limit of zone size. Lowering the local dimming level, adding some ambient or bias lighting, or avoiding small bright text on dark themes all make it less noticeable.',
      },
    ],
  },
};
