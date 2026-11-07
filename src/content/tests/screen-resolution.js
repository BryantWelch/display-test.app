export default {
  slug: 'screen-resolution',
  order: 100,
  category: 'start',
  name: 'What Is My Screen Resolution?',
  shortName: 'Screen Resolution',
  badges: ['New', 'Popular'],
  summary: 'See your screen resolution, scaling, refresh rate, HDR, and color gamut — instantly.',
  seo: {
    title: 'What Is My Screen Resolution? Free Screen Resolution Checker',
    description:
      'Instantly see your real screen resolution, display scaling, device pixel ratio, refresh rate, aspect ratio, HDR and color gamut. Copy a full monitor report — free, no download.',
  },
  inlineTool: () => import('../../tools/DisplayInfoTool'),
  page: {
    title: 'What Is My Screen Resolution?',
    intro:
      'Your screen resolution, scaling, refresh rate, and color capabilities — read live from your browser. Move this window to another monitor and the numbers update. Use **Copy report** to paste the details into a support ticket, forum post, or return request.',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is-resolution',
        heading: 'What screen resolution means',
        blocks: [
          'Resolution is the number of pixels your display shows, written as **width × height** — for example 1920 × 1080 is 1,920 pixels across and 1,080 down, about 2.07 million pixels. Every flat panel has one **native resolution**: the exact pixel grid of the panel. Running at native resolution gives the sharpest image; anything else is stretched by the monitor or GPU and looks softer.',
          'Resolution alone doesn’t tell you how sharp a screen looks — that depends on how big the screen is and how far away you sit. Use the [PPI calculator](/ppi-calculator) to turn resolution and size into pixel density.',
        ],
      },
      {
        id: 'css-vs-physical',
        heading: 'CSS pixels, physical pixels, and scaling',
        blocks: [
          'Browsers don’t report physical pixels directly. They report **CSS pixels** — a logical unit the operating system and browser scale so text stays readable on dense screens. The link between the two is the **device pixel ratio (DPR)**:',
          { ul: ['**Physical pixels = CSS pixels × device pixel ratio**'] },
          'A 4K (3840 × 2160) monitor with Windows scaling at 150% reports a CSS screen size of 2560 × 1440 and a DPR of 1.5. A MacBook with a Retina display typically reports a DPR of 2. This tool multiplies the two to show the physical resolution, and lists the CSS size separately because that’s the number most other “what is my resolution” sites show.',
          {
            note: '**Browser zoom also changes the DPR.** At 110% browser zoom on a 100%-scaled screen, the DPR becomes 1.1 and the reported CSS size shrinks. Press **Ctrl+0** (**Cmd+0** on Mac) to reset zoom before reading the numbers.',
          },
          'The result can still differ from your panel’s native resolution. The browser only knows the mode the operating system is **sending** — if Windows is set to 1920 × 1080 on a 2560 × 1440 monitor, this page shows 1920 × 1080. Check the monitor’s spec sheet or its on-screen menu (often under *Information*) to confirm the native mode.',
        ],
      },
      {
        id: 'common-resolutions',
        heading: 'Common screen resolutions',
        blocks: [
          {
            table: {
              head: ['Name', 'Resolution', 'Aspect ratio', 'Typical use'],
              rows: [
                ['HD / 720p', '1280 × 720', '16:9', 'Budget laptops, small TVs'],
                ['WXGA / “HD” laptop', '1366 × 768', '≈16:9', 'Older and budget laptops'],
                ['HD+', '1600 × 900', '16:9', 'Laptops'],
                ['Full HD (FHD) / 1080p', '1920 × 1080', '16:9', '24" monitors, laptops, TVs'],
                ['WUXGA', '1920 × 1200', '16:10', 'Productivity monitors, laptops'],
                ['QHD / 1440p', '2560 × 1440', '16:9', '27" gaming and office monitors'],
                ['WQXGA', '2560 × 1600', '16:10', 'Laptops, 30" monitors'],
                ['Ultrawide FHD', '2560 × 1080', '21:9', '29" ultrawides'],
                ['Ultrawide QHD (UWQHD)', '3440 × 1440', '21:9', '34" ultrawides'],
                ['Super ultrawide (DQHD)', '5120 × 1440', '32:9', '49" super ultrawides'],
                ['4K UHD / 2160p', '3840 × 2160', '16:9', '27–32" monitors, TVs'],
                ['5K', '5120 × 2880', '16:9', '27" Apple Studio Display and similar'],
                ['5K2K ultrawide', '5120 × 2160', '21:9', '40–45" ultrawides'],
                ['8K UHD', '7680 × 4320', '16:9', 'Large TVs, specialist monitors'],
              ],
            },
          },
          'Laptop panels are often 16:10 (1920 × 1200, 2560 × 1600, 2880 × 1800) and tablets and phones use many other ratios, so not every screen matches a named standard.',
        ],
      },
      {
        id: 'change-resolution',
        heading: 'How to change resolution and scaling',
        blocks: [
          { h3: 'Windows 11 and 10' },
          {
            ol: [
              'Right-click the desktop and choose **Display settings**.',
              'Select the monitor at the top if you have more than one.',
              'Under **Display resolution**, pick the option marked **(Recommended)** — that is the native resolution the monitor reports.',
              'Under **Scale**, choose 100%, 125%, 150%, etc. Scaling makes text and UI bigger without changing the pixel grid.',
              'For refresh rate, open **Advanced display** and set **Choose a refresh rate**.',
            ],
          },
          { h3: 'macOS' },
          {
            ol: [
              'Open **System Settings → Displays** and select the display.',
              'Choose a size preset (“Larger Text” … “More Space”), or turn on **Show all resolutions** to see the full list.',
              'On Retina and most external high-DPI displays, macOS renders at 2× and scales down, so the “looks like” resolution is smaller than the native pixel count. The browser reports DPR 2 for these modes.',
            ],
          },
          {
            note: 'If the recommended resolution is lower than your monitor’s spec, the cable, adapter, dock, or port may not support the full mode. Try a different cable (DisplayPort or certified HDMI 2.1 for high resolutions and refresh rates) and update your graphics driver.',
          },
        ],
      },
      {
        id: 'why-scaled',
        heading: 'Why the browser reports a scaled resolution',
        blocks: [
          'Websites are laid out in CSS pixels so that a 16px font is a readable size on every screen. If browsers reported physical pixels, pages would become tiny on 4K laptops. Because of that, `screen.width` and `screen.height` are always in CSS pixels, and some privacy-focused browsers (Firefox with resistFingerprinting, Tor Browser, Brave) deliberately round or fake them.',
          'With fractional scaling (125%, 150%, 175%), the multiplication can be off by a pixel or two, and with several monitors at different scaling levels the numbers change as you drag the window between screens. Refresh rate is measured, not reported: it’s estimated from how often the browser draws frames, so battery saver, background tabs, and variable refresh rate (G-SYNC/FreeSync) can make it read lower. See the [refresh rate test](/refresh-rate) for a detailed measurement.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Physical resolution matches the native resolution on your monitor’s spec sheet.',
        'Refresh rate matches what you set in display settings (for example 144 Hz, not 60 Hz).',
        'Scaling is a whole number (100% or 200%) if you need pixel-exact tests.',
      ],
      bad: [
        'Physical resolution lower than the panel’s native mode — the OS is sending a non-native resolution and the image is being stretched.',
        'Refresh rate stuck at 60 Hz on a high-refresh monitor — check display settings, cable, and port.',
        'Odd values like 1.1 or 0.9 for device pixel ratio — browser zoom is not at 100%.',
      ],
    },
    tips: [
      'Set browser zoom to 100% (Ctrl+0 / Cmd+0) before reading the numbers.',
      'Drag this window onto each monitor — values update live per screen.',
      'Keep this tab in the foreground and plugged in for an accurate refresh rate.',
      'Compare with the **(Recommended)** resolution in your OS display settings.',
    ],
    related: ['refresh-rate', 'ppi-calculator', 'hdr-test', 'test-patterns'],
    affiliates: 'testPatterns',
    disclaimer:
      'Values come from your browser and operating system and may be rounded, scaled, or deliberately obscured for privacy. Check your monitor’s spec sheet for its native resolution and maximum refresh rate.',
    faqs: [
      {
        question: 'What is my screen resolution?',
        answer:
          'The large number at the top of this page is your physical screen resolution — the CSS size reported by your browser multiplied by the device pixel ratio. If your OS scaling is 100% and browser zoom is 100%, it equals the CSS size exactly.',
      },
      {
        question: 'Why does this site say 1536 × 864 when my laptop is 1920 × 1080?',
        answer:
          '1536 × 864 is 1920 × 1080 divided by 1.25 — Windows is scaling the desktop to 125%. That is the CSS resolution websites see. The physical resolution shown here multiplies it back to 1920 × 1080.',
      },
      {
        question: 'How do I find my monitor’s native resolution?',
        answer:
          'In Windows display settings, the option marked “(Recommended)” is the native resolution the monitor reports over EDID. You can also check the model number on the back of the monitor and look up its spec sheet, or open the monitor’s on-screen menu, which often shows the current input mode.',
      },
      {
        question: 'Is a higher device pixel ratio better?',
        answer:
          'A higher DPR means more physical pixels per CSS pixel, so text and images look sharper at the same size. It doesn’t change how much fits on screen — that’s the CSS resolution. A DPR of 2 at 2560 × 1440 CSS pixels (a 5K display) looks much crisper than DPR 1 at the same CSS size.',
      },
      {
        question: 'Why is the refresh rate shown lower than my monitor supports?',
        answer:
          'The browser draws at whatever rate the OS is running the display. If it reads 60 Hz on a 144 Hz monitor, the refresh rate is probably still set to 60 Hz in display settings, the cable can’t carry the higher rate, or battery saver is limiting the browser. Background tabs and some laptops in power-saving mode also throttle frames.',
      },
      {
        question: 'Does the color depth number mean my monitor is 8-bit?',
        answer:
          'Not necessarily. Browsers almost always report 24-bit color (8 bits per channel) even on 10-bit or HDR displays, so treat it as “as reported” rather than a panel spec. Use the [color gradient test](/color-gradient) to check for banding instead.',
      },
    ],
  },
};
