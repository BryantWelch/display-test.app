export default {
  slug: 'color-gradient',
  order: 310,
  category: 'color',
  name: 'Color Banding & Gradient Test',
  shortName: 'Banding',
  badges: [],
  summary: 'Pixel-exact gradients to spot banding, posterization, dithering, and color tints.',
  seo: {
    title: 'Color Banding Test — Pixel-Exact Gradient Test for Monitors | Free',
    description:
      'Check your monitor for color banding with pixel-exact 0–255 gradients: gray, RGB, CMY and custom ramps, dark and light ranges stretched full-screen, stepped mode and level labels. Learn 8-bit vs 6-bit+FRC vs 10-bit.',
  },
  testSeo: {
    title: 'Color Banding & Gradient Test — Fullscreen',
    description: 'Pixel-exact gradient ramps for checking banding and dithering.',
  },
  load: () => import('../../pages/tests/ColorGradientTest'),
  checkup: { step: 60, question: 'Are gradients smooth, without obvious bands or color tints?' },
  page: {
    title: 'Color Banding & Gradient Test',
    intro:
      'Show pixel-exact gradient ramps where every one of the 256 levels gets its own clean band. A good display renders them as smooth ramps; harsh stripes, jumps, or tinted bands point to bit-depth limits, poor processing, or a settings problem.',
    startLabel: 'Start banding test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'Banding, dithering and bit depth',
        blocks: [
          'Standard 8-bit video has 256 levels per channel. Drawn across a 1920-pixel screen, each level is a band about 7.5 pixels wide — normally too subtle to see as distinct steps. **Banding** is when neighboring bands become obvious stripes because levels have been lost or merged somewhere along the way.',
          {
            ul: [
              '**True 8-bit panel**: shows all 256 levels directly. Steps are very faint; a gray ramp looks smooth from a normal distance.',
              '**6-bit + FRC**: the panel can only show 64 levels and fakes the in-between ones by rapidly flickering neighboring levels (frame rate control, a form of temporal dithering). Usually looks smooth, but you may see shimmer or fine crawling noise in dark ramps up close.',
              '**8-bit + FRC / true 10-bit**: 1,024 levels per channel. This only matters for 10-bit content (HDR video, some pro apps); a web page is 8-bit, so this test can’t reveal the extra precision.',
              '**Spatial dithering**: GPUs and some displays add a fixed noise pattern to hide steps. It looks like fine grain instead of bands — that’s working as intended.',
            ],
          },
        ],
      },
      {
        id: 'how-it-works',
        heading: 'How this test works',
        blocks: [
          'CSS gradients are interpolated and sometimes dithered by the browser, so they can hide (or invent) banding. This test draws each level as an exact integer-wide band of a single code value on a device-pixel canvas, so what you see is what your display does with those 256 values.',
          {
            ol: [
              'Use your normal picture mode at native resolution, with OS scaling at 100% (or 200%) if possible.',
              'Click **Start banding test**. Begin with the **Gray** full-range ramp and view it from your normal distance.',
              'Switch to **Dark 0–64** — dark tones are where banding is most visible. The range is stretched across the screen so each level is wide enough to see.',
              'Try **Red, Green, Blue** and **Gray + RGB** to look for tints or uneven steps in one channel.',
              'Turn on **Steps** (e.g. 32) to see what deliberate banding looks like, then compare with **Every level**.',
              'Enable **level labels** (L) to note exactly where a jump or crush happens.',
            ],
          },
        ],
      },
      {
        id: 'interpret',
        heading: 'Interpreting what you see',
        blocks: [
          {
            ul: [
              '**Faint, evenly spaced steps up close that vanish at normal distance**: normal for 8-bit.',
              '**Evenly spaced but clearly visible bands in the full ramp**: the signal is being reduced somewhere — often 6-bit output, limited-range RGB mismatch, a low-bit-depth color profile, or GPU color adjustments.',
              '**Several dark levels merging into one black band**: black crush. Check brightness, gamma, and full vs limited RGB with the [black level test](/black-level).',
              '**Several bright levels merging into white**: white clipping — see the [white saturation test](/white-saturation).',
              '**Bands with a color tint (pink, green, purple) in a gray ramp**: the channels don’t track evenly — a calibration, gamma or panel issue. Compare with the [gamma test](/gamma) in R/G/B mode.',
              '**Shimmering or crawling noise in dark areas**: temporal dithering (FRC). Normal on many panels, and usually invisible at viewing distance.',
            ],
          },
        ],
      },
      {
        id: 'fix',
        heading: 'Reducing banding',
        blocks: [
          {
            ul: [
              'Remove software color adjustments first: ICC profiles applied through the GPU lookup table, Night Light, NVIDIA/AMD digital vibrance and brightness/contrast sliders can all drop levels on 8-bit outputs.',
              'Make sure the PC and display agree on **RGB full** range (or both on limited). A mismatch crushes or lifts the ends and can add steps.',
              'Set output to **10-bit** (or 8-bit with dithering) in the GPU panel when your display supports it — the GPU can then dither its own adjustments.',
              'Avoid extreme picture settings: maxed contrast, sharpness, or “dynamic” modes stretch the levels you have.',
              'Banding in videos and streams is often in the content itself (compression). If this test is smooth, your display isn’t the cause.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'The gray ramp looks smooth at normal viewing distance; individual steps are only faintly visible up close.',
        'Dark 0–64 and Light 192–255 show many small, evenly spaced steps with every level distinct.',
        'Gray stays neutral across the ramp — no pink, green, or purple bands.',
        'Fine grain or faint shimmer in dark areas (dithering) is normal.',
      ],
      bad: [
        'Obvious, wide stripes in the full 0–255 gray ramp.',
        'Several dark or bright levels merging into one flat band (crushed blacks or clipped whites).',
        'Steps of uneven width or brightness, or color-tinted bands in a gray ramp.',
        'A gradient that looks fine in one channel but steppy in another.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Usually 8-bit or 8-bit+FRC with smooth ramps. Some budget and older IPS monitors are 6-bit+FRC — look for shimmer in dark ramps.' },
      { panel: 'VA', note: 'Ramps are generally smooth, but dark-level gamma shifts with viewing angle and can make near-black steps look uneven at the screen edges. Judge from straight ahead.' },
      { panel: 'TN', note: 'Many TN panels are 6-bit+FRC. Expect more visible dithering noise, and vertical gradients that change with head position.' },
      { panel: 'OLED / QD-OLED', note: 'Near-black is the weak spot: the first few levels above black can look blotchy, steppy or tinted. Check Dark 0–64 carefully.' },
      { panel: 'Mini-LED', note: 'Local dimming zones can add soft brightness steps that don’t line up with the level bands. Toggle local dimming to tell them apart.' },
    ],
    whenToReturn: [
      'Obvious banding in the full gray ramp persists after removing GPU/OS color adjustments and checking RGB range — the panel or its processing is likely truncating levels.',
      'Strong color tints in gray ramps that no picture mode fixes.',
      'Dark levels that never separate from black in any mode (severe black crush), especially on an OLED inside its return window.',
    ],
    tips: [
      'Turn off Night Light, f.lux, and GPU color tweaks before testing.',
      'Set OS scaling to 100% (or 200%) so bands stay pixel-exact.',
      'View from your normal seating distance first, then lean in.',
      'Test both horizontal and vertical — some artifacts only show in one direction.',
    ],
    related: ['gamma', 'black-level', 'white-saturation', 'uniformity'],
    affiliates: 'colorGradient',
    disclaimer:
      'A visual check of how your display and graphics pipeline render 8-bit gradients. It cannot measure panel bit depth or verify 10-bit output; use manufacturer specs and a colorimeter for that.',
    faqs: [
      {
        question: 'What is color banding?',
        answer:
          'Color banding is when a smooth gradient shows visible steps or stripes instead of a seamless transition. It’s most noticeable in skies, shadows, and dark scenes where neighboring colors are very similar.',
      },
      {
        question: 'What causes color banding on monitors?',
        answer:
          'Common causes are reduced bit depth (6-bit panels, 6-bit output), software color adjustments applied in 8 bits, a full/limited RGB range mismatch, aggressive picture processing, and compressed content. Many of these are settings problems rather than panel defects.',
      },
      {
        question: 'Can this test tell if my monitor is 10-bit?',
        answer:
          'No. A web page renders in 8 bits per channel, so it can’t show the extra levels of a 10-bit panel. It can show whether your display handles 8-bit content cleanly. Check the manufacturer’s spec sheet and your GPU’s output settings for 10-bit support.',
      },
      {
        question: 'What is 6-bit + FRC?',
        answer:
          'A panel that can natively show 64 levels per channel and uses frame rate control (rapid flicker between neighboring levels) to approximate 256. It usually looks smooth, but can show fine shimmering noise in dark gradients up close.',
      },
      {
        question: 'Can color banding be fixed?',
        answer:
          'Often, yes: remove GPU and OS color adjustments, match the RGB range between PC and display, enable 10-bit or dithered output if available, and avoid extreme picture settings. Banding caused by the panel’s own processing or bit depth can’t be fixed in software.',
      },
      {
        question: 'Is banding worse on certain panel types?',
        answer:
          'Bit depth and processing matter more than panel type. That said, OLEDs are prone to uneven near-black steps, and many TN and budget panels use 6-bit+FRC.',
      },
    ],
  },
};
