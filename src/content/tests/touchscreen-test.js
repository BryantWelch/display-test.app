export default {
  slug: 'touchscreen-test',
  order: 620,
  category: 'utilities',
  name: 'Touchscreen Test',
  shortName: 'Touchscreen',
  badges: [],
  summary: 'Check multi-touch, dead zones, and ghost touches on any touchscreen.',
  seo: {
    title: 'Touchscreen Test — Multi-Touch, Dead Zones & Ghost Touch Checker',
    description:
      'Free online touchscreen test for phones, tablets, and touch monitors. Count simultaneous touches, paint coverage to find dead zones, and spot ghost touches.',
  },
  testSeo: {
    title: 'Touchscreen Test — Fullscreen',
    description: 'Draw with every finger, count touches, and find dead zones.',
  },
  load: () => import('../../pages/tests/TouchscreenTest'),
  page: {
    title: 'Touchscreen Test',
    intro:
      'Find out whether every part of your touchscreen responds, how many fingers it tracks at once, and whether it registers touches you didn’t make. Works on phones, tablets, 2-in-1 laptops, and touch monitors — in the browser, nothing to install.',
    startLabel: 'Start touchscreen test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'modes',
        heading: 'Three ways to test',
        blocks: [
          {
            ul: [
              '**Draw** — every contact gets a numbered, colored circle with crosshairs and leaves a trail. The counter shows how many touches are active and the most seen at once.',
              '**Coverage** — the screen is divided into small cells that turn green as you drag over them. Paint the whole screen; anything left dark is a **dead zone**.',
              '**Tap grid** — tap each cell of a grid once. Cells turn green when they register. Good for a quick, systematic pass, especially near edges and corners.',
            ],
          },
          'Use the browser’s fullscreen mode so the edges of the panel are part of the test area, and tap **Hide controls** before painting so the control panel doesn’t cover part of the screen (**Show controls** brings it back). On phones, system gestures at the very edges (back, home) may still be handled by the OS first.',
        ],
      },
      {
        id: 'dead-zones',
        heading: 'Finding dead zones',
        blocks: [
          'A dead zone is an area where the digitizer doesn’t detect touch. It’s usually a strip along one axis (a failed sensor line) or a patch where the screen was pressed or cracked.',
          {
            ol: [
              'Choose **Coverage** and a fine or medium cell size, then tap **Hide controls**.',
              'Drag one finger slowly in horizontal rows across the whole screen, then in vertical columns.',
              'Look for cells that stay dark, or lines in **Draw** mode that break at the same spot every time.',
              'Retry the area slowly. If it never registers, it’s a hardware fault, not a missed swipe.',
            ],
          },
          {
            note: 'A fast swipe can skip cells. The test only fills small gaps between touch events, so real dead strips stay visible — slow down and repaint before deciding.',
          },
        ],
      },
      {
        id: 'ghost-touches',
        heading: 'Ghost touches and palm rejection',
        blocks: [
          '**Ghost touches** are touches the screen reports when nobody is touching it. Open **Draw** mode and leave the device flat without touching it for a minute. Any new trails, or the active counter going above zero, are ghost touches.',
          'Common causes:',
          {
            ul: [
              'A dirty or wet screen, or a screen protector with an air bubble or edge lifting.',
              'A charger with poor grounding — test again on battery to compare.',
              'A damaged digitizer, or a case pressing on the edge of the display.',
            ],
          },
          '**Palm rejection** is handled by the OS and app, not the browser. Resting your palm here will usually show up as a touch — that’s expected. To test it, use a drawing app with a stylus and rest your hand as you normally would.',
        ],
      },
      {
        id: 'multi-touch',
        heading: 'How many touches can it detect?',
        blocks: [
          'Place fingers on the screen one at a time and watch **Max simultaneous**. Most Android phones and tablets track 10 points, and iPhones track 5 — a sixth finger drops the touches already down. Older iPads track 11; recent ones track more, around 17. Touch laptops and monitors usually track 10, older or cheaper panels 2–5. Apple doesn’t publish these limits. **Device reports** shows the number the browser exposes, which is only a hint: some browsers report a fixed or capped value, so trust what you actually measure.',
          {
            table: {
              head: ['Device type', 'Typical touch points'],
              rows: [
                ['Android phones and tablets', '10 (some budget models 5)'],
                ['iPhone', '5'],
                ['iPad', '11 on older models; recent models around 17'],
                ['Windows 2-in-1s and touch laptops', '10'],
                ['Portable / desktop touch monitors', '10 (some budget models 2–5)'],
                ['Large interactive displays', '20–40'],
              ],
            },
          },
          'If fewer touches register than expected, check that you’re touching with flat fingertips, not nails, and that your fingers aren’t too close together — touches closer than about 1 cm can merge into one.',
        ],
      },
      {
        id: 'calibrate',
        heading: 'Calibrating and fixing touch',
        blocks: [
          { h3: 'Windows' },
          {
            ol: [
              'Open **Control Panel → Hardware and Sound → Tablet PC Settings** and choose **Calibrate…** (shown only when a touch or pen display is connected).',
              'With more than one monitor, use **Setup** on the same screen to tell Windows which display is the touchscreen — wrong mapping makes touches land on the other monitor.',
              'If touch stops working entirely, open **Device Manager → Human Interface Devices**, disable and re-enable **HID-compliant touch screen**, and check for a firmware or driver update from the manufacturer.',
            ],
          },
          { h3: 'Android' },
          {
            ul: [
              'Android doesn’t have a general touch calibration — touch accuracy is set in firmware. Restart the phone, remove the screen protector, and retest.',
              'Some phones have **Touch sensitivity** (for screen protectors) under **Settings → Display**. Turn it on if you use a thick protector.',
              'Many phones include a hardware test menu (for example, Samsung’s **Samsung Members → Diagnostics**). Third-party “calibration” apps can’t change the digitizer.',
            ],
          },
          { h3: 'iPhone and iPad' },
          'There’s no calibration setting. Restart, remove the case and protector, and contact Apple if a dead zone remains.',
        ],
      },
    ],
    lookFor: {
      good: [
        'One circle per finger that follows smoothly, with no lag spikes or jumps.',
        'Max simultaneous matches the device (often 10; 5 on iPhone; past 11 on a recent iPad).',
        'Coverage and tap grid turn fully green, including edges and corners.',
        'Nothing appears while the screen isn’t being touched.',
      ],
      bad: [
        'Cells that stay dark, or lines that break at the same spot (dead zone).',
        'Trails or circles appearing on their own (ghost touches).',
        'Touches registering offset from your finger (calibration or wrong-display mapping on Windows).',
        'Fewer simultaneous touches than the spec.',
      ],
    },
    tips: [
      'Clean and dry the screen first — moisture causes false touches.',
      'Remove loose screen protectors or cases that press on the edges.',
      'Go fullscreen so the edges are testable.',
      'Test again unplugged from the charger if you see ghost touches.',
    ],
    related: ['dead-pixel', 'screen-resolution', 'white-screen', 'refresh-rate'],
    faqs: [
      {
        question: 'How do I test if my touchscreen is working?',
        answer:
          'Open the test and touch the screen. A colored circle should follow each finger. Then switch to **Coverage** and drag across the whole screen: if every cell turns green, every area is responding.',
      },
      {
        question: 'What causes ghost touches?',
        answer:
          'Moisture or dirt on the screen, a faulty or poorly grounded charger, a lifting screen protector, pressure from a case, or a damaged digitizer. Clean the screen, remove accessories, and test on battery to narrow it down. If ghost touches continue, it’s likely hardware.',
      },
      {
        question: 'Can a dead zone on a touchscreen be fixed?',
        answer:
          'Software issues (a stuck driver, wrong calibration) can be fixed by restarting, recalibrating on Windows, or updating firmware. A dead strip that never responds is usually a damaged digitizer or flex cable and needs repair or a screen replacement.',
      },
      {
        question: 'How many fingers does my screen support?',
        answer:
          'Put fingers down one at a time and watch **Max simultaneous** — that is what your screen actually tracked. **Device reports** shows the number of touch points the browser exposes; it is often right, but some browsers report a fixed or capped value.',
      },
      {
        question: 'Does this work with a stylus or mouse?',
        answer:
          'Yes. Pens and mice are tracked too (the mouse only while the button is held). **Last contact** shows the input type, pressure (for pens that report it), and contact size.',
      },
    ],
  },
};
