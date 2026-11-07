export default {
  slug: 'gamma',
  order: 300,
  category: 'color',
  name: 'Gamma Test',
  shortName: 'Gamma',
  badges: [],
  summary: 'Match solid grays to a fine line pattern to estimate your display gamma (1.6–2.8), per channel.',
  seo: {
    title: 'Monitor Gamma Test — Check 2.2 vs 2.4 Gamma Online | Free',
    description:
      'Estimate your monitor’s gamma in a minute: match solid grays to a pixel-exact line pattern (γ 1.6–2.8), check red, green and blue tracking, and learn what 2.2, 2.4, sRGB and BT.1886 mean.',
  },
  testSeo: {
    title: 'Gamma Test — Fullscreen',
    description: 'Pixel-exact gamma matching tiles for gray and red, green, blue channels.',
  },
  load: () => import('../../pages/tests/GammaTest'),
  page: {
    title: 'Monitor Gamma Test',
    intro:
      'Estimate your display’s gamma by eye: each tile pairs a fine pattern of full-on and full-off pixel lines with a solid gray. The gray that disappears into the pattern tells you roughly which gamma your screen is running — for gray and for each color channel.',
    startLabel: 'Start gamma test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'What gamma is',
        blocks: [
          'Pixel values are not light. A signal value of 128 out of 255 doesn’t produce half the light of 255 — the display applies a power curve, **gamma**, so that light ≈ (value / 255)^γ. With γ = 2.2, value 128 produces only about 22% of full white.',
          'The curve exists because our eyes are far more sensitive to differences in dark tones than bright ones, so spending more code values on the shadows hides banding. Content is mastered assuming a particular curve; if your display uses a different one, midtones come out too light or too dark.',
          {
            ul: [
              '**Gamma too low** (e.g. 1.8–2.0): images look flat and washed out, shadows look gray and lifted.',
              '**Gamma too high** (e.g. 2.5–2.6): images look contrasty and dark, shadow detail crushes together.',
            ],
          },
        ],
      },
      {
        id: 'how-it-works',
        heading: 'How this test works',
        blocks: [
          'Each tile has a surround of alternating full-on and full-off pixel lines. Half the lines are lit, so from a distance the surround emits **50% of full light**, regardless of gamma — your eye averages the lines, not the signal values.',
          'The center of each tile is a solid gray at the value that *should* produce 50% light on a display with that gamma: `255 × 0.5^(1/γ)`. For γ 2.2 that’s value 186; for γ 2.4 it’s 191; for γ 1.8 it’s about 174.',
          'Only one of those solids actually emits the same light as the stripes on your screen. When you step back or squint until the lines blur, that tile’s center vanishes into its surround — its label is your approximate gamma at mid-gray.',
          {
            ol: [
              'Set the display to the picture mode you want to check, at native resolution, with OS scaling at 100% (or 200%).',
              'Click **Start gamma test**. Press **L** to hide the labels so you aren’t biased.',
              'Step back 2–3 m (or squint) until the line pattern looks like a flat gray.',
              'Use the arrow keys (or click) to select the tile whose center blends in best, then press **L** to read its gamma.',
              'Repeat with **Dark 25%** and **Light 75%** to see whether gamma holds across the range, and with **R / G / B** to check gray tracking.',
            ],
          },
          { note: 'The pattern only works when one test pixel is one screen pixel. Under 125% or 150% scaling the browser resamples the lines into a blur that no longer averages correctly — the test will warn you.' },
        ],
      },
      {
        id: 'targets',
        heading: '2.2 vs 2.4 vs sRGB vs BT.1886',
        blocks: [
          {
            table: {
              head: ['Target', 'Used for', 'Notes'],
              rows: [
                ['**Gamma 2.2**', 'Windows, macOS, web, games, most SDR content', 'The default target for desktop monitors in a normally lit room.'],
                ['**sRGB curve**', 'The formal sRGB standard', 'A piecewise curve with a short linear segment near black; it averages ~2.2 but is noticeably lighter in the deepest shadows.'],
                ['**Gamma 2.4 / BT.1886**', 'Film and TV mastering, dark-room viewing', 'BT.1886 is a 2.4 power curve adjusted for the display’s real black level. On an OLED with near-zero black it is essentially pure 2.4.'],
                ['**Gamma 1.8**', 'Legacy Mac (before 2009) and some print workflows', 'Rarely the right choice today.'],
              ],
            },
          },
          'In a bright room a slightly lower gamma (≈2.2) keeps shadows visible; in a dark room 2.4 gives a deeper, more film-like image. HDR doesn’t use gamma at all — it uses the PQ (ST 2084) curve, so this test applies to SDR only.',
        ],
      },
      {
        id: 'interpret',
        heading: 'Reading your result',
        blocks: [
          {
            ul: [
              '**Mid-gray match within ±0.1 of your target** (e.g. 2.1–2.3 for a 2.2 target): good — differences this small are hard to see in real content.',
              '**Dark 25% matches lower than Mid 50%**: shadows are lifted (common with “black equalizer”, “shadow boost”, or sRGB-curve modes).',
              '**Dark 25% matches higher**: shadows are crushed — check that your PC and display agree on full vs limited RGB range.',
              '**R, G and B land on different tiles**: the channels track differently, so grays pick up a tint (often pinkish or greenish) at that brightness.',
            ],
          },
          'This is a visual estimate, usually good to about ±0.1–0.2. It assumes your black is truly black; on LCDs with a raised black level the reading skews slightly. A **colorimeter** with calibration software (DisplayCAL, Calman, HCFR) measures the full curve precisely.',
        ],
      },
      {
        id: 'adjust',
        heading: 'Adjusting gamma',
        blocks: [
          {
            ul: [
              '**Monitor OSD**: many monitors have a Gamma setting (often labeled 1.8 / 2.0 / 2.2 / 2.4 / 2.6, or Mode 1–5). The labels aren’t always accurate — use this test to check what each mode really does.',
              '**Picture modes**: “sRGB”, “Standard” or “Rec.709” modes usually target 2.2; “Cinema” or “Movie” often target 2.4. Gaming and “Dynamic” modes frequently distort gamma to lift shadows.',
              '**Brightness / contrast**: on many monitors “Brightness” actually shifts the black point and changes the apparent gamma near black. Set it with the [black level test](/black-level) first.',
              '**GPU and OS**: NVIDIA and AMD control panels and the Windows calibration tool (`dccw`) can apply gamma tweaks, but these work through 8-bit lookup tables and can add banding. Prefer fixing gamma on the display itself.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'From a distance, one tile’s center blends into its line surround — that’s your gamma estimate.',
        'Mid-gray matches near your target (≈2.2 for desktop, ≈2.4 for dark-room video).',
        'Dark, mid and light regions all match within about 0.1–0.2 of each other.',
        'Red, green and blue rows match at the same gamma.',
      ],
      bad: [
        'The match falls well below 2.0 (washed out) or above 2.5 (crushed) in your normal picture mode.',
        'Dark-region match differs a lot from mid-gray — shadows lifted or crushed.',
        'One color channel matches a different tile than the others — grays will be tinted.',
        'Visible moiré or a blurry pattern — check OS scaling is 100% or 200%.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Gamma is stable when viewed straight on. Off-axis it drifts lighter, so keep your head centered on the tiles.' },
      { panel: 'VA', note: 'Gamma shifts strongly with viewing angle — the center of the screen can read 2.2 while the edges look lighter. Judge tiles near the center from straight ahead.' },
      { panel: 'TN', note: 'Gamma changes dramatically with vertical angle; moving your head up or down will change which tile matches. Results are only meaningful from dead center.' },
      { panel: 'OLED / QD-OLED', note: 'Black is truly black, so the match is reliable, but ABL can dim large bright areas. Gamma near black can be inconsistent on some panels — compare the Dark 25% result.' },
      { panel: 'Mini-LED', note: 'Local dimming changes the backlight under the tiles and can skew the match. Turn local dimming off (or to Low) for this test.' },
    ],
    whenToReturn: [
      'No picture mode or gamma setting gets the mid-gray match anywhere near 2.2 — the display can’t show standard content correctly.',
      'One channel tracks far off the others in every mode, giving a strong tint to grays that settings can’t remove.',
      'Gamma is otherwise fine but you see it shift heavily across the screen — that’s viewing angle or uniformity, see the [uniformity test](/uniformity).',
    ],
    tips: [
      'Set OS display scaling to 100% (or 200%) so the line pattern is pixel-exact.',
      'Turn off dynamic contrast, eco/auto-brightness and black-enhancement features.',
      'Hide labels with L while matching, then reveal your pick.',
      'Squint or step back — the lines must blur together before you compare.',
    ],
    related: ['black-level', 'white-saturation', 'color-gradient', 'contrast'],
    affiliates: 'gamma',
    disclaimer:
      'A visual estimate, not a measurement. Display gamma, black level and channel tracking can only be measured accurately with a colorimeter and calibration software.',
    faqs: [
      {
        question: 'What gamma should my monitor be set to?',
        answer:
          'For Windows, macOS, the web and games, 2.2 is the standard target. For watching films in a dark room, 2.4 (BT.1886) is closer to how content is mastered. 1.8 is a legacy Mac setting that is rarely appropriate today.',
      },
      {
        question: 'How accurate is an online gamma test?',
        answer:
          'Pattern matching is a well-established visual method and is usually good to about ±0.1–0.2 when the browser renders pixel-exact and you view from a distance. It assumes a true-black panel and can be thrown off by fractional OS scaling, local dimming, or viewing angle. A colorimeter is needed for a precise curve.',
      },
      {
        question: 'Is sRGB the same as gamma 2.2?',
        answer:
          'Not exactly. The sRGB curve has a short linear section near black and averages about 2.2, but in the darkest shadows it is lighter than a pure 2.2 power curve. Many displays labeled “sRGB mode” actually use a pure 2.2 curve.',
      },
      {
        question: 'What happens if gamma is too high or too low?',
        answer:
          'Too high (e.g. 2.6) makes images dark and contrasty with crushed shadows. Too low (e.g. 1.8) makes images look washed out with gray-looking blacks. Correct gamma keeps midtones and shadow detail as the content creator intended.',
      },
      {
        question: 'Why do the red, green and blue channels give different results?',
        answer:
          'Each subpixel color has its own response curve. If they don’t track the same gamma, neutral grays become tinted at some brightness levels. Small differences are common on uncalibrated screens; large ones need a calibrated profile or an RGB gain/offset adjustment.',
      },
      {
        question: 'Can I adjust gamma on my monitor?',
        answer:
          'Usually yes — look for a Gamma option in the OSD, or a picture mode such as sRGB, Standard or Cinema. GPU control panels and Windows Display Color Calibration can also adjust it, though software adjustments can add banding on 8-bit outputs.',
      },
    ],
  },
};
