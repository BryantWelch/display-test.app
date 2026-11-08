export default {
  slug: 'white-screen',
  order: 600,
  category: 'utilities',
  name: 'White Screen',
  shortName: 'White Screen',
  badges: [],
  summary: 'A full-screen white page for cleaning, finding dust, lighting, and checking your display.',
  seo: {
    title: 'White Screen — Full-Screen White Page (with Cleaning Lock) | Free',
    description:
      'Pure white full screen in one click. Spot dust and dead pixels, clean your monitor with touches locked, check uniformity, or use it as a soft light. Free, no download.',
  },
  testSeo: {
    title: 'White Screen — Fullscreen',
    description: 'Pure white full screen with color options and a cleaning lock.',
  },
  load: () => import('../../pages/tests/SolidScreenTest'),
  page: {
    title: 'White Screen',
    intro:
      'A pure white (#FFFFFF) full screen with nothing else on it. Use it to find dust and smudges before you clean, lock the screen while you wipe it, check for dark spots or dead pixels, or turn your display into a soft light.',
    startLabel: 'Open white screen',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'uses',
        heading: 'What a white screen is good for',
        blocks: [
          {
            ul: [
              '**Finding dust and smudges.** A bright, even background makes fingerprints, streaks, and dust specks stand out, so you know where to wipe.',
              '**Cleaning.** Turn on the **cleaning lock** before you wipe: taps, clicks, and keys are ignored, so a touchscreen or a stray key press won’t open something mid-wipe.',
              '**Dead pixel checks.** A dead pixel shows as a sharp black dot on white; a dead subpixel shows as a tiny colored dot (for example magenta when green is missing). For a full check of all colors, use the [dead pixel test](/dead-pixel).',
              '**Uniformity at a glance.** Dim corners, a yellow or pink tint on one side, or a darker band are easier to see on white. Mid and dark grays show clouding and the dirty screen effect better — the [uniformity test](/uniformity) has them.',
              '**A light source.** On a laptop or spare monitor, white makes a quick fill light for video calls, a ring-light substitute, or a light box for tracing. Pick **warm white** for a softer, less blue light.',
            ],
          },
        ],
      },
      {
        id: 'clean',
        heading: 'How to clean your screen with the cleaning lock',
        blocks: [
          {
            ol: [
              'Open the white screen and look at it from an angle — dust and streaks show up best with light glancing across the surface.',
              'Click **Lock screen for cleaning** (or press **L**). The controls disappear and input is ignored.',
              'Wipe gently with a dry microfiber cloth, in one direction. For greasy marks, lightly dampen the cloth with distilled water — never spray liquid onto the screen. For a wetter clean, turn the display off first.',
              'Hold **Esc** for 2 seconds to unlock. On a touchscreen, press and hold any corner for 3 seconds.',
              'Check again on white, then pick **Black** in the controls (or open the [black screen](/black-screen)) — some smudges only show on dark backgrounds.',
            ],
          },
          {
            warning:
              'Avoid paper towels, window cleaner, alcohol, and ammonia on matte or anti-glare coatings — they can strip the coating and leave permanent cloudy patches. Check your manufacturer’s cleaning guidance first.',
          },
        ],
      },
      {
        id: 'light',
        heading: 'Using the screen as a light',
        blocks: [
          'A typical LCD monitor at full brightness puts out around 250–400 nits, enough for a soft fill light at arm’s length on a video call. OLEDs are dimmer on a full white screen because automatic brightness limiting (ABL) caps full-screen brightness. For tracing, lay thin paper over a tablet held flat, press lightly, and turn on the cleaning lock so your hand doesn’t tap anything.',
          {
            ul: [
              'Use **warm white** for a less clinical, less blue light, or pick a custom tint.',
              'Raise the display’s own brightness setting for more light — the **signal level** slider only dims the color in software.',
              '**Keep screen awake** is on by default here, so the display doesn’t go to sleep while you’re using it as a light.',
              'In a dark room, a full white screen is harsh. Lower the level or the monitor brightness rather than staring into it.',
            ],
          },
        ],
      },
      {
        id: 'colors',
        heading: 'Other colors',
        blocks: [
          'The same page can show black, red, green, blue, 50% gray, warm white, or any custom hex color. Use the left and right arrow keys (or Space) to step through them; up and down change the level. Solid **red**, **green**, and **blue** are useful for finding stuck subpixels; **50% gray** shows uneven backlighting and the dirty screen effect better than white.',
        ],
      },
    ],
    lookFor: {
      good: [
        'An even white from corner to corner, with only a slight falloff at the very edges.',
        'Specks that move or disappear when you wipe — that’s dust, not the panel.',
        'A slight color shift when you look from an angle (normal for IPS and VA).',
        'OLED: full white looks dimmer than small white areas — that’s brightness limiting (ABL), not a fault.',
      ],
      bad: [
        'A sharp black dot that stays put after cleaning (possible dead pixel — confirm with the [dead pixel test](/dead-pixel)).',
        'Large darker patches, a yellow or pink corner, or bands — check with the [uniformity test](/uniformity).',
        'Cloudy or rainbow patches that don’t wipe away — possible coating damage or pressure marks.',
      ],
    },
    tips: [
      'Wipe with a dry microfiber cloth; turn the display off before using any moisture.',
      'Look across the screen at an angle to see dust and streaks.',
      'Use the cleaning lock on touchscreens and laptops so wiping doesn’t click anything.',
      'Lower the level in a dark room — full white at night is harsh.',
    ],
    related: ['black-screen', 'dead-pixel', 'uniformity', 'brightness'],
    affiliates: 'deadPixel',
    faqs: [
      {
        question: 'How do I make my screen completely white?',
        answer:
          'Click **Open white screen**. The page goes fullscreen and shows pure white (#FFFFFF). Move the mouse or tap to bring back the controls; press Esc or use **Exit test** to leave.',
      },
      {
        question: 'How do I clean my screen without clicking things?',
        answer:
          'Open the white or black screen and click **Lock screen for cleaning**. Clicks, taps, and key presses are then ignored. Hold Esc for 2 seconds, or press and hold a screen corner for 3 seconds, to unlock. If you have something to wipe off with moisture, turning the display off is still the safest option.',
      },
      {
        question: 'Can I use a white screen as a light for video calls?',
        answer:
          'Yes. A second monitor or laptop showing white works as a soft fill light. Use **warm white** for a more flattering tone and turn up the monitor’s own brightness. It won’t match a real ring light, but it noticeably brightens your face in a dark room.',
      },
      {
        question: 'Will a white screen fix stuck pixels or screen burn-in?',
        answer:
          'Not on its own. A static white screen doesn’t revive stuck pixels — that needs rapidly changing colors over the spot (see the [dead pixel test](/dead-pixel) page for options). On OLEDs, the TV or monitor’s built-in pixel refresh is the right tool for temporary image retention.',
      },
      {
        question: 'Is it bad to leave a white screen on for a long time?',
        answer:
          'On LCD monitors it’s harmless, though it uses more power than a dark image. On OLED, a full white screen at high brightness for hours causes extra wear and heat, so avoid leaving it on unattended.',
      },
    ],
  },
};
