import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Toggle, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const PALETTES = {
  borealis: { label: 'Borealis', colors: ['#34d399', '#2dd4bf', '#4ade80', '#5eead4'], fringe: '#a78bfa' },
  twilight: { label: 'Twilight', colors: ['#a78bfa', '#f472b6', '#818cf8', '#c084fc'], fringe: '#38bdf8' },
  ember: { label: 'Ember', colors: ['#fb923c', '#f43f5e', '#f97316', '#fb7185'], fringe: '#fde68a' },
  arctic: { label: 'Arctic', colors: ['#7dd3fc', '#38bdf8', '#67e8f9', '#93c5fd'], fringe: '#c4b5fd' },
  meadow: { label: 'Meadow', colors: ['#4ade80', '#a3e635', '#86efac', '#34d399'], fringe: '#fde047' },
  rose: { label: 'Rose', colors: ['#fb7185', '#e879f9', '#f472b6', '#c084fc'], fringe: '#818cf8' },
};

const DEFAULTS = { speed: 30, brightness: 60, bands: 4, reach: 60, wave: 60, rays: 50, palette: 'borealis', stars: true };
const MAX_DT = 50;
const FRAME_MS = 1000 / 30;
const MAX_EDGE = 640;
const COLUMN = 2;
const SPRITE_H = 256;

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * One vertical strip of curtain: a long tail fading up into the fringe color,
 * a bright lower edge, and a short soft fade below it.
 */
const makeSprite = (main, fringe) => {
  const c = document.createElement('canvas');
  c.width = 1;
  c.height = SPRITE_H;
  const g = c.getContext('2d');
  const [r, gr, b] = hexToRgb(main);
  const [fr, fg, fb] = hexToRgb(fringe);
  const grad = g.createLinearGradient(0, 0, 0, SPRITE_H);
  grad.addColorStop(0, `rgba(${fr},${fg},${fb},0)`);
  grad.addColorStop(0.3, `rgba(${fr},${fg},${fb},0.22)`);
  grad.addColorStop(0.62, `rgba(${r},${gr},${b},0.55)`);
  grad.addColorStop(0.88, `rgba(${r},${gr},${b},1)`);
  grad.addColorStop(0.93, `rgba(${Math.min(255, r + 50)},${Math.min(255, gr + 50)},${Math.min(255, b + 50)},1)`);
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 1, SPRITE_H);
  return c;
};

const AuroraTest = () => {
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [bands, setBands] = useState(DEFAULTS.bands);
  const [reach, setReach] = useState(DEFAULTS.reach);
  const [wave, setWave] = useState(DEFAULTS.wave);
  const [rays, setRays] = useState(DEFAULTS.rays);
  const [palette, setPalette] = useState(DEFAULTS.palette);
  const [stars, setStars] = useState(DEFAULTS.stars);
  const [paused, setPaused] = useState(false);
  const sim = useRef(null);
  const sprites = useRef(new Map());

  const spriteFor = (main, fringe) => {
    const key = `${main}|${fringe}`;
    let sprite = sprites.current.get(key);
    if (!sprite) {
      sprite = makeSprite(main, fringe);
      sprites.current.set(key, sprite);
    }
    return sprite;
  };

  const animate = (ctx, { width, height, dpr }, t) => {
    let s = sim.current;
    if (!s) s = sim.current = { time: 0, last: t, acc: FRAME_MS, drawn: '', buf: null, bctx: null, sky: null, skyKey: '' };

    const dtMs = Math.min(MAX_DT, Math.max(0, t - s.last));
    s.last = t;
    if (!paused) {
      s.time += (dtMs / 1000) * (speed / 30);
      s.acc += dtMs;
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const bw = Math.max(COLUMN * 2, Math.round(width * scale));
    const bh = Math.max(2, Math.round(height * scale));
    const stamp = `${palette}|${brightness}|${bands}|${reach}|${wave}|${rays}|${stars}|${width}x${height}`;
    if (s.acc < FRAME_MS && s.drawn === stamp) return;
    s.acc = 0;
    s.drawn = stamp;

    if (!s.buf) {
      s.buf = document.createElement('canvas');
      s.bctx = s.buf.getContext('2d', { alpha: false });
    }
    if (s.buf.width !== bw || s.buf.height !== bh) {
      s.buf.width = bw;
      s.buf.height = bh;
    }

    const bctx = s.bctx;
    bctx.globalCompositeOperation = 'source-over';
    bctx.globalAlpha = 1;
    bctx.fillStyle = '#000';
    bctx.fillRect(0, 0, bw, bh);
    bctx.globalCompositeOperation = 'lighter';
    bctx.imageSmoothingEnabled = true;

    const { colors, fringe } = PALETTES[palette];
    const amp = (wave / 100) * 0.12;
    const len = 0.18 + (reach / 100) * 0.5;
    const glow = 0.25 + brightness / 120;
    const rayDepth = rays / 100;
    const time = s.time;

    for (let i = 0; i < bands; i++) {
      const sprite = spriteFor(colors[i % colors.length], fringe);
      const base = 0.5 + (0.3 * (i + 0.5)) / bands;
      const phase = i * 1.9;
      for (let x = 0; x < bw; x += COLUMN) {
        const u = x / bw;
        const edge =
          base +
          amp *
            (Math.sin(u * 5.2 + time * 0.21 + phase) * 0.6 +
              Math.sin(u * 11.5 - time * 0.13 + phase * 1.3) * 0.28 +
              Math.sin(time * 0.15 + phase) * 0.3);
        const tall = len * (0.75 + 0.25 * Math.sin(u * 7.3 + time * 0.17 + phase));
        const ray =
          1 -
          rayDepth *
            (0.5 + 0.5 * Math.sin(u * 140 + phase * 5 + time * 0.6) * Math.sin(u * 53 - time * 0.35 + phase));
        const sheet = 0.55 + 0.45 * Math.sin(u * 3.1 - time * 0.11 + phase * 0.7);
        const a = glow * ray * sheet;
        if (a <= 0.01) continue;
        const bottom = edge * bh;
        const h = tall * bh;
        bctx.globalAlpha = Math.min(1, a);
        bctx.drawImage(sprite, 0, 0, 1, SPRITE_H, x, bottom - h, COLUMN, h * 1.08);
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(s.buf, 0, 0, width, height);

    if (stars) {
      const skyKey = `${width}x${height}`;
      if (s.skyKey !== skyKey) {
        s.skyKey = skyKey;
        const count = Math.round((width * height) / (6500 * dpr * dpr));
        s.sky = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height * 0.8,
          a: 0.25 + Math.random() * 0.6,
          r: Math.random() < 0.12 ? 2 : 1,
          tw: Math.random() * 6.28,
        }));
      }
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = '#e2e8f0';
      for (const star of s.sky) {
        ctx.globalAlpha = star.a * (0.75 + 0.25 * Math.sin(time * 0.9 + star.tw));
        const size = Math.max(1, Math.round(star.r * dpr));
        ctx.fillRect(Math.round(star.x), Math.round(star.y), size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const handleReset = () => {
    setSpeed(DEFAULTS.speed);
    setBrightness(DEFAULTS.brightness);
    setBands(DEFAULTS.bands);
    setReach(DEFAULTS.reach);
    setWave(DEFAULTS.wave);
    setRays(DEFAULTS.rays);
    setPalette(DEFAULTS.palette);
    setStars(DEFAULTS.stars);
    setPaused(false);
    sim.current = null;
  };

  const paletteKeys = Object.keys(PALETTES);
  const cyclePalette = (dir) =>
    setPalette((p) => paletteKeys[(paletteKeys.indexOf(p) + dir + paletteKeys.length) % paletteKeys.length]);

  const shortcuts = [
    { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
    { key: 'ArrowUp', label: 'Faster', action: () => setSpeed((v) => Math.min(100, v + 5)) },
    { key: 'ArrowDown', label: 'Slower', action: () => setSpeed((v) => Math.max(5, v - 5)) },
    { key: 'ArrowRight', label: 'Next palette', action: () => cyclePalette(1) },
    { key: 'ArrowLeft', label: 'Previous palette', action: () => cyclePalette(-1) },
    { key: 's', label: 'Stars on / off', action: () => setStars((v) => !v) },
  ];

  return (
    <TestShell
      title="Aurora"
      description="Just for fun. The curtains should melt from one color into the next. Hard stripes in the color, rather than in the folds or rays, are banding."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Curtains</h3>
            <Slider label="Speed" value={speed} min={5} max={100} onChange={setSpeed} format={(v) => `${v}%`} />
            <Slider label="Brightness" value={brightness} min={20} max={100} onChange={setBrightness} format={(v) => `${v}%`} />
            <Slider label="Bands" value={bands} min={1} max={6} onChange={setBands} />
            <Slider label="Height" value={reach} min={0} max={100} step={5} onChange={setReach} format={(v) => `${v}%`} />
            <Slider label="Wave" value={wave} min={0} max={100} step={5} onChange={setWave} format={(v) => `${v}%`} />
            <Slider label="Rays" value={rays} min={0} max={100} step={5} onChange={setRays} format={(v) => `${v}%`} />
          </Section>
          <Section>
            <h3>Sky</h3>
            <Segmented
              label="Palette"
              options={Object.entries(PALETTES).map(([value, p]) => ({ value, label: p.label }))}
              value={palette}
              onChange={setPalette}
              columns={3}
            />
            <Toggle label="Stars" checked={stars} onChange={setStars} />
            <Hint>Press Space to pause, ← / → to change palette, and S for stars. A smooth panel shows soft sheets. Distinct steps inside a sheet are the same banding the gradient test is for. The picture updates 30 times a second to keep CPU use low.</Hint>
          </Section>
        </>
      }
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </TestShell>
  );
};

export default AuroraTest;
