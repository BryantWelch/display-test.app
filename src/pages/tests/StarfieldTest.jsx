import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const STAR_TINTS = ['#f8fafc', '#cfe8ff', '#fff4d6', '#ffd9a8'];

const COLORS = {
  white: { label: 'White', tints: ['#f8fafc'] },
  mixed: { label: 'Mixed', tints: STAR_TINTS },
  ice: { label: 'Ice', tints: ['#7dd3fc'] },
  gold: { label: 'Gold', tints: ['#fbbf24'] },
};

const DEFAULTS = { speed: 20, density: 2000, color: 'mixed', warp: false, fov: 50 };
const MAX_DT = 50;
const MAX_STARS = 10000;
const ALPHA_STEPS = 5;
const WIDTH_STEPS = 3;
const WIDTHS = [1, 1.8, 3.2];
const MARGIN = 24;

const StarfieldTest = () => {
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [density, setDensity] = useState(DEFAULTS.density);
  const [color, setColor] = useState(DEFAULTS.color);
  const [warp, setWarp] = useState(DEFAULTS.warp);
  const [fov, setFov] = useState(DEFAULTS.fov);
  const [paused, setPaused] = useState(false);
  const sim = useRef(null);

  const animate = (ctx, { width, height, dpr }, t) => {
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.max(width, height) * (0.35 + (100 - fov) / 100);
    const spanX = (cx + MARGIN) / scale;
    const spanY = (cy + MARGIN) / scale;

    const place = (star, z) => {
      star.z = z;
      star.x = (Math.random() * 2 - 1) * spanX * z;
      star.y = (Math.random() * 2 - 1) * spanY * z;
      star.tint = Math.floor(Math.random() * STAR_TINTS.length);
      return star;
    };

    // New stars must match a field that has already been flying. Uniform depths
    // put near (fast, long-streaked) stars all over the screen, while in flight
    // near stars only survive close to the center — so a fresh field looked like
    // a burst of warp until those extra stars flew off. Sample the steady state:
    // a star spawned at depth z0 with screen position r stays visible until
    // z = z0 * max(|rx|, |ry|), and it spends equal time at every depth in between.
    const seed = (star) => {
      for (;;) {
        const z0 = 0.85 + Math.random() * 0.15;
        const rx = Math.random() * 2 - 1;
        const ry = Math.random() * 2 - 1;
        const z = 0.02 + Math.random() * (z0 - 0.02);
        if (z >= z0 * Math.max(Math.abs(rx), Math.abs(ry))) {
          star.z = z;
          star.x = rx * spanX * z0;
          star.y = ry * spanY * z0;
          star.tint = Math.floor(Math.random() * STAR_TINTS.length);
          return star;
        }
      }
    };

    let s = sim.current;
    if (!s || s.w !== width || s.h !== height || s.fov !== fov) {
      s = sim.current = {
        w: width,
        h: height,
        fov,
        stars: [],
        last: t,
        segs: [],
      };
    }
    const count = Math.min(MAX_STARS, density);
    while (s.stars.length < count) s.stars.push(seed({}));
    if (s.stars.length > count) s.stars.length = count;

    const tints = COLORS[color].tints;
    const buckets = tints.length * ALPHA_STEPS * WIDTH_STEPS;
    while (s.segs.length < buckets) s.segs.push([]);
    for (const seg of s.segs) seg.length = 0;

    const dt = Math.min(MAX_DT, Math.max(0, t - s.last));
    s.last = t;
    const step = paused ? 0 : (speed / 100) * (dt / 1000) * (warp ? 2.2 : 1);
    const tail = warp ? 3.5 : 1.4;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    for (const star of s.stars) {
      const prev = Math.min(0.999, star.z + step * tail);
      star.z -= step;
      if (star.z <= 0.02) {
        place(star, 0.85 + Math.random() * 0.15);
        continue;
      }
      const x = cx + (star.x / star.z) * scale;
      const y = cy + (star.y / star.z) * scale;
      if (x < -MARGIN || y < -MARGIN || x > width + MARGIN || y > height + MARGIN) {
        place(star, 0.85 + Math.random() * 0.15);
        continue;
      }
      const px = cx + (star.x / prev) * scale;
      const py = cy + (star.y / prev) * scale;
      const alpha = Math.min(1, (1 - star.z) * 1.35);
      const lw = Math.max(1, (1 - star.z) * (warp ? 3.2 : 2.2));
      const ai = Math.min(ALPHA_STEPS - 1, Math.floor(alpha * ALPHA_STEPS));
      const wi = lw < 1.35 ? 0 : lw < 2.4 ? 1 : 2;
      const ti = star.tint % tints.length;
      s.segs[(ti * ALPHA_STEPS + ai) * WIDTH_STEPS + wi].push(px, py, x, y);
    }

    ctx.lineCap = 'round';
    for (let i = 0; i < buckets; i++) {
      const seg = s.segs[i];
      if (seg.length === 0) continue;
      const wi = i % WIDTH_STEPS;
      const ai = Math.floor(i / WIDTH_STEPS) % ALPHA_STEPS;
      const ti = Math.floor(i / (WIDTH_STEPS * ALPHA_STEPS));
      ctx.strokeStyle = tints[ti];
      ctx.globalAlpha = (ai + 1) / ALPHA_STEPS;
      ctx.lineWidth = WIDTHS[wi] * dpr;
      ctx.beginPath();
      for (let p = 0; p < seg.length; p += 4) {
        ctx.moveTo(seg[p], seg[p + 1]);
        ctx.lineTo(seg[p + 2], seg[p + 3]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const handleReset = () => {
    setSpeed(DEFAULTS.speed);
    setDensity(DEFAULTS.density);
    setColor(DEFAULTS.color);
    setWarp(DEFAULTS.warp);
    setFov(DEFAULTS.fov);
    setPaused(false);
    sim.current = null;
  };

  const shortcuts = [
    { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
    { key: 'ArrowUp', label: 'Faster', action: () => setSpeed((v) => Math.min(100, v + 5)) },
    { key: 'ArrowDown', label: 'Slower', action: () => setSpeed((v) => Math.max(5, v - 5)) },
    { key: 'ArrowRight', label: 'More stars', action: () => setDensity((v) => Math.min(MAX_STARS, v + 500)) },
    { key: 'ArrowLeft', label: 'Fewer stars', action: () => setDensity((v) => Math.max(100, v - 500)) },
    { key: 'w', label: 'Warp on / off', action: () => setWarp((v) => !v) },
  ];

  return (
    <TestShell
      title="Starfield"
      description="Just for fun. Most of the screen stays black, which is where an OLED pulls ahead of a backlit panel."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Flight</h3>
            <Slider label="Speed" value={speed} min={5} max={100} onChange={setSpeed} format={(v) => `${v}%`} />
            <Slider label="Stars" value={density} min={100} max={MAX_STARS} step={100} onChange={setDensity} format={(v) => v.toLocaleString()} />
            <Slider label="Field of view" value={fov} min={0} max={100} step={5} onChange={setFov} format={(v) => `${v}%`} />
            <Segmented
              label="Color"
              options={Object.entries(COLORS).map(([value, c]) => ({ value, label: c.label }))}
              value={color}
              onChange={setColor}
              columns={4}
            />
            <Segmented
              label="Streaks"
              options={[
                { value: false, label: 'Points' },
                { value: true, label: 'Warp' },
              ]}
              value={warp}
              onChange={setWarp}
              columns={2}
            />
            <Hint>Press Space to pause, W for warp, and ← / → for fewer or more stars. A wider field of view makes the stars rush past faster at the edges. Speed is the same at 60 Hz and 240 Hz; a higher refresh rate just draws the motion more often.</Hint>
          </Section>
        </>
      }
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </TestShell>
  );
};

export default StarfieldTest;
