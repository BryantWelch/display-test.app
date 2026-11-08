export default {
  slug: 'brightness',
  order: 230,
  category: 'defects',
  name: 'Brightness & White Window Test',
  shortName: 'White Window',
  badges: [],
  summary: 'White windows from 1% to 100% of the screen to see ABL, local dimming, and blooming.',
  seo: {
    title: 'Monitor Brightness & White Window Test (ABL, Blooming)',
    description:
      'Free white window test from 1% to 100% of the screen with APL readout. See OLED ABL and Mini-LED blooming, and set a comfortable SDR brightness for your room.',
  },
  testSeo: {
    title: 'White Window Test — Fullscreen',
    description: 'Adjustable white window on black with APL readout.',
  },
  load: () => import('../../pages/tests/BrightnessTest'),
  page: {
    title: 'Brightness & White Window Test',
    intro:
      'Display a white window that covers an exact share of your screen — from a 1% highlight to full-screen white — and watch how brightness changes. It’s the same kind of pattern reviewers use to measure peak brightness, ABL and blooming; here you judge the behavior by eye.',
    startLabel: 'Start white window test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'Why window size changes brightness',
        blocks: [
          'Many displays can’t run every pixel at full brightness at the same time. Power supplies, heat, and panel lifetime limit how much light the whole screen can emit, so the brightness of a white area depends on **how much of the screen is bright**.',
          'That’s measured as **APL (average picture level)** — the average signal level across the whole screen. A 10% white window on black is 10% APL; full-screen white is 100%. The test shows the APL of the current pattern.',
          {
            ul: [
              '**ABL (automatic brightness limiting)**, mainly OLED: as APL rises, the whole screen dims. A small window may be very bright, while full-screen white is a fraction of that.',
              '**Local dimming**, Mini-LED and other full-array (FALD) LCDs: the backlight is split into zones. Small windows can be driven extra bright, but light spills into neighboring black zones as a halo (**blooming**).',
              '**LCDs without local dimming**: one backlight for the whole screen, so brightness barely changes with window size — but black around the window is only as dark as the panel allows.',
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
              'Use the picture mode you care about (SDR desktop, or the TV’s game/movie mode). Leave brightness where you normally have it.',
              'Dim the room so blooming and glow are easy to see.',
              'Click **Start white window test**. Start at **10%** and look at the window and the black around it.',
              'Step through sizes with **↑ / ↓**: 1% → 100%. Watch whether the window gets dimmer as it grows, and whether the change is instant or gradual.',
              'Move the window to the corners (**P**) and try a circle (**S**) to see how local dimming zones handle edges.',
              'Lower the window level with **← / →** to see how dimming behaves with mid-gray content, and raise the background to mimic a typical desktop.',
            ],
          },
          { note: 'This is SDR content in a browser. Most displays don’t reach their HDR peak brightness for SDR, and browsers don’t offer a reliable way to output HDR highlights in a test like this. See the [HDR test](/hdr-test) for what your browser reports.' },
        ],
      },
      {
        id: 'interpret',
        heading: 'What you might see',
        blocks: [
          {
            ul: [
              '**Window dims as it grows** (most obvious from 25% to 100%): ABL. Normal on OLED; how strong it is varies by model and picture mode.',
              '**Brightness slowly drops after a few seconds on a static window**: temporal or static-content dimming (ASBL on many OLED TVs) — a burn-in protection feature.',
              '**Glow or halo around small windows**: blooming from local dimming. Expect more of it with higher dimming settings and with circles or corner windows.',
              '**Window has visibly soft or blocky edges of light in the black**: individual dimming zones lighting up.',
              '**No change at all with size**: typical for LCDs without local dimming, and for OLED monitors in modes that cap brightness to avoid ABL.',
            ],
          },
        ],
      },
      {
        id: 'set-brightness',
        heading: 'Setting brightness for your room',
        blocks: [
          'Screen brightness is measured in **nits** (candelas per square metre, cd/m²). For SDR desktop use, **about 120 nits** in a dim or evenly lit room is the usual calibration target. A bright office or a desk next to a window may need 200–300 nits; in a dark room 80–100 nits is often plenty.',
          {
            ol: [
              'Choose a neutral picture mode (Standard, sRGB, Movie) and turn off auto-brightness, eco modes and dynamic contrast.',
              'Start the test and choose a **100%** window at a **100%** window level. Hold a sheet of white printer paper next to the screen under your normal room lighting.',
              'Adjust the display’s **Brightness** (called Backlight or OLED Light on many TVs) until the screen’s white looks about as bright as the paper: not glowing beside it, not dull gray.',
              'Check the [black level](/black-level) and [white saturation](/white-saturation) tests afterwards. You shouldn’t need more brightness to see shadow detail, and Contrast shouldn’t clip highlights.',
            ],
          },
          'On most monitors, **Brightness** sets how much light the backlight or OLED panel emits, making everything brighter or darker without changing the signal. **Contrast** sets the white level of the signal, and too much clips highlights. Many TVs label things differently: *Brightness* shifts the black level, while *Backlight* or *OLED Light* sets light output. The white saturation and black level tests show what each control does on your display.',
          { note: 'On OLED, full-screen white is the case where ABL dims the screen most. Normal desktop content is usually closer to the 25–50% windows, so check those sizes too before settling on a setting.' },
          {
            warning:
              'Many displays dim using **PWM**, switching the backlight or pixels on and off very quickly. On many panels the flicker gets worse at low brightness settings and can cause eye strain. If a low brightness setting bothers you, raise brightness and use softer room lighting, or look for a flicker-free or DC-dimming option. A browser can’t detect PWM. See the [setup checklist](/guides/setup-checklist#pwm-flicker) for simple ways to check for it.',
          },
        ],
      },
      {
        id: 'hdr-10-percent',
        heading: 'Why HDR peak brightness is quoted at 10%',
        blocks: [
          'HDR highlights — sun glints, lamps, explosions — usually cover a small part of the frame. Reviewers and standards like VESA DisplayHDR therefore quote peak brightness on a small window (often 10%, sometimes 2% or 3%) as well as full-screen.',
          'For OLEDs the difference is large: a monitor might hit ~1000 nits on a 2% window but only ~250 nits full-screen. That’s why spec sheets list several numbers, and why a full-screen white page can look less bright than an HDR highlight.',
          {
            warning:
              'Brightness in nits can only be measured with a light meter or colorimeter placed on the window. A browser can set pixel values but can’t sense the light that comes out of the screen — this test shows how brightness *changes*, not how bright it is.',
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'The window looks evenly bright with crisp edges at every size.',
        'OLED: gradual dimming as the window grows toward 100% — ABL working as designed.',
        'Mini-LED: a soft, faint halo around small windows is normal; it shouldn’t look like a bright cloud.',
        'Black around the window stays black (OLED) or a steady dark gray (LCD).',
      ],
      bad: [
        'Strong pumping: the whole screen visibly jumps in brightness when the window changes slightly.',
        'Large, bright halos or blocky glowing zones around small windows.',
        'Brightness drops a lot after a few seconds of a static window, if that bothers you in desktop use.',
        'Uneven brightness inside a full-screen white window — check the [uniformity test](/uniformity).',
      ],
    },
    panelNotes: [
      { panel: 'IPS / VA / TN (no local dimming)', note: 'Brightness is essentially the same at every window size. Black around the window is the panel’s native black — dark gray on IPS, deeper on VA.' },
      { panel: 'OLED / QD-OLED', note: 'ABL is expected: small windows are brightest, full-screen white is dimmest. Some monitors offer a “uniform brightness” or capped mode that removes ABL at the cost of peak brightness.' },
      { panel: 'Mini-LED', note: 'Small windows can be very bright, with some blooming into black. More zones and better algorithms mean less blooming; higher local-dimming settings trade blooming for deeper blacks.' },
    ],
    whenToReturn: [
      'Brightness pumps or flickers with normal desktop content and no setting stops it.',
      'Blooming is far worse than reviews show for the same model, or a dimming zone stays lit when it shouldn’t.',
      'A full-screen white window shows obvious dark patches, tint shifts or bands — that’s uniformity, see [uniformity](/uniformity).',
    ],
    tips: [
      'Test in a dark room so halos and glow are visible.',
      'Turn off auto-brightness / ambient light sensors so they don’t change the result.',
      'Give each size a few seconds — some dimming is gradual.',
      'If you have a light meter or colorimeter, measure each window size for real numbers.',
    ],
    related: ['black-level', 'white-saturation', 'local-dimming', 'contrast', 'uniformity', 'hdr-test'],
    affiliates: 'brightness',
    disclaimer:
      'A visual aid for seeing brightness behavior. It cannot measure brightness in nits or certify HDR performance — that requires a calibrated light meter or colorimeter.',
    faqs: [
      {
        question: 'Can this test measure my monitor’s brightness in nits?',
        answer:
          'No. A browser can only set pixel values; it has no way to sense the light your screen emits. To measure nits, place a colorimeter or light meter on the white window. This test shows how brightness changes with window size, not the absolute number.',
      },
      {
        question: 'What is ABL (automatic brightness limiting)?',
        answer:
          'ABL reduces brightness when a large part of the screen is bright, to stay within power and heat limits and protect the panel. It’s most noticeable on OLED: a small white window is much brighter than full-screen white.',
      },
      {
        question: 'What is APL?',
        answer:
          'Average picture level — the average signal level across the whole screen, from 0% (all black) to 100% (all white). A 10% white window on black is 10% APL. Many displays set their brightness limit based on APL.',
      },
      {
        question: 'Why is HDR brightness measured with a 10% window?',
        answer:
          'Most HDR highlights cover a small part of the image, and many displays can only reach their peak brightness on small areas. A 10% window (or 2–3% for some reviews) shows that highlight capability, while a 100% window shows sustained full-screen brightness.',
      },
      {
        question: 'What brightness level should I use?',
        answer:
          'Match the screen to your room: about 120 nits is the usual SDR target for a dim or evenly lit room, 80–100 nits suits a dark room, and 200–300 nits may be needed near a bright window. Without a meter, show a 100% white window and match it to a sheet of white paper under your room light. If white pages feel glaring, lower brightness.',
      },
      {
        question: 'Why does my screen get dimmer when I open a white web page?',
        answer:
          'That’s ABL or a similar power-limiting feature reacting to the jump in average picture level. It’s normal on OLED and on some bright LCDs in HDR modes. Some monitors offer a mode that keeps brightness constant at a lower peak.',
      },
    ],
  },
};
