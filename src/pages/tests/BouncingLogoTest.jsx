import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Slider, ColorSwatches, Readout, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const COLORS = [
  { name: 'Sky', value: '#38bdf8' },
  { name: 'Green', value: '#4ade80' },
  { name: 'Amber', value: '#fbbf24' },
  { name: 'Coral', value: '#f87171' },
  { name: 'Violet', value: '#a78bfa' },
  { name: 'White', value: '#f8fafc' },
];

const LOGOS = [
  { id: 'site', label: 'Display Test' },
  { id: 'dvd', label: 'DVD', italic: true, tracking: 0.08 },
  { id: 'vhs', label: 'VHS', tracking: 0.14 },
  { id: '4k', label: '4K', tracking: 0.02 },
  { id: 'oled', label: 'OLED', tracking: 0.08 },
  { id: 'hdr', label: 'HDR', tracking: 0.1 },
];

const DEFAULTS = { speed: 180, size: 8, colors: 'cycle', logo: 'site' };
const MAX_DT = 100;
const START_COLOR = COLORS.length - 1;
const CORNER_MS = 1400;

const logoById = (id) => LOGOS.find((logo) => logo.id === id) || LOGOS[0];

const fontFor = (italic, weight, px) => `${italic ? 'italic ' : ''}${weight} ${px}px Inter, system-ui, sans-serif`;

/**
 * Lays text out one character at a time and returns its ink bounds, so the bounce box
 * hugs the visible letters instead of the font's em box and trailing letter spacing.
 */
const layoutText = (ctx, text, font, spacing) => {
  ctx.font = font;
  const chars = [...text];
  const xs = [];
  let adv = 0;
  for (const ch of chars) {
    xs.push(adv);
    adv += ctx.measureText(ch).width + spacing;
  }
  const first = ctx.measureText(chars[0]);
  const last = ctx.measureText(chars[chars.length - 1]);
  const all = ctx.measureText(text);
  const left = -first.actualBoundingBoxLeft;
  const right = xs[xs.length - 1] + last.actualBoundingBoxRight;
  return {
    chars,
    xs,
    left,
    width: right - left,
    ascent: all.actualBoundingBoxAscent,
    descent: all.actualBoundingBoxDescent,
  };
};

const drawText = (ctx, layout, font, x, baseline) => {
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  layout.chars.forEach((ch, i) => ctx.fillText(ch, x + layout.xs[i], baseline));
};

/** Bounce box for the selected mark, in device pixels. */
const measureLogo = (ctx, logo, target) => {
  if (logo.id === 'site') {
    const font = fontFor(false, 700, Math.max(10, Math.round(target * 0.5)));
    const text = layoutText(ctx, 'Display Test', font, 0);
    const gap = Math.round(target * 0.22);
    return { kind: 'site', w: Math.ceil(target + gap + text.width), h: target, font, text, gap };
  }
  const fontPx = Math.max(12, Math.round(target / 0.73));
  const font = fontFor(logo.italic, 800, fontPx);
  const text = layoutText(ctx, logo.label, font, fontPx * (logo.tracking || 0));
  const pad = Math.ceil(fontPx * (logo.italic ? 0.05 : 0.02));
  return {
    kind: 'word',
    w: Math.ceil(text.width + pad * 2),
    h: Math.ceil(text.ascent + text.descent + pad * 2),
    font,
    text,
    pad,
  };
};

/** Small test-pattern television, matching the mark in the site header. Fills a size × size square. */
const drawTv = (ctx, x, y, size) => {
  const lw = Math.max(1.25, size * 0.045);
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + size * 0.36, y + size * 0.2);
  ctx.lineTo(x + size * 0.2, y + lw / 2);
  ctx.moveTo(x + size * 0.64, y + size * 0.2);
  ctx.lineTo(x + size * 0.8, y + lw / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(x, y + size * 0.16, size, size * 0.84, size * 0.1);
  ctx.fillStyle = '#64798a';
  ctx.fill();

  const sx = x + size * 0.07;
  const sy = y + size * 0.27;
  const sw = size * 0.64;
  const sh = size * 0.62;
  const bars = ['#fcd462', '#44c4a1', '#27a2db', '#e56353'];
  const bw = sw / bars.length;
  for (let i = 0; i < bars.length; i++) {
    ctx.fillStyle = bars[i];
    ctx.fillRect(sx + bw * i, sy, bw + 0.5, sh);
  }

  const kx = x + size * 0.85;
  const ky = y + size * 0.45;
  ctx.beginPath();
  ctx.fillStyle = '#334155';
  ctx.arc(kx, ky, size * 0.075, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d5d6db';
  for (let i = 0; i < 3; i++) ctx.fillRect(x + size * 0.77, y + size * (0.66 + i * 0.08), size * 0.16, Math.max(1, size * 0.025));
  ctx.restore();
};

const drawLogo = (ctx, box, x, y, color) => {
  ctx.fillStyle = color;
  if (box.kind === 'site') {
    drawTv(ctx, x, y, box.h);
    const { text } = box;
    const baseline = y + box.h * 0.58 + (text.ascent - text.descent) / 2 - box.h * 0.08;
    ctx.fillStyle = color;
    drawText(ctx, text, box.font, x + box.h + box.gap - text.left, baseline);
    return;
  }
  drawText(ctx, box.text, box.font, x + box.pad - box.text.left, y + box.pad + box.text.ascent);
};

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

const modInverse = (a, m) => {
  let [r0, r1] = [((a % m) + m) % m, m];
  let [s0, s1] = [1, 0];
  while (r1) {
    const q = Math.floor(r0 / r1);
    [r0, r1] = [r1, r0 - q * r1];
    [s0, s1] = [s1, s0 - q * s1];
  }
  return ((s0 % m) + m) % m;
};

/**
 * Steps until both axes bounce on the same step, or null if they never line up.
 * Each axis bounces on step a, a + p, a + 2p, … where p is its travel range plus the bounce step.
 */
const stepsToCorner = (s, rangeX, rangeY) => {
  if (rangeX <= 0 || rangeY <= 0) return null;
  const px = rangeX + 1;
  const py = rangeY + 1;
  const ax = (s.sx > 0 ? rangeX - s.x : s.x) + 1;
  const ay = (s.sy > 0 ? rangeY - s.y : s.y) + 1;
  const g = gcd(px, py);
  const diff = ay - ax;
  if (((diff % g) + g) % g !== 0) return null;
  const m = py / g;
  if (m === 1) return ax;
  const k = (((diff / g) % m) + m) % m;
  const t = (k * modInverse((px / g) % m, m)) % m;
  return ax + px * t;
};

const formatWait = (seconds) => {
  if (seconds == null) return 'Never at this size';
  if (seconds < 1) return 'Now';
  if (seconds < 60) return `${Math.ceil(seconds)} s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} min`;
  const h = Math.floor(seconds / 3600);
  const min = Math.round((seconds % 3600) / 60);
  if (h >= 48) return `${Math.round(h / 24)} days`;
  return min ? `${h} h ${min} min` : `${h} h`;
};

const BouncingLogoTest = () => {
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [size, setSize] = useState(DEFAULTS.size);
  const [colors, setColors] = useState(DEFAULTS.colors);
  const [fixedColor, setFixedColor] = useState(COLORS[0].value);
  const [logoId, setLogoId] = useState(DEFAULTS.logo);
  const [paused, setPaused] = useState(false);
  const [readout, setReadout] = useState({ corners: 0, bounces: 0, color: COLORS[START_COLOR].name, next: '—' });
  const sim = useRef(null);
  const shown = useRef(readout);

  const animate = (ctx, { width, height }, t) => {
    const logo = logoById(logoId);
    const short = Math.min(width, height);
    let target = Math.max(18, Math.round(short * (size / 100)));
    let box = measureLogo(ctx, logo, target);
    if (box.w > width * 0.62) {
      target = Math.max(18, Math.floor((target * width * 0.62) / box.w));
      box = measureLogo(ctx, logo, target);
    }

    const key = `${width}x${height}`;
    let s = sim.current;
    if (!s || s.key !== key) {
      s = sim.current = {
        key,
        x: Math.round(Math.max(0, width - box.w) * (0.15 + Math.random() * 0.7)),
        y: Math.round(Math.max(0, height - box.h) * (0.15 + Math.random() * 0.7)),
        sx: 1,
        sy: 1,
        ax: 0,
        ay: 0,
        color: START_COLOR,
        corners: 0,
        bounces: 0,
        last: t,
        cornerAt: -1e9,
      };
    }

    const rangeX = width - box.w;
    const rangeY = height - box.h;
    s.x = Math.max(0, Math.min(s.x, Math.max(0, rangeX)));
    s.y = Math.max(0, Math.min(s.y, Math.max(0, rangeY)));

    const dt = Math.min(MAX_DT, Math.max(0, t - s.last));
    s.last = t;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    if (!paused && rangeX > 0 && rangeY > 0) {
      const px = (speed * dt) / 1000;
      s.ax += px;
      s.ay += px;
      let guard = 0;
      while ((s.ax >= 1 || s.ay >= 1) && guard < 80) {
        guard += 1;
        let hitX = false;
        let hitY = false;
        if (s.ax >= 1) {
          s.ax -= 1;
          const nx = s.x + s.sx;
          if (nx < 0 || nx > rangeX) {
            s.sx *= -1;
            hitX = true;
          } else {
            s.x = nx;
          }
        }
        if (s.ay >= 1) {
          s.ay -= 1;
          const ny = s.y + s.sy;
          if (ny < 0 || ny > rangeY) {
            s.sy *= -1;
            hitY = true;
          } else {
            s.y = ny;
          }
        }
        if (hitX || hitY) {
          s.bounces += 1;
          if (colors === 'cycle') s.color = (s.color + 1) % COLORS.length;
          if (hitX && hitY) {
            s.corners += 1;
            s.cornerAt = t;
          }
        }
      }
    }

    if (colors === 'fixed') {
      const picked = COLORS.findIndex((c) => c.value === fixedColor);
      if (picked >= 0) s.color = picked;
    }
    const swatch = COLORS[s.color];

    const since = t - s.cornerAt;
    if (since < CORNER_MS) {
      const k = 1 - since / CORNER_MS;
      const cx = s.sx > 0 ? 0 : width;
      const cy = s.sy > 0 ? 0 : height;
      const r = short * (0.25 + 0.35 * (1 - k));
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      glow.addColorStop(0, swatch.value);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.35 * k;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = k;
      ctx.fillStyle = '#f8fafc';
      ctx.font = `700 ${Math.max(16, Math.round(short * 0.045))}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Corner!', width / 2, height / 2);
      ctx.globalAlpha = 1;
    }

    drawLogo(ctx, box, s.x, s.y, swatch.value);

    const steps = stepsToCorner(s, rangeX, rangeY);
    const next = {
      corners: s.corners,
      bounces: s.bounces,
      color: swatch.name,
      next: formatWait(steps == null ? null : steps / speed),
    };
    const prev = shown.current;
    if (next.corners !== prev.corners || next.bounces !== prev.bounces || next.color !== prev.color || next.next !== prev.next) {
      shown.current = next;
      setReadout(next);
    }
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const handleReset = () => {
    setSpeed(DEFAULTS.speed);
    setSize(DEFAULTS.size);
    setColors(DEFAULTS.colors);
    setFixedColor(COLORS[0].value);
    setLogoId(DEFAULTS.logo);
    setPaused(false);
    sim.current = null;
    const cleared = { corners: 0, bounces: 0, color: COLORS[START_COLOR].name, next: '—' };
    shown.current = cleared;
    setReadout(cleared);
  };

  const cycleLogo = (dir) =>
    setLogoId((id) => {
      const i = LOGOS.findIndex((logo) => logo.id === id);
      return LOGOS[(i + dir + LOGOS.length) % LOGOS.length].id;
    });

  const shortcuts = [
    { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
    { key: 'ArrowUp', label: 'Faster', action: () => setSpeed((v) => Math.min(480, v + 20)) },
    { key: 'ArrowDown', label: 'Slower', action: () => setSpeed((v) => Math.max(60, v - 20)) },
    { key: 'ArrowRight', label: 'Next logo', action: () => cycleLogo(1) },
    { key: 'ArrowLeft', label: 'Previous logo', action: () => cycleLogo(-1) },
  ];

  return (
    <TestShell
      title="Bouncing Logo"
      description="Just for fun. It starts as the Display Test logo, changes color when it hits an edge, and counts a corner only when both edges are hit at once."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Logo</h3>
            <Segmented label="Mark" options={LOGOS.map((logo) => ({ value: logo.id, label: logo.label }))} value={logoId} onChange={setLogoId} columns={3} />
            <Slider label="Size" value={size} min={4} max={16} onChange={setSize} format={(v) => `${v}%`} />
            <Hint>Press ← / → to switch logos. DVD is the letters DVD — the same bouncing idea, not the DVD Video logo.</Hint>
          </Section>
          <Section>
            <h3>Motion</h3>
            <Slider label="Speed" value={speed} min={60} max={480} step={10} onChange={setSpeed} format={(v) => `${v} px/s`} />
            <Segmented
              label="Color"
              options={[
                { value: 'cycle', label: 'Change on bounce' },
                { value: 'fixed', label: 'Hold color' },
              ]}
              value={colors}
              onChange={setColors}
              columns={2}
            />
            {colors === 'fixed' ? <ColorSwatches colors={COLORS} value={fixedColor} onChange={setFixedColor} columns={6} /> : null}
            <Hint>Press Space to pause. It moves the same distance per second at any refresh rate. A corner counts only when both edges are hit on the same step.</Hint>
          </Section>
          <Section>
            <h3>Score</h3>
            <Readout
              items={[
                ['Corners', String(readout.corners)],
                ['Bounces', String(readout.bounces)],
                ['Next corner', readout.next],
                ['Color', readout.color],
              ]}
            />
            <Hint>Next corner is worked out from the logo’s position and the window size. If it says never, nudge the size slider or resize the window.</Hint>
          </Section>
        </>
      }
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </TestShell>
  );
};

export default BouncingLogoTest;
