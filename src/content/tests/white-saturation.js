export default {
  slug: 'white-saturation',
  order: 325,
  category: 'color',
  name: 'White Saturation Test',
  shortName: 'White Clipping',
  badges: [],
  summary: 'Near-white patches 235–254 on pure white to catch clipped highlights from contrast or range settings.',
  seo: {
    title: 'White Saturation Test — Check Highlight Clipping & Contrast | Free',
    description:
      'Free full-screen white clipping test. See if near-white highlight detail is lost to high contrast, an HDMI RGB range mismatch, or a vivid / dynamic mode.',
  },
  testSeo: {
    title: 'White Saturation Test — Fullscreen',
    description: 'Near-white patches 215–254 on pure white, reference bars, and a step ramp.',
  },
  load: () => import('../../pages/tests/WhiteSaturationTest'),
  checkup: { step: 55, question: 'Can you distinguish the top few white levels from pure white?' },
  page: {
    title: 'White Saturation & Clipping Test',
    intro:
      'The bright-end twin of the black level test. If the brightest shades all merge into one flat white, clouds, snow, skin highlights, and bright UI lose their detail.',
    startLabel: 'Start white saturation test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-it-shows',
        heading: 'What this test shows',
        blocks: [
          'The screen is filled with pure white (255) and patches are placed at 235, 236 … 254 (or 215–254 with the wider range). Below them are near-white reference bars and a one-step ramp up to 255.',
          {
            ul: [
              '**Good** — you can tell most patches apart from the background, with only the last two or three (252–254) hard to see.',
              '**Clipping** — the top 5–10 or more patches vanish into the background, so the display shows them all as the same white.',
              '**Tinted** — patches look pink, green, or blue compared with the white around them: one color channel is clipping before the others.',
            ],
          },
        ],
      },
      {
        id: 'causes',
        heading: 'Why whites clip',
        blocks: [
          {
            ul: [
              '**Contrast set too high.** On most monitors and TVs, “Contrast” sets the white point. Pushing it past the panel’s limit throws away the top steps. Lower it until 250–253 reappear.',
              '**Brightness / backlight** usually doesn’t clip on its own, but some cheaper monitors map “Brightness” to a signal offset — try lowering it too.',
              '**Limited-range mismatch.** A full-range PC signal into a display set to limited (16–235) clips everything above 235 to white. You’ll see crushed blacks at the same time — check the [black level test](/black-level).',
              '**Vivid / Dynamic / Store modes.** These stretch contrast and boost highlights for showroom impact. Switch to Standard, Movie, Filmmaker, Cinema, or sRGB modes.',
              '**Sharpness and “detail enhancers”** can add halos and make the top steps look uneven.',
            ],
          },
          'The **background 235** option simulates video white. Values above it (245, 254) are “whiter than white”: a TV set to limited range may show them identical to 235, which is acceptable for video.',
        ],
      },
      {
        id: 'fix',
        heading: 'How to fix it',
        blocks: [
          {
            ol: [
              'Reset the picture mode to a neutral preset (Standard, sRGB, Movie, or Filmmaker).',
              'Make sure the GPU / console and the display agree on RGB range — see [how to fix range mismatches](/black-level).',
              'Lower **Contrast** a few steps at a time until patches 250–253 become visible, then stop.',
              'Turn off dynamic contrast, “HDR effect” on SDR content, and auto-brightness / eco sensors.',
              'Recheck the [black level](/black-level) and [gamma](/gamma) — changing contrast affects the whole curve.',
            ],
          },
        ],
      },
      {
        id: 'limits',
        heading: 'What a browser can and can’t tell you',
        blocks: [
          'This test checks whether the display distinguishes near-white codes, not how bright white is. A browser can’t read luminance, and on Windows with HDR or Advanced Color enabled, SDR white is remapped before it reaches the panel. Test in SDR mode for clean results. Laptop and phone panels with automatic brightness or content-adaptive contrast can change the result from second to second — turn those off. A calibration (ICC) profile, or a GPU set to output limited range, can also merge neighboring near-white steps before they reach the display.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Most patches from 235 up are distinguishable from the white background.',
        'Only the top two or three (252–254) are hard to separate.',
        'All patches look neutral gray-white, with no color tint.',
      ],
      bad: [
        'The top 5–10+ patches disappear: highlights are clipping.',
        'Patches look pink, green, or blue: one channel clips first (often from color temperature or contrast settings).',
        'Patches clip and the black level test also crushes: RGB range mismatch.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'Full-screen white triggers automatic brightness limiting (ABL), so the whole screen may dim. That’s normal and doesn’t cause clipping by itself.' },
      { panel: 'IPS / VA / TN', note: 'Usually shows all steps at default contrast. Clipping almost always comes from contrast set too high or a vivid mode.' },
      { panel: 'TVs', note: 'Dynamic and Vivid modes commonly clip. Movie / Filmmaker modes are tuned to preserve highlight detail.' },
    ],
    whenToReturn: [
      'Highlights still clip in a neutral mode with contrast at default and matching RGB range.',
      'A strong color tint across the near-white patches that no white balance setting fixes.',
    ],
    tips: [
      'Full-screen white is bright — lower brightness first if it’s uncomfortable.',
      'Use an SDR desktop; HDR mode remaps SDR whites.',
      'Turn off auto-brightness and eco / ambient light sensors.',
      'Run the black level test right after — the two settings interact.',
    ],
    related: ['black-level', 'brightness', 'gamma', 'contrast'],
    affiliates: 'brightness',
    disclaimer:
      'A visual check for highlight clipping. It doesn’t measure luminance or color accuracy; use a colorimeter for calibrated results.',
    faqs: [
      {
        question: 'What is white clipping?',
        answer:
          'White clipping (or white crush) is when the brightest shades all display as the same white, so detail in bright areas — clouds, snow, light skin, overexposed sky — is lost.',
      },
      {
        question: 'How many patches should I be able to see?',
        answer:
          'On a well-adjusted display, nearly all of them. Not seeing 253–254 is common and fine. If everything from about 245 up blends into the background, contrast is too high or the range is mismatched.',
      },
      {
        question: 'Does contrast or brightness control white?',
        answer:
          'On most displays Contrast sets white level and can clip highlights, while Brightness (or Backlight) sets overall light output. On some cheaper monitors the names are swapped or both affect the signal — use this test and the black level test to see what each control actually does.',
      },
      {
        question: 'Why does the whole white screen dim on my OLED?',
        answer:
          'OLEDs limit power on large bright areas (ABL). A full white field is the worst case, so brightness drops. It doesn’t make patches clip; judge the steps relative to each other.',
      },
      {
        question: 'Why do patches look tinted?',
        answer:
          'If one color channel reaches its maximum before the others, the top steps differ from white only in the other channels, so they take on that channel’s tint (pinkish if red clips first). Lowering contrast or choosing a different color temperature preset usually fixes it.',
      },
    ],
  },
};
