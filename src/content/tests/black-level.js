export default {
  slug: 'black-level',
  order: 320,
  category: 'color',
  name: 'Black Level Test',
  shortName: 'Black Level',
  badges: ['New'],
  summary: 'Near-black patches and PLUGE bars to catch crushed or washed-out blacks and HDMI range mismatches.',
  seo: {
    title: 'Black Level Test — Check Black Crush & HDMI RGB Range | Free',
    description:
      'Free full-screen black level (PLUGE) test. See whether near-black shadow detail is crushed or washed out, and fix HDMI full vs limited RGB range mismatches on PC, console, and TV.',
  },
  testSeo: {
    title: 'Black Level Test — Fullscreen',
    description: 'Near-black patches 1–40 on pure black, PLUGE bars, and a step ramp.',
  },
  load: () => import('../../pages/tests/BlackLevelTest'),
  checkup: { step: 50, question: 'Can you see at least levels 3-5 above black, without the black background looking gray?' },
  page: {
    title: 'Black Level & Black Crush Test',
    intro:
      'Check that the darkest shades your display can show are actually visible — not swallowed into black (crush) and not lifted into gray (washout). Most problems come from one setting: the RGB range.',
    startLabel: 'Start black level test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-it-shows',
        heading: 'What this test shows',
        blocks: [
          'The test fills the screen with pure black (code value 0 of 255) and places patches at 1, 2, 3 … up to 20 or 40 on top of it. Below them are PLUGE-style reference bars and a one-step ramp.',
          {
            ul: [
              '**Crushed blacks** — the first several patches are invisible. Shadow detail in games and films disappears into a black blob.',
              '**Washed-out blacks** — every patch is visible, but the “black” background itself looks dark gray. Images look flat and foggy.',
              '**Correct** — the background is as dark as the panel can go, patch 1 or 2 is very hard to see, and by about 3–5 you can clearly pick patches out.',
            ],
          },
          'Some panels can’t separate 1 and 2 from 0 even when everything is set correctly. That’s fine — what matters is that the ramp climbs steadily and the background isn’t gray.',
        ],
      },
      {
        id: 'rgb-range',
        heading: 'HDMI full vs limited RGB range',
        blocks: [
          'PCs normally use **full range** RGB, where black is 0 and white is 255. TVs and video use **limited range** (also called “video levels” or 16–235), where black is 16 and white is 235. When the source and the display disagree, you get one of two symptoms:',
          {
            table: {
              head: ['Source sends', 'Display expects', 'Result'],
              rows: [
                ['Limited (16–235)', 'Full (0–255)', 'Washed-out: black shows as dark gray, white is dull. All patches visible.'],
                ['Full (0–255)', 'Limited (16–235)', 'Crushed: everything at or below 16 becomes black, highlights above 235 clip.'],
                ['Full', 'Full', 'Correct (typical PC monitor).'],
                ['Limited', 'Limited', 'Correct (typical TV / console setup).'],
              ],
            },
          },
          'The **background 16** option simulates video black. With it, the PLUGE bar at 12 is “below black”: on a correctly set limited-range TV it disappears into the background; if you can see it, the chain is passing full-range values. In full-range PC RGB nothing exists below 0, so the 0-background bars only go upward.',
          { note: 'Whichever range you choose, set **both ends** to match. Changing only one side is how the mismatch happens in the first place.' },
        ],
      },
      {
        id: 'fix',
        heading: 'How to fix it',
        blocks: [
          { h3: 'Windows PC' },
          {
            ul: [
              '**NVIDIA:** NVIDIA Control Panel → Display → Change resolution → “Use NVIDIA color settings” → Output dynamic range: **Full**. Older drivers default to Limited on HDMI when a TV-style resolution (like 1080p/4K at 60 Hz) is used.',
              '**AMD:** AMD Software → Settings → Display → Pixel Format: **RGB 4:4:4 Full RGB**. “RGB 4:4:4 Limited RGB” or YCbCr modes can wash blacks out.',
              '**Intel:** Intel Graphics Command Center → Display → Color → Quantization Range: **Full**.',
              'Then set the monitor’s own option (“HDMI black level”, “RGB range”, “Black level”) to **Full / High / Normal** to match. DisplayPort connections are almost always full range already.',
            ],
          },
          { h3: 'Consoles' },
          {
            ul: [
              '**PlayStation 5:** Settings → Screen and Video → Video Output → RGB Range: Automatic usually works; force **Full** for a PC monitor, **Limited** if the TV clips.',
              '**Xbox Series X|S:** Settings → General → TV & display options → Video fidelity → Color space: **Standard (recommended)** for TVs; PC RGB only if the display is set to full range too.',
              '**Nintendo Switch:** System Settings → TV Output → RGB Range: Automatic, or match the display manually.',
            ],
          },
          { h3: 'TVs' },
          'Look for **HDMI Black Level** (Samsung: Low / Normal), **Black Level** (LG: Low / High), or **RGB Range** (Sony: Auto / Full / Limited). The names are confusing — “Low” often means limited, “High/Normal” often means full. Use this test to check rather than trusting the label.',
        ],
      },
      {
        id: 'panel-behavior',
        heading: 'OLED near-black and VA black smearing',
        blocks: [
          'Even with the range correct, panel types handle near-black differently:',
          {
            ul: [
              '**OLED** turns pixels fully off at 0, so true black is perfect. The steps just above black are hard to drive precisely: you may see patches 1–2 vanish, slight banding, or faint blotches (near-black uniformity, sometimes called “mura”). Some TVs deliberately crush the first few steps to hide this.',
              '**VA LCDs** have deep blacks for an LCD but slow dark transitions. Moving dark objects can leave a smeary trail (“black smearing”). That’s a response-time issue — see the [response time test](/response-time).',
              '**IPS LCDs** usually show every step clearly, but black itself glows gray in a dark room. That’s the panel’s native contrast, not a range problem.',
            ],
          },
          'Raising brightness or a “black level / shadow detail” control can make patches visible on any panel, but at the cost of grayer blacks. The goal is the darkest background that still shows the low patches.',
        ],
      },
      {
        id: 'limits',
        heading: 'What a browser can and can’t tell you',
        blocks: [
          'This is a visual check. A browser can’t read the signal range your GPU is actually sending, and color management (Windows Advanced Color, HDR mode, or a custom ICC profile) can shift near-black values before they reach the panel. For the cleanest result run the test in SDR mode, at default color settings, in a dark room.',
        ],
      },
    ],
    lookFor: {
      good: [
        'The background is as dark as your panel gets — not visibly gray.',
        'Patches become visible somewhere around 2–5 and every patch after that is a little brighter.',
        'With background 16: the 12 bar disappears and the 20 bar is just visible.',
      ],
      bad: [
        'Patches 1–8 or more are invisible: blacks are crushed (often full-range signal into a limited-range display).',
        'Every patch is easy to see and the background looks dark gray: washed out (often limited-range signal into a full-range display).',
        'Patches out of order, blotchy, or tinted: near-black uniformity or processing issues.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'Perfect 0 black. Levels 1–3 can be invisible or slightly blotchy — that’s near-black handling, not crush, if 4–5 and up are visible.' },
      { panel: 'IPS', note: 'Expect every patch to be visible but black to glow gray in the dark. Lowering brightness helps black depth without hiding patches.' },
      { panel: 'VA', note: 'Deep blacks; low patches may shift slightly with viewing angle (“black crush” off-center). Sit straight on.' },
      { panel: 'Mini-LED / FALD', note: 'Local dimming can switch zones off under the black background and hide the lowest patches. Test with local dimming on and off.' },
    ],
    whenToReturn: [
      'Blacks stay crushed or gray after matching RGB range on both source and display and resetting picture settings.',
      'The black background shows obvious blotches, bands, or color tints on a new OLED or Mini-LED.',
    ],
    tips: [
      'Dim the room and let your eyes adjust for a minute.',
      'Switch off HDR and dynamic contrast / “black enhancer” settings first.',
      'Turn labels off once you know the layout — the text can light up a local dimming zone.',
      'Sit straight in front of the screen; VA and IPS shift near-black with angle.',
    ],
    related: ['white-saturation', 'gamma', 'contrast', 'local-dimming'],
    affiliates: 'contrast',
    disclaimer:
      'A visual aid for setting black level and spotting range mismatches. It doesn’t measure luminance; use a colorimeter for calibrated results.',
    faqs: [
      {
        question: 'What is black crush?',
        answer:
          'Black crush is when several of the darkest shades all display as the same black, so shadow detail disappears. It’s usually caused by a full-range signal going into a display set to limited range, or by brightness / black level set too low.',
      },
      {
        question: 'Should I use full or limited RGB range?',
        answer:
          'For a PC monitor, use full range on both the GPU and the monitor. For a TV used with consoles or video players, limited is standard and fine — as long as both ends agree. The visible result matters more than which one you pick.',
      },
      {
        question: 'Why does my black look gray?',
        answer:
          'Either the source is sending limited range to a display expecting full (raise the range to Full on the GPU or set the display to Limited), brightness / black level is too high, or it’s an IPS or edge-lit panel whose native black glows in a dark room.',
      },
      {
        question: 'Why can’t I see patch 1 or 2 on my OLED?',
        answer:
          'Many OLEDs struggle to produce the first few steps above off, and some intentionally clip them to hide near-black blotching. If you can see patches from about 4–5 up and the ramp is smooth, that’s normal.',
      },
      {
        question: 'Is this the same as a PLUGE pattern?',
        answer:
          'It uses the same idea. Broadcast PLUGE puts bars slightly below and above video black (16). PCs using full-range RGB have no values below black, so the default view only shows bars above 0; switch the background to 16 to see a true below-black bar.',
      },
    ],
  },
};
