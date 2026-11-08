export default {
  slug: 'viewing-angle',
  order: 240,
  category: 'defects',
  name: 'Viewing Angle Test',
  shortName: 'Viewing Angle',
  badges: [],
  summary: 'Color patches and gray steps to check color, gamma, and contrast shift as you move off-axis.',
  seo: {
    title: 'Viewing Angle Test — Color & Gamma Shift (IPS, VA, TN, OLED)',
    description:
      'Free full-screen viewing angle test. Color patches, gray steps, and a gamma-match pattern show color shift, VA gamma washout, TN inversion, and IPS glow as you move off-center.',
  },
  testSeo: {
    title: 'Viewing Angle Test — Fullscreen',
    description: 'Full-screen color patches and gray steps for checking off-axis color and gamma shift.',
  },
  load: () => import('../../pages/tests/ViewingAngleTest'),
  page: {
    title: 'Viewing Angle Test',
    intro:
      'See how much your display’s colors, contrast, and shadows change when you look from the side, above, or below — for shared screens, large monitors, couch viewing, or just choosing the right panel type.',
    startLabel: 'Start viewing angle test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'What viewing angle actually affects',
        blocks: [
          'The “178°” on spec sheets only means contrast stays above a threshold (usually 10:1, sometimes 5:1) at that angle — a very low bar that says nothing about color or gamma. What you actually notice off-axis is:',
          {
            ul: [
              '**Gamma shift** — mid-tones get brighter or darker, so images look washed out or too contrasty.',
              '**Color shift** — whites and skin tones pick up a yellow, blue, pink, or green tint; saturated colors desaturate.',
              '**Contrast loss** — blacks lift toward gray (and on IPS, a corner glow appears on dark content).',
              '**Inversion** — on TN panels, dark tones can flip brighter than lighter ones when viewed from below.',
            ],
          },
          'On a large screen you see the edges at an angle even when you sit centered, so viewing angle also shows up as **edge-to-center differences** from your normal seat.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Use your normal picture mode and brightness, and turn off local dimming and dynamic contrast.',
              'Sit centered with your eyes level with the middle of the screen, at your usual distance. Click **Start viewing angle test**.',
              'On **Patches**, note how white, the grays, and the skin-tone patch look head-on. Then move **horizontally**: lean or slide left and right about 30–45°, keeping your eye height the same.',
              'Return to center, then move **vertically**: stand up and crouch down. Vertical shift is usually stronger than horizontal on VA and much stronger on TN.',
              'Switch to **Gray bars** (→) and **Near-black** to see gamma shift and shadow detail change as you move.',
              'On **Gamma match**, note how well the solid patches blend into the fine lines around them head-on (step back if you can see the lines), then repeat the moves. Patches turning lighter or darker than their surround is gamma shift.',
              'Finally sit normally and compare the patches at the edges of the screen with the ones in the center.',
            ],
          },
          { note: 'Move your head, not the monitor — tilting the screen also changes reflections, which hides what you’re trying to see.' },
        ],
      },
      {
        id: 'panels',
        heading: 'What each panel type looks like off-axis',
        blocks: [
          {
            ul: [
              '**IPS** — colors and gamma stay quite stable. Contrast drops somewhat, and dark content shows a silvery or warm **IPS glow** in the corners that grows with angle.',
              '**VA** — great contrast head-on, but **gamma shift** off-axis: mid-tones and shadows wash out and lose saturation as you move away. On large VA monitors (32″+, especially flat) you can see this **from your normal seat** as lighter, less contrasty edges, and near-black detail “appears” at the sides.',
              '**TN** — usable horizontally, but **strong vertical shift**: from below, the image darkens and can **invert**; from above it washes out. Even at a desk the top and bottom of the screen can look like different shades.',
              '**OLED** — no glow and very stable gamma, but whites can take on a **slight tint** off-axis (pink/green on WOLED, a magenta or green cast on QD-OLED), and brightness falls off gradually.',
            ],
          },
        ],
      },
      {
        id: 'interpret',
        heading: 'Using the results',
        blocks: [
          'Viewing angle is a property of the panel technology, not a defect — two units of the same model should behave about the same. Use the test to decide whether a display suits **how you sit**:',
          {
            ul: [
              'Solo desktop use, sitting centered: mild shift rarely matters, except on large flat VA or TN where edge shift is visible from your seat.',
              'Couch gaming, TVs, or shared viewing: IPS-type LCD TVs, OLED, or VA TVs with wide-angle layers hold up best.',
              'Color-critical work: you want little shift at your seating position, so the edges of the screen match the center.',
              'A **curved** screen reduces edge angle on large VA monitors, which is why so many are curved.',
            ],
          },
          'A browser can show patterns but can’t measure angle or color — this is a side-by-side visual comparison, not a goniometer measurement.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Patches keep roughly the same color and brightness as you move 30° or so left and right.',
        'Gray bars stay in order (each step lighter than the last) from every position.',
        'Gamma match patches stay close to their line surround as you move.',
        'IPS: some corner glow on dark content from an angle. OLED: a slight tint on white off-axis.',
      ],
      bad: [
        'Mid-grays and skin tone wash out or change hue with small head movements (strong gamma shift, typical of VA).',
        'Gray steps darken or invert when viewed from below (TN).',
        'Edges of the screen look visibly lighter or tinted from your normal seated position.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Stable color and gamma off-axis; contrast drops and dark content shows IPS glow in the corners.' },
      { panel: 'VA', note: 'Gamma shift and washout off-axis. On large flat VA panels the edges can look lighter and less saturated even from your normal seat.' },
      { panel: 'TN', note: 'Strong vertical shift — darkening and inversion from below, washout from above. Sit with eyes level with the screen center.' },
      { panel: 'OLED (WOLED / QD-OLED)', note: 'Excellent angles with no glow; a slight color tint on white and gradual brightness drop off-axis are normal.' },
      { panel: 'Mini-LED', note: 'Behaves like its underlying LCD (IPS or VA); off-axis, blooming around bright objects becomes more visible.' },
    ],
    whenToReturn: [
      'You bought for couch or shared viewing and the colors fall apart a step to the side — that won’t change with another unit of the same model.',
      'Edge-to-center shift is distracting from your normal seat on a large VA or TN monitor.',
      'One unit shows a clearly different tint or shift than the same model should — that’s a defect rather than panel technology.',
    ],
    tips: [
      'Sit centered with your eyes level with the middle of the screen before you start.',
      'Turn off local dimming, dynamic contrast, and eye-saver modes.',
      'Move your head, not the screen.',
      'Check horizontally and vertically separately — they behave very differently on VA and TN.',
    ],
    related: ['uniformity', 'gamma', 'black-level', 'contrast'],
    affiliates: 'viewingAngle',
    disclaimer:
      'A visual comparison aid — a browser can’t measure angles, luminance, or color. Results depend on your seating position, room light, and picture settings.',
    faqs: [
      {
        question: 'What are viewing angles on a monitor?',
        answer:
          'How well a display keeps its brightness, contrast, gamma, and color when seen from off-center. Good viewing angles mean the picture looks the same from the side or above as it does head-on.',
      },
      {
        question: 'How do I test my monitor’s viewing angles?',
        answer:
          'Start the test, note how the white, gray, and skin-tone patches look head-on, then move your head left and right, and then up and down. Watch for tint, washout, darkening, and changes in the gray steps, and use the Gamma match pattern to see mid-tones shift against a fixed reference. Check horizontal and vertical separately.',
      },
      {
        question: 'Which panel type has the best viewing angles?',
        answer:
          'OLED and IPS are best. OLED keeps gamma almost perfectly but can show a slight tint; IPS keeps color well but loses contrast and shows glow on dark scenes. VA shows noticeable gamma and color shift off-axis, and TN is the weakest, especially vertically.',
      },
      {
        question: 'Is IPS glow a viewing angle problem?',
        answer:
          'Yes — IPS glow is the IPS panel’s off-axis behavior on dark content. It changes with your angle and distance, which is how you tell it apart from backlight bleed (which stays fixed). Check both on the [uniformity test](/uniformity).',
      },
      {
        question: 'Why do the edges of my VA monitor look washed out when I sit centered?',
        answer:
          'On a large screen you see the edges at an angle even from the center seat, and VA panels shift gamma quickly with angle. That’s normal for VA, and it’s why most large VA monitors are curved.',
      },
      {
        question: 'Do viewing angles matter for gaming monitors?',
        answer:
          'For solo play sitting centered at a normal-size monitor, less so. They matter more for large screens, couch gaming, sharing the screen, and color work, where edges or off-center viewers would see a different image.',
      },
    ],
  },
};
