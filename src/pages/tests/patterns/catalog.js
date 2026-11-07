import * as g from './generators.js';

export const PATTERN_CATEGORIES = [
  { value: 'check', label: 'Check' },
  { value: 'color', label: 'Color' },
  { value: 'geometry', label: 'Geometry' },
];

const opts = (values, fmt = (v) => String(v)) => values.map((v) => ({ value: v, label: fmt(v) }));
const px = (v) => (v === 'log' ? 'Log' : `${v}px`);

/**
 * Pattern definitions, in display order. draw(ctx, width, height, variant) renders at device pixels.
 * `variants` (optional) shows a segmented control; the first entry is the default.
 * `invertible` enables the Invert toggle for black/white patterns.
 */
export const PATTERNS = [
  // Check
  {
    id: 'overscan-aspect',
    category: 'check',
    name: 'Overscan & aspect',
    help: 'The outer white line is the very edge pixel — all four sides should be visible. Colored frames mark 1–5% insets; the circle must be round and the square square.',
    draw: g.overscanAspect,
  },
  {
    id: 'sharpness',
    category: 'check',
    name: 'Sharpness / overshoot',
    help: 'Edges of the black and white blocks should meet the gray cleanly. A bright or dark outline hugging an edge is sharpening; soft, gray line pairs mean blur or scaling.',
    draw: g.sharpness,
    invertible: true,
  },
  {
    id: 'clipping',
    category: 'check',
    name: 'Clipping targets',
    help: 'Every ring in both targets should be distinguishable from its neighbor. Rings merging into the outer one = crushed blacks (left) or clipped whites (right).',
    variants: [
      { value: 'full', label: 'Full range (0–255)' },
      { value: 'video', label: 'Video (16–235)' },
    ],
    draw: g.clippingTargets,
  },
  {
    id: 'color-wipe',
    category: 'check',
    name: 'Color wipe',
    help: 'Each ramp should be smooth from end to end. Visible steps = banding; a flat region at either end = clipping; a tint in the white end of the full ramps = color cast.',
    variants: [
      { value: 'full', label: 'Black → color → white' },
      { value: 'half', label: 'Black → color' },
    ],
    draw: g.colorWipe,
  },
  {
    id: 'composite',
    category: 'check',
    name: 'Composite chart',
    help: 'An overview: smooth RGB ramps, 12 saturated hues, 1px tiles that look flat, a gamma row (the patch that vanishes into its stripes ≈ your gamma), and 12 distinct gray steps.',
    draw: g.composite,
  },
  {
    id: 'low-contrast',
    category: 'check',
    name: 'Low-contrast detail',
    help: 'Rows are base gray levels, columns are the level difference. Small differences are hard to see by design; whole dark rows that look flat suggest black crush, flat light rows suggest clipping.',
    variants: [
      { value: 'checker', label: 'Checker' },
      { value: 'lines', label: 'Lines' },
    ],
    draw: g.lowContrast,
  },
  {
    id: 'gamma',
    category: 'check',
    name: 'Gamma chart',
    help: 'Step back or squint: the column where the solid patch blends into its 1px stripes is your approximate mid-tone gamma for that channel (2.2 is the usual target). Rows should agree.',
    variants: [
      { value: 'lines', label: 'Lines' },
      { value: 'checker', label: 'Checker' },
    ],
    draw: g.gammaChart,
  },
  {
    id: 'pattern-tiles',
    category: 'check',
    name: '1px pattern tiles',
    help: 'Every tile should look like a flat, even texture. Moiré bands, shimmer, or tiles that turn into gray mush mean the image is being scaled or sharpened.',
    draw: g.patternTiles,
    invertible: true,
  },
  {
    id: 'wedge',
    category: 'check',
    name: 'Resolution wedge',
    help: 'Lines should stay separate down to pitch 2 (1px on, 1px off) and merge only below it. Moiré or color fringes before pitch 2 indicate scaling, sharpening, or chroma subsampling.',
    variants: [
      { value: 'h', label: 'Horizontal' },
      { value: 'v', label: 'Vertical' },
    ],
    draw: g.resolutionWedge,
    invertible: true,
  },
  {
    id: 'star',
    category: 'check',
    name: 'Resolution star',
    help: 'The center turns solid as lines converge — that is normal. The moiré around it should be symmetric and gray; lopsided or colored moiré points to scaling or subsampling.',
    draw: g.resolutionStar,
    invertible: true,
  },
  {
    id: 'border',
    category: 'check',
    name: 'Edge lines',
    help: 'Eight 1px frames, 2px apart, at the screen edge. You should count all eight on every side; missing frames = overscan, merged or uneven frames = scaling.',
    draw: g.borderLines,
    invertible: true,
  },

  // Color
  {
    id: 'bars-h',
    category: 'color',
    name: 'Color bars (horizontal)',
    help: 'Bars should be vivid and evenly bright with sharp boundaries. Continuous mode should blend smoothly with no bands or jumps.',
    variants: opts([3, 6, 12, 'cont'], (v) => (v === 'cont' ? 'Continuous' : String(v))),
    draw: (ctx, w, h, v) => g.colorBars(ctx, w, h, v, 'h'),
  },
  {
    id: 'bars-v',
    category: 'color',
    name: 'Color bars (vertical)',
    help: 'Same as horizontal bars, rotated. Boundaries between bars should be crisp; colored fringes at edges can indicate chroma subsampling.',
    variants: opts([3, 6, 12, 'cont'], (v) => (v === 'cont' ? 'Continuous' : String(v))),
    draw: (ctx, w, h, v) => g.colorBars(ctx, w, h, v, 'v'),
  },
  {
    id: 'rgb4096',
    category: 'color',
    name: '4,096 color patches',
    help: '16 levels of red (across), green (down), and blue (per block). Neighboring cells should all be distinct; merged cells at the bright end mean clipping.',
    draw: g.rgb4096,
  },
  {
    id: 'random-color',
    category: 'color',
    name: 'Random color noise',
    help: 'Stable seeded noise. Detail should look equally crisp across the screen; smearing or blocky color at 1px suggests scaling or chroma subsampling.',
    variants: opts([1, 2, 4, 8, 16], px),
    draw: (ctx, w, h, v) => g.randomBlocks(ctx, w, h, v, 'color'),
  },
  {
    id: 'random-gray',
    category: 'color',
    name: 'Random gray noise',
    help: 'Fine gray noise exposes sharpening halos and uneven coatings. A faint grainy sparkle on matte screens is normal anti-glare texture.',
    variants: opts([1, 2, 4, 8, 16], px),
    draw: (ctx, w, h, v) => g.randomBlocks(ctx, w, h, v, 'gray'),
  },
  {
    id: 'triangle',
    category: 'color',
    name: 'RGB triangle',
    help: 'A straight mix of red, green, and blue. Blends should be smooth with no bands; a muddy center is expected because it is a linear RGB mix.',
    variants: [
      { value: 'solid', label: 'Solid' },
      { value: 'wireframe', label: 'Wireframe' },
    ],
    draw: g.rgbTriangle,
  },

  // Geometry
  {
    id: 'stripe-bands',
    category: 'geometry',
    name: 'Stripe bands',
    help: 'Bands of 1, 2, 3, 4, 6, and 8px stripes. Every stripe in a band should be the same width and brightness; uneven or beating stripes mean non-native resolution.',
    variants: [
      { value: 'h', label: 'Horizontal' },
      { value: 'v', label: 'Vertical' },
    ],
    draw: g.stripeBands,
    invertible: true,
  },
  {
    id: 'checkers',
    category: 'geometry',
    name: 'Checkerboard',
    help: 'Squares should be perfectly even. A 1px checker should look like flat gray from a distance; flicker or crawling on it is LCD inversion or overdrive artifacts.',
    variants: opts([1, 2, 4, 8, 16, 32, 'log'], px),
    draw: g.checkers,
    invertible: true,
  },
  {
    id: 'distortion',
    category: 'geometry',
    name: 'Circles & squares',
    help: 'Circles must be round and squares square everywhere on the screen. Ovals or rectangles mean the picture is stretched (wrong aspect or scaling mode).',
    variants: [
      { value: 'circles', label: 'Circle grid' },
      { value: 'squares', label: 'Square grid' },
      { value: 'one', label: 'One circle' },
    ],
    draw: g.distortion,
    invertible: true,
  },
  {
    id: 'lines-h',
    category: 'geometry',
    name: 'Horizontal lines',
    help: '1px lines at a fixed pitch. Every line should be equally bright and sharp; alternating bright/dim lines or wavy shimmer mean vertical scaling.',
    variants: opts([2, 3, 4, 8, 'log'], px),
    draw: (ctx, w, h, v) => g.lines(ctx, w, h, v, 'h'),
    invertible: true,
  },
  {
    id: 'lines-v',
    category: 'geometry',
    name: 'Vertical lines',
    help: '1px vertical lines. They should be crisp and uniform; color fringes on every line are subpixel layout, but uneven brightness means horizontal scaling.',
    variants: opts([2, 3, 4, 8, 'log'], px),
    draw: (ctx, w, h, v) => g.lines(ctx, w, h, v, 'v'),
    invertible: true,
  },
  {
    id: 'points',
    category: 'geometry',
    name: 'Points',
    help: 'Single lit pixels on a regular grid. Every dot should be the same size and brightness; missing or smeared dots mean scaling (or, if one is always dark, a dead pixel).',
    variants: opts([2, 4, 8, 16, 32], px),
    draw: g.points,
    invertible: true,
  },
  {
    id: 'squares',
    category: 'geometry',
    name: 'Squares',
    help: 'A grid of equal squares and gaps. Squares should be identical across the screen with straight, even gaps.',
    variants: opts([2, 4, 8, 16, 32], px),
    draw: g.squares,
    invertible: true,
  },
];
