/** Display order and copy for test groupings on Home, the nav mega-menu, and the footer. */
export const CATEGORIES = [
  {
    id: 'start',
    label: 'Start here',
    description: 'Find out what your display and browser actually report before you test anything.',
  },
  {
    id: 'defects',
    label: 'Panel defects',
    description: 'Dead and stuck pixels, backlight bleed, uniformity, blooming, and burn-in.',
  },
  {
    id: 'color',
    label: 'Color & tone',
    description: 'Gamma, banding, black and white levels, color discrimination, and wide gamut.',
  },
  {
    id: 'motion',
    label: 'Motion & refresh',
    description: 'Refresh rate, ghosting, frame skipping, and input polling.',
  },
  {
    id: 'clarity',
    label: 'Sharpness & geometry',
    description: 'Text rendering, test patterns, chroma subsampling, and overscan.',
  },
  {
    id: 'utilities',
    label: 'Utilities & calculators',
    description: 'Solid-color screens, touch testing, and size / PPI math.',
  },
  {
    id: 'fun',
    label: 'Just for fun',
    description: 'Not a measurement — just something nice to look at on a good panel.',
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
