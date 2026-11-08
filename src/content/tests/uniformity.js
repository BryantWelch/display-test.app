export default {
  slug: 'uniformity',
  order: 210,
  category: 'defects',
  name: 'Uniformity & Backlight Bleed Test',
  shortName: 'Uniformity',
  badges: ['Popular'],
  summary: 'Solid fields and zone grids to reveal backlight bleed, IPS glow, clouding, and dirty-screen effect.',
  seo: {
    title: 'Backlight Bleed & Uniformity Test — IPS Glow, Clouding, DSE | Free',
    description:
      'Free full-screen backlight bleed and uniformity test. Black, gray, and color fields with a zone grid to spot bleed, IPS glow, clouding, vignetting, and DSE.',
  },
  testSeo: {
    title: 'Uniformity & Backlight Bleed Test — Fullscreen',
    description: 'Full-screen black, gray, and color fields with zone grid for checking backlight bleed and uniformity.',
  },
  load: () => import('../../pages/tests/UniformityTest'),
  checkup: { step: 30, question: 'On a dark screen, is backlight bleed or clouding acceptable to you?' },
  page: {
    title: 'Uniformity & Backlight Bleed Test',
    intro:
      'Fill the screen with solid black, gray, and color fields to check how evenly your display lights up — and tell real defects like backlight bleed and clouding apart from normal IPS glow.',
    startLabel: 'Start uniformity test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'What uniformity problems look like',
        blocks: [
          'An ideal panel shows the same brightness and color everywhere. Real panels vary, and the variation has different causes that look different on screen:',
          {
            ul: [
              '**Backlight bleed** — light leaking around the edges of an LCD, usually as bright patches or streaks at the edges and corners on a black screen. It is caused by pressure from the frame on the panel and **does not change** when you move your head.',
              '**IPS glow** — a silvery or warm sheen in the corners of IPS panels on dark content. It **changes or disappears as you move your head** or sit farther back. It is a property of IPS technology, not a defect.',
              '**Clouding** — soft, blotchy lighter areas anywhere on the panel (often edge-lit VA and IPS), visible on black and very dark gray.',
              '**Dirty screen effect (DSE)** — faint smudges, bands, or a "dirty window" texture that stays fixed while the image moves. Most visible on 5–20% gray and on large panels during camera pans.',
              '**Vignetting and tint shift** — corners or edges a little darker, or one side warmer/cooler than the center. Most visible on 50–100% gray.',
              '**OLED near-black non-uniformity** — no backlight, so no bleed or glow, but faint banding, vertical lines, or tinted patches can show on 5–10% gray.',
            ],
          },
          'Gray levels on this site are a percentage of the full signal (50% = RGB 128), not of light output — 50% gray emits only about a fifth of white’s luminance.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Let the display warm up for 15–30 minutes and wipe the screen with a dry microfiber cloth.',
              'Use your normal brightness. Turn off local dimming, dynamic contrast, and ambient-light sensors — they change the backlight while you look.',
              'Dim the room, but don’t test in total darkness at max brightness unless that’s how you actually use the screen; that exaggerates bleed far beyond what you’ll see in practice.',
              'Click **Start uniformity test**. Step through presets with **← / →**: start at **0%** and **5–10%** for bleed and clouding, then **50%** and **100%** for vignetting and tint, then red, green, and blue.',
              'For dirty screen effect, pick **5–20%** gray and press **P** to scroll a faint moving pattern. Smudges or bands that stay put while it moves are DSE.',
              'Press **G** for a 3×3 or 5×5 zone grid and compare each zone to the center. Turn overlays off for the final dark-room look.',
              'If you see a bright corner, move your head side to side and back. If it shifts or fades, it’s glow; if it stays put, it’s bleed.',
            ],
          },
          { note: 'Phone cameras exaggerate bleed dramatically on long exposures. Judge with your eyes, and if you photograph it, use a normal exposure that matches what you see.' },
        ],
      },
      {
        id: 'interpret',
        heading: 'Interpreting what you see',
        blocks: [
          'Almost every LCD shows some non-uniformity on a black field in a dark room. What matters is whether it’s visible in **your** content and lighting.',
          {
            ul: [
              'Slight brightening at one or two edges on 0% black that you can’t see on a movie with black bars: normal.',
              'Corner glow that moves with your head on an IPS panel: normal for the technology.',
              'Bright streaks or blobs that are obvious in letterboxed movies, dark games, or a dark desktop at your usual brightness: worth a return inside the window.',
              'Bands or smudges on 5–20% gray that you notice while scrolling or watching sports: DSE — mostly a large-TV issue and very common, but severe cases are returnable.',
              'One side clearly warmer or cooler than the other on 50% gray: color uniformity issue; matters most for photo and video work.',
            ],
          },
          'Uniformity is a panel lottery: two units of the same model can look very different. Measured corner-to-center brightness drops of 10–20% are common on consumer monitors and hard to see on real content; only some professional monitors guarantee tighter tolerances.',
          'A browser can show the patterns but can’t measure luminance. For numbers (for example, “corner is 15% dimmer than center”), you need a colorimeter and uniformity software.',
        ],
      },
      {
        id: 'fix',
        heading: 'Can you reduce it?',
        blocks: [
          {
            ul: [
              'Lower brightness: bleed and glow scale with backlight level.',
              'Add some ambient light behind or around the screen (bias lighting) so the eye is less sensitive to dark-scene glow.',
              'For IPS glow, sit a little farther back or slightly lower so you look at the panel more head-on.',
              'Some photo and pro monitors have a **uniformity compensation** mode that evens out brightness and tint across the screen. It lowers peak brightness and contrast and does not fix bleed on black.',
              'Loosening bezel screws or massaging the panel occasionally reduces bleed, but it can crack the panel and void the warranty — not recommended.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'On an LCD, black looks like a dark, fairly even gray with slightly brighter corners or edges.',
        'Corner glow that changes or fades as you move your head (IPS glow).',
        'Gray and white fields look even, with only gentle darkening toward the edges.',
      ],
      bad: [
        'Bright patches or streaks at the edges that stay put when you move (backlight bleed).',
        'Blotchy light clouds in the middle of a black field (clouding).',
        'Bands or smudges on 5–20% gray that stay fixed while content moves (dirty screen effect).',
        'One side clearly tinted compared with the center on 50% gray.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Corner IPS glow on black is normal and changes with angle. Edge bleed is common; judge it at your real brightness and seating distance.' },
      { panel: 'VA', note: 'Much less glow and generally better black uniformity, but clouding and DSE on large VA monitors and TVs are common.' },
      { panel: 'TN', note: 'Viewing angle makes the top and bottom look different shades even when uniform — sit centered and level before judging.' },
      { panel: 'OLED / QD-OLED', note: 'No backlight, so no bleed or glow. Look instead for near-black banding, tint, or "vertical banding" on 5–10% gray, and for burn-in on 50% gray.' },
      { panel: 'Mini-LED', note: 'Local dimming zones create blooming and can hide bleed. Test with local dimming off for the panel itself, then on to see what you’ll actually get.' },
    ],
    whenToReturn: [
      'Inside the retailer return window: if bleed or clouding is visible in your everyday dark content, return or exchange — panels vary a lot from unit to unit.',
      'Bright bleed that you notice in letterboxed movies or dark games at your normal brightness.',
      'Strong tint or brightness shift on 50% gray that affects photo or design work.',
      'New bleed that appears after the monitor was moved or bumped — the panel may have been stressed.',
    ],
    tips: [
      'Warm up the display for 15–30 minutes first.',
      'Turn off local dimming, dynamic contrast, and auto-brightness.',
      'Test at your normal brightness, not maximum, unless that is how you use it.',
      'Sit at your usual distance and centered; move your head to tell glow from bleed.',
    ],
    related: ['black-level', 'viewing-angle', 'dead-pixel', 'local-dimming'],
    affiliates: 'uniformity',
    disclaimer:
      'A visual inspection aid — browsers can’t measure luminance or color, and this does not replace colorimeter-based uniformity measurement or manufacturer diagnostics.',
    faqs: [
      {
        question: 'What is backlight bleed?',
        answer:
          'Light from an LCD’s backlight leaking around the panel edges, usually caused by uneven pressure from the frame. It shows as bright patches at the edges on dark screens and, unlike IPS glow, doesn’t change when you move your head. OLEDs have no backlight, so they don’t bleed.',
      },
      {
        question: 'How do I tell IPS glow from backlight bleed?',
        answer:
          'Show a black field and move your head left, right, and back. IPS glow shifts, changes color, or fades as your angle changes. Backlight bleed stays in the same place and keeps the same shape. Many IPS panels have a bit of both.',
      },
      {
        question: 'Is some backlight bleed normal?',
        answer:
          'Yes — almost every LCD shows some on a black screen in a dark room. It becomes a problem when you notice it in normal content (dark movies, games, a dark desktop) at your usual brightness. Inside a retailer’s return window it’s reasonable to exchange a unit that bothers you.',
      },
      {
        question: 'What is clouding?',
        answer:
          'Soft, uneven lighter patches on dark images, often away from the edges. It comes from uneven backlight diffusion or panel pressure and is most common on edge-lit LCDs, especially large VA monitors and TVs.',
      },
      {
        question: 'What is dirty screen effect (DSE)?',
        answer:
          'Faint bands or smudges that stay fixed while the picture moves, like looking through a dirty window. Check with the 5–20% gray fields and the moving pattern on — it’s most visible on large TVs during camera pans over grass, ice, or sky. Some DSE is common; strong DSE is a valid reason to exchange.',
      },
      {
        question: 'Can backlight bleed get better or worse over time?',
        answer:
          'It sometimes eases slightly in the first weeks as the panel settles, but don’t count on it. It can get worse if the monitor is bumped or the stand puts pressure on the frame. Decide within the return window rather than waiting.',
      },
    ],
  },
};
