export default {
  slug: 'test-patterns',
  order: 510,
  category: 'clarity',
  name: 'Monitor Test Patterns',
  shortName: 'Test Patterns',
  badges: [],
  summary: '24 pixel-exact patterns for sharpness, overscan, geometry, gamma, and scaling — drawn live at your native resolution.',
  seo: {
    title: 'Monitor Test Patterns — Sharpness, Overscan, Geometry & Gamma | Free',
    description:
      'Free full-screen monitor test patterns drawn at your exact device resolution: sharpness/overshoot, overscan & aspect, resolution wedges, 1px lines, checkerboards, gamma, clipping, and color bars.',
  },
  testSeo: {
    title: 'Test Patterns — Fullscreen',
    description: 'Pixel-exact test patterns for sharpness, overscan, geometry, gamma, and color.',
  },
  load: () => import('../../pages/tests/TestPatternsTest'),
  checkup: { step: 70, question: 'Do 1-pixel lines look crisp and even, with no halos or shimmer?' },
  page: {
    title: 'Monitor Test Patterns',
    intro:
      'Classic calibration patterns — sharpness, overscan, resolution wedges, 1px lines, checkerboards, gamma and clipping charts, color bars — generated in your browser at your display’s exact device resolution, so one pattern pixel is one panel pixel.',
    startLabel: 'Start test patterns',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'why-pixel-exact',
        heading: 'Why pixel-exact matters',
        blocks: [
          'Most test patterns depend on 1-pixel detail: a line one pixel wide, a checkerboard that alternates every pixel. If that image gets resized on the way to the panel — by the browser, by Windows or macOS display scaling, or by the monitor itself — the 1px detail is resampled into blur and moiré, and the pattern starts testing the scaler instead of the screen.',
          'These patterns aren’t images. Each one is drawn live on a canvas sized to your screen’s **device pixels**, using whole-pixel coordinates, so they fit any resolution exactly — 1080p, 1440p, 4K, ultrawide, laptop, or phone. The panel shows the canvas size and device pixel ratio, and warns you if fractional OS scaling (125%, 150%) prevents an exact mapping.',
          {
            note: 'For exact results: set the display to its **native resolution**, use **100% or 200%** OS scaling if you can, and enter fullscreen so the canvas covers the whole panel.',
          },
        ],
      },
      {
        id: 'how-to',
        heading: 'How to use the patterns',
        blocks: [
          {
            ol: [
              'Set your display to its native resolution and turn off any “demo”, “dynamic”, or store picture mode.',
              'Click **Start test patterns** and go fullscreen. Check the readout: the canvas size should match your screen, and **Pixel-exact** should say Yes.',
              'Pick a category (**Check**, **Color**, **Geometry**) and a pattern. Use **← / →** to step through patterns and **↑ / ↓** to switch variants (for example, checker size). **I** inverts black/white patterns.',
              'Read the one-line “What to look for” note under each pattern, then look at the screen from your normal distance and up close.',
              'Change one monitor setting at a time (sharpness, scaling/aspect, picture mode) and recheck the same pattern.',
            ],
          },
        ],
      },
      {
        id: 'check-patterns',
        heading: 'Check patterns: sharpness, overscan, and resolution',
        blocks: [
          {
            ul: [
              '**Overscan & aspect** — a white border on the outermost pixel, colored frames at 1–5% inset, a true circle inside a true square, and a center crosshair. If the white border is missing on any side, the display is cropping (overscan). If the circle looks oval, the picture is stretched.',
              '**Sharpness / overshoot** — 1px and 2px line pairs, a 1px checker, black and white blocks, and isolated 1px lines on mid-gray. Sharpening shows up as a thin bright or dark halo hugging each edge; too little sharpness (or scaling) turns line pairs into soft gray.',
              '**Edge lines** — eight 1px frames, 2px apart, at the screen edge. Count them on every side.',
              '**Resolution wedge** and **star** — lines that converge until they can no longer be separated. Lines should stay distinct down to a pitch of 2 (1px on, 1px off). Moiré or colored fringes earlier than that point to scaling, sharpening, or chroma subsampling.',
              '**1px pattern tiles** — 24 tiles of 1px lines, grids, dots, and checkers. Each should look like a flat, even texture.',
            ],
          },
        ],
      },
      {
        id: 'levels-patterns',
        heading: 'Check patterns: levels, gamma, and contrast',
        blocks: [
          {
            ul: [
              '**Clipping targets** — concentric rings a few levels apart near black and near white. Every ring should be visible; rings that merge mean crushed shadows or clipped highlights. Use the [black level](/black-level) and [white saturation](/white-saturation) tests to tune brightness and contrast.',
              '**Gamma chart** — solid patches set inside 1px stripes. From a distance, the patch that blends into its stripes marks your approximate mid-tone gamma for each channel. See the [gamma test](/gamma) for a dedicated version.',
              '**Low-contrast detail** — 1px checkers or lines of two nearly identical grays. It shows how much shadow and highlight detail survives your settings.',
              '**Color wipe** and **composite chart** — smooth ramps and an all-in-one overview: hues, tiles, a gamma row, and gray steps.',
            ],
          },
        ],
      },
      {
        id: 'color-patterns',
        heading: 'Color patterns',
        blocks: [
          {
            ul: [
              '**Color bars** (3, 6, 12, or continuous; horizontal or vertical) — saturated hues with crisp boundaries. Continuous bars should show no bands.',
              '**4,096 color patches** — 16 levels each of red, green, and blue. Neighboring cells should all be distinct.',
              '**Random color / gray noise** (1–16px blocks) — seeded so it looks the same every time. Fine noise reveals sharpening, smearing, and the grainy texture of matte coatings.',
              '**RGB triangle** — a linear blend of red, green, and blue (solid or wireframe) for spotting banding and uneven processing.',
            ],
          },
          'For banding specifically, the [color gradient test](/color-gradient) is more sensitive. For chroma subsampling over HDMI, use the [chroma subsampling test](/chroma-subsampling).',
        ],
      },
      {
        id: 'geometry-patterns',
        heading: 'Geometry patterns',
        blocks: [
          {
            ul: [
              '**Stripe bands** — bands of 1, 2, 3, 4, 6, and 8px stripes. Every stripe in a band should be identical.',
              '**Checkerboard** (1–32px, or log scale) — perfectly even squares. A 1px checker should look like flat gray from a distance.',
              '**Circles & squares** — a grid of 1px circles or squares, or one large circle. They must stay round and square across the whole screen.',
              '**Horizontal / vertical lines** (2–8px pitch, or log) and **points** — single-pixel detail at a fixed pitch. Alternating bright and dim lines are a sure sign of scaling.',
              '**Squares** — equal squares and gaps for checking straightness and even spacing.',
            ],
          },
          'Flat panels can’t bend lines the way CRTs did, so “geometry” problems on LCD and OLED screens are almost always about **scaling** and **aspect ratio** — a non-native resolution, a TV’s zoom mode, or a stretched console output — rather than panel distortion. Projectors are the exception: keystone and lens geometry show up clearly here.',
        ],
      },
      {
        id: 'limits',
        heading: 'What a browser can and can’t show',
        blocks: [
          'A browser can draw exact pixel values at your device resolution, but it can’t see what happens after the image leaves the GPU. These patterns let **you** judge scaling, sharpening, overscan, and processing by eye; they don’t measure anything.',
          {
            ul: [
              'Exact mapping needs whole-number OS scaling. At 125% or 150%, 1px patterns may show moiré because the browser itself must resample.',
              'Browsers may color-manage the canvas to your display profile, and the GPU or display may apply its own processing, so level-sensitive charts (clipping, gamma) are approximate.',
              'Measured gamma, color accuracy, and luminance need a colorimeter. Use these patterns for setup and spotting problems, and calibration hardware for numbers.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        '1px lines and checkers look crisp and even, with every line the same brightness.',
        'The outermost white border is visible on all four sides; the circle is round and the square is square.',
        'Black and white edges on gray meet cleanly, with no outline.',
        'Ramps and bars blend smoothly; every ring in the clipping targets is visible.',
      ],
      bad: [
        'Bright or dark halos along edges — sharpening or overshoot (try lowering **Sharpness**).',
        'Moiré, shimmer, or alternating bright/dim lines — the image is being scaled (check native resolution and OS scaling).',
        'Missing edge lines or a cropped border — overscan (look for **Just Scan**, **Screen Fit**, or **1:1 pixel** mode).',
        'Ovals instead of circles — the picture is stretched (wrong aspect or zoom mode).',
        'Colored fringes on fine colored detail — possible chroma subsampling; confirm with the [chroma test](/chroma-subsampling).',
      ],
    },
    panelNotes: [
      {
        panel: 'IPS / VA / TN (LCD)',
        note: 'Monitors are usually 1:1 by default. Default sharpness varies by brand (often a mid value is neutral), so use the sharpness pattern to find the setting with no halos. A 1px checker can shimmer slightly from inversion — that’s normal on many LCDs.',
      },
      {
        panel: 'OLED / QD-OLED',
        note: 'Non-RGB subpixel layouts (WOLED RWBG, QD-OLED triangles) add color fringes to 1px white lines and text. That’s the panel structure, not a fault. Keep static patterns on screen only briefly.',
      },
      {
        panel: 'TV used as a monitor',
        note: 'TVs often overscan and sharpen by default. Set the input to PC / Game mode, enable **Just Scan** / **Screen Fit** / **Original**, and set sharpness to its neutral value (often 0 or 10). See [using a TV as a monitor](/guides/tv-as-monitor).',
      },
      {
        panel: 'Laptops & phones',
        note: 'High-DPI screens usually run at 150–300% scaling. 200% and 300% map exactly; fractional values may show moiré on 1px patterns even when the panel is perfect.',
      },
    ],
    whenToReturn: [
      'Patterns only look wrong at one setting: it’s a configuration issue, not a defect. Fix the scaling, sharpness, or aspect setting.',
      'Lines stay blurry or uneven at native resolution with 1:1 mapping and neutral sharpness: the panel or its scaler may be faulty — worth a return inside the window.',
      'A row or column of pixels never lights in the points or lines patterns: check it with the [dead pixel test](/dead-pixel).',
    ],
    tips: [
      'Use native resolution and 100% or 200% OS scaling for exact 1:1 pixels.',
      'Go fullscreen so the canvas matches your screen size — the panel readout tells you.',
      'Turn off dynamic contrast, “super resolution”, and edge enhancement before judging sharpness.',
      'View from your normal distance first, then up close or with a phone camera at 2–3× zoom.',
    ],
    related: ['text-clarity', 'screen-resolution', 'chroma-subsampling', 'gamma', 'black-level', 'color-gradient'],
    affiliates: 'testPatterns',
    disclaimer:
      'These patterns are for checking and adjusting a display by eye. They do not measure luminance, gamma, or color accuracy — use a colorimeter and calibration software for that.',
    faqs: [
      {
        question: 'What are monitor test patterns?',
        answer:
          'Test patterns are synthetic images built to show one display behavior at a time: fine lines for sharpness and scaling, edge markers for overscan, circles for aspect ratio, ramps for banding, and near-black and near-white steps for clipping. They make problems obvious that normal content hides.',
      },
      {
        question: 'Why do these patterns look different from downloaded PNG test images?',
        answer:
          'A PNG is made for one resolution, and browsers and operating systems often resize it, which smears 1px detail. These patterns are drawn live at your screen’s exact device resolution, so they stay pixel-exact on any display — as long as OS scaling is a whole number.',
      },
      {
        question: 'How do I check for overscan?',
        answer:
          'Open **Overscan & aspect**. The thin white line is the very outermost pixel. If you can’t see it on all four sides, the display is cropping the image. On TVs, look for **Just Scan**, **Screen Fit**, **Original**, or **1:1** in the picture size or aspect settings. The colored frames show roughly how much is cut off (1–5%).',
      },
      {
        question: 'How do I set my monitor’s sharpness correctly?',
        answer:
          'Use the **Sharpness / overshoot** pattern. Raise sharpness until bright or dark halos appear along the black and white block edges, then lower it until they just disappear and the 1px line pairs still look crisp. That point is often the monitor’s neutral default, which is not always 0.',
      },
      {
        question: 'Why do 1px lines shimmer or show moiré on my screen?',
        answer:
          'Usually because the image is being scaled. The display may not be at native resolution, OS scaling may be fractional (125% or 150%), or a TV may be zooming the picture. The readout in the test shows the canvas size, device pixel ratio, and whether the mapping is pixel-exact.',
      },
      {
        question: 'Can these patterns calibrate my display?',
        answer:
          'They help you set it up: sharpness, overscan, aspect, and rough brightness and contrast. They can’t measure gamma, white point, or color accuracy, because a browser can’t see the light the panel emits. For true calibration, use a colorimeter with calibration software.',
      },
    ],
  },
};
