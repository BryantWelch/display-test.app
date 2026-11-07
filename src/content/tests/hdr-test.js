export default {
  slug: 'hdr-test',
  order: 350,
  category: 'color',
  name: 'HDR & Wide Color Gamut Test',
  shortName: 'HDR & Gamut',
  badges: ['New'],
  summary: 'Check whether HDR is on, which color gamut your screen reports, and see P3 vs sRGB side by side.',
  seo: {
    title: 'HDR Test & Wide Color Gamut Test — Is HDR On? P3 vs sRGB Check',
    description:
      'Free online HDR and wide color gamut test. See if your browser reports HDR, Display P3, or Rec. 2020, check HDR10 video decode support, and compare sRGB vs P3 colors on your monitor.',
  },
  testSeo: {
    title: 'HDR & Wide Gamut Test — Fullscreen',
    description: 'Fullscreen sRGB vs Display P3 vs Rec. 2020 color swatches and a P3-only visibility test.',
  },
  load: () => import('../../pages/tests/HdrTest'),
  inlineTool: () => import('../../tools/HdrTool'),
  page: {
    title: 'HDR & Wide Color Gamut Test',
    intro:
      'Find out whether your display is in HDR mode, how wide a color gamut your browser can use on it, and whether it can decode HDR10 video — then see sRGB, Display P3, and Rec. 2020 colors side by side in fullscreen.',
    startLabel: 'Start gamut comparison',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'HDR and wide color gamut are different things',
        blocks: [
          '**Color gamut** is the range of colors a screen can show. Most web content is **sRGB**. **Display P3** (used by Apple devices, most OLEDs, and many modern monitors) covers about 25% more colors, mostly deeper reds and greens. **Rec. 2020** is wider still and is the target for HDR video — no consumer display covers all of it.',
          '**HDR (high dynamic range)** is about brightness: highlights brighter than normal “paper white” and deeper shadow detail, carried with a PQ or HLG signal. A display can be wide-gamut without HDR (many P3 laptops) or accept HDR with a fairly narrow gamut (cheap “HDR400” monitors).',
          'The verdict above reads three things your browser exposes: the `color-gamut` and `dynamic-range` media queries, and HDR10 decode support from the Media Capabilities API. If a line says **Not reported**, the browser didn’t answer — it does not mean your display lacks the feature.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the gamut test',
        blocks: [
          {
            ol: [
              'Click **Start gamut comparison** to open the swatch grid: each row is the same color at full saturation in sRGB, Display P3, and Rec. 2020.',
              'On a wide-gamut screen in a color-managed browser (Chrome, Edge, Safari, recent Firefox), the P3 column looks more saturated than sRGB — especially red and green. On an sRGB screen the columns look the same, because the browser maps them back into sRGB.',
              'Switch to **Gamut-only**: a Display P3 square sits inside an sRGB border of the “same” color. If you can see the square, your setup is really showing P3 colors. If the screen looks like one flat color, it’s limited to sRGB.',
              'Try the **2020 vs P3** comparison too. A visible square there is rare and means the display reports a gamut beyond P3.',
            ],
          },
          {
            note: 'Your camera or screenshot tool can’t capture this reliably — screenshots are often converted to sRGB. Judge by eye.',
          },
        ],
      },
      {
        id: 'browser-limits',
        heading: 'What a browser can and can’t test about HDR',
        blocks: [
          'Web pages, CSS colors, and canvas drawings are rendered at **SDR white** — the brightness you set for normal content — even when HDR is on. That’s why the **White** view shows three identical whites. Only HDR video, and HDR images in browsers that support them, can use brightness above SDR white.',
          'So this page can confirm HDR is **enabled** and that **HDR video can decode**, but it can’t measure peak brightness, tone mapping, or local dimming. For those:',
          {
            ul: [
              'Run the [Windows HDR Calibration app](https://apps.microsoft.com/detail/9n7f2sm5d1lr) from Microsoft. It sets your display’s real peak and black levels so games and the OS tone map correctly.',
              'Play known HDR test videos in a browser or player that supports HDR, full screen, with HDR enabled.',
              'Use the [local dimming test](/local-dimming) for blooming, and the [black level](/black-level) and [white saturation](/white-saturation) tests for SDR clipping.',
            ],
          },
        ],
      },
      {
        id: 'settings',
        heading: 'Turning HDR on: Windows and macOS',
        blocks: [
          { h3: 'Windows 11' },
          {
            ul: [
              '**Use HDR** — Settings → System → Display → select the monitor → **Use HDR**. This switches the signal to HDR10 and makes this page report HDR.',
              '**SDR content brightness** — under the same HDR settings. It controls how bright the desktop, browser, and other SDR content look in HDR mode. If SDR looks dim or washed out, raise it.',
              '**Auto HDR** — expands supported DirectX games from SDR to HDR. It doesn’t affect browsers or the desktop.',
              '**Windows HDR Calibration** — install it from the Microsoft Store and run it once per monitor after enabling HDR.',
              'If **Use HDR** is missing, the monitor, cable, or port isn’t passing HDR. Use DisplayPort or a certified HDMI 2.0/2.1 cable and update the GPU driver.',
            ],
          },
          { h3: 'macOS' },
          {
            ul: [
              'Macs use **EDR (Extended Dynamic Range)**: HDR content is shown brighter than the desktop automatically on supported displays (MacBook Pro Liquid Retina XDR, Pro Display XDR, iPad Pro, and many HDR external monitors).',
              'For external HDR monitors, enable **High Dynamic Range** in System Settings → Displays.',
              'Turning off **Automatically adjust brightness** and setting brightness higher gives EDR more headroom.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'In the swatch grid, P3 and Rec. 2020 reds and greens look deeper than sRGB on a wide-gamut screen.',
        'In the gamut-only view, a P3 square is clearly visible inside the sRGB border (red and green are easiest).',
        'On an sRGB monitor, all columns look identical — that’s correct behavior, not a fault.',
        'All three whites in the White view match.',
      ],
      bad: [
        'Colors look oversaturated or neon in the sRGB column — the monitor may be in a wide-gamut mode without an sRGB clamp.',
        'HDR is on but whites and grays look dim or washed out — raise SDR content brightness or run Windows HDR Calibration.',
        'A “wide gamut” monitor shows no P3 square — check the monitor’s color mode, the OS color profile, and that the browser isn’t forcing sRGB.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'Usually 95–100% DCI-P3 and true per-pixel HDR. The P3 square should be easy to see. Full-screen white is dimmer than small highlights (ABL) — that’s normal.' },
      { panel: 'Mini-LED', note: 'Wide gamut and high peak brightness. Local dimming can create halos around bright objects in HDR.' },
      { panel: 'Edge-lit “HDR400” LCD', note: 'Accepts HDR signals but has limited contrast and a gamut often only modestly wider than sRGB. HDR may look worse than SDR; this is a panel limit, not a setting.' },
      { panel: 'Standard sRGB IPS / VA / TN', note: 'No visible P3 square and identical columns are expected. Browsers report sRGB.' },
      { panel: 'Laptop / Apple displays', note: 'Most recent MacBooks and premium Windows laptops are P3. Apple XDR displays support EDR HDR in Safari and Chrome.' },
    ],
    tips: [
      'Turn off night light / Night Shift and blue-light filters.',
      'Set the monitor to its native or standard color mode, not “sRGB emulation”, to see its full gamut.',
      'Use Chrome, Edge, or Safari for the most complete HDR and gamut reporting.',
      'After enabling HDR on Windows, run the Windows HDR Calibration app.',
    ],
    related: ['color-gradient', 'local-dimming', 'white-saturation', 'screen-resolution'],
    affiliates: 'colorGradient',
    disclaimer:
      'Gamut and HDR values are reported by your browser and operating system and depend on color profiles and settings. This is not a colorimeter measurement.',
    faqs: [
      {
        question: 'How do I know if HDR is actually working?',
        answer:
          'If the HDR line says “Yes — HDR is on for this screen”, the operating system is sending an HDR signal. Many monitors also show an HDR badge in their on-screen menu. To see HDR brightness, play HDR video fullscreen — web pages and this test stay at SDR white by design.',
      },
      {
        question: 'Why does my HDR monitor only show sRGB here?',
        answer:
          'The color-gamut value depends on the monitor’s color profile and mode. On Windows in SDR mode, many wide-gamut monitors report sRGB unless a proper ICC profile is installed. Enabling HDR, installing the manufacturer’s profile, or turning off the monitor’s sRGB mode can change the result.',
      },
      {
        question: 'Why does my browser say “Not reported” for HDR?',
        answer:
          'Some browsers, notably older Firefox versions, don’t support the dynamic-range media query. Try Chrome, Edge, or Safari. Not reported doesn’t mean your display can’t do HDR.',
      },
      {
        question: 'Why can’t I see the P3 square?',
        answer:
          'Either the display covers only sRGB, the monitor is in an sRGB-clamped mode, or the browser isn’t color-managing to the display. Red and green show the biggest difference; blue is nearly identical even on good P3 panels.',
      },
      {
        question: 'Does this test measure HDR peak brightness?',
        answer:
          'No. Browsers can’t render CSS or canvas brighter than SDR white, so peak brightness, tone mapping, and HDR black levels need HDR video or the [Windows HDR Calibration app](https://apps.microsoft.com/detail/9n7f2sm5d1lr). A colorimeter is needed for real nit measurements.',
      },
      {
        question: 'Should I leave HDR on all the time in Windows?',
        answer:
          'On OLED and good mini-LED monitors, many people do, with SDR content brightness set comfortably. On edge-lit HDR400 monitors, the desktop often looks washed out in HDR — turn it on only for HDR games and video.',
      },
    ],
  },
};
