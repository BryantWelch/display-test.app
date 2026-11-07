export default {
  slug: 'screen-ruler',
  order: 650,
  category: 'utilities',
  name: 'Screen Ruler',
  shortName: 'Screen Ruler',
  badges: ['New'],
  summary: 'An actual-size on-screen ruler in cm and inches, calibrated with any bank card.',
  seo: {
    title: 'Online Ruler (Actual Size) — Calibrated Screen Ruler in cm, mm & Inches',
    description:
      'A real-size ruler on your screen. Calibrate in seconds with a credit card, then measure in centimeters, millimeters, or inches — and find your screen’s physical size and diagonal. Free.',
  },
  inlineTool: () => import('../../tools/ScreenRuler'),
  page: {
    title: 'Screen Ruler',
    intro:
      'Screens all have different pixel densities, so an on-screen ruler is only accurate once it knows how big your pixels are. Calibrate once with a bank card, and get a true-size ruler in cm and inches plus your screen’s real width, height, and diagonal.',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'how-to',
        heading: 'How to calibrate',
        blocks: [
          {
            ol: [
              'Set browser zoom to **100%** (Ctrl + 0, or ⌘ + 0 on a Mac).',
              'Take any credit card, debit card, driver’s license, or ID card. They all share the **ID-1** size from ISO/IEC 7810: **85.60 × 53.98 mm** (3.370 × 2.125 in).',
              'Hold the card flat against the screen with one corner on the top-left corner of the blue box.',
              'Drag the slider (or use **Smaller / Larger** for fine steps) until the box’s edges line up with the card on all sides.',
              'Click **Save calibration**. It’s stored in this browser, so the ruler stays accurate next time on this screen.',
            ],
          },
          'Know your screen’s exact diagonal? Enter it instead and click **Calibrate from size**. That’s often more precise than matching a card by eye.',
          {
            note: 'Library cards, gift cards, and loyalty cards are usually the same size, but not always. Use a bank card or ID if you can.',
          },
        ],
      },
      {
        id: 'accuracy',
        heading: 'Why the ruler needs calibrating',
        blocks: [
          'Web pages measure everything in **CSS pixels**, which are defined as 1/96 of an inch — but that’s a convention, not a real measurement. A 27″ 1440p monitor, a 4K laptop, and a phone all show a “1 cm” CSS line at different physical lengths. Calibration measures the real number of CSS pixels per millimeter on your screen.',
          'Things that break calibration:',
          {
            ul: [
              '**Browser zoom.** Anything other than 100% scales the ruler. The tool warns you if zoom or scaling has changed since you saved.',
              '**Changing OS display scaling** or resolution — recalibrate afterwards.',
              '**Moving the window to another monitor.** Each screen needs its own calibration.',
            ],
          },
          'Carefully calibrated, the ruler is usually accurate to within about 1%. For anything critical, use a physical ruler.',
        ],
      },
      {
        id: 'screen-size',
        heading: 'Measuring your screen size',
        blocks: [
          'Once calibrated, the tool divides your screen’s reported size (in CSS pixels) by the calibrated pixels per millimeter to estimate its physical width, height, and diagonal. It’s a quick way to find a laptop’s screen size without a tape measure, or to check what an unbranded portable monitor really is.',
          'To go the other way — from a known size to pixel density — use the [PPI calculator](/ppi-calculator). To compare two screens or plan a viewing distance, try the [screen size calculator](/screen-size-calculator).',
        ],
      },
      {
        id: 'uses',
        heading: 'What people use it for',
        blocks: [
          {
            ul: [
              'Measuring small objects — screws, jewelry, a ring’s width, a coin — by holding them against the screen.',
              'Checking print layouts, icons, and UI mockups at real size.',
              'Finding the true size of a screen you can’t easily measure.',
              'Checking whether text on a web page is a readable physical size at your viewing distance.',
            ],
          },
        ],
      },
    ],
    tips: [
      'Set browser zoom to 100% before calibrating.',
      'Look straight at the card — viewing at an angle makes edges appear offset.',
      'Calibrate each monitor separately.',
      'On phones and small tablets, turn the card upright to fit.',
    ],
    related: ['ppi-calculator', 'screen-size-calculator', 'screen-resolution', 'text-clarity'],
    faqs: [
      {
        question: 'Is this online ruler actual size?',
        answer:
          'Only after calibrating. Without calibration it assumes 96 CSS pixels per inch, which is rarely correct. Match the box to a bank card or enter your screen’s diagonal, and the ruler becomes actual size on that screen.',
      },
      {
        question: 'What size is a credit card in mm and inches?',
        answer:
          'Credit, debit, and most ID cards follow the ISO/IEC 7810 ID-1 format: 85.60 × 53.98 mm, or 3.370 × 2.125 inches, with corners rounded at about 3.18 mm.',
      },
      {
        question: 'How do I find my screen size without a tape measure?',
        answer:
          'Calibrate the ruler with a bank card. The tool then calculates your screen’s width, height, and diagonal from the screen size the browser reports. Expect it to be within a few percent of the advertised size.',
      },
      {
        question: 'Why is the ruler wrong on my phone?',
        answer:
          'Phones have very high pixel density and the browser reports scaled CSS pixels, so the default is almost always off. Calibrate with a card held upright, and make sure page zoom or text-size settings aren’t enlarging the page.',
      },
      {
        question: 'Does my calibration get saved?',
        answer:
          'Yes, in this browser’s local storage on this device. Nothing is uploaded. Clear it any time with **Clear calibration**, and recalibrate if you change zoom, scaling, or monitors.',
      },
    ],
  },
};
