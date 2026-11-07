export default {
  slug: 'tv-as-monitor',
  order: 50,
  name: 'TV as a Monitor',
  title: 'Using a TV as a PC Monitor: The Settings That Matter',
  summary: 'Set up a TV for desktop and gaming use: PC mode, 4:4:4 chroma, overscan, RGB range, HDR, VRR and burn-in.',
  lastReviewed: '2026-11-07',
  seo: {
    title: 'Using a TV as a Monitor — PC Mode, 4:4:4, Overscan, 4K120 & HDR Setup',
    description:
      'Make a TV work well as a PC monitor: Game/PC mode, HDMI 2.1 4K 120 Hz and VRR, 4:4:4 chroma for sharp text, overscan, RGB range, HDR and OLED burn-in tips.',
  },
  intro:
    'TVs make great big monitors, but out of the box they’re tuned for video: they crop the edges, soften text, add processing delay and sometimes send the wrong black level. A handful of settings fixes nearly all of it. Setting names vary by brand and model year, so treat the names here as what to look for, not exact menu paths.',
  sections: [
    {
      id: 'pc-game-mode',
      heading: 'Use Game mode and label the input as PC',
      blocks: [
        'Two separate settings matter most, and you usually want both:',
        {
          ul: [
            '**Game mode** (sometimes “Game Optimizer”, “Game Motion Plus” or set automatically by **ALLM**, auto low latency mode) turns off most video processing to reduce input lag.',
            '**PC input label / PC mode.** Many TVs change behavior when the HDMI input’s icon or type is set to “PC” — commonly enabling full 4:4:4 chroma and disabling some processing. On LG TVs this is done by changing the input icon to PC; Samsung TVs have a similar PC source type, and their *Input Signal Plus* setting may also need enabling for full bandwidth.',
          ],
        },
        'On some TVs, PC labeling and Game mode interact — for example, one may restrict picture settings the other allows. If text looks soft or colors look off after changing one, check the other.',
        'Also turn off motion smoothing, noise reduction, edge enhancement and dynamic contrast if they’re still active. For desktop use, set sharpness to the neutral value (often 0 in PC/Game mode, but it varies).',
      ],
    },
    {
      id: 'hdmi-21',
      heading: 'HDMI 2.1, 4K 120 Hz and VRR',
      blocks: [
        'To get 4K at 120 Hz (or higher) with full color, you need HDMI 2.1 bandwidth end to end:',
        {
          ul: [
            'A **GPU with HDMI 2.1** output.',
            'A **TV port that supports 4K 120 Hz** — not every HDMI port on every TV does. Check the label next to the port or the manual.',
            'An **Ultra High Speed HDMI** cable. Long or uncertified cables are a common cause of flickering, black screens, or the TV refusing high refresh rates.',
            'The TV’s enhanced HDMI mode enabled for that port, if it has one (names include *HDMI Ultra HD Deep Color* and *Input Signal Plus*).',
          ],
        },
        'Turn on **VRR** (and G-Sync / FreeSync if offered) for gaming. Then select the refresh rate in your OS and confirm it with the [Refresh Rate](/refresh-rate) and [Frame Skipping](/frame-skipping) tests.',
        { note: 'Some TVs show brightness flicker in dark scenes or loading screens with VRR, when frame rates jump around. That’s a known behavior on many VRR displays, not usually a defect. Capping the frame rate or using a steady frame rate can reduce it.' },
      ],
    },
    {
      id: 'chroma',
      heading: 'Get 4:4:4 chroma for sharp text',
      blocks: [
        'Video is usually sent with chroma subsampling (4:2:2 or 4:2:0): color information at reduced resolution. It’s invisible in movies but makes colored text — red on black, blue on gray — look smeared or fringed.',
        'For desktop use you want **RGB or YCbCr 4:4:4**. It usually requires the PC input label or enhanced HDMI mode described above, and enough bandwidth for your resolution and refresh rate. Verify with the [Chroma Subsampling](/chroma-subsampling) test: with 4:4:4, every line of colored text is crisp.',
        'If 4:4:4 only works at lower refresh rates, you’re probably bandwidth-limited — check the cable and port.',
      ],
    },
    {
      id: 'overscan',
      heading: 'Turn off overscan',
      blocks: [
        'Overscan crops a few percent off the edges and scales the rest up — a leftover from broadcast TV. On a PC it cuts off the taskbar and makes everything slightly blurry because pixels no longer map one-to-one.',
        'Look for **Just Scan** (LG), **Screen Fit** or **Fit to Screen** (Samsung), **Full Pixel** (Sony), or an *Aspect ratio* / *Picture size* setting set to the original or full-pixel option. Then open the overscan pattern in [Test Patterns](/test-patterns): you should see the outer border lines on all four edges.',
        'Avoid compensating with GPU driver “resize desktop” sliders — that scales the image and softens text. Fix overscan on the TV.',
      ],
    },
    {
      id: 'rgb-range',
      heading: 'Match the RGB range',
      blocks: [
        'TVs are built around limited-range video (16–235), while PCs normally output full range (0–255). A mismatch gives either gray, washed-out blacks or crushed shadows.',
        'Set the PC to **full range RGB** and set the TV’s black level setting (often *HDMI black level*, *Black level*, or *HDMI video range*) to match — or to auto, if auto gets it right. Check with [Black Level](/black-level) and [White Saturation](/white-saturation). See the [setup checklist](/guides/setup-checklist) for where the setting lives in GPU drivers.',
      ],
    },
    {
      id: 'hdr',
      heading: 'HDR on a TV connected to a PC',
      blocks: [
        {
          ul: [
            'Turn on HDR in Windows only when you want it; many people use SDR for desktop work and switch to HDR for games and movies.',
            'Run the **Windows HDR Calibration** app (available from the Microsoft Store) so games know the TV’s peak brightness.',
            'On the TV, use HDR Game mode and turn on the TV’s **HGIG** option if it has one — it lets the game do the tone mapping instead of applying it twice.',
            'If the desktop looks washed out in HDR, adjust the *SDR content brightness* slider, or use SDR for desktop work.',
          ],
        },
        'The [HDR Test](/hdr-test) gives a quick visual check, but browser HDR support is limited and varies by browser — it can’t measure peak brightness or tone mapping accuracy.',
      ],
    },
    {
      id: 'text-clarity',
      heading: 'Text clarity on OLED and other subpixel layouts',
      blocks: [
        'Windows ClearType assumes an RGB stripe of vertical subpixels. Many TVs don’t have one: WOLED panels use an RGBW layout, and some LCD TVs use BGR or other arrangements. That can produce colored fringes on text even with 4:4:4 chroma.',
        {
          ul: [
            'Run the **ClearType Text Tuner** and pick the samples that look best to you — sometimes that means the least colorful ones.',
            'Increase scaling (125–150% on a large 4K TV) so text is drawn with more pixels.',
            'Sit at an appropriate distance — fringing is much less visible from a couch than from a desk.',
          ],
        },
        'Compare settings with the [Text Clarity](/text-clarity) test.',
      ],
    },
    {
      id: 'burn-in',
      heading: 'Burn-in risk for desktop use',
      blocks: [
        'An OLED TV used as a desktop monitor sees exactly the kind of content that causes burn-in: a static taskbar, window borders and icons for hours. Many TV warranties don’t cover burn-in. Reduce the risk with an auto-hiding taskbar, dark themes, a short screen-off timeout, moderate brightness, and leaving the TV’s own protection features and compensation cycles enabled. See the [OLED burn-in guide](/guides/oled-burn-in) and check periodically with the [Burn-in Test](/burn-in).',
      ],
    },
    {
      id: 'input-lag',
      heading: 'Input lag',
      blocks: [
        'Game mode is the single biggest factor in a TV’s input lag; outside it, processing can add a noticeable delay. Some TVs also add lag when certain features (like motion smoothing or some HDR processing) are enabled in Game mode.',
        { warning: 'Browsers can’t measure input lag. It requires timing the path from input to photons, which needs dedicated hardware. For lag numbers, look for reviews that measure your exact model.' },
        'What you can check in the browser is whether frames are delivered smoothly — use [Frame Skipping](/frame-skipping) and [Response Time](/response-time) to look for dropped frames and motion blur.',
      ],
    },
  ],
  related: ['chroma-subsampling', 'test-patterns', 'black-level', 'refresh-rate', 'frame-skipping', 'text-clarity', 'hdr-test', 'burn-in'],
  faqs: [
    {
      question: 'Why is text blurry when I use my TV as a monitor?',
      answer:
        'Usually chroma subsampling (4:2:2 or 4:2:0), overscan, or non-native resolution. Label the HDMI input as PC, enable Game/PC mode, turn off overscan (Just Scan / Screen Fit), and confirm 4:4:4 with the [Chroma Subsampling](/chroma-subsampling) test.',
    },
    {
      question: 'How do I get 4K 120 Hz on my TV from a PC?',
      answer:
        'You need an HDMI 2.1 GPU output, an HDMI 2.1-capable TV port, an Ultra High Speed HDMI cable, and the TV’s enhanced HDMI mode enabled for that port. Then pick 120 Hz in your OS display settings.',
    },
    {
      question: 'Why does my TV cut off the edges of the desktop?',
      answer:
        'That’s overscan. Set the TV’s picture size to Just Scan, Screen Fit, Full Pixel or the equivalent, rather than shrinking the desktop in the GPU driver.',
    },
    {
      question: 'Is it safe to use an OLED TV as a computer monitor?',
      answer:
        'Many people do, but static desktop elements raise burn-in risk and TV warranties often exclude it. Use an auto-hiding taskbar, dark mode, moderate brightness and a short screen-off timeout, and leave the TV’s protection features on.',
    },
    {
      question: 'Can I test my TV’s input lag in a browser?',
      answer:
        'No. Input lag measurement needs hardware that times the delay between input and light output. Browser tests can check refresh rate, frame skipping and motion blur, but not latency.',
    },
  ],
};
