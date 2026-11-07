export default {
  slug: 'chroma-subsampling',
  order: 520,
  category: 'clarity',
  name: 'Chroma Subsampling Test (4:4:4)',
  shortName: 'Chroma 4:4:4',
  badges: ['New'],
  summary: 'Check whether your TV or monitor shows full 4:4:4 color or blurs colored text with 4:2:2 / 4:2:0.',
  seo: {
    title: 'Chroma Subsampling Test — Check 4:4:4 vs 4:2:2 vs 4:2:0 | TV as Monitor',
    description:
      'Free 4:4:4 chroma test chart. See if colored text blurs on your TV or monitor, tell 4:2:2 from 4:2:0, and fix it with PC mode, HDMI settings, and GPU output format.',
  },
  testSeo: {
    title: 'Chroma Subsampling Test — Fullscreen',
    description: 'Pixel-exact colored text and 1-px line pairs to detect 4:2:2 and 4:2:0 chroma subsampling.',
  },
  load: () => import('../../pages/tests/ChromaTest'),
  page: {
    title: 'Chroma Subsampling Test (4:4:4)',
    intro:
      'Colored text looks smeared on your TV-as-monitor even though everything else is sharp? That’s chroma subsampling. This pixel-exact chart shows whether your display is receiving full **4:4:4** color, or **4:2:2** / **4:2:0**, and the fixes below cover every major GPU and TV brand.',
    startLabel: 'Start chroma test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'What 4:4:4, 4:2:2, and 4:2:0 mean',
        blocks: [
          'Video signals split each pixel into brightness (**luma**) and color (**chroma**). Our eyes are less sensitive to fine color detail, so video formats save bandwidth by sending color at lower resolution:',
          {
            table: {
              head: ['Format', 'Color resolution', 'What you see'],
              rows: [
                ['**4:4:4** (or RGB)', 'Full — every pixel has its own color', 'Sharp colored text. What you want on a PC.'],
                ['**4:2:2**', 'Half horizontally', 'Colored text and vertical colored lines smear sideways.'],
                ['**4:2:0**', 'Half horizontally and vertically', 'Colored text blurs in every direction; colored 1-px lines merge.'],
              ],
            },
          },
          'Movies, streaming, and game consoles use 4:2:0 and look fine because real-world images rarely have 1-pixel color edges. Desktop text, UI, and spreadsheets do — so on a PC, subsampling makes red, blue, and purple text look fuzzy and fringed.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to read the chart',
        blocks: [
          {
            ol: [
              'Set the display to its native resolution and **100% or 200% scaling** so the chart maps 1:1 to panel pixels. Turn off TV sharpness and noise reduction.',
              'Click **Start chroma test** and sit close to the screen.',
              'Compare the colored rows with the **white on black** and **black on white** rows at the top. In 4:4:4 every row is equally crisp.',
              'Look at the line pairs. If the **vertical** colored lines melt into a flat color but the **horizontal** ones stay striped, the signal is **4:2:2**. If both melt, it’s **4:2:0**.',
              'If the white/black lines also blur, the issue is scaling, overscan, or sharpness processing rather than chroma — check the [test patterns](/test-patterns) page.',
            ],
          },
          {
            note: 'Red on blue, blue on red, and magenta on green are the most sensitive rows. Dark blue text on black is naturally hard to read on any display — compare it with the same row after a settings change rather than judging it alone.',
          },
        ],
      },
      {
        id: 'when',
        heading: 'When subsampling happens',
        blocks: [
          {
            ul: [
              '**TVs used as monitors.** Most TVs only process 4:4:4 in a dedicated PC or Game mode; in other picture modes they convert internally to 4:2:2 even if the PC sends 4:4:4. See [using a TV as a monitor](/guides/tv-as-monitor).',
              '**HDMI bandwidth limits.** HDMI 2.0 (18 Gbps) can carry 4K60 at 8-bit 4:4:4 but not 4K60 10-bit HDR — the GPU drops to 4:2:2 or 4:2:0. 4K120 needs HDMI 2.1 (FRL) for 4:4:4; over HDMI 2.0 it falls back to 4:2:0.',
              '**HDR.** Turning on HDR increases bit depth, which often pushes the link over its limit and triggers subsampling.',
              '**Driver defaults.** GPUs sometimes pick YCbCr 4:2:2 or 4:2:0 automatically over HDMI, especially with TVs whose EDID advertises it.',
              '**Adapters, docks, and long cables.** A DisplayPort-to-HDMI adapter or USB-C dock limited to HDMI 2.0 can force subsampling at high refresh rates.',
              '**Game consoles.** Xbox and PlayStation output 4:2:0/4:2:2 for video and many games by default; that’s normal and not a problem for games.',
            ],
          },
        ],
      },
      {
        id: 'fix',
        heading: 'How to get 4:4:4',
        blocks: [
          { h3: 'On the PC (GPU output)' },
          {
            ul: [
              '**NVIDIA:** NVIDIA Control Panel (or NVIDIA app) → Display → *Change resolution* → **Use NVIDIA color settings** → Output color format **RGB** (or YCbCr444), Output dynamic range **Full**.',
              '**AMD:** AMD Software → Settings → Display → **Pixel Format** → **RGB 4:4:4 Full RGB** (or YCbCr 4:4:4).',
              '**Intel:** Intel Graphics Command Center / Intel Arc Control → Display → Color → set **RGB** or **YCbCr 4:4:4** output.',
              '**macOS:** Macs choose the format automatically. Use a DisplayPort/USB-C or HDMI 2.1-capable connection, and if the TV still shows 4:2:2, try lowering refresh rate or turning off HDR.',
              'If 4:4:4 isn’t offered, lower refresh rate (for example 4K120 → 4K60), turn off HDR, or drop to 8-bit color — and use a certified **Ultra High Speed HDMI** cable on an HDMI 2.1 port.',
            ],
          },
          { h3: 'On the TV' },
          {
            ul: [
              '**LG:** Enable **HDMI Ultra HD Deep Colour** for the input, then set the input icon / label to **PC** (Home Dashboard → Inputs → Edit). PC mode is what enables 4:4:4.',
              '**Samsung:** Turn on **Input Signal Plus** for the port, then set the source name or icon to **PC** (or enable **PC mode** / **Game Mode** on newer models).',
              '**Sony:** Set **HDMI signal format** to **Enhanced** for the port, and use **Game** or **Graphics** picture mode.',
              '**TCL / Hisense:** Set **HDMI 2.1 / HDMI mode** to **Enhanced** or **2.1** and choose **Game** or **PC** picture mode.',
              '**Vizio / Roku TVs:** Enable **Full UHD Color** (Vizio) or **HDMI mode: Auto/2.1** (Roku TV) and use the Game or Computer picture mode.',
              'Make sure the PC is plugged into a port that supports 4K at the full refresh rate — on many TVs only one or two HDMI ports are HDMI 2.1.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'Every colored text row is as sharp as the white-on-black row.',
        'All 1-pixel line pairs show clear stripes when you look closely.',
        'Thin red, blue, and purple text has clean edges with no colored smudging.',
      ],
      bad: [
        'Red on blue or magenta on green text is blurry or smeared while gray text is sharp — 4:2:2 or 4:2:0.',
        'Vertical colored lines merge into one color but horizontal lines stay striped — 4:2:2.',
        'Both vertical and horizontal colored lines merge — 4:2:0.',
        'Even white/black lines blur — check scaling, overscan, and TV sharpness instead.',
      ],
    },
    panelNotes: [
      { panel: 'TV (LCD or OLED)', note: 'The usual suspect. Most TVs need PC mode / a PC input label plus enhanced HDMI to show 4:4:4. Outside PC mode, many convert to 4:2:2 internally.' },
      { panel: 'PC monitor (DisplayPort)', note: 'Almost always 4:4:4 RGB. If text smears here, check GPU color format and look for an HDMI-only fallback.' },
      { panel: 'OLED / QD-OLED monitors', note: 'Colored fringes on text that appear even in 4:4:4 come from the subpixel layout (WRGB or triangular QD-OLED), not chroma subsampling. They show on gray text too.' },
      { panel: 'Projectors', note: 'Many accept 4:4:4 only at lower refresh rates. Test at 60 Hz first.' },
    ],
    tips: [
      'Use native resolution and 100% (or 200%) scaling so 1 chart pixel = 1 panel pixel.',
      'Turn TV sharpness, noise reduction, and motion smoothing off.',
      'Sit close — subsampling is a pixel-level effect.',
      'Change one setting at a time and re-run the test.',
    ],
    related: ['text-clarity', 'test-patterns', 'screen-resolution', 'hdr-test'],
    affiliates: 'textClarity',
    disclaimer:
      'A visual test only — it cannot read the signal format directly. Your TV’s info screen or GPU control panel shows the actual output format.',
    faqs: [
      {
        question: 'How do I know if my TV supports 4:4:4?',
        answer:
          'Most TVs from the last several years accept 4:4:4 at 4K60, and HDMI 2.1 models at 4K120, but often only in PC mode or with enhanced HDMI turned on. Run this test before and after changing those settings; if colored text sharpens, 4:4:4 is working. See the [TV as a monitor guide](/guides/tv-as-monitor) for brand-specific steps.',
      },
      {
        question: 'Is RGB the same as 4:4:4?',
        answer:
          'For this purpose, yes. RGB never subsamples color, and YCbCr 4:4:4 carries full color resolution too. Both pass this test. Prefer RGB Full on PCs unless your TV only enables PC mode with YCbCr 4:4:4.',
      },
      {
        question: 'Why does HDR make my text blurry?',
        answer:
          'HDR uses 10-bit color, which needs more bandwidth. On HDMI 2.0, 4K60 10-bit only fits with 4:2:2 or 4:2:0, so the GPU drops chroma resolution. Use HDMI 2.1 or DisplayPort, lower the refresh rate, or keep HDR off for desktop work.',
      },
      {
        question: 'Does chroma subsampling matter for games and movies?',
        answer:
          'Much less. Movies and streaming are mastered in 4:2:0, and most games have few sharp color edges. It matters most for text, UI, spreadsheets, and pixel art.',
      },
      {
        question: 'The test still looks blurry in 4:4:4. What else could it be?',
        answer:
          'Check that the PC is at the display’s native resolution with 100% or 200% scaling, browser zoom is 100%, and TV overscan (“Just Scan”, “Screen Fit”, or “Full Pixel”) is set so the image isn’t scaled. Also turn TV sharpness off and see the [text clarity test](/text-clarity).',
      },
    ],
  },
};
