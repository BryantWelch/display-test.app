export default {
  slug: 'text-clarity',
  order: 500,
  category: 'clarity',
  name: 'Text Clarity Test',
  shortName: 'Text Clarity',
  badges: [],
  summary: 'Check text sharpness, small-size readability, and ClearType / OLED color fringing.',
  seo: {
    title: 'Text Clarity Test — Check Blurry Text, ClearType & OLED Fringing | Free',
    description:
      'Free full-screen text clarity test. Compare fonts and tiny sizes, spot color fringing on OLED and LCD, find your panel’s subpixel layout, and learn how to tune ClearType.',
  },
  testSeo: {
    title: 'Text Clarity Test — Fullscreen',
    description: 'Full-screen text samples, tiny-size ladder, and subpixel fringing comparison.',
  },
  load: () => import('../../pages/tests/TextClarityTest'),
  checkup: { step: 65, question: 'Is text sharp and comfortable to read, without distracting color fringes?' },
  page: {
    title: 'Text Clarity Test',
    intro:
      'Fill the screen with real text to see how sharp, even, and comfortable it is — and find out whether colored fringes around letters come from ClearType, your panel’s subpixel layout, or scaling.',
    startLabel: 'Start text clarity test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-affects',
        heading: 'What makes text look sharp or blurry',
        blocks: [
          'Text clarity depends on four things, roughly in order of impact:',
          {
            ul: [
              '**Native resolution.** An LCD or OLED has a fixed pixel grid. Any other resolution forces the monitor or GPU to resample, which softens every edge. Always run at native and use OS scaling to make things bigger.',
              '**Pixel density (PPI).** At around 90–110 PPI (24″ 1080p, 27″ 1440p) individual pixels are visible and anti-aliasing does a lot of work. At 160 PPI and above with 150–200% scaling, text looks print-like on any panel. Check yours with the [PPI calculator](/ppi-calculator).',
              '**Anti-aliasing.** Windows uses ClearType subpixel rendering by default, which treats each pixel’s red, green, and blue stripes as separate light sources to sharpen horizontal detail. macOS and phones use grayscale smoothing.',
              '**Subpixel layout.** ClearType assumes vertical RGB or BGR stripes. QD-OLED (triangular subpixels) and WOLED (red, white, blue, green) don’t match, which is why some OLED monitors show colored fringes around text.',
            ],
          },
          'Monitor sharpness and overscan settings can also add halos or blur; set sharpness to its neutral value (often 0, 5, or 50 depending on the brand) and turn overscan off on TVs.',
          'When a TV is used as a monitor, or a GPU sends YCbCr 4:2:2 or 4:2:0 over HDMI, color detail is shared between neighboring pixels. Black-and-white text can look fine while red or blue text on dark backgrounds smears. Label the TV input as **PC** (or enable its PC mode) and set the GPU output to RGB or YCbCr 4:4:4, then confirm with the [chroma subsampling test](/chroma-subsampling).',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Set your display to its native resolution and the scaling you normally use, and sit at your usual distance.',
              'Click **Start text clarity test**. The **Paragraphs** view fills the screen with text in your choice of font, size, weight, spacing, and colors.',
              'Switch to **Tiny sizes** to see 8–16px text side by side. Note the smallest size you can read without leaning in or squinting.',
              'Switch to **Fringing**. Compare the real browser text, then the three generated samples (grayscale, RGB, BGR) to see which suits your panel. The pixel tiles below them show your subpixel layout up close, and the edge tile reveals over-sharpening halos.',
              'Try both black-on-white and white-on-black — fringing and blooming show up differently on each.',
            ],
          },
          'The sizes are CSS pixels. At 150% scaling, 12px text is drawn with 18 physical pixels, so the same setting looks sharper on a high-PPI laptop than on a 1080p desktop monitor.',
        ],
      },
      {
        id: 'fringing',
        heading: 'Understanding color fringing',
        blocks: [
          'Look closely at a thin vertical stroke like **l** or **|**. With ClearType on a normal LCD, you’ll see a faint red tint on one side and blue on the other. That’s how subpixel rendering works, and at normal distance it should blend into a sharper-looking edge.',
          'The **Fringing** view also draws three versions of the same text pixel by pixel, so they look identical on every computer regardless of OS settings:',
          {
            ul: [
              '**RGB stripe** looks cleanest on most LCDs.',
              '**BGR stripe** looks cleanest on some LCDs, TVs, and stripe panels rotated 180°.',
              '**Grayscale** usually looks best on QD-OLED, WOLED, and portrait-rotated screens, where both stripe versions show colored halos.',
            ],
          },
          'A browser can’t detect your subpixel layout directly. These samples help you judge by eye; a phone camera in macro mode on the pixel structure tiles will confirm it.',
        ],
      },
      {
        id: 'fix',
        heading: 'How to improve blurry or fringed text',
        blocks: [
          {
            ul: [
              '**Windows:** press Start, type `cttune` (“Adjust ClearType text”), and run the wizard separately on each monitor at native resolution. Pick the samples that look best to you, not the ones you think are “correct”.',
              '**OLED on Windows:** if fringing bothers you, try turning ClearType off in the same wizard to get grayscale smoothing in most apps, and use 125–150% scaling if text is still too small. ClearType can reduce fringing on QD-OLED and WOLED but can’t fully remove it, and some apps ignore the setting.',
              '**Windows scaling:** at 125% or 150%, older apps that aren’t DPI-aware get stretched and look blurry while modern apps stay sharp. Turn on “Let Windows try to fix apps so they’re not blurry” in Settings → System → Display (under Scale or Advanced scaling settings), or set a per-app override under the app’s Properties → Compatibility → Change high DPI settings.',
              '**macOS:** text is always grayscale-smoothed, so 1080p and 1440p external monitors look softer than on Windows. If text looks soft, choose a “looks like” resolution that is exactly half the panel’s native resolution, or use a higher-PPI display (a 5K 27″ or 4K 24″ panel at 200% looks print-sharp).',
              '**TVs:** set the HDMI input type or icon to **PC** (or turn on PC / Game mode), set picture size to Just Scan / Screen Fit to disable overscan, and turn sharpness to neutral. This usually enables 4:4:4 chroma and switches off processing that blurs text.',
              '**Everywhere:** use the native resolution, enlarge with OS scaling or browser zoom rather than lowering resolution, and set monitor sharpness to neutral — lower it until the edge tile in the **Fringing** view shows no bright or dark outline.',
            ],
          },
          { note: 'Run the test again after any change. ClearType changes apply to newly opened windows, so you may need to reload this page.' },
        ],
      },
    ],
    lookFor: {
      good: [
        'Letters look crisp and evenly weighted across the screen, at your normal distance.',
        'A faint red / blue tint on vertical strokes when you look very closely (normal ClearType on LCD).',
        'Small sizes (11–13px) are readable without leaning in on a typical desktop monitor.',
        'One of the three generated samples (grayscale, RGB, or BGR) looks clearly cleaner than the others.',
      ],
      bad: [
        'Everything looks soft or slightly doubled — usually a non-native resolution or scaling.',
        'Obvious green, magenta, or rainbow halos around text at normal distance (subpixel layout mismatch, common on QD-OLED / WOLED).',
        'Halos or bright outlines around dark text on white — monitor sharpness set too high.',
        'Black-and-white text is sharp but colored text smears, especially red or blue on dark — chroma subsampling (common on TVs without PC mode).',
        'Thin strokes that look bold in some places and faint in others, or shimmer as you move your eyes.',
      ],
    },
    panelNotes: [
      { panel: 'IPS / VA / TN (LCD)', note: 'Nearly all use an RGB stripe, so ClearType works as designed. A faint red/blue edge on close inspection is normal.' },
      { panel: 'QD-OLED', note: 'Triangular subpixel layout. Green/magenta fringes on text are expected; grayscale smoothing or higher scaling helps. Newer generations fringe less.' },
      { panel: 'WOLED (LG OLED)', note: 'Red-white-blue-green layout. Fringing is usually subtler than early QD-OLED but still visible on small high-contrast text.' },
      { panel: 'High-PPI laptops and 4K/5K monitors', note: 'At 150–200% scaling, fringing and stair-stepping are hard to see on any panel type.' },
    ],
    tips: [
      'Use your display’s native resolution and adjust size with OS scaling, not resolution.',
      'Set monitor sharpness to its neutral value before judging text.',
      'Test at your real working distance — fringing that’s visible at 20 cm may vanish at 70 cm.',
      'Rotated portrait monitors change the subpixel direction; grayscale often looks best.',
    ],
    related: ['ppi-calculator', 'screen-resolution', 'chroma-subsampling', 'test-patterns'],
    affiliates: 'textClarity',
    disclaimer:
      'A visual comparison aid. The browser can’t measure sharpness or detect your subpixel layout, and comfort is personal — consult an eye care professional if you experience persistent eye strain.',
    faqs: [
      {
        question: 'Why does text look blurry on my monitor?',
        answer:
          'The most common causes are a non-native resolution, fractional scaling on some apps, monitor sharpness set too low or high, and low pixel density. Set the native resolution first, then enlarge with OS scaling. Running the ClearType tuner (`cttune`) on Windows often helps too.',
      },
      {
        question: 'Why is text blurry on a TV used as a PC monitor?',
        answer:
          'TVs often overscan, sharpen, and receive 4:2:0 or 4:2:2 chroma by default, which smears colored text. Set the HDMI input to PC mode (on LG, change the input icon to PC), pick Just Scan / Screen Fit, set sharpness to neutral, and make sure the GPU outputs RGB or 4:4:4. Check the result with the [chroma subsampling test](/chroma-subsampling).',
      },
      {
        question: 'Why do OLED monitors have color fringing on text?',
        answer:
          'Windows ClearType assumes each pixel is three vertical stripes in RGB or BGR order. QD-OLED uses a triangle of subpixels and WOLED uses red, white, blue, and green, so subpixel-rendered edges land on the wrong colors and show green or magenta halos. Grayscale smoothing, higher scaling, or a higher-PPI panel reduces it; tuning ClearType alone can’t fully fix it.',
      },
      {
        question: 'How do I adjust ClearType in Windows?',
        answer:
          'Press Start, type `cttune` or “Adjust ClearType text”, and follow the wizard. It runs once per monitor, so complete it on each display at native resolution. Unticking “Turn on ClearType” on the first page switches most apps to grayscale smoothing.',
      },
      {
        question: 'Can this test tell me my panel’s subpixel layout?',
        answer:
          'Not directly — browsers can’t read it. The Fringing view shows text anti-aliased for RGB, BGR, and grayscale so you can judge which looks cleanest, and the pixel structure tiles let you confirm the layout with a phone camera in macro mode.',
      },
      {
        question: 'Should I use light or dark mode for clearer text?',
        answer:
          'Dark text on a light background is usually sharpest and easiest to read in a bright room. Light text on dark can bloom on glossy or very bright panels and may smear on slow VA panels when scrolling, but many people find it more comfortable in dim rooms. Try both in the test.',
      },
      {
        question: 'What is the smallest readable font size?',
        answer:
          'It depends on PPI and distance. On a typical 24–27″ desktop monitor at 100% scaling, most people read 12–13px comfortably and 11px with effort. Use the Tiny sizes view to find your own limit, then set app and browser zoom so body text is comfortably above it.',
      },
    ],
  },
};
