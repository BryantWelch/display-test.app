/** Amazon Associate product catalog + per-page recommendations. */

export const products = {
  matrix4k: {
    name: 'The Matrix (4K Ultra HD)',
    href: 'https://amzn.to/3TJOH3K',
    note: 'The source material—great on a calibrated display once you’re done watching the rain.',
  },
  whoosh: {
    name: 'WHOOSH! Screen Cleaner Kit',
    href: 'https://amzn.to/4yXtKlM',
    note: 'Alcohol-free cleaner + cloth so dust and fingerprints don’t fake out your test results.',
  },
  benqScreenBar: {
    name: 'BenQ ScreenBar Halo Monitor Light',
    href: 'https://amzn.to/4z1eEMl',
    note: 'Monitor-mounted desk light that brightens your workspace without reflecting on the screen.',
  },
  screenMom: {
    name: 'Screen Mom Screen Cleaner Kit',
    href: 'https://amzn.to/4q59s5H',
    note: 'Large 16oz bottle and microfiber cloth for monitors, TVs, and laptops.',
  },
  ugreenDp: {
    name: 'UGREEN DisplayPort Cable',
    href: 'https://amzn.to/3U1ajbJ',
    note: 'VESA-friendly DP cable so high refresh rates and resolutions actually make it to the panel.',
  },
  cableMattersHdmi: {
    name: 'Cable Matters HDMI 2.1 Cable',
    href: 'https://amzn.to/4wPUl2T',
    note: 'Certified Ultra High Speed HDMI for 4K high-refresh and console / GPU setups.',
  },
  lgUltragear: {
    name: 'LG UltraGear 27" Gaming Monitor',
    href: 'https://amzn.to/4z7dJd8',
    note: 'Fast IPS gaming panel when motion clarity is the priority.',
  },
  dellPlus: {
    name: 'Dell Plus 31.5" 4K Monitor',
    href: 'https://amzn.to/4hVh2hg',
    note: 'Large 4K desktop display for sharper text and everyday productivity.',
  },
  asusProArt: {
    name: 'ASUS ProArt PA278CV 27" Monitor',
    href: 'https://amzn.to/3RXlGAM',
    note: 'Calman-verified color-accurate IPS for photo, design, and calibration work.',
  },
  alienwareOled: {
    name: 'Alienware 34" QD-OLED Ultrawide',
    href: 'https://amzn.to/45NjHlT',
    note: 'Curved QD-OLED ultrawide with near-instant response and deep contrast.',
  },
  digitalVideoEssentials: {
    name: 'Digital Video Essentials HD Basics',
    href: 'https://amzn.to/49qsgGm',
    note: 'Classic calibration disc for basic TV picture setup.',
  },
  disneyWow: {
    name: 'Disney WOW Calibration Disc',
    href: 'https://amzn.to/4nugIFo',
    note: 'Guided living-room calibration if you want something approachable.',
  },
  spearsMunsil: {
    name: 'Spears & Munsil HD Benchmark Disc',
    href: 'https://amzn.to/4oB33gK',
    note: 'Detailed patterns for sharpness, geometry, and levels on a Blu-ray player.',
  },
  calibrite123: {
    name: 'Calibrite Display 123 Colorimeter',
    href: 'https://amzn.to/47sfXqr',
    note: 'Entry-level meter for a reliable brightness and color baseline.',
  },
  calibriteProHl: {
    name: 'Calibrite Display Pro HL',
    href: 'https://amzn.to/43DioFx',
    note: 'Higher-capability meter for bright / HDR-capable displays.',
  },
  spyderX: {
    name: 'Datacolor SpyderX Pro',
    href: 'https://amzn.to/4nuMKkS',
    note: 'Popular all-around calibrator for desktop monitors.',
  },
  i1Basic: {
    name: 'X-Rite i1Basic Pro 3',
    href: 'https://amzn.to/4qwoph5',
    note: 'Spectrophotometer option for more advanced calibration workflows.',
  },
};

/** Calibration software (not affiliate links). */
export const software = [
  {
    name: 'DisplayCAL',
    href: 'https://displaycal.net/',
    note: 'Free, open-source profiling with most colorimeters. The usual starting point.',
  },
  {
    name: 'Calman',
    href: 'https://store.portrait.com/consumer-software.html',
    note: 'Commercial calibration suite used by reviewers and TV calibrators; supports AutoCal on many TVs.',
  },
  {
    name: 'QuickGamma',
    href: 'https://quickgamma.de/indexen.html',
    note: 'Free Windows utility for visual gamma adjustment when you don’t own a meter.',
  },
  {
    name: 'Calibrize',
    href: 'https://windowsreport.com/software/colorjinn-calibrize/',
    note: 'Simple guided visual calibration for Windows. Better than nothing, not a substitute for a meter.',
  },
];

/** Sections for the /gear page. */
export const gearSections = [
  {
    id: 'meters',
    title: 'Colorimeters',
    intro:
      'The only way to get real numbers — brightness in nits, measured gamma, white point, and Delta E. Worth it if you do photo/video work or want a TV properly calibrated.',
    products: [products.calibrite123, products.spyderX, products.calibriteProHl, products.i1Basic],
  },
  {
    id: 'discs',
    title: 'Calibration discs',
    intro:
      'For TVs fed by a Blu-ray / 4K player. They contain the same kinds of patterns as this site, but go through your player’s video path.',
    products: [products.spearsMunsil, products.digitalVideoEssentials, products.disneyWow],
  },
  {
    id: 'cables',
    title: 'Cables',
    intro:
      'If the refresh rate test shows 60 Hz on a high-refresh monitor, the cable or port is a common culprit. Use DisplayPort 1.4+ or certified HDMI 2.1.',
    products: [products.ugreenDp, products.cableMattersHdmi],
  },
  {
    id: 'cleaning',
    title: 'Cleaning & lighting',
    intro:
      'Dust looks like dead pixels and glare looks like uniformity problems. Clean first; light the desk, not the screen.',
    products: [products.whoosh, products.screenMom, products.benqScreenBar],
  },
  {
    id: 'monitors',
    title: 'Monitors we point people to',
    intro:
      'When a panel fails the checkup, these are sensible replacements by use case: color work, fast IPS gaming, OLED contrast, and large 4K productivity.',
    products: [products.asusProArt, products.lgUltragear, products.alienwareOled, products.dellPlus],
  },
];

export const pageAffiliates = {
  deadPixel: {
    title: 'Clean the screen, then decide what’s next',
    intro:
      'Dust and smudges look a lot like defects. If you’re replacing the panel, a sharper 4K display is a common upgrade path.',
    products: [products.whoosh, products.screenMom, products.dellPlus],
  },
  uniformity: {
    title: 'If the panel stays (or you’re shopping)',
    intro:
      'After you’ve checked for blotches and bleed, these are practical next steps—either clean up what you have or improve the desk setup around it.',
    products: [products.screenMom, products.benqScreenBar, products.asusProArt],
  },
  brightness: {
    title: 'Set brightness with less guesswork',
    intro:
      'A quick clean helps you see the real white level. A meter locks in a comfortable target—and better desk lighting means you can run the panel dimmer.',
    products: [products.benqScreenBar, products.calibrite123, products.whoosh],
  },
  contrast: {
    title: 'When you want deeper blacks',
    intro:
      'Checkerboards show washout by eye. OLED contrast is a different league if you’re shopping—or calibrate what you already own.',
    products: [products.alienwareOled, products.spyderX, products.calibrite123],
  },
  gamma: {
    title: 'When OSD tweaks aren’t enough',
    intro:
      'A colorimeter measures what your eyes can only guess. Pair one with calibration software for a stable tone curve.',
    products: [products.calibrite123, products.calibriteProHl, products.spyderX],
  },
  colorGradient: {
    title: 'Smoothing gradients with better color tools',
    intro:
      'Banding often improves with a proper profile—and a factory-calibrated panel gives you a stronger starting point.',
    products: [products.asusProArt, products.calibriteProHl, products.i1Basic],
  },
  colorDistance: {
    title: 'For color-critical work',
    intro:
      'If similar colors look muddy, a color-accurate monitor plus a hardware profile is the usual next step.',
    products: [products.asusProArt, products.calibrite123, products.calibriteProHl],
  },
  viewingAngle: {
    title: 'Wide angles and living-room setups',
    intro:
      'IPS and OLED hold up better off-axis. For TVs, a calibration disc still helps after you’ve checked seating positions.',
    products: [products.asusProArt, products.alienwareOled, products.spearsMunsil],
  },
  testPatterns: {
    title: 'Physical discs for TV and Blu-ray setups',
    intro:
      'Browser patterns are great on a PC. If you’re calibrating from a disc player, these are the usual home-theater picks.',
    products: [products.spearsMunsil, products.digitalVideoEssentials, products.disneyWow],
  },
  responseTime: {
    title: 'Faster panels and the cables that keep up',
    intro:
      'Motion clarity is mostly the monitor—then make sure DisplayPort or HDMI 2.1 isn’t the bottleneck.',
    products: [products.lgUltragear, products.alienwareOled, products.ugreenDp, products.cableMattersHdmi],
  },
  textClarity: {
    title: 'Sharper text starts with pixels (and a clean screen)',
    intro:
      'Higher PPI makes UI text easier to read. Good desk light and a clean panel help almost as much as resolution.',
    products: [products.dellPlus, products.benqScreenBar, products.whoosh],
  },
  matrix: {
    title: 'Watch the real thing',
    intro: 'You ran the homage. Here’s the film that started the green-rain aesthetic.',
    products: [products.matrix4k],
  },
};
