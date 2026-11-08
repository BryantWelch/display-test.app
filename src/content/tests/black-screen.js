export default {
  slug: 'black-screen',
  order: 605,
  category: 'utilities',
  name: 'Black Screen',
  shortName: 'Black Screen',
  badges: [],
  summary: 'A full-screen black page for cleaning, checking backlight bleed and hot pixels, or blacking out the screen.',
  seo: {
    title: 'Black Screen — Full-Screen Black Page (with Cleaning Lock) | Free',
    description:
      'Pure black full screen in one click. Black out an OLED, clean your monitor with touches locked, check backlight bleed and IPS glow, or find hot pixels. Free, no download.',
  },
  testSeo: {
    title: 'Black Screen — Fullscreen',
    description: 'Pure black full screen with color options and a cleaning lock.',
  },
  load: () => import('../../pages/tests/SolidScreenTest'),
  page: {
    title: 'Black Screen',
    intro:
      'A pure black (#000000) full screen; the cursor and controls hide after a few seconds. On an OLED it looks like the display is off; on an LCD it shows how dark your panel really gets. Use it to black out a screen, clean it, or check for backlight bleed and hot pixels.',
    startLabel: 'Open black screen',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'uses',
        heading: 'What a black screen is good for',
        blocks: [
          {
            ul: [
              '**OLED “off” look.** OLED pixels switch off completely on black, so the panel looks powered down while the computer keeps running — handy for a downloading game, a second screen you don’t need, or a dark room.',
              '**Cleaning.** Black shows streaks, lint, and wipe marks that hide on white. Turn on the **cleaning lock** so wiping doesn’t click or type anything.',
              '**Backlight bleed and IPS glow.** In a dark room, LCD backlight leaks show up as bright patches at the edges and corners, and IPS panels add a glow that shifts with viewing angle. Black makes both obvious. See the [uniformity test](/uniformity) for a more careful check.',
              '**Hot and stuck pixels.** A pixel that’s always lit shows up as a bright dot on black. Dead (always-off) pixels are invisible on black — use the [white screen](/white-screen) for those.',
              '**Reducing light.** A black screen is the quickest way to stop a monitor lighting up a bedroom without changing inputs or settings.',
            ],
          },
        ],
      },
      {
        id: 'bleed',
        heading: 'Checking backlight bleed and glow',
        blocks: [
          {
            ol: [
              'Turn off the room lights and let your eyes adjust for a minute.',
              'Set the monitor to the brightness you normally use — testing at 100% makes every LCD look bad.',
              'Open the black screen and sit at your normal viewing distance, straight on.',
              'Look for bright patches along the edges or corners. Then move your head: **glow** changes with viewing angle; **bleed** stays in place.',
            ],
          },
          'Some edge glow is normal on IPS panels; VA panels have far less glow but can still show edge bleed. Bleed that’s visible at your usual brightness, in normal content, is worth raising with the retailer while you can still return the monitor.',
          {
            table: {
              head: ['Panel', 'What black looks like'],
              rows: [
                [
                  '**OLED / QD-OLED**',
                  'Truly black in a dark room — pixels are off. QD-OLED can look dark gray in a lit room because the panel reflects room light; that isn’t glow.',
                ],
                ['**IPS**', 'Dark gray with glow in the corners when viewed off-center. Normal within limits.'],
                ['**VA**', 'Deepest LCD black; little glow, occasional edge bleed.'],
                ['**Mini-LED**', 'Near-black with local dimming on; check bleed with local dimming off.'],
              ],
            },
          },
        ],
      },
      {
        id: 'clean',
        heading: 'Cleaning with the screen locked',
        blocks: [
          {
            ol: [
              'Open the black screen and click **Lock screen for cleaning** (or press **L**).',
              'Wipe gently with a dry microfiber cloth. Use a cloth barely dampened with distilled water for stubborn marks — never spray the screen. For a wetter clean, turn the display off first.',
              'Hold **Esc** for 2 seconds, or press and hold a corner for 3 seconds on a touchscreen, to unlock.',
              'Check under a lamp at an angle; black shows remaining streaks clearly. Then pick **White** in the controls (or open the [white screen](/white-screen)) to find dust.',
            ],
          },
        ],
      },
      {
        id: 'hot-pixels',
        heading: 'Finding hot pixels',
        blocks: [
          'A hot pixel is a pixel that’s always on. On black it appears as a tiny white or colored dot that doesn’t move when you move your head. Wipe the screen first — dust catches light and can look identical. To confirm and classify a defect across every color, run the [dead pixel test](/dead-pixel).',
        ],
      },
    ],
    lookFor: {
      good: [
        'OLED: the screen looks fully off.',
        'LCD: an even, very dark gray with mild glow in the corners that changes with your viewing angle.',
        'Specks that disappear after wiping — dust or lint.',
      ],
      bad: [
        'A bright dot that stays put on black (hot or stuck pixel).',
        'Bright, fixed patches or streaks along the edges at normal brightness (backlight bleed).',
        'Any glow at all on an OLED showing pure black — check HDR and black-level settings.',
      ],
    },
    tips: [
      'Test bleed in a dark room, at your normal brightness, from your usual seat.',
      'Turn off local dimming to see raw backlight bleed on Mini-LED.',
      'Use the cleaning lock so wiping doesn’t click or type anything.',
      'Phone cameras exaggerate bleed — judge with your eyes.',
    ],
    related: ['white-screen', 'uniformity', 'dead-pixel', 'brightness'],
    affiliates: 'uniformity',
    faqs: [
      {
        question: 'How do I make my screen completely black?',
        answer:
          'Click **Open black screen**. The page goes fullscreen, shows pure black, and hides the cursor and controls after a few seconds. On an OLED the panel looks switched off. Move the mouse to bring the controls back; press Esc to leave.',
      },
      {
        question: 'Does a black screen save power or protect an OLED?',
        answer:
          'On OLED, yes: black pixels are off, so power use and wear drop to almost nothing. On an LCD the backlight stays on, so savings are small — turning the monitor off or letting it sleep saves more.',
      },
      {
        question: 'Why does my black screen look gray or glow in the corners?',
        answer:
          'LCD panels block a backlight that’s always on, so some light leaks through. Corner glow that changes with viewing angle is IPS glow and is normal; fixed bright patches are backlight bleed. Lowering brightness reduces both.',
      },
      {
        question: 'How do I unlock the cleaning lock?',
        answer:
          'Hold **Esc** for 2 seconds. On a touchscreen, press and hold any corner of the screen for 3 seconds. Quick taps and key presses are ignored so they don’t unlock it by accident.',
      },
      {
        question: 'Can I leave a black screen on overnight?',
        answer:
          'Yes. It’s safe on both LCD and OLED. **Keep screen awake** is off by default on the black screen, so your OS can still sleep the display on its own schedule, which saves more power on an LCD. Turn it on if you need the screen to stay on. On an OLED, a black screen is gentler than any static image.',
      },
    ],
  },
};
