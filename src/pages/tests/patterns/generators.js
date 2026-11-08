/**
 * Procedural test-pattern generators. Every function draws into an untransformed 2D context
 * whose backing store is in device pixels (see PixelCanvas), using integer fillRect calls or
 * ImageData so 1px detail lands on exactly one physical pixel. Signature: (ctx, width, height, variant).
 */

const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

/** Small, fast seeded PRNG so random patterns look the same on every visit. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer split of `total` into `n` parts: [0, ..., total]. */
const edges = (total, n) => Array.from({ length: n + 1 }, (_, i) => Math.round((i * total) / n));

const fontSize = (w, h) => Math.max(11, Math.round(Math.min(w, h) / 60));

function fill(ctx, color, x, y, w, h) {
  ctx.fillStyle = typeof color === 'string' ? color : rgb(color);
  ctx.fillRect(x, y, w, h);
}

function label(ctx, text, x, y, { color = '#fff', size = 14, align = 'left', baseline = 'top' } = {}) {
  ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, Math.round(x), Math.round(y));
}

/** Two-color pattern from a predicate over local coordinates. */
function binary(ctx, x0, y0, w, h, pred, fg = WHITE, bg = BLACK) {
  if (w <= 0 || h <= 0) return;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  let i = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 4) {
      const c = pred(x, y) ? fg : bg;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, x0, y0);
}

/** Bresenham line; calls plot(x, y) for every pixel. */
function line(x0, y0, x1, y1, plot) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const xe = Math.round(x1);
  const ye = Math.round(y1);
  const dx = Math.abs(xe - x);
  const dy = -Math.abs(ye - y);
  const sx = x < xe ? 1 : -1;
  const sy = y < ye ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    plot(x, y);
    if (x === xe && y === ye) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

/** Full-canvas pixel buffer with aliased drawing primitives. Call commit() when done. */
function createRaster(ctx, w, h, bg = BLACK) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = bg[0];
    d[i + 1] = bg[1];
    d[i + 2] = bg[2];
    d[i + 3] = 255;
  }
  const set = (x, y, c) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    d[i] = c[0];
    d[i + 1] = c[1];
    d[i + 2] = c[2];
  };
  return {
    set,
    line: (x0, y0, x1, y1, c) => line(x0, y0, x1, y1, typeof c === 'function' ? (x, y) => set(x, y, c(x, y)) : (x, y) => set(x, y, c)),
    hline: (x0, x1, y, c) => {
      for (let x = x0; x <= x1; x++) set(x, y, c);
    },
    vline: (x, y0, y1, c) => {
      for (let y = y0; y <= y1; y++) set(x, y, c);
    },
    rect(x0, y0, x1, y1, c) {
      this.hline(x0, x1, y0, c);
      this.hline(x0, x1, y1, c);
      this.vline(x0, y0, y1, c);
      this.vline(x1, y0, y1, c);
    },
    /** 1px midpoint circle around an integer center. */
    circle(cx, cy, r, c) {
      let x = r;
      let y = 0;
      let err = 1 - r;
      while (x >= y) {
        set(cx + x, cy + y, c);
        set(cx - x, cy + y, c);
        set(cx + x, cy - y, c);
        set(cx - x, cy - y, c);
        set(cx + y, cy + x, c);
        set(cx - y, cy + x, c);
        set(cx + y, cy - x, c);
        set(cx - y, cy - x, c);
        y += 1;
        if (err < 0) {
          err += 2 * y + 1;
        } else {
          x -= 1;
          err += 2 * (y - x) + 1;
        }
      }
    },
    commit: () => ctx.putImageData(img, 0, 0),
  };
}

/** Solid disc around an integer center, row by row so edges are aliased. */
function disc(ctx, cx, cy, r, color) {
  ctx.fillStyle = rgb(color);
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r * r - dy * dy));
    ctx.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
  }
}

/** Horizontal gradient: colorAt(t in [0,1]) per column. */
function hRamp(ctx, x0, y0, w, h, colorAt) {
  for (let x = 0; x < w; x++) {
    fill(ctx, colorAt(w > 1 ? x / (w - 1) : 0), x0 + x, y0, 1, h);
  }
}

/** Vertical gradient: colorAt(t in [0,1]) per row. */
function vRamp(ctx, x0, y0, w, h, colorAt) {
  for (let y = 0; y < h; y++) {
    fill(ctx, colorAt(h > 1 ? y / (h - 1) : 0), x0, y0 + y, w, 1);
  }
}

const scale = (c, t) => c.map((v) => Math.round(v * t));

/** Fully saturated hue (degrees) as integer RGB. */
export function hueRGB(deg) {
  const h6 = (((deg % 360) + 360) % 360) / 60;
  const i = Math.floor(h6);
  const f = h6 - i;
  const q = Math.round(255 * (1 - f));
  const t = Math.round(255 * f);
  return [
    [255, t, 0],
    [q, 255, 0],
    [0, 255, t],
    [0, q, 255],
    [t, 0, 255],
    [255, 0, q],
  ][i];
}

const textOn = (c) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] > 110 ? '#000' : '#fff');

/** Inverts every pixel exactly (255 - v), for the panel's Invert toggle. */
export function invertCanvas(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
  }
  ctx.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------------------------

const CLIP_LEVELS = {
  full: { dark: [0, 2, 4, 6, 8, 12, 16, 24], light: [255, 253, 251, 249, 247, 243, 239, 231] },
  video: { dark: [16, 18, 20, 22, 24, 28, 32, 40], light: [235, 233, 231, 229, 227, 223, 219, 211] },
};

/** Two concentric-ring targets near black and near white on mid-gray. */
export function clippingTargets(ctx, w, h, variant = 'full') {
  const { dark, light } = CLIP_LEVELS[variant] || CLIP_LEVELS.full;
  fill(ctx, [128, 128, 128], 0, 0, w, h);
  const fs = fontSize(w, h);
  const R = Math.floor(Math.min(w / 4, h / 2) * 0.88);
  const cy = Math.floor(h / 2);
  [
    [Math.floor(w / 4), dark, '#fff'],
    [Math.floor((3 * w) / 4), light, '#000'],
  ].forEach(([cx, levels, textColor]) => {
    const n = levels.length;
    const radii = levels.map((_, i) => Math.round((R * (n - i)) / n));
    levels.forEach((v, i) => disc(ctx, cx, cy, radii[i], [v, v, v]));
    levels.forEach((v, i) => {
      const inner = radii[i + 1] ?? 0;
      label(ctx, String(v), cx, cy + (radii[i] + inner) / 2, { color: textColor, size: fs, align: 'center', baseline: 'middle' });
    });
  });
}

/** Black → color (→ white) ramps for each primary and secondary. */
export function colorWipe(ctx, w, h, variant = 'full') {
  fill(ctx, BLACK, 0, 0, w, h);
  const colors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 255, 255],
  ];
  if (variant === 'half') colors.push(WHITE);
  const gap = Math.max(2, Math.round(h / 100));
  const ys = edges(h + gap, colors.length);
  colors.forEach((c, i) => {
    const y = ys[i];
    const bh = ys[i + 1] - ys[i] - gap;
    hRamp(ctx, 0, y, w, bh, (t) => {
      if (variant === 'half') return scale(c, t);
      if (t <= 0.5) return scale(c, t * 2);
      const k = t * 2 - 1;
      return c.map((v) => Math.round(v + (255 - v) * k));
    });
  });
}

/** 1px pattern tiles: [label, predicate(x, y)]. Shared by the tile chart and the composite. */
export const TILES = [
  ['H 1:1', (x, y) => y % 2 === 0],
  ['H 1:2', (x, y) => y % 3 === 0],
  ['H 2:1', (x, y) => y % 3 !== 0],
  ['H 1:3', (x, y) => y % 4 === 0],
  ['H 2:2', (x, y) => (y >> 1) % 2 === 0],
  ['H 3:3', (x, y) => Math.floor(y / 3) % 2 === 0],
  ['V 1:1', (x) => x % 2 === 0],
  ['V 1:2', (x) => x % 3 === 0],
  ['V 2:1', (x) => x % 3 !== 0],
  ['V 1:3', (x) => x % 4 === 0],
  ['V 2:2', (x) => (x >> 1) % 2 === 0],
  ['V 3:3', (x) => Math.floor(x / 3) % 2 === 0],
  ['Grid 2', (x, y) => x % 2 === 0 || y % 2 === 0],
  ['Grid 4', (x, y) => x % 4 === 0 || y % 4 === 0],
  ['Dots 2', (x, y) => x % 2 === 0 && y % 2 === 0],
  ['Dots 3', (x, y) => x % 3 === 0 && y % 3 === 0],
  ['Dots 4', (x, y) => x % 4 === 0 && y % 4 === 0],
  ['Holes 2', (x, y) => !(x % 2 === 0 && y % 2 === 0)],
  ['Check 1', (x, y) => (x + y) % 2 === 0],
  ['Check 2', (x, y) => ((x >> 1) + (y >> 1)) % 2 === 0],
  ['Check 3', (x, y) => (Math.floor(x / 3) + Math.floor(y / 3)) % 2 === 0],
  ['Check 2×1', (x, y) => ((x >> 1) + y) % 2 === 0],
  ['Diag ↘', (x, y) => (x + y) % 4 === 0],
  ['Diag ↙', (x, y) => (((x - y) % 4) + 4) % 4 === 0],
];

/** Grid of 1px line, dot, grid, and checker tiles. */
export function patternTiles(ctx, w, h) {
  fill(ctx, BLACK, 0, 0, w, h);
  const cols = 6;
  const rows = 4;
  const gap = Math.max(2, Math.round(Math.min(w, h) / 120));
  const xs = edges(w - gap, cols);
  const ys = edges(h - gap, rows);
  TILES.forEach(([, pred], i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    binary(ctx, xs[c] + gap, ys[r] + gap, xs[c + 1] - xs[c] - gap, ys[r + 1] - ys[r] - gap, pred);
  });
}

const BASES = [0, 8, 16, 32, 64, 128, 192, 224, 239];
const DELTAS = [1, 2, 3, 4, 6, 8, 12, 16];

/** Low-contrast 1px checkers/lines: rows = base gray, columns = level difference. */
export function lowContrast(ctx, w, h, variant = 'checker') {
  fill(ctx, BLACK, 0, 0, w, h);
  const fs = fontSize(w, h);
  const left = fs * 4;
  const top = fs * 2;
  const gap = Math.max(2, Math.round(Math.min(w, h) / 200));
  const xs = edges(w - left, DELTAS.length).map((x) => x + left);
  const ys = edges(h - top, BASES.length).map((y) => y + top);
  const pred = variant === 'lines' ? (x, y) => y % 2 === 0 : (x, y) => (x + y) % 2 === 0;
  DELTAS.forEach((dv, c) => {
    label(ctx, `+${dv}`, (xs[c] + xs[c + 1]) / 2, top / 2, { size: fs, align: 'center', baseline: 'middle' });
  });
  BASES.forEach((b, r) => {
    label(ctx, String(b), left / 2, (ys[r] + ys[r + 1]) / 2, { size: fs, align: 'center', baseline: 'middle' });
    DELTAS.forEach((dv, c) => {
      const hi = Math.min(255, b + dv);
      binary(ctx, xs[c], ys[r], xs[c + 1] - xs[c] - gap, ys[r + 1] - ys[r] - gap, pred, [hi, hi, hi], [b, b, b]);
    });
  });
}

const gammaLevel = (g) => Math.round(255 * Math.pow(0.5, 1 / g));

/** A 50% dither surround with a solid patch at the level that matches it for gamma g. */
function gammaCell(ctx, x, y, w, h, g, mask, mode, fs) {
  const on = mask.map((m) => m * 255);
  const pred = mode === 'checker' ? (px, py) => (px + py) % 2 === 0 : (px, py) => py % 2 === 0;
  binary(ctx, x, y, w, h, pred, on, BLACK);
  const v = gammaLevel(g);
  const pc = mask.map((m) => m * v);
  const pw = Math.round(w * 0.45);
  const ph = Math.round(h * 0.55);
  const px = x + Math.round((w - pw) / 2);
  const py = y + Math.round((h - ph) / 2);
  fill(ctx, pc, px, py, pw, ph);
  label(ctx, g.toFixed(1), px + pw / 2, py + ph - fs * 0.4, { color: textOn(pc), size: fs, align: 'center', baseline: 'bottom' });
}

/** Gamma chart: rows gray/red/green/blue, columns gamma 1.6–2.8. */
export function gammaChart(ctx, w, h, variant = 'lines') {
  fill(ctx, BLACK, 0, 0, w, h);
  const gammas = [1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8];
  const masks = [
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const fs = fontSize(w, h);
  const gap = Math.max(3, Math.round(Math.min(w, h) / 150));
  const xs = edges(w - gap, gammas.length);
  const ys = edges(h - gap, masks.length);
  masks.forEach((mask, r) => {
    gammas.forEach((g, c) => {
      gammaCell(ctx, xs[c] + gap, ys[r] + gap, xs[c + 1] - xs[c] - gap, ys[r + 1] - ys[r] - gap, g, mask, variant, fs);
    });
  });
}

/** Many charts in one: RGB ramps, hues, 1px tiles, gamma, gray steps, gray ramp. */
export function composite(ctx, w, h) {
  fill(ctx, BLACK, 0, 0, w, h);
  const fs = Math.max(10, Math.round(fontSize(w, h) * 0.8));
  const gap = Math.max(2, Math.round(h / 140));
  const rampH = Math.round(h * 0.04);
  const bottomH = Math.round(h * 0.08);
  const rowsTop = rampH * 3 + gap;
  const rowH = Math.floor((h - rowsTop - bottomH - gap * 5) / 4);
  [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
  ].forEach((c, i) => hRamp(ctx, 0, i * rampH, w, rampH, (t) => scale(c, t)));

  const xs = edges(w + gap, 12);
  const cell = (r, i, fn) => {
    const x = xs[i];
    const y = rowsTop + gap + r * (rowH + gap);
    fn(x, y, xs[i + 1] - xs[i] - gap, rowH);
  };
  for (let i = 0; i < 12; i++) {
    cell(0, i, (x, y, cw, ch) => {
      const c = hueRGB(i * 30);
      fill(ctx, c, x, y, cw, ch);
      label(ctx, c.join(' '), x + cw / 2, y + ch - fs * 0.5, { color: textOn(c), size: fs, align: 'center', baseline: 'bottom' });
    });
    cell(1, i, (x, y, cw, ch) => binary(ctx, x, y, cw, ch, TILES[[0, 4, 5, 6, 10, 11, 12, 14, 16, 18, 19, 20][i]][1]));
    cell(2, i, (x, y, cw, ch) => gammaCell(ctx, x, y, cw, ch, 0.8 + i * 0.2, [1, 1, 1], 'lines', fs));
    cell(3, i, (x, y, cw, ch) => {
      const v = Math.round((i * 255) / 11);
      fill(ctx, [v, v, v], x, y, cw, ch);
      label(ctx, String(v), x + cw / 2, y + ch - fs * 0.5, { color: v > 110 ? '#000' : '#fff', size: fs, align: 'center', baseline: 'bottom' });
    });
  }
  hRamp(ctx, 0, h - bottomH, w, bottomH, (t) => scale(WHITE, t));
}

const INSET_COLORS = [
  [255, 70, 70],
  [255, 200, 0],
  [70, 220, 70],
  [0, 200, 255],
  [170, 120, 255],
];

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

function aspectLabel(w, h) {
  const g = gcd(w, h) || 1;
  const a = w / g;
  const b = h / g;
  const ratio = `${(w / h).toFixed(2)}:1`;
  return b <= 40 ? `${a}:${b} (${ratio})` : ratio;
}

/** New: edge border, 1–5% inset frames, a true circle in a true square, center crosshair. */
export function overscanAspect(ctx, w, h) {
  const r = createRaster(ctx, w, h);
  r.rect(0, 0, w - 1, h - 1, WHITE);
  const insets = INSET_COLORS.map((c, i) => {
    const ix = Math.round((w * (i + 1)) / 100);
    const iy = Math.round((h * (i + 1)) / 100);
    r.rect(ix, iy, w - 1 - ix, h - 1 - iy, c);
    return [ix, iy];
  });
  const mid = [128, 128, 128];
  const cxs = w % 2 ? [(w - 1) / 2] : [w / 2 - 1, w / 2];
  const cys = h % 2 ? [(h - 1) / 2] : [h / 2 - 1, h / 2];
  cxs.forEach((x) => r.vline(x, 0, h - 1, mid));
  cys.forEach((y) => r.hline(0, w - 1, y, mid));
  let D = Math.round(Math.min(w, h) * 0.7);
  if (D % 2 === 0) D -= 1;
  const sx = Math.floor((w - D) / 2);
  const sy = Math.floor((h - D) / 2);
  r.rect(sx, sy, sx + D - 1, sy + D - 1, WHITE);
  r.circle(sx + (D - 1) / 2, sy + (D - 1) / 2, (D - 1) / 2, WHITE);
  r.commit();

  const small = Math.max(9, Math.floor(Math.min(w, h) * 0.009));
  insets.forEach(([ix, iy], i) => {
    const color = rgb(INSET_COLORS[i]);
    label(ctx, `${i + 1}%`, Math.round(w * 0.1) + i * small * 3, iy + 2, { color, size: small });
    label(ctx, `${i + 1}%`, ix + 3, Math.round(h * 0.12) + i * small * 2, { color, size: small });
  });
  const fs = fontSize(w, h);
  const cx = cxs[cxs.length - 1];
  const cy = cys[cys.length - 1];
  label(ctx, `${w} × ${h} px`, cx + fs, cy + fs * 0.6, { size: fs });
  label(ctx, aspectLabel(w, h), cx + fs, cy + fs * 1.9, { size: fs, color: '#aaa' });
}

/** Classic overscan chart: concentric 1px frames every 2px at the edge plus corner diagonals. */
export function borderLines(ctx, w, h) {
  const r = createRaster(ctx, w, h);
  for (let i = 0; i < 8; i++) {
    const k = i * 2;
    r.rect(k, k, w - 1 - k, h - 1 - k, WHITE);
  }
  r.line(0, 0, w - 1, h - 1, WHITE);
  r.line(w - 1, 0, 0, h - 1, WHITE);
  r.commit();
}

/** Fan of lines whose pitch shrinks toward the apex, with pitch markers 1–9. */
export function resolutionWedge(ctx, w, h, variant = 'h') {
  const horiz = variant !== 'v';
  const L = horiz ? w : h;
  const A = horiz ? h : w;
  const r = createRaster(ctx, w, h);
  const plot = horiz ? (u, v) => r.set(u, v, WHITE) : (u, v) => r.set(v, u, WHITE);
  const cv = Math.floor(A / 2);
  const end = 10;
  const K = Math.ceil(A / 2 / end);
  for (let k = -K; k <= K; k++) line(0, cv, L - 1, cv + k * end, plot);
  const fs = fontSize(w, h);
  const stop = A - (horiz ? fs * 2 : fs * 3);
  const marks = [];
  for (let p = 1; p <= 9; p++) {
    const u = Math.round((p * (L - 1)) / 10);
    const start = cv + Math.ceil((K * end * u) / (L - 1)) + 4;
    for (let v = start; v < stop; v++) plot(u, v);
    marks.push([p, u]);
  }
  r.commit();
  marks.forEach(([p, u]) => {
    if (horiz) label(ctx, String(p), u, h - fs * 0.5, { size: fs, align: 'center', baseline: 'bottom' });
    else label(ctx, String(p), w - fs * 0.5, u, { size: fs, align: 'right', baseline: 'middle' });
  });
  label(ctx, 'Line pitch (px)', fs * 0.5, h - fs * 0.5, { size: fs, baseline: 'bottom' });
}

/** Black lines from the center to every few pixels of the perimeter, on white. */
export function resolutionStar(ctx, w, h) {
  const r = createRaster(ctx, w, h, WHITE);
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  const step = Math.max(4, Math.round(Math.min(w, h) / 150));
  const plot = (x, y) => r.set(x, y, BLACK);
  for (let x = 0; x < w; x += step) {
    line(cx, cy, x, 0, plot);
    line(cx, cy, x, h - 1, plot);
  }
  for (let y = 0; y < h; y += step) {
    line(cx, cy, 0, y, plot);
    line(cx, cy, w - 1, y, plot);
  }
  r.commit();
}

/**
 * New: Lagom-style sharpness/overshoot check on mid-gray. Top row: 1px and 2px line pairs and a
 * 1px checker. Bottom row: hard black and white blocks, isolated 1px lines, and 1–4px bars,
 * where sharpening shows up as bright/dark halos hugging each edge.
 */
export function sharpness(ctx, w, h) {
  const G = [128, 128, 128];
  fill(ctx, G, 0, 0, w, h);
  const fs = fontSize(w, h);
  const m = Math.max(fs * 2, Math.round(Math.min(w, h) * 0.06));
  const rowH = Math.floor((h - m * 3) / 2);
  const top = [
    ['1px vertical', (x) => x % 2 === 0],
    ['1px horizontal', (x, y) => y % 2 === 0],
    ['1px checker', (x, y) => (x + y) % 2 === 0],
    ['2px vertical', (x) => (x >> 1) % 2 === 0],
    ['2px horizontal', (x, y) => (y >> 1) % 2 === 0],
  ];
  const xs = edges(w - m, top.length).map((x) => x + m);
  top.forEach(([name, pred], i) => {
    const pw = xs[i + 1] - xs[i] - m;
    binary(ctx, xs[i], m, pw, rowH, pred);
    label(ctx, name, xs[i], m - fs * 0.3, { color: '#000', size: fs, baseline: 'bottom' });
  });

  const y2 = m * 2 + rowH;
  const bx = edges(w - m, 4).map((x) => x + m);
  const bw = (i) => bx[i + 1] - bx[i] - m;
  fill(ctx, BLACK, bx[0], y2, bw(0), rowH);
  fill(ctx, WHITE, bx[1], y2, bw(1), rowH);
  label(ctx, 'Black edge', bx[0], y2 - fs * 0.3, { color: '#000', size: fs, baseline: 'bottom' });
  label(ctx, 'White edge', bx[1], y2 - fs * 0.3, { color: '#000', size: fs, baseline: 'bottom' });

  const lw = bw(2);
  const spacing = Math.max(8, Math.round(lw / 12));
  const half = Math.floor(rowH / 2);
  for (let x = 0, i = 0; x < lw; x += spacing, i++) fill(ctx, i % 2 ? WHITE : BLACK, bx[2] + x, y2, 1, half - spacing);
  for (let y = half, i = 0; y < rowH; y += spacing, i++) fill(ctx, i % 2 ? WHITE : BLACK, bx[2], y2 + y, lw, 1);
  label(ctx, 'Isolated 1px lines', bx[2], y2 - fs * 0.3, { color: '#000', size: fs, baseline: 'bottom' });

  let x = bx[3];
  const xEnd = bx[3] + bw(3);
  for (let k = 1; x < xEnd; k = (k % 4) + 1) {
    fill(ctx, BLACK, x, y2, Math.min(k, xEnd - x), half);
    fill(ctx, WHITE, x, y2 + half, Math.min(k, xEnd - x), rowH - half);
    x += k + spacing;
  }
  label(ctx, '1–4px bars', bx[3], y2 - fs * 0.3, { color: '#000', size: fs, baseline: 'bottom' });
}

// ---------------------------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------------------------

/** Saturated hue bars. variant: 3 | 6 | 12 | 'cont'. dir 'h' stacks horizontal stripes. */
export function colorBars(ctx, w, h, variant = 6, dir = 'h') {
  const horiz = dir === 'h';
  if (variant === 'cont') {
    (horiz ? vRamp : hRamp)(ctx, 0, 0, w, h, (t) => hueRGB(t * 360));
    return;
  }
  const n = Number(variant);
  const cuts = edges(horiz ? h : w, n);
  for (let i = 0; i < n; i++) {
    const c = hueRGB((i * 360) / n);
    if (horiz) fill(ctx, c, 0, cuts[i], w, cuts[i + 1] - cuts[i]);
    else fill(ctx, c, cuts[i], 0, cuts[i + 1] - cuts[i], h);
  }
}

/** 16 levels per channel = 4096 patches: 4×4 blue blocks, red across, green down. */
export function rgb4096(ctx, w, h) {
  fill(ctx, BLACK, 0, 0, w, h);
  const cw = Math.floor(w / 64);
  const ch = Math.floor(h / 64);
  if (!cw || !ch) return;
  const ox = Math.floor((w - cw * 64) / 2);
  const oy = Math.floor((h - ch * 64) / 2);
  const grid = cw >= 6 && ch >= 6 ? 1 : 0;
  for (let b = 0; b < 16; b++) {
    const bx = (b % 4) * 16;
    const by = Math.floor(b / 4) * 16;
    for (let g = 0; g < 16; g++) {
      for (let rr = 0; rr < 16; rr++) {
        fill(ctx, [rr * 17, g * 17, b * 17], ox + (bx + rr) * cw, oy + (by + g) * ch, cw - grid, ch - grid);
      }
    }
  }
}

/** Seeded random blocks of `size` px. variant 'color' | 'gray'. */
export function randomBlocks(ctx, w, h, size = 1, mode = 'color') {
  const s = Math.max(1, Number(size));
  const rand = mulberry32(0x5eed1234 ^ (s * 7919) ^ (mode === 'gray' ? 0xabcdef : 0));
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const bw = Math.ceil(w / s);
  const bh = Math.ceil(h / s);
  const c = [0, 0, 0];
  for (let by = 0; by < bh; by++) {
    for (let bx = 0; bx < bw; bx++) {
      if (mode === 'gray') {
        c[0] = c[1] = c[2] = Math.floor(rand() * 256);
      } else {
        c[0] = Math.floor(rand() * 256);
        c[1] = Math.floor(rand() * 256);
        c[2] = Math.floor(rand() * 256);
      }
      const y1 = Math.min(h, (by + 1) * s);
      const x1 = Math.min(w, (bx + 1) * s);
      for (let y = by * s; y < y1; y++) {
        let i = (y * w + bx * s) * 4;
        for (let x = bx * s; x < x1; x++, i += 4) {
          d[i] = c[0];
          d[i + 1] = c[1];
          d[i + 2] = c[2];
          d[i + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Red/green/blue triangle, solid barycentric blend or a wireframe fan. */
export function rgbTriangle(ctx, w, h, variant = 'solid') {
  const A = [Math.round(w * 0.1), Math.round(h * 0.05)];
  const B = [Math.round(w * 0.9), Math.round(h * 0.05)];
  const C = [Math.round(w * 0.5), Math.round(h * 0.95)];
  const den = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
  const bary = (x, y) => {
    const l1 = ((B[1] - C[1]) * (x - C[0]) + (C[0] - B[0]) * (y - C[1])) / den;
    const l2 = ((C[1] - A[1]) * (x - C[0]) + (A[0] - C[0]) * (y - C[1])) / den;
    return [l1, l2, 1 - l1 - l2];
  };
  const r = createRaster(ctx, w, h);
  if (variant === 'wireframe') {
    const color = (x, y) => {
      const l = bary(x, y).map((v) => Math.max(0, v));
      const mx = Math.max(...l) || 1;
      return l.map((v) => Math.round((255 * v) / mx));
    };
    const N = 24;
    const lerp = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      [
        [A, B, C],
        [B, C, A],
        [C, A, B],
      ].forEach(([V, P, Q]) => {
        const T = lerp(P, Q, t);
        r.line(V[0], V[1], T[0], T[1], color);
      });
    }
  } else {
    const c = [0, 0, 0];
    for (let y = A[1]; y <= C[1]; y++) {
      for (let x = A[0]; x <= B[0]; x++) {
        const l = bary(x, y);
        if (l[0] < 0 || l[1] < 0 || l[2] < 0) continue;
        c[0] = Math.round(255 * l[0]);
        c[1] = Math.round(255 * l[1]);
        c[2] = Math.round(255 * l[2]);
        r.set(x, y, c);
      }
    }
  }
  r.commit();
}

// ---------------------------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------------------------

/** Bands of alternating stripes 1, 2, 3, 4, 6, 8px wide. variant 'h' | 'v'. */
export function stripeBands(ctx, w, h, variant = 'h') {
  fill(ctx, BLACK, 0, 0, w, h);
  const widths = [1, 2, 3, 4, 6, 8];
  const horiz = variant !== 'v';
  const span = horiz ? h : w;
  const gap = Math.max(4, Math.round(span / 50));
  const cuts = edges(span + gap, widths.length);
  widths.forEach((k, i) => {
    const a = cuts[i];
    const len = cuts[i + 1] - cuts[i] - gap;
    if (horiz) binary(ctx, 0, a, w, len, (x, y) => Math.floor(y / k) % 2 === 0);
    else binary(ctx, a, 0, len, h, (x) => Math.floor(x / k) % 2 === 0);
  });
}

/** Checkerboard of `size` px squares, or 'log': sizes growing away from the top-left corner. */
export function checkers(ctx, w, h, variant = 2) {
  if (variant !== 'log') {
    const s = Number(variant);
    binary(ctx, 0, 0, w, h, (x, y) => (Math.floor(x / s) + Math.floor(y / s)) % 2 === 0);
    return;
  }
  const sizes = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256];
  const max = Math.max(w, h);
  const lut = new Uint16Array(max + 1);
  let start = 0;
  for (let i = 0; start <= max; i++) {
    const s = sizes[Math.min(i, sizes.length - 1)];
    const end = Math.min(max + 1, Math.ceil(start / s) * s + s * 6);
    lut.fill(s, start, end);
    start = end;
  }
  binary(ctx, 0, 0, w, h, (x, y) => {
    const s = lut[Math.max(x, y)];
    return (Math.floor(x / s) + Math.floor(y / s)) % 2 === 0;
  });
}

/** Grid of 1px circles or squares, or one large circle with diameters. */
export function distortion(ctx, w, h, variant = 'circles') {
  const r = createRaster(ctx, w, h);
  if (variant === 'one') {
    let D = Math.round(Math.min(w, h) * 0.92);
    if (D % 2 === 0) D -= 1;
    const cx = Math.floor((w - D) / 2) + (D - 1) / 2;
    const cy = Math.floor((h - D) / 2) + (D - 1) / 2;
    const rad = (D - 1) / 2;
    r.circle(cx, cy, rad, WHITE);
    r.hline(cx - rad, cx + rad, cy, WHITE);
    r.vline(cx, cy - rad, cy + rad, WHITE);
    r.commit();
    return;
  }
  const cols = 8;
  const cell = Math.floor(w / cols);
  const rows = Math.max(1, Math.floor(h / cell));
  const ox = Math.floor((w - cell * cols) / 2);
  const oy = Math.floor((h - cell * rows) / 2);
  let D = Math.round(cell * 0.8);
  if (D % 2 === 0) D -= 1;
  const pad = Math.floor((cell - D) / 2);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x0 = ox + i * cell + pad;
      const y0 = oy + j * cell + pad;
      if (variant === 'squares') r.rect(x0, y0, x0 + D - 1, y0 + D - 1, WHITE);
      else r.circle(x0 + (D - 1) / 2, y0 + (D - 1) / 2, (D - 1) / 2, WHITE);
    }
  }
  r.commit();
}

/** 1px lines every `pitch` px, or 'log' with pitch growing 2 → 32px across the screen. */
export function lines(ctx, w, h, variant = 2, dir = 'h') {
  fill(ctx, BLACK, 0, 0, w, h);
  ctx.fillStyle = '#fff';
  const span = dir === 'h' ? h : w;
  const draw = (p) => (dir === 'h' ? ctx.fillRect(0, p, w, 1) : ctx.fillRect(p, 0, 1, h));
  if (variant === 'log') {
    for (let p = 0; p < span; ) {
      draw(p);
      p += Math.max(2, Math.round(2 * Math.pow(16, p / span)));
    }
    return;
  }
  const pitch = Number(variant);
  for (let p = 0; p < span; p += pitch) draw(p);
}

/** Single white pixels every `pitch` px. */
export function points(ctx, w, h, variant = 4) {
  const p = Number(variant);
  binary(ctx, 0, 0, w, h, (x, y) => x % p === 0 && y % p === 0);
}

/** `size` px white squares separated by `size` px of black on both axes. */
export function squares(ctx, w, h, variant = 4) {
  const s = Number(variant);
  binary(ctx, 0, 0, w, h, (x, y) => Math.floor(x / s) % 2 === 0 && Math.floor(y / s) % 2 === 0);
}
