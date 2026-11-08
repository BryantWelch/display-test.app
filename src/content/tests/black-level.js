export default {
  slug: 'black-level',
  order: 320,
  category: 'color',
  name: 'Black Level Test',
  shortName: 'Black Level',
  badges: [],
  summary: 'Near-black patches and PLUGE bars to catch crushed or washed-out blacks and HDMI range mismatches.',
  seo: {
    title: 'Black Level Test — Check Black Crush & HDMI RGB Range | Free',
    description:
      'Free full-screen black level test. See if shadow detail is crushed or washed out, and fix HDMI full vs limited RGB range mismatches on PC, console, and TV.',
  },
  testSeo: {
    title: 'Black Level Test — Fullscreen',
    description: 'Near-black patches 1–40 on pure black, PLUGE bars, and a step ramp.',
  },
  load: () => import('../../pages/tests/BlackLevelTest'),
  checkup: { step: 50, question: 'Can you see at least levels 3–5 above black, without the black background looking gray?' },
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
          'The test fills the screen with pure black (code value 0 of 255) and places patches at 1, 2, 3 … up to 20 or 40 on top of it. Below them are PLUGE-style reference bars and a ramp that climbs one code value per step.',
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
          'The **16 · Video black** background borrows the broadcast PLUGE layout, where black is 16 and a bar at 12 sits just below it. A browser, though, always sends full-range PC values (your GPU rescales them if it outputs limited range), so on a correctly matched chain 16 is a dark gray and the 12 bar is faintly darker than it. If the background, the 12 bar, and the 16 bar all merge into the same pure black, the display is clipping everything at or below 16: the crushed mismatch from the table above. With the 0 background nothing exists below black, so those bars only go upward.',
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
              '**AMD:** AMD Software → Settings → Display → Pixel Format: **RGB 4:4:4 Pixel Format PC Standard (Full RGB)**. The “Studio (Limited RGB)” option or YCbCr modes can wash blacks out.',
              '**Intel:** Intel Graphics Command Center → Display → Color → Quantization Range: **Full**.',
              'Then set the monitor’s own option (“HDMI black level”, “RGB range”, “Black level”) to **Full / High / Normal** to match. DisplayPort connections are almost always full range already.',
            ],
          },
          { h3: 'Consoles' },
          {
            ul: [
              '**PlayStation 5:** Settings → Screen and Video → Video Output → RGB Range: Automatic usually works; force **Full** for a PC monitor, **Limited** if the TV clips.',
              '**Xbox Series X|S:** Settings → General → TV & display options → Video fidelity & overscan → Color space: **Standard (recommended)** for TVs; PC RGB only if the display is set to full range too.',
              '**Nintendo Switch:** System Settings → TV Output → RGB Range: Automatic, or match the display manually.',
            ],
          },
          { h3: 'TVs' },
          'Look for **HDMI Black Level** (Samsung: Low / Normal), **Black Level** (LG: Low / High), or **HDMI Video Range** (Sony: Auto / Full / Limited). The names are confusing — “Low” often means limited, “High/Normal” often means full. Use this test to check rather than trusting the label.',
        ],
      },
      {
        id: 'brightness',
        heading: 'Brightness, backlight, and gamma',
        blocks: [
          'Once the range matches, the remaining near-black controls are easy to mix up:',
          {
            ul: [
              'On most **TVs**, **Brightness** (Sony: **Black level**) doesn’t make the whole picture brighter. It shifts black up or down. Too low crushes the first patches; too high turns the background gray. Overall light output is a separate **Backlight**, **OLED Light**, or **Peak brightness** control.',
              'On most **PC monitors**, **Brightness** is the backlight. Shadow controls go by names like **Black Equalizer**, **Black Stabilizer**, or **Shadow Boost**, and they lift dark tones rather than black itself.',
              '**Gamma** also moves near-black. A higher gamma (2.4 or BT.1886) darkens the first few steps; a lower one (2.0) lifts them. If the background is black but patches 1–8 stay hidden with the range set correctly, check gamma before touching brightness. See the [gamma test](/gamma).',
            ],
          },
          {
            ol: [
              'Set the RGB range on both ends and pick a standard, movie, or sRGB picture mode.',
              'Use the 0 background. On a TV, lower **Brightness** until the first several patches disappear, then raise it a step at a time until patches 2–3 are just visible.',
              'If the background itself starts to look gray, step back down. That is raised black, and it costs contrast everywhere.',
            ],
          },
          'Room light matters too. Reflections on the screen can be brighter than patches 1–3, so even a perfect display hides them in daylight. Set black level in a dim room. If you mostly watch in a bright one, a slightly higher setting is a reasonable trade-off.',
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
        'With background 16: the background is a dark gray, the 12 bar is faintly darker than it, and the 20 bar is faintly lighter.',
      ],
      bad: [
        'Patches 1–8 or more are invisible: blacks are crushed (often full-range signal into a limited-range display).',
        'Every patch is easy to see and the background looks dark gray: washed out (often limited-range signal into a full-range display).',
        'With background 16, the background and the 12 and 16 bars all look like the same pure black: the display is clipping everything at or below 16.',
        'Patches out of order, blotchy, or tinted: near-black uniformity or processing issues.',
      ],
    },
    panelNotes: [
      { panel: 'OLED / QD-OLED', note: 'Perfect 0 black. Levels 1–3 can be invisible or slightly blotchy — that’s near-black handling, not crush, if 4–5 and up are visible.' },
      { panel: 'IPS', note: 'Expect every patch to be visible but black to glow gray in the dark. Lowering brightness helps black depth without hiding patches.' },
      { panel: 'VA', note: 'Deep blacks, but gamma shifts with viewing angle: the lowest patches can look crushed straight on and lift into view off-center. Judge from straight in front of the screen center.' },
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
          'Either the source is sending limited range to a display expecting full (set the GPU output to Full, or the display to Limited), brightness / black level is too high, or it’s an IPS or edge-lit panel whose native black glows in a dark room.',
      },
      {
        question: 'Why can’t I see patch 1 or 2 on my OLED?',
        answer:
          'Many OLEDs struggle to produce the first few steps above off, and some intentionally clip them to hide near-black blotching. If you can see patches from about 4–5 up and the ramp is smooth, that’s normal.',
      },
      {
        question: 'Is this the same as a PLUGE pattern?',
        answer:
          'It uses the same idea. Broadcast PLUGE puts bars slightly below and above video black (16), and you set a TV’s brightness until the below-black bar just disappears. A browser always sends full-range PC values with nothing below 0, so the default view only shows bars above black. The 16 background recreates the PLUGE layout, but here the 12 bar should stay faintly visible; if it vanishes, the display is clipping below 16. For a true PLUGE calibration, play a PLUGE pattern from a video file or disc in the TV’s own player.',
      },
    ],
  },
};
