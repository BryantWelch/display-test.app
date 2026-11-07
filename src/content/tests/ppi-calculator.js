export default {
  slug: 'ppi-calculator',
  order: 640,
  category: 'utilities',
  name: 'PPI Calculator',
  shortName: 'PPI Calculator',
  badges: ['New'],
  summary: 'Pixel density, dot pitch, physical size, and “retina” distance for any screen.',
  seo: {
    title: 'PPI Calculator — Pixels Per Inch, Dot Pitch & Retina Distance',
    description:
      'Calculate PPI (pixel density) from resolution and screen size. Get dot pitch, width and height in inches and cm, aspect ratio, retina viewing distance, and recommended scaling. Pre-filled with your screen.',
  },
  inlineTool: () => import('../../tools/PpiCalculator'),
  page: {
    title: 'PPI Calculator',
    intro:
      'Enter a resolution and diagonal to get pixel density (PPI), dot pitch, physical width and height, and the distance at which individual pixels stop being visible. Your current screen’s resolution is filled in automatically.',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is-ppi',
        heading: 'What PPI means',
        blocks: [
          '**PPI (pixels per inch)** is how many pixels fit along one inch of the screen. It depends on both resolution and size: a 27″ 4K monitor and a 55″ 4K TV have the same number of pixels, but the monitor packs them twice as tightly.',
          'The formula is the diagonal resolution in pixels divided by the diagonal size in inches: **PPI = √(width² + height²) ÷ diagonal**. A 27″ 2560 × 1440 monitor has √(2560² + 1440²) ≈ 2937 pixels across the diagonal, so 2937 ÷ 27 ≈ **109 PPI**.',
          '**Dot pitch** is the same thing in reverse: the distance between pixel centers, in millimeters (25.4 ÷ PPI). Smaller pitch means finer detail.',
          'Higher PPI makes text and images sharper at the same distance, but only up to a point. Beyond the **retina distance** — where one pixel covers less than 1 arcminute of your vision, the limit of 20/20 eyesight — extra pixels are hard to see.',
        ],
      },
      {
        id: 'scaling',
        heading: 'PPI and display scaling',
        blocks: [
          'Windows and macOS lay out apps assuming roughly 96–110 PPI at 100% scaling for a desktop monitor at arm’s length. Denser screens need scaling to keep text readable; the calculator suggests a value based on that target.',
          {
            ul: [
              '**~90–110 PPI** (24″ 1080p, 27″ 1440p, 34″ 3440 × 1440): use **100%**. Text is sharp enough and you get the full workspace.',
              '**~120–140 PPI** (24″ 1440p, 32″ 4K, 15.6″ 1080p laptops): **125%** is typical; some people prefer 100% on a 32″ 4K for more space.',
              '**~160 PPI** (27″ 4K): **150%**, which gives the workspace of a 2560 × 1440 screen with much crisper text.',
              '**~210–220 PPI** (27″ 5K, 14″ 2560 × 1600 laptops): **200%** on Windows. On macOS this is the classic “Retina” density.',
            ],
          },
          'Non-integer scaling (125%, 150%) works well in modern apps, but some older Windows apps can look blurry. Check text rendering with the [text clarity test](/text-clarity).',
        ],
      },
      {
        id: 'comparison',
        heading: 'PPI of popular screen sizes',
        blocks: [
          {
            table: {
              head: ['Screen', 'Resolution', 'PPI', 'Retina distance', 'Typical scaling'],
              rows: [
                ['24″ monitor', '1920 × 1080', '92', '95 cm / 37″', '100%'],
                ['24″ monitor', '2560 × 1440', '122', '71 cm / 28″', '100–125%'],
                ['27″ monitor', '1920 × 1080', '82', '107 cm / 42″', '100%'],
                ['27″ monitor', '2560 × 1440', '109', '80 cm / 32″', '100%'],
                ['27″ monitor', '3840 × 2160', '163', '54 cm / 21″', '150%'],
                ['27″ monitor', '5120 × 2880', '218', '40 cm / 16″', '200%'],
                ['32″ monitor', '3840 × 2160', '138', '63 cm / 25″', '125–150%'],
                ['34″ ultrawide', '3440 × 1440', '110', '80 cm / 31″', '100%'],
                ['15.6″ laptop', '1920 × 1080', '141', '62 cm / 24″', '125%'],
                ['55″ TV', '3840 × 2160', '80', '109 cm / 43″', '—'],
                ['65″ TV', '3840 × 2160', '68', '129 cm / 51″', '—'],
              ],
            },
          },
          'Most people sit 50–80 cm from a desktop monitor. If you sit closer than the retina distance you may see individual pixels or slightly jagged text, which is why 27″ 1440p looks fine at arm’s length but a 27″ 1080p can look soft.',
        ],
      },
      {
        id: 'accuracy',
        heading: 'About the detected resolution',
        blocks: [
          'The calculator reads your screen size and scaling from the browser and multiplies them to estimate physical pixels. That’s the resolution your OS is sending, which normally equals the panel’s native resolution. Browser zoom changes the estimate, and browsers can’t report the screen’s diagonal — enter it yourself. Check the details on the [screen resolution](/screen-resolution) page.',
          'To measure your screen’s physical size without a tape measure, try the [screen ruler](/screen-ruler); to compare sizes and viewing distances, use the [screen size calculator](/screen-size-calculator).',
        ],
      },
    ],
    tips: [
      'Use the panel’s native resolution, not a scaled one.',
      'Diagonal is the advertised size in inches (corner to corner of the visible area).',
      'Laptop and phone sizes are often fractional — 13.6″, 14.2″, 6.3″.',
      'Set browser zoom to 100% for an accurate detected resolution.',
    ],
    related: ['screen-size-calculator', 'screen-ruler', 'screen-resolution', 'text-clarity'],
    affiliates: 'textClarity',
    faqs: [
      {
        question: 'How do I calculate PPI?',
        answer:
          'Divide the diagonal resolution by the diagonal size: PPI = √(width² + height²) ÷ diagonal in inches. For 1920 × 1080 on a 24″ screen that’s √(1920² + 1080²) ≈ 2203 ÷ 24 ≈ 92 PPI.',
      },
      {
        question: 'What is a good PPI for a monitor?',
        answer:
          'Around 100–110 PPI is comfortable at 100% scaling for most people at arm’s length. 140–165 PPI with 125–150% scaling looks noticeably sharper for text. Above about 200 PPI the gains are small at desktop distances.',
      },
      {
        question: 'Is PPI the same as DPI?',
        answer:
          'People use them interchangeably for screens, but strictly PPI is pixels on a display and DPI is ink dots for printers. Windows also uses “DPI” to mean its scaling setting (96 DPI = 100%), which is different from your panel’s physical PPI.',
      },
      {
        question: 'What does “retina distance” mean?',
        answer:
          'It’s the viewing distance beyond which a person with 20/20 vision (about 1 arcminute of acuity) can no longer pick out individual pixels. It equals roughly 3438 ÷ PPI inches. Sit farther than that and the screen looks perfectly smooth.',
      },
      {
        question: 'Does higher PPI use more GPU power?',
        answer:
          'Resolution does, not PPI. A 27″ 4K and a 32″ 4K are equally demanding to render. Higher-PPI screens at the same size usually mean more pixels, so games need more GPU power — but the desktop is usually fine.',
      },
    ],
  },
};
