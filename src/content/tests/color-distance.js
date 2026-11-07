export default {
  slug: 'color-distance',
  order: 340,
  category: 'color',
  name: 'Color Distinction Test',
  shortName: 'Color Distinction',
  badges: [],
  summary: 'Find the smallest color difference you can see on your display, from near-black to near-white.',
  seo: {
    title: 'Color Distinction Test — How Small a Color Difference Can You See? | Free',
    description:
      'Free full-screen test of near-identical colors. Compare two shades with ±1 step controls or a 1–8 step staircase to find your threshold in shadows, highlights, skin tones, and blues.',
  },
  testSeo: {
    title: 'Color Distinction Test — Fullscreen',
    description: 'Compare near-identical colors and find your visible threshold.',
  },
  load: () => import('../../pages/tests/ColorDistanceTest'),
  page: {
    title: 'Color Distinction Test',
    intro:
      'Put two nearly identical colors side by side and find the smallest difference you can still see — in shadows, highlights, skin tones, and sky blues. A quick way to judge whether your display (and setup) can show fine tonal detail.',
    startLabel: 'Start color distinction test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-it-tests',
        heading: 'What this test does (and doesn’t) measure',
        blocks: [
          'Colors on the web are sent to your display as 8-bit code values: 0–255 for each of red, green, and blue. This test shows a patch that differs from its background by a few code values and lets you see whether that difference is visible.',
          'The result depends on your **display, its settings, your eyes, and your room lighting** together. That’s exactly what matters for day-to-day use, but it is not a measurement of color accuracy. A display can show every 1-step difference and still be noticeably off in hue or white point.',
          { note: 'We deliberately don’t show Delta E (ΔE) values. ΔE describes the difference between measured colors, and a browser can’t measure what your screen actually emits — only a colorimeter or spectrophotometer can.' },
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Use your normal brightness and picture mode, and turn off dynamic contrast or “black enhancer” modes for a fair result.',
              'Click **Start color distinction test**. In **Two colors** mode, pick a preset, then tap **−1** on one channel or press **↓** until the patch disappears. The last visible difference is your threshold for that color.',
              'Switch to **Staircase** for an at-a-glance view: six patches at 1, 2, 3, 4, 6, and 8 code values from the background. Use **Shuffle & hide labels** for a blind check, count what you can see, then reveal.',
              'Repeat on near black, near white, and mid gray — results usually differ a lot between them.',
            ],
          },
        ],
      },
      {
        id: 'interpret',
        heading: 'Interpreting your results',
        blocks: [
          {
            table: {
              head: ['What you see', 'What it usually means'],
              rows: [
                ['1–2 step differences visible at mid gray', 'Excellent tonal resolution — typical of a good, well-set-up display in a dim room.'],
                ['Need 3–4 steps at mid gray', 'Normal for many displays and viewing conditions.'],
                ['Near-black patches invisible below 4–8 steps', 'Black crush: brightness/black level set too low, gamma too high, or a VA/OLED near-black handling issue. Check the [black level test](/black-level).'],
                ['Near-white patches invisible', 'Highlight clipping: contrast too high, or an oversaturated / “vivid” mode. Check [white saturation](/white-saturation).'],
                ['Steps look uneven (e.g. +3 visible but +4 not)', 'Banding or dithering in the display pipeline; compare with the [color gradient test](/color-gradient).'],
              ],
            },
          },
          'Human vision is more sensitive to differences in some colors than others, so needing more steps for blues than for greens or skin tones is expected and not a display fault.',
        ],
      },
      {
        id: 'improve',
        heading: 'Improving what you can distinguish',
        blocks: [
          {
            ul: [
              'Turn off dynamic contrast, eco modes, and sharpness/“detail enhancement” that can crush or exaggerate fine steps.',
              'Set brightness and contrast with the [black level](/black-level) and [white saturation](/white-saturation) tests before judging fine differences.',
              'Make sure the GPU outputs full-range RGB (0–255) to monitors; a limited-range mismatch crushes shadows and highlights.',
              'Reduce glare and reflections — ambient light washes out near-black differences first.',
              'For color-critical work, a hardware calibration with a colorimeter is the only way to verify accuracy.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'The mid-gray patch is visible at 2–3 code values of difference.',
        'In staircase mode, patches get steadily easier to see from +1 to +8.',
        'Near-black and near-white patches become visible by about 4–6 steps.',
      ],
      bad: [
        'Near-black patches are invisible even at 8 steps (shadow crush).',
        'Near-white patches are invisible even at 8 steps (highlight clipping).',
        'Visibility jumps around between steps, or the patch shows bands or noise.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Good mid-tone discrimination, but IPS glow in a dark room can hide near-black steps at the edges.' },
      { panel: 'VA', note: 'High contrast helps, but some VA panels crush the first few near-black steps or shift them with viewing angle.' },
      { panel: 'OLED', note: 'Near-black steps can be crushed or show blotchy near-black uniformity; this varies by model and firmware.' },
      { panel: '6-bit + FRC panels', note: 'Many budget panels show 8-bit color with temporal dithering. 1-step differences may shimmer or be uneven.' },
    ],
    tips: [
      'Dim the room and avoid reflections on the screen.',
      'Let the display warm up for 15–20 minutes.',
      'Turn off dynamic contrast and HDR for this test.',
      'Look away briefly between steps so your eyes don’t adapt to the patch.',
    ],
    related: ['color-gradient', 'black-level', 'white-saturation', 'gamma'],
    affiliates: 'colorDistance',
    disclaimer:
      'A perceptual check of your display and viewing conditions, not a color accuracy measurement. Use a colorimeter for calibration and Delta E figures.',
    faqs: [
      {
        question: 'What does the color distinction test measure?',
        answer:
          'How small a difference in RGB code values you can see on your display, in your room, with your eyes. It’s useful for judging shadow and highlight detail and display settings, but it doesn’t measure color accuracy.',
      },
      {
        question: 'Why doesn’t this test show Delta E?',
        answer:
          'Delta E compares colors that have been measured. A browser only knows the values it sends to the screen, not the light the screen emits, so any ΔE figure here would be false precision. Use a colorimeter if you need real accuracy numbers.',
      },
      {
        question: 'Why can’t I see the difference near black?',
        answer:
          'Near-black differences are the first to disappear when brightness or black level is set too low, gamma is too high, ambient light is reflecting off the screen, or the GPU and monitor disagree about full vs limited RGB range. Fix those with the [black level test](/black-level), then retest.',
      },
      {
        question: 'Is it normal to need more steps for some colors?',
        answer:
          'Yes. Human vision is more sensitive to some colors and brightness levels than others, and 8-bit steps aren’t perceptually even. Needing a few more steps in blues or very dark tones is expected.',
      },
      {
        question: 'Can I improve my monitor’s color accuracy?',
        answer:
          'Start with the right picture mode (often sRGB or “standard”), neutral settings, and full-range RGB. For real accuracy you need hardware calibration with a colorimeter, and the panel’s gamut and uniformity still set the limits.',
      },
    ],
  },
};
