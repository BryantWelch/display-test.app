export default {
  slug: 'crt',
  order: 950,
  category: 'fun',
  name: 'CRT',
  shortName: 'CRT',
  badges: [],
  summary: 'A curved glass tube with scanlines, phosphor glow, and a station test card. Just for fun.',
  seo: {
    title: 'CRT — Free Fullscreen Cathode-Ray Tube Screensaver',
    description:
      'A curved CRT in the browser: color, green, amber, or white phosphor, with scanlines, an aperture grille, and a station test card. Just for fun.',
  },
  testSeo: {
    title: 'CRT — Fullscreen',
    description: 'Fullscreen curved tube with scanlines and a station test card.',
  },
  load: () => import('../../pages/tests/CrtTest'),
  page: {
    title: 'CRT',
    intro:
      'A station test card inside a curved glass tube. This is **just for fun** — the bow, the scanlines, and the glow are drawn on purpose. The black around the tube is the part that belongs to your display.',
    startLabel: 'Warm up the tube',
    lastReviewed: '2026-11-13',
    sections: [
      {
        id: 'about',
        heading: 'What you are looking at',
        blocks: [
          'Color bars, a crosshair, a circle, and a dot tracing a slow figure. **DISPLAY TEST** sits along the bottom in a block font. A soft beam walks down the picture, the way the electron beam did, but it never flashes the whole screen.',
          '**Phosphor** is the tube’s color: full color, or the green, amber, and white phosphors real monitors used. Monochrome modes keep the brightness of each bar and throw the hue away. **Curve** bows the picture out in the middle. **Scanlines** are the dark gaps between rows. **Glow** is the phosphor blooming past the sharp edge. **Aperture grille** lays thin dark stripes over the picture, like the mask behind the glass.',
          'Press **Space** to pause, **← / →** to change phosphor, **↑ / ↓** for brightness, and **G** for the grille. The card is drawn small and scaled up, because a tube was soft. The scanlines stay sharp.',
        ],
      },
      {
        id: 'panel',
        heading: 'What is the drawing, and what is the panel',
        blocks: [
          'Steps inside a color bar, or inside the glow, can be banding. The [color gradient test](/color-gradient) is the one that draws every step on purpose. A gray haze in the black around the tube, in a dark room, is the backlight. That is the panel, and the [uniformity test](/uniformity) is where to look at it.',
          'The scanlines and the grille stay put when you move your head. A moiré that shifts as you move, or that appears only at some sizes, is the fine pattern beating against the panel’s own pixels. Lower **Scanlines** or turn the grille off if you only want the card.',
        ],
      },
    ],
    lookFor: {
      good: [
        'The picture bows, the rows are striped, and the beam walks down slowly.',
        'The area outside the tube stays black, or as black as the panel can manage.',
      ],
      bad: [
        'Hard strips inside a single color bar — banding. Confirm it on the gradient test.',
        'A gray wash over the black around the tube in a dark room — backlight glow.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'The black around the tube should drop away. The glow in the picture is drawn; it is not the panel blooming.' },
      { panel: 'LCD', note: 'The black around the tube is where backlight glow and clouding show. The scanlines can pick up a faint moiré on some panels.' },
      { panel: 'Wide gamut', note: 'Color mode looks richer. Green and amber are still ordinary sRGB colors, just more saturated on a wide-gamut screen.' },
    ],
    tips: [
      'Dim the room and hide the controls if you want the tube to read as a screen in the dark.',
      'Turn the grille off and lower scanlines before you decide a pattern is the panel.',
      'Green phosphor on a black field is the easiest place to see the black level around the tube.',
    ],
    related: ['aurora', 'matrix', 'color-gradient', 'uniformity'],
    disclaimer:
      'Purely for entertainment — not a diagnostic test. The beam moves slowly and the screen does not flash. Take a break if it causes discomfort.',
    faqs: [
      {
        question: 'Are the scanlines a problem with my monitor?',
        answer:
          'No. The dark rows and the aperture grille are drawn on top of the card. They stay fixed when you lean in. A pattern that appears, disappears, or shifts only when you move is the fine lines beating against the panel, and you can turn both effects down.',
      },
      {
        question: 'Why do the colors look different on my other screen?',
        answer:
          'The card is the same sRGB colors everywhere. A wide-gamut panel shows them more saturated, and a warm or cool preset shifts green and amber. Brightness in the panel only changes the drawing, not the display’s backlight.',
      },
      {
        question: 'Can I leave it on an OLED?',
        answer:
          'The beam and the dot keep moving, so it is gentler than a static image, but the bars and the label stay in the same place. It is a screensaver, not something to park for hours. See the [OLED burn-in guide](/guides/oled-burn-in).',
      },
    ],
  },
};
