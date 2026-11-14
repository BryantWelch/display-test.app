import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Toggle, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const PHOSPHORS = {
  color: { label: 'Color' },
  green: { label: 'Green', rgb: [118, 255, 148] },
  amber: { label: 'Amber', rgb: [255, 178, 72] },
  white: { label: 'White', rgb: [232, 238, 244] },
};

const BARS = [
  [192, 192, 192],
  [192, 192, 0],
  [0, 192, 192],
  [0, 192, 0],
  [192, 0, 192],
  [192, 0, 0],
  [0, 0, 192],
];

/** 5×7 glyphs, high bit on the left. Only the letters the station card uses. */
const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

const DEFAULTS = { phosphor: 'color', scanlines: 55, curve: 45, glow: 45, brightness: 80, grille: true };
const FRAME_MS = 1000 / 30;
const MAX_DT = 50;
const MAX_EDGE = 540;
const LABEL = 'DISPLAY TEST';

const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const ink = (phosphor, r, g, b, alpha = 1) => {
  if (phosphor === 'color') return `rgba(${r},${g},${b},${alpha})`;
  const y = luma(r, g, b) / 255;
  const [tr, tg, tb] = PHOSPHORS[phosphor].rgb;
  return `rgba(${Math.round(tr * y)},${Math.round(tg * y)},${Math.round(tb * y)},${alpha})`;
};

const drawLabel = (ctx, phosphor, bw, bh) => {
  const scale = Math.max(2, Math.floor((bw * 0.62) / (LABEL.length * 6)));
  const gap = scale;
  const charW = 5 * scale + gap;
  const textW = LABEL.length * charW - gap;
  let x = Math.round((bw - textW) / 2);
  const y = Math.round(bh * 0.86);
  ctx.fillStyle = ink(phosphor, 255, 255, 255);
  for (const ch of LABEL) {
    const rows = FONT[ch];
    for (let row = 0; row < 7; row++) {
      const bits = rows[row];
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << (4 - col))) ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
    x += charW;
  }
};

/** The station card, drawn flat. Curvature, glow, and scanlines are added later. */
const paintCard = (ctx, bw, bh, time, phosphor) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, bw, bh);

  const barH = Math.round(bh * 0.2);
  const gap = Math.max(2, Math.round(bw * 0.004));
  const barW = (bw - gap * (BARS.length + 1)) / BARS.length;
  BARS.forEach((color, i) => {
    ctx.fillStyle = ink(phosphor, color[0], color[1], color[2]);
    ctx.fillRect(gap + i * (barW + gap), gap, barW, barH - gap);
  });

  const top = barH + bh * 0.06;
  const bottom = bh * 0.8;
  ctx.strokeStyle = ink(phosphor, 210, 210, 210, 0.85);
  ctx.lineWidth = Math.max(1, Math.round(bw / 280));
  ctx.beginPath();
  for (let i = 1; i < 8; i++) {
    const x = (bw * i) / 8;
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  }
  for (let i = 0; i <= 4; i++) {
    const y = top + ((bottom - top) * i) / 4;
    ctx.moveTo(bw * 0.06, y);
    ctx.lineTo(bw * 0.94, y);
  }
  ctx.stroke();

  const cx = bw / 2;
  const cy = (top + bottom) / 2;
  const radius = Math.min(bw, bottom - top) * 0.34;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.stroke();

  const ox = cx + Math.sin(time * 0.9) * radius * 0.62;
  const oy = cy + Math.sin(time * 1.35) * radius * 0.42;
  const dot = Math.max(3, Math.round(bw / 90));
  ctx.fillStyle = ink(phosphor, 255, 255, 255);
  ctx.fillRect(ox - dot / 2, oy - dot / 2, dot, dot);

  const beam = (time * 0.16) % 1;
  const by = beam * bh;
  const reach = bh * 0.045;
  const fade = ctx.createLinearGradient(0, by - reach, 0, by + reach);
  const beamColor = phosphor === 'color' ? '255,255,255' : PHOSPHORS[phosphor].rgb.join(',');
  fade.addColorStop(0, `rgba(${beamColor},0)`);
  fade.addColorStop(0.5, `rgba(${beamColor},0.28)`);
  fade.addColorStop(1, `rgba(${beamColor},0)`);
  ctx.fillStyle = fade;
  ctx.fillRect(0, by - reach, bw, reach * 2);

  drawLabel(ctx, phosphor, bw, bh);
};

const CrtTest = () => {
  const [phosphor, setPhosphor] = useState(DEFAULTS.phosphor);
  const [scanlines, setScanlines] = useState(DEFAULTS.scanlines);
  const [curve, setCurve] = useState(DEFAULTS.curve);
  const [glow, setGlow] = useState(DEFAULTS.glow);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [grille, setGrille] = useState(DEFAULTS.grille);
  const [paused, setPaused] = useState(false);
  const sim = useRef(null);

  const animate = (ctx, { width, height }, t) => {
    let s = sim.current;
    if (!s) s = sim.current = { time: 0, last: t, acc: FRAME_MS, drawn: '', buf: null, bctx: null, scanKey: -1, scanPattern: null, grillePattern: null };

    const dtMs = Math.min(MAX_DT, Math.max(0, t - s.last));
    s.last = t;
    if (!paused) {
      s.time += dtMs / 1000;
      s.acc += dtMs;
    }

    const stamp = `${phosphor}|${scanlines}|${curve}|${glow}|${brightness}|${grille}|${width}x${height}`;
    if (s.drawn === stamp && s.acc < FRAME_MS) return;
    s.acc = 0;
    s.drawn = stamp;

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const bw = Math.max(160, Math.round(width * scale));
    const bh = Math.max(90, Math.round(height * scale));
    if (!s.buf) {
      s.buf = document.createElement('canvas');
      s.bctx = s.buf.getContext('2d', { alpha: false });
    }
    if (s.buf.width !== bw || s.buf.height !== bh) {
      s.buf.width = bw;
      s.buf.height = bh;
    }
    paintCard(s.bctx, bw, bh, s.time, phosphor);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const margin = Math.round(Math.min(width, height) * 0.045);
    const dx = margin;
    const dy = margin;
    const dw = width - margin * 2;
    const dh = height - margin * 2;
    const amount = (curve / 100) * dw * 0.16;

    if (!s.glowBuf) {
      s.glowBuf = document.createElement('canvas');
      s.glowCtx = s.glowBuf.getContext('2d');
    }
    if (s.glowBuf.width !== bw || s.glowBuf.height !== bh) {
      s.glowBuf.width = bw;
      s.glowBuf.height = bh;
    }
    if (glow > 0) {
      s.glowCtx.clearRect(0, 0, bw, bh);
      s.glowCtx.filter = `blur(${(2 + (glow / 100) * 5).toFixed(1)}px)`;
      s.glowCtx.drawImage(s.buf, 0, 0);
      s.glowCtx.filter = 'none';
    }

    // Bow each row so the glass bulges: full width in the middle, pinched at the top and bottom.
    const blit = (src, alpha) => {
      ctx.globalAlpha = alpha;
      if (amount < 1) {
        ctx.drawImage(src, dx, dy, dw, dh);
        return;
      }
      const strips = 56;
      for (let i = 0; i < strips; i++) {
        const t0 = i / strips;
        const t1 = (i + 1) / strips;
        const v = t0 + t1 - 1;
        const pinch = amount * v * v;
        const sy = Math.min(bh - 1, Math.floor(t0 * bh));
        const sh = Math.max(1, Math.min(bh - sy, Math.ceil(t1 * bh) - sy));
        ctx.drawImage(src, 0, sy, bw, sh, dx + pinch, dy + t0 * dh, dw - pinch * 2, Math.max(1, (t1 - t0) * dh));
      }
    };

    if (glow > 0) blit(s.glowBuf, 0.45 + (glow / 100) * 0.35);
    blit(s.buf, (brightness / 100) * 0.92 + 0.08);

    ctx.globalAlpha = 1;
    if (scanlines > 0) {
      const key = Math.round(scanlines / 5);
      if (s.scanKey !== key) {
        s.scanKey = key;
        const tile = document.createElement('canvas');
        tile.width = 1;
        tile.height = 3;
        const g = tile.getContext('2d');
        g.fillStyle = `rgba(0,0,0,${(scanlines / 100) * 0.72})`;
        g.fillRect(0, 2, 1, 1);
        s.scanPattern = ctx.createPattern(tile, 'repeat');
      }
      ctx.fillStyle = s.scanPattern;
      ctx.fillRect(dx, dy, dw, dh);
    }

    if (grille) {
      if (!s.grillePattern) {
        const tile = document.createElement('canvas');
        tile.width = 3;
        tile.height = 1;
        const g = tile.getContext('2d');
        g.fillStyle = 'rgba(0,0,0,0.42)';
        g.fillRect(2, 0, 1, 1);
        s.grillePattern = ctx.createPattern(tile, 'repeat');
      }
      ctx.fillStyle = s.grillePattern;
      ctx.fillRect(dx, dy, dw, dh);
    }

    const cx = width / 2;
    const cy = height / 2;
    const vignette = ctx.createRadialGradient(cx, cy, Math.min(dw, dh) * 0.28, cx, cy, Math.max(dw, dh) * 0.62);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const handleReset = () => {
    setPhosphor(DEFAULTS.phosphor);
    setScanlines(DEFAULTS.scanlines);
    setCurve(DEFAULTS.curve);
    setGlow(DEFAULTS.glow);
    setBrightness(DEFAULTS.brightness);
    setGrille(DEFAULTS.grille);
    setPaused(false);
    sim.current = null;
  };

  const keys = Object.keys(PHOSPHORS);
  const cyclePhosphor = (dir) =>
    setPhosphor((p) => keys[(keys.indexOf(p) + dir + keys.length) % keys.length]);

  const shortcuts = [
    { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
    { key: 'ArrowRight', label: 'Next phosphor', action: () => cyclePhosphor(1) },
    { key: 'ArrowLeft', label: 'Previous phosphor', action: () => cyclePhosphor(-1) },
    { key: 'ArrowUp', label: 'Brighter', action: () => setBrightness((v) => Math.min(100, v + 5)) },
    { key: 'ArrowDown', label: 'Dimmer', action: () => setBrightness((v) => Math.max(30, v - 5)) },
    { key: 'g', label: 'Grille on / off', action: () => setGrille((v) => !v) },
  ];

  return (
    <TestShell
      title="CRT"
      description="Just for fun. The bow, the scanlines, and the glow are drawn on purpose. The black around the tube is the part that shows your panel."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Tube</h3>
            <Segmented
              label="Phosphor"
              options={Object.entries(PHOSPHORS).map(([value, p]) => ({ value, label: p.label }))}
              value={phosphor}
              onChange={setPhosphor}
              columns={4}
            />
            <Slider label="Curve" value={curve} min={0} max={100} step={5} onChange={setCurve} format={(v) => `${v}%`} />
            <Slider label="Scanlines" value={scanlines} min={0} max={100} step={5} onChange={setScanlines} format={(v) => `${v}%`} />
            <Slider label="Glow" value={glow} min={0} max={100} step={5} onChange={setGlow} format={(v) => `${v}%`} />
            <Slider label="Brightness" value={brightness} min={30} max={100} step={5} onChange={setBrightness} format={(v) => `${v}%`} />
            <Toggle label="Aperture grille" checked={grille} onChange={setGrille} />
            <Hint>Press Space to pause, ← / → for the phosphor, and G for the grille. Scanlines and the grille are part of the drawing, not a fault in the panel.</Hint>
          </Section>
        </>
      }
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </TestShell>
  );
};

export default CrtTest;
