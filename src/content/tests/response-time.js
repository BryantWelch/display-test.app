export default {
  slug: 'response-time',
  order: 410,
  category: 'motion',
  name: 'Motion Blur & Ghosting Test',
  shortName: 'Ghosting',
  badges: ['Popular'],
  summary: 'Frame-locked moving objects to judge ghosting, overshoot, and motion blur at your real refresh rate.',
  seo: {
    title: 'Monitor Ghosting & Motion Blur Test (Response Time) | Free UFO Test',
    description:
      'Free online ghosting test: frame-locked moving UFOs at full, ½ and ¼ frame rate to spot motion blur, smearing, and overdrive overshoot. Set your monitor’s overdrive by eye — no download.',
  },
  testSeo: {
    title: 'Motion Blur & Ghosting Test — Fullscreen',
    description: 'Frame-locked moving objects for judging ghosting, overshoot, and motion blur.',
  },
  load: () => import('../../pages/tests/ResponseTimeTest'),
  checkup: { step: 80, question: 'Is motion acceptably clear, without strong trails or bright halos?' },
  page: {
    title: 'Motion Blur & Ghosting Test',
    intro:
      'Moving objects locked to your monitor’s real refresh rate, so you can see ghosting trails, overdrive halos, and motion blur — and pick the overdrive setting that looks cleanest.',
    startLabel: 'Start ghosting test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How this ghosting test works',
        blocks: [
          'The test measures your refresh rate, then moves each object an exact whole number of pixels on every frame. That keeps motion perfectly even, so any smear or halo you see comes from the display, not from the animation.',
          {
            ul: [
              '**Full-rate lane** — updates every refresh. This is the sharpest your monitor can show motion at this speed.',
              '**½ and ¼ rate lanes** — the same speed, but updating every 2nd or 4th refresh. They show how motion looks when a game runs below your refresh rate: more blur and visible stutter.',
              '**Speed** is set in pixels per frame, or in pixels per second converted using your measured refresh rate. Use the arrow keys to change it and **Space** to pause.',
            ],
          },
          'Our older test used CSS animation timed in seconds. Its speed couldn’t line up with your refresh rate, so motion was slightly uneven. This version is frame-locked, the same approach used by Blur Busters’ TestUFO.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run it',
        blocks: [
          {
            ol: [
              'Set the monitor to its highest refresh rate (check with the [refresh rate test](/refresh-rate)) and turn off backlight strobing / “motion blur reduction” for a first look.',
              'Click **Start ghosting test**. Follow the UFO in the full-rate lane with your eyes. Don’t stare at a fixed point.',
              'Look **behind** the object for a trail (ghosting or smearing), and around its edges for a bright or dark outline (overshoot).',
              'Change your monitor’s overdrive setting (often called Response Time, Trace Free, OD, or AMA) and compare. Pick the setting with the shortest trail and **no** bright halo.',
              'Repeat on the **black** background to check dark transitions, which are the slowest on VA panels, and on **gray** to judge overshoot.',
            ],
          },
          'A dropped-frame strip at the top marks any frame the browser delivered late. If it shows red often, close other apps or tabs before judging motion. Stutter from dropped frames isn’t the panel’s fault.',
        ],
      },
      {
        id: 'blur-vs-ghosting',
        heading: 'Motion blur, ghosting, and overshoot',
        blocks: [
          { h3: 'Sample-and-hold blur' },
          'Almost every LCD and OLED holds each frame on screen for the whole refresh. Your eyes move smoothly while the image jumps in steps, so the picture smears across your retina. This blur depends on **how long each frame stays on screen**, not on pixel speed. At 60 Hz each frame is held for 16.7 ms; at 240 Hz it’s 4.2 ms. That’s why higher refresh rates look clearer even on an instant-response OLED.',
          { h3: 'Ghosting (slow pixel transitions)' },
          'If pixels can’t finish changing color within one refresh, a faint copy of the object trails behind it. On VA panels this often looks like dark, smoky **black smearing** when bright objects move over dark backgrounds.',
          { h3: 'Overshoot (inverse ghosting)' },
          'Overdrive speeds up transitions by briefly driving pixels past their target. Too much overdrive leaves a **bright or colored halo** — often the opposite color of the normal trail. It looks worse than mild ghosting, so the “Extreme” or “Fastest” setting is rarely the best choice. Overshoot often gets worse at lower refresh rates, so check it at the frame rates you actually play at.',
        ],
      },
      {
        id: 'mprt-gtg',
        heading: 'GtG vs MPRT: what the “1 ms” spec means',
        blocks: [
          {
            table: {
              head: ['Spec', 'What it measures', 'What it tells you'],
              rows: [
                ['**GtG** (gray-to-gray)', 'Time for a pixel to move between two gray levels, usually 10%–90% of the change', 'How much ghosting / smearing to expect. Marketing figures are often a best case at maximum overdrive.'],
                ['**MPRT** (moving picture response time)', 'How long each frame stays visible', 'Sample-and-hold blur. Without strobing, MPRT can’t be shorter than the frame time (6.9 ms at 144 Hz).'],
              ],
            },
          },
          'A “1 ms MPRT” claim almost always means backlight strobing is on. A “1 ms GtG” claim usually means the fastest overdrive mode, which often overshoots.',
          {
            note:
              '**A browser can’t measure response time in milliseconds.** Accurate GtG and overshoot numbers need a photodiode and oscilloscope (or a tool like OSLTT), and MPRT needs a pursuit camera. This test lets you **compare** settings and panels by eye. It does not produce a number.',
          },
        ],
      },
      {
        id: 'strobing-vrr',
        heading: 'Strobing, BFI, VRR, and pursuit-camera photos',
        blocks: [
          { h3: 'Backlight strobing and black frame insertion' },
          'Strobing modes (ULMB, DyAc, ELMB, “Aim Stabilizer”, “MBR”) and OLED black frame insertion flash each frame briefly instead of holding it. That cuts sample-and-hold blur a lot. In exchange you get lower brightness, possible flicker, and sometimes a double-image “strobe crosstalk” in parts of the screen. Strobing works best when the frame rate matches the refresh rate, so try the full-rate lane.',
          { h3: 'Variable refresh rate (G-SYNC / FreeSync)' },
          'VRR matches the refresh to the game’s frame rate to avoid tearing and stutter. It doesn’t remove blur. Browsers render at the fixed desktop refresh rate, so VRR normally isn’t active during this test. Many monitors tune overdrive for maximum refresh, so overshoot can increase at lower in-game frame rates under VRR.',
          { h3: 'Taking a pursuit-camera photo with a phone' },
          {
            ol: [
              'Turn on the **pursuit camera sync track** and choose a moderate speed (8–16 px/frame).',
              'Set your phone camera to a slower shutter if possible (1/30 s or longer), or record video.',
              'Slide the phone sideways along the screen at the same speed as the UFO, keeping it pointed at the object. A smooth rail or the edge of the desk helps.',
              'Check the sync track in the photo. When the camera matched the speed, its two rows of blocks line up into a neat **ladder**. If the blocks look staggered or smeared, your tracking speed was off — take another shot.',
            ],
          },
          'Photos in sync show the motion blur and ghosting your eye sees, which makes it easy to compare overdrive modes side by side. This is a simplified version of the Blur Busters pursuit-camera method that reviewers use.',
        ],
      },
    ],
    lookFor: {
      good: [
        'The full-rate UFO looks fairly crisp when you follow it; you can make out its shape and lights.',
        'A short, faint trail at high speeds — normal sample-and-hold blur.',
        'The ½ and ¼ rate lanes look blurrier and stuttery — expected, since they update less often.',
        'Little difference between gray and black backgrounds.',
      ],
      bad: [
        'A long dark or smoky trail behind the object, especially on black (slow transitions / VA smearing).',
        'A bright, white, or colored outline around the object (overdrive overshoot — lower the overdrive setting).',
        'Several distinct copies of the object with strobing on (strobe crosstalk).',
        'Frequent red marks in the dropped-frame strip — the browser is stuttering, so fix that before judging.',
      ],
    },
    panelNotes: [
      { panel: 'IPS', note: 'Usually quick and even. A mid overdrive setting is typically cleanest; the highest setting often adds a bright halo.' },
      { panel: 'VA', note: 'Dark-to-gray transitions are slow, so dark smearing on black backgrounds is common and normal for the panel type. Overdrive helps but can overshoot on lighter shades.' },
      { panel: 'TN', note: 'Fast transitions with little ghosting; color and viewing angles are the weak spots, not motion.' },
      { panel: 'OLED / QD-OLED', note: 'Pixel transitions are near-instant, so there is basically no ghosting or overshoot. Remaining blur is sample-and-hold, which only shrinks with higher refresh rates or black frame insertion.' },
      { panel: 'Mini-LED', note: 'Motion depends on the underlying LCD (often VA or IPS). Local dimming zones can lag behind fast objects and leave a faint glowing “halo” trail on dark backgrounds — that’s the backlight, not the pixels.' },
    ],
    whenToReturn: [
      'Heavy trails or overshoot on **every** overdrive setting at your normal refresh rate — the panel is slow, not mistuned.',
      'Overshoot you can’t remove without unacceptable smearing, particularly if a review of the same model shows a clean mode.',
      'Strong strobe crosstalk across the middle of the screen in strobing mode, if strobing was the reason you bought it.',
      'Black smearing on a VA panel is a trait of the technology. Return it if it bothers you during the return window, but a warranty claim usually won’t cover it.',
    ],
    tips: [
      'Confirm the monitor is running at its full refresh rate with the [refresh rate test](/refresh-rate).',
      'Close other heavy tabs and apps so the browser doesn’t drop frames.',
      'Sit at your normal distance and track the object with your eyes. Don’t stare at a fixed point.',
      'Change only the overdrive setting between runs so you know what made the difference.',
    ],
    related: ['refresh-rate', 'frame-skipping', 'mouse-polling-rate', 'test-patterns'],
    affiliates: 'responseTime',
    disclaimer:
      'A visual comparison aid. It cannot measure pixel response time or input lag in milliseconds — those need dedicated instruments.',
    faqs: [
      {
        question: 'Can a website measure my monitor’s response time in ms?',
        answer:
          'No. A browser only knows when it hands a frame to the GPU, not when the pixels physically change. Real response-time numbers come from a light sensor and oscilloscope (or tools like OSLTT). This test shows the result visually so you can compare overdrive settings and monitors by eye.',
      },
      {
        question: 'What is the best overdrive setting?',
        answer:
          'The highest setting that doesn’t produce a bright halo (overshoot) around the moving object. On many monitors that is the middle option. Check on both gray and black backgrounds, and at the frame rates you actually play at.',
      },
      {
        question: 'Why does my OLED still look blurry in motion?',
        answer:
          'OLED pixels switch almost instantly, but each frame is still held for the full refresh period, and your eye smears it as it tracks. That sample-and-hold blur only shrinks with a higher refresh rate (and frame rate) or black frame insertion.',
      },
      {
        question: 'What is the difference between ghosting and motion blur?',
        answer:
          'Ghosting is a trailing copy of the object caused by pixels that change too slowly. Motion blur is mostly caused by sample-and-hold: each frame is held still while your eye moves. A monitor can have zero ghosting and still show motion blur.',
      },
      {
        question: 'Why do the ½ and ¼ rate lanes look worse?',
        answer:
          'They move at the same speed but update less often, so each image is held longer and jumps further between updates. That’s what a game running at 72 fps looks like on a 144 Hz monitor. It shows why a higher frame rate matters as much as a higher refresh rate.',
      },
      {
        question: 'Does this test show input lag?',
        answer:
          'No. Input lag (the delay from a click to a change on screen) can’t be measured from inside a browser. See the [mouse polling rate test](/mouse-polling-rate) for why, and how reviewers measure it.',
      },
    ],
  },
};
