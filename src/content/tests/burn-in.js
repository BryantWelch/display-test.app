export default {
  slug: 'burn-in',
  order: 260,
  category: 'defects',
  name: 'Burn-in & Image Retention Test',
  shortName: 'Burn-in Test',
  badges: ['New'],
  summary: 'Check OLED and LCD screens for burn-in, test temporary image retention, and run a gentle refresher.',
  seo: {
    title: 'OLED Burn-in Test & Image Retention Fixer — Free Online Check',
    description:
      'Free full-screen burn-in test for OLED, plasma, and LCD screens. Check uniform grays and colors for taskbar or HUD ghosts, time how fast image retention fades, and run a gentle refresher.',
  },
  testSeo: {
    title: 'Burn-in Test — Fullscreen',
    description: 'Uniform test fields, a timed image retention test, and a slow refresher.',
  },
  load: () => import('../../pages/tests/BurnInTest'),
  page: {
    title: 'Burn-in & Image Retention Test',
    intro:
      'Look for ghosts of taskbars, logos, and game HUDs on uniform colors, find out whether a mark is temporary retention or permanent burn-in, and clear short-term retention with a slow refresher.',
    startLabel: 'Start burn-in test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'retention-vs-burn-in',
        heading: 'Image retention vs burn-in',
        blocks: [
          {
            ul: [
              '**Temporary image retention** — a faint ghost of something that was on screen recently. It fades within minutes to hours of normal use. Common on OLED and some IPS LCDs after long static content.',
              '**Burn-in** — permanent, uneven wear. On OLED, pixels that showed bright static elements for hundreds or thousands of hours have aged more than their neighbors, so they’re dimmer. It doesn’t fade.',
            ],
          },
          'The difference matters: retention goes away by itself, burn-in doesn’t. No website, video, or app can restore worn OLED material.',
        ],
      },
      {
        id: 'modes',
        heading: 'The three modes',
        blocks: [
          { h3: 'Check for burn-in' },
          'Full-screen uniform fields: **18% gray**, **50% gray**, **red**, **green**, **blue**, and **cyan**. Dark gray is the most revealing for OLED wear; the primaries show which subpixel color has aged (red and blue OLED subpixels often wear differently). Look for shapes that match what you leave on screen: taskbar, browser tabs, channel logos, news tickers, game HUDs, minimaps.',
          { h3: 'Retention test' },
          'Shows a high-contrast static pattern — a fake taskbar, logo, “LIVE” bug, crosshair, and health bar — for 1 to 10 minutes, then automatically switches to 50% gray. Watch how visible the ghost is and how quickly it fades. Panels that retain strongly after a few minutes are worth babying with dark themes and auto-hide taskbars.',
          { h3: 'Refresher' },
          'A slowly scrolling white bar, an inverted copy of the retention pattern, or a slow full-screen hue cycle, for 5 to 60 minutes with a countdown. Everything moves or changes slowly — there’s no fast flashing. It can help **temporary** retention fade sooner. It does nothing for real burn-in.',
          { note: 'While a timer runs, the page asks for a screen wake lock so the display doesn’t sleep. If your browser doesn’t support it, set your power plan to keep the screen on.' },
        ],
      },
      {
        id: 'real-fix',
        heading: 'What actually fixes it',
        blocks: [
          'OLED TVs and monitors include their own maintenance routines, which do far more than any on-screen pattern can:',
          {
            ul: [
              '**Short compensation cycles** run automatically for a few minutes after the display goes to standby (often after every 4 hours of use). Leave it plugged in and let it go to standby, not off at the wall.',
              '**Pixel refresh / panel refresh** — a long (about an hour) manual cycle in the settings menu. Manufacturers recommend it only occasionally, because it evens out wear by using up a little of the panel’s lifespan.',
              '**Pixel shift / screen move**, **logo luminance**, and **taskbar detection** reduce how much wear builds in the first place.',
            ],
          },
          'If a ghost survives several short compensation cycles in standby, it’s very likely permanent. See the [OLED burn-in guide](/guides/oled-burn-in) for prevention and warranty coverage.',
        ],
      },
      {
        id: 'prevention',
        heading: 'Preventing burn-in',
        blocks: [
          {
            ul: [
              'Auto-hide the taskbar or dock and use a dark wallpaper that changes.',
              'Use a screen saver or let the display turn off after a few minutes idle.',
              'Avoid maximum brightness for desktop work; SDR at 100–200 nits is plenty.',
              'Vary content — the same game HUD or news channel for hours every day is the classic cause.',
              'Don’t disable the panel’s own pixel shift or compensation features.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'Every field is uniform, with no shapes that match on-screen UI.',
        'After the retention test, any ghost fades within a few minutes.',
        'Soft, wide brightness variation that doesn’t match any UI shape (that’s uniformity).',
      ],
      bad: [
        'Sharp outlines of a taskbar, logo, ticker, or HUD on gray or a primary color.',
        'A tinted band or shape visible only on one color (one subpixel color worn).',
        'A retention ghost that’s still clearly visible after an hour of normal use and a standby cycle.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'The panel type most at risk of burn-in. Short-term retention after static content is normal and usually clears after a standby compensation cycle.' },
      { panel: 'IPS / VA LCD', note: 'LCDs don’t burn in the OLED way, but some IPS panels show temporary retention that clears within hours.' },
      { panel: 'Plasma', note: 'Prone to both retention and burn-in. Retention often fades with varied content; the refresher can speed that up.' },
    ],
    whenToReturn: [
      'Any visible burn-in on a new or nearly new display — return it inside the retailer window.',
      'Burn-in on an OLED under warranty: check whether your manufacturer covers it (some monitor brands now include 2–3 years of burn-in coverage).',
      'Retention that appears after only a few minutes of static content and doesn’t fade, on a brand-new panel.',
    ],
    tips: [
      'Run the check after the display has been on for 15+ minutes.',
      'Dim the room and use dark gray first; it shows OLED wear best.',
      'Hide the control panel with H during timed modes so it doesn’t leave its own mark.',
      'Let the TV or monitor go into standby afterwards so its compensation cycle can run.',
    ],
    related: ['uniformity', 'dead-pixel', 'black-level', 'white-screen'],
    affiliates: 'uniformity',
    disclaimer:
      'A visual aid. True burn-in is permanent and can’t be repaired by any on-screen pattern; use your display’s built-in pixel refresh / compensation and follow the manufacturer’s guidance.',
    faqs: [
      {
        question: 'Can burn-in be fixed?',
        answer:
          'Permanent burn-in can’t be reversed by a website or video. The panel’s built-in compensation and pixel refresh cycles can even out some wear, and temporary image retention fades on its own. Beyond that, the fix is a panel replacement under warranty.',
      },
      {
        question: 'Does the refresher actually work?',
        answer:
          'It can help short-term image retention fade sooner by showing changing content. It won’t fix burn-in, because burn-in is physical wear. Your display’s own compensation cycle (run in standby) is more effective for both.',
      },
      {
        question: 'How do I tell burn-in from image retention?',
        answer:
          'Run the check, use the display normally for an hour, let it go to standby for a compensation cycle, then check again. If the ghost is gone or fading, it was retention. If it looks the same, it’s burn-in.',
      },
      {
        question: 'Which color shows burn-in best?',
        answer:
          'Dark or mid gray for overall wear, and solid red, green, blue, or cyan for wear in one subpixel color. Burn-in on OLED often shows as a slightly darker or tinted shape of a taskbar, logo, or HUD.',
      },
      {
        question: 'Is a modern OLED monitor safe for desktop use?',
        answer:
          'Risk is much lower than it used to be, thanks to compensation cycles, pixel shift, and taskbar dimming, but long static desktops at high brightness still wear OLEDs faster. Auto-hide UI, use dark themes, and check warranty burn-in coverage.',
      },
    ],
  },
};
