export default {
  slug: 'dead-pixel',
  order: 200,
  category: 'defects',
  name: 'Dead Pixel Test',
  shortName: 'Dead Pixel',
  badges: ['Popular'],
  summary: 'Cycle full-screen solid colors to spot dead, stuck, and hot pixels.',
  seo: {
    title: 'Dead Pixel Test — Find Dead & Stuck Pixels in 30 Seconds | Free',
    description:
      'Free full-screen dead pixel checker for LCD, OLED, laptop, and gaming monitors. Cycle solid colors with arrow keys to find dead, stuck, or hot pixels — no download.',
  },
  testSeo: {
    title: 'Dead Pixel Test — Fullscreen',
    description: 'Full-screen solid colors to find dead, stuck, and hot pixels.',
  },
  load: () => import('../../pages/tests/DeadPixelTest'),
  checkup: { step: 20, question: 'Did you find any dead, stuck, or hot pixels?' },
  page: {
    title: 'Dead Pixel Test',
    intro:
      'Fill the screen with solid colors to find dead, stuck, or hot pixels — after a new purchase, before a return window closes, or whenever a spot doesn’t look right.',
    startLabel: 'Start dead pixel test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'Dead, stuck, and hot pixels',
        blocks: [
          'Every pixel is made of red, green, and blue subpixels. When one stops responding you’ll see one of three things:',
          {
            ul: [
              '**Dead pixel** — always black, no matter what color is shown. Most visible on white.',
              '**Stuck pixel** — locked on one color (often red, green, or blue). Most visible on black or a contrasting color.',
              '**Hot pixel** — always on as a bright white point. Most visible on black.',
            ],
          },
          'Manufacturers allow a small number of defects, but clusters, or a single bright defect near the center, are distracting and often qualify for a return.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Wipe the screen with a dry microfiber cloth — dust looks exactly like a dead pixel.',
              'Dim the room lights and sit at your normal distance.',
              'Click **Start dead pixel test**. Use **← / →** or **Space** to step through colors, or turn on auto-cycle.',
              'On each color, scan the screen in rows: left to right, top to bottom. Spend the most time on **white**, **black**, **red**, **green**, and **blue**.',
              'If you find something, step through every color to classify it, and photograph it on the color where it’s most visible.',
            ],
          },
          'If a spot moves when you move your head, it’s a reflection or dust, not a pixel.',
        ],
      },
      {
        id: 'interpret',
        heading: 'Interpreting what you find',
        blocks: [
          {
            ul: [
              'One defect at the edge is usually “within spec” for a manufacturer warranty, but most retailers will still take a return inside their window.',
              'Any bright (hot or stuck) defect in the center third of the screen is worth returning while you can.',
              'Several defects, or a cluster of adjacent bad pixels, suggest a panel problem rather than bad luck.',
            ],
          },
          'See the [dead pixel policies guide](/guides/dead-pixel-policies) for how manufacturers count defects and how to file a claim.',
        ],
      },
      {
        id: 'fix',
        heading: 'Can it be fixed?',
        blocks: [
          'Dead pixels (no power to the pixel) are permanent. Stuck pixels sometimes recover:',
          {
            ul: [
              'Power the display off for 10 minutes, then retest.',
              'Run the [stuck pixel fixer](/stuck-pixel-fixer) over the spot for 10–30 minutes.',
              'Gentle pressure with a soft cloth while the pixel is lit is an old trick, but it can damage modern panels — and it can void warranties. We don’t recommend it on OLED or touchscreens.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'Every color is completely uniform from edge to edge at pixel level.',
        'Tiny specks that move with your head or wipe away (dust, reflections).',
        'Faint, soft-edged brightness changes — that’s uniformity, not pixels.',
      ],
      bad: [
        'A sharp black dot that stays black on every color (dead pixel).',
        'A dot that stays red, green, blue, or white when the screen changes (stuck / hot pixel).',
        'Lines of bad pixels or clusters — a panel or connection fault.',
      ],
    },
    panelNotes: [
      { panel: 'IPS / VA / TN (LCD)', note: 'Stuck subpixels are the most common defect. A soft cloth press sometimes helps but can damage the panel.' },
      { panel: 'OLED / QD-OLED', note: 'Defects are rarer but can’t be massaged. Some brands treat any bright defect as a fault. Fringing around text is normal subpixel layout, not dead pixels.' },
      { panel: 'Mini-LED', note: 'Dark halos around bright objects are local dimming, not pixels — test dead pixels with local dimming off.' },
    ],
    whenToReturn: [
      'Inside the retailer return window: return for **any** defect that bothers you — this is far easier than a warranty claim.',
      'Any bright stuck or hot pixel near the center.',
      'Two or more defects, or any cluster or line.',
      'Outside the return window: check the manufacturer’s pixel policy and photograph the defect on the color where it’s clearest.',
    ],
    tips: [
      'Run at native resolution with no OS scaling so one test pixel = one panel pixel.',
      'Turn off local dimming / dynamic contrast — they can hide hot pixels.',
      'Retest after a 15–20 minute warm-up; some stuck pixels only show when warm.',
      'Use a phone camera at 2–3× zoom to confirm a suspected pixel.',
    ],
    related: ['stuck-pixel-fixer', 'uniformity', 'black-level', 'screen-resolution'],
    affiliates: 'deadPixel',
    disclaimer:
      'A visual inspection aid — it does not replace manufacturer diagnostics. Follow your vendor’s guidance when requesting service.',
    faqs: [
      {
        question: 'What is the difference between a dead pixel and a stuck pixel?',
        answer:
          'A dead pixel stays black because it isn’t receiving power. A stuck pixel stays lit in one color because one or more subpixels are always on. Stuck pixels can sometimes be revived with a pixel-flashing tool; dead pixels are permanent.',
      },
      {
        question: 'How many dead pixels are acceptable on a new monitor?',
        answer:
          'It depends on the brand. Many follow an ISO 9241-307 Class II style policy that allows a handful of defects; some offer “zero bright dot” guarantees. Retailer return windows are usually more generous — see the [dead pixel policies guide](/guides/dead-pixel-policies).',
      },
      {
        question: 'Can dead pixels spread?',
        answer:
          'Individual dead pixels don’t spread. If new ones keep appearing over weeks, that points to a panel or driver fault — document them with dates and contact the manufacturer.',
      },
      {
        question: 'Does this work on phones and TVs?',
        answer:
          'Yes. Open the test in the device’s browser and go fullscreen. On phones, turn off auto-brightness; on TVs, use the TV’s own browser or cast a fullscreen tab.',
      },
    ],
  },
};
