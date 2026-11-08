export default {
  slug: 'contrast',
  order: 330,
  category: 'color',
  name: 'Checkerboard Contrast Test',
  shortName: 'Checkerboard Contrast',
  badges: [],
  summary: 'Black and white checkerboards and boxes to judge black depth, glow, blooming, and flare by eye.',
  seo: {
    title: 'Monitor Contrast Test — Checkerboard & Black Depth Check | Free',
    description:
      'Judge your monitor’s contrast by eye with black-and-white checkerboards, an ANSI 4×4 pattern, and white box windows. Spot gray blacks, IPS glow, and blooming.',
  },
  testSeo: {
    title: 'Checkerboard Contrast Test — Fullscreen',
    description: 'Checkerboard, ANSI 4×4, and box patterns for judging contrast by eye.',
  },
  load: () => import('../../pages/tests/ContrastTest'),
  page: {
    title: 'Checkerboard Contrast Test',
    intro:
      'Put pure black next to pure white and see how your display copes: how deep the blacks stay, whether white areas bleed light into them, and how the screen glows in a dark room. It’s a visual check — a browser can’t measure contrast ratio, but it can show you what that number means in practice.',
    startLabel: 'Start contrast test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'Contrast ratio, and what a browser can’t measure',
        blocks: [
          '**Contrast ratio** is the luminance of full white divided by the luminance of full black, e.g. 300 nits ÷ 0.3 nits = 1000:1. It needs a light meter or colorimeter to measure — a web page can only send pixel values, it can’t read how much light comes back out of the screen.',
          'Measured with a full white screen and then a full black screen, it’s called **full-on/full-off** contrast. **ANSI contrast** measures white and black on screen at the same time, on a 4×4 checkerboard, so it includes light spilling between areas and is usually lower.',
          'What you *can* see is the result: whether black looks black or dark gray, how much light leaks from bright areas into dark ones, and how the screen behaves with mixed content. That’s what this test is for.',
          {
            table: {
              head: ['Panel type', 'Typical native contrast'],
              rows: [
                ['IPS', '~1000:1 (up to ~2000:1 on newer panels)'],
                ['VA', '~3000:1 – 6000:1'],
                ['TN', '~700:1 – 1000:1'],
                ['Mini-LED (local dimming on)', 'Very high in full-field patterns, lower in busy checkerboards'],
                ['OLED / QD-OLED', 'Effectively infinite — pixels switch fully off'],
              ],
            },
          },
          'Spec-sheet “dynamic contrast” figures (1,000,000:1 and up) are produced by dimming the whole backlight on black screens and don’t reflect what you see with real content.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Use your normal picture mode, and dim the room — contrast differences are much easier to see in the dark.',
              'Click **Start contrast test**. The default is an 8×8 checkerboard of pure black (0) and pure white (255).',
              'Look at the black squares: do they stay black next to white ones, or turn gray? Try 2×2 for big areas and 16×16 or more for fine mixes.',
              'Switch to **ANSI 4×4**, the pattern reviewers measure for “ANSI contrast”. Compare its black squares with the full-screen [black screen](/black-screen) test: on most LCDs they look a little lighter, because some light from the white squares spills into them.',
              'Try **White box** (a small white window on black) to look for blooming and haloing, then **Black box** to see how black holds up when the rest of the screen is bright.',
            ],
          },
        ],
      },
      {
        id: 'interpret',
        heading: 'What the patterns reveal',
        blocks: [
          {
            ul: [
              '**Black squares look gray in a dark room** (LCD): that’s the panel’s native black level — normal for IPS, less so for VA. Compare panels side by side rather than against a number.',
              '**Black looks lighter right next to white than farther away** (easiest to see around the white box): flare — light scattering inside the panel layers or in a matte anti-glare coating.',
              '**Halos or glowing “clouds” around white squares or the white box**: local-dimming blooming (Mini-LED, FALD) — the backlight zone is lit even though the pixels are black.',
              '**Black squares darker in a 2×2 checker than at 16×16** on Mini-LED: dimming zones can’t follow small squares, so busy patterns show much lower contrast than full-screen ones.',
              '**Corners or edges glowing, especially off-angle**: IPS glow or backlight bleed — confirm with the [black level](/black-level) and [uniformity](/uniformity) tests.',
              '**Whites dimming as more of the screen turns white** (for example, shrinking the black box): automatic brightness limiting (ABL), typical on OLED — explore it with the [white window test](/brightness).',
            ],
          },
        ],
      },
      {
        id: 'improve',
        heading: 'Getting the best contrast from your display',
        blocks: [
          {
            ul: [
              'On an LCD monitor, **Brightness** usually sets the backlight, which raises black and white together. Lower it to what’s comfortable for your room — in the dark, a dimmer backlight means darker blacks.',
              'Check shadow detail with the [black level test](/black-level) so near-black detail is visible but black isn’t lifted (on TVs, this control is usually called **Brightness** or **Black level**).',
              'Set **Contrast** with the [white saturation test](/white-saturation). It sets the white level of the signal, not the panel’s contrast ratio: too high clips bright details instead of adding contrast.',
              'Match the PC and display RGB range (full/full or limited/limited) — a mismatch turns black into dark gray.',
              'On Mini-LED displays, try different local dimming levels: higher gives deeper blacks but more blooming.',
              'Reduce glare: light falling on the screen raises perceived black more than any panel difference.',
            ],
          },
          'For a real contrast ratio number, measure black and white with a colorimeter and software such as DisplayCAL or HCFR, or look up an independent review that measured your model.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Black squares look clearly darker than the room around the screen (in a dim room).',
        'Black looks equally dark across the screen — center, corners, and right next to white.',
        'Edges between squares are crisp with no glow spilling into the black.',
        'OLED: black squares are fully off, indistinguishable from the bezel.',
      ],
      bad: [
        'Black squares look washed-out gray even in a dark room — check brightness and RGB range.',
        'Strong halos or glowing clouds around white areas (blooming).',
        'Bright corners or patches in the black squares (backlight bleed / glow).',
        'Whites visibly dim as you add more white (ABL) if this bothers you in daily use.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Blacks look dark gray in a dark room and corners may glow, especially off-angle. That’s IPS glow, normal for the technology unless it’s severe or uneven.' },
      { panel: 'VA', note: 'Noticeably deeper blacks than IPS when viewed head-on. Black squares lighten toward the edges of large screens because of viewing angle.' },
      { panel: 'TN', note: 'Lowest contrast of the LCD types, and black depth changes a lot with vertical viewing angle.' },
      { panel: 'OLED / QD-OLED', note: 'Black squares are truly black with no blooming. QD-OLED without a polarizer can look grayish in a lit room — that’s ambient light reflecting, not the panel. Large white areas may dim (ABL).' },
      { panel: 'Mini-LED', note: 'Excellent contrast in simple scenes, but checkerboards are the worst case for local dimming — expect halos and lifted blacks in fine patterns.' },
    ],
    whenToReturn: [
      'Black is clearly worse than other units of the same model in reviews, after checking brightness and RGB range.',
      'Strong, uneven bright patches or bleed in black areas that are visible in normal content.',
      'Severe blooming that a local-dimming setting can’t tame and that distracts in films or games.',
    ],
    tips: [
      'Test in a dim or dark room — ambient light hides black-level differences.',
      'Sit straight in front of the center; off-axis viewing lightens blacks on LCDs.',
      'Turn off dynamic contrast and eco modes so the backlight stays constant.',
      'Clean the screen: smudges scatter light into black areas.',
    ],
    related: ['black-level', 'local-dimming', 'brightness', 'uniformity'],
    affiliates: 'contrast',
    disclaimer:
      'A visual comparison aid. It cannot measure contrast ratio, black level, or luminance — those need a colorimeter or light meter.',
    faqs: [
      {
        question: 'Can a website measure my monitor’s contrast ratio?',
        answer:
          'No. A browser can only send pixel values; it can’t sense how much light the screen emits. Measuring contrast ratio requires a colorimeter or light meter reading full white and full black. This test lets you judge black depth, glow and blooming by eye instead.',
      },
      {
        question: 'What is a good contrast ratio?',
        answer:
          'For LCDs, around 1000:1 is typical for IPS and 3000:1 or more is good (common on VA). Mini-LED with local dimming can be much higher in simple scenes, and OLED is effectively infinite because pixels switch fully off.',
      },
      {
        question: 'What is ANSI contrast?',
        answer:
          'ANSI contrast is measured on a 4×4 black-and-white checkerboard: the average of the white squares divided by the average of the black squares. Because white and black are on screen together, it includes flare and local-dimming limits and is usually lower than full-on/full-off contrast.',
      },
      {
        question: 'What is the difference between static and dynamic contrast?',
        answer:
          'Static (native) contrast is measured with a fixed backlight and reflects what you see within one frame. Dynamic contrast lets the backlight dim on dark scenes, producing huge marketing numbers that don’t apply to mixed content. Compare static figures.',
      },
      {
        question: 'Why do black squares look gray on my monitor?',
        answer:
          'On LCDs some backlight always leaks through, so black is dark gray — most visible on IPS in a dark room. A brightness setting that’s too high, or a full/limited RGB range mismatch between PC and monitor, can make it worse.',
      },
      {
        question: 'Can I improve my monitor’s contrast?',
        answer:
          'You can make the most of it by setting brightness and contrast correctly, matching RGB range, reducing glare, and tuning local dimming if available. You can’t exceed the panel’s native contrast through settings.',
      },
      {
        question: 'Does the monitor’s Contrast setting change its contrast ratio?',
        answer:
          'Not really. On most displays **Contrast** scales the signal to set how bright white is. Turning it up past the panel’s limit doesn’t make blacks deeper — it clips the brightest shades into flat white, which the [white saturation test](/white-saturation) shows. Turning it well down dims white and slightly lowers the effective ratio. The native ratio is fixed by the panel.',
      },
    ],
  },
};
