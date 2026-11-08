import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Toggle, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const PALETTES = {
  mixed: { label: 'Mixed', hues: null },
  gold: { label: 'Gold', hues: [38, 48, 28] },
  ice: { label: 'Ice', hues: [190, 205, 175] },
  berry: { label: 'Berry', hues: [330, 290, 350] },
};

const SHAPES = {
  mixed: { label: 'Mixed' },
  peony: { label: 'Peony' },
  ring: { label: 'Ring' },
  heart: { label: 'Heart' },
};

const DEFAULTS = { rate: 3, size: 60, gravity: 50, palette: 'mixed', shape: 'mixed', glitter: false };
const MAX_DT = 50;
const MAX_SPARKS = 1600;
const SPARK_LIFE = 0.45;
const DRAG = 1.6;
const STREAK = 0.04;
const FLASH_MS = 140;

const hueOf = (palette) => {
  const hues = PALETTES[palette].hues;
  if (!hues) return Math.floor(Math.random() * 360);
  return hues[Math.floor(Math.random() * hues.length)] + (Math.random() * 16 - 8);
};

const pickShape = (shape) => {
  if (shape !== 'mixed') return shape;
  const r = Math.random();
  return r < 0.55 ? 'peony' : r < 0.88 ? 'ring' : 'heart';
};

/** Unit-length launch directions (and speed factors) for each spark in a burst. */
const directions = (shape, n) => {
  const out = [];
  if (shape === 'ring') {
    const tilt = 0.35 + Math.random() * 0.65;
    const spin = Math.random() * Math.PI;
    const cs = Math.cos(spin);
    const sn = Math.sin(spin);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = Math.cos(a);
      const y = Math.sin(a) * tilt;
      const f = 0.96 + Math.random() * 0.08;
      out.push([(x * cs - y * sn) * f, (x * sn + y * cs) * f]);
    }
  } else if (shape === 'heart') {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = 16 * Math.sin(a) ** 3;
      const y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
      out.push([x / 17, y / 17]);
    }
  } else {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const f = Math.random() ** 0.35;
      out.push([Math.cos(a) * f, Math.sin(a) * f]);
    }
  }
  return out;
};

const FireworksTest = () => {
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [size, setSize] = useState(DEFAULTS.size);
  const [gravity, setGravity] = useState(DEFAULTS.gravity);
  const [palette, setPalette] = useState(DEFAULTS.palette);
  const [shape, setShape] = useState(DEFAULTS.shape);
  const [glitter, setGlitter] = useState(DEFAULTS.glitter);
  const [paused, setPaused] = useState(false);
  const sim = useRef(null);
  const queue = useRef([]);

  const animate = (ctx, { width, height, dpr }, t) => {
    let s = sim.current;
    if (!s) s = sim.current = { rockets: [], sparks: [], flashes: [], launch: 0, last: t, clock: 0 };
    const dt = paused ? 0 : Math.min(MAX_DT, Math.max(0, t - s.last)) / 1000;
    s.last = t;
    s.clock += dt;

    const burst = (x, y, hue) => {
      const room = MAX_SPARKS - s.sparks.length;
      if (room <= 0) return;
      const kind = pickShape(shape);
      const n = Math.min(room, Math.round((kind === 'peony' ? 30 : 40) + size * 0.8));
      const sp = height * (0.14 + size / 380) * (kind === 'heart' ? 0.9 : 1);
      const second = palette === 'mixed' && Math.random() < 0.35 ? hue + 120 + Math.random() * 120 : null;
      for (const [dx, dy] of directions(kind, n)) {
        const h = second != null && Math.random() < 0.5 ? second : hue;
        s.sparks.push({
          x,
          y,
          vx: dx * sp,
          vy: dy * sp,
          life: SPARK_LIFE + Math.random() * 0.15,
          age: 0,
          color: `hsl(${Math.round(h + (Math.random() * 14 - 7))} 90% 64%)`,
          w: (1.2 + Math.random() * 1.2) * dpr,
          seed: Math.random() * 100,
        });
      }
      s.flashes.push({ x, y, at: s.clock, hue, r: sp * 0.22 });
    };

    if (!paused) {
      s.launch += dt * rate;
      while (s.launch >= 1) {
        s.launch -= 1;
        s.rockets.push({
          x: width * (0.12 + Math.random() * 0.76),
          y: height + 4,
          vx: (Math.random() - 0.5) * height * 0.06,
          vy: -(height * (0.9 + Math.random() * 0.35)),
          hue: hueOf(palette),
        });
      }
      for (const click of queue.current) burst(click.x, click.y, hueOf(palette));
      queue.current = [];
    }

    const g = height * (gravity / 50) * 0.85;
    const drag = Math.exp(-DRAG * dt);
    s.rockets = s.rockets.filter((r) => {
      r.vy += g * dt;
      r.x += r.vx * dt;
      r.y += r.vy * dt;
      if (r.vy >= 0) {
        burst(r.x, r.y, r.hue);
        return false;
      }
      return r.y < height + 8;
    });
    s.sparks = s.sparks.filter((p) => {
      p.age += dt;
      if (p.age >= p.life) return false;
      p.vx *= drag;
      p.vy = p.vy * drag + g * dt * 0.4;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      return true;
    });
    s.flashes = s.flashes.filter((f) => (s.clock - f.at) * 1000 < FLASH_MS);

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    for (const f of s.flashes) {
      const k = 1 - ((s.clock - f.at) * 1000) / FLASH_MS;
      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      glow.addColorStop(0, `hsla(${Math.round(f.hue)} 100% 85% / ${0.55 * k})`);
      glow.addColorStop(1, 'hsla(0 0% 0% / 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
    }

    ctx.strokeStyle = '#fff1c2';
    ctx.lineWidth = Math.max(1, 1.5 * dpr);
    ctx.beginPath();
    for (const r of s.rockets) {
      ctx.moveTo(r.x - r.vx * 0.05, r.y - r.vy * 0.05);
      ctx.lineTo(r.x, r.y);
    }
    ctx.stroke();

    for (const p of s.sparks) {
      const left = 1 - p.age / p.life;
      let alpha = left * left;
      if (glitter && left < 0.55) alpha *= Math.sin(s.clock * 38 + p.seed) > 0.2 ? 1.4 : 0.15;
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(p.x - p.vx * STREAK, p.y - p.vy * STREAK);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const launchAt = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    queue.current.push({
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    });
  };

  const handleReset = () => {
    setRate(DEFAULTS.rate);
    setSize(DEFAULTS.size);
    setGravity(DEFAULTS.gravity);
    setPalette(DEFAULTS.palette);
    setShape(DEFAULTS.shape);
    setGlitter(DEFAULTS.glitter);
    setPaused(false);
    sim.current = null;
    queue.current = [];
  };

  const shortcuts = [
    { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
    { key: 'ArrowUp', label: 'More launches', action: () => setRate((v) => Math.min(8, v + 1)) },
    { key: 'ArrowDown', label: 'Fewer launches', action: () => setRate((v) => Math.max(0, v - 1)) },
    {
      key: 'f',
      label: 'Fire one',
      action: () => {
        const canvas = canvasRef.current;
        if (!canvas || paused) return;
        queue.current.push({
          x: canvas.width * (0.2 + Math.random() * 0.6),
          y: canvas.height * (0.15 + Math.random() * 0.35),
        });
      },
    },
  ];

  return (
    <TestShell
      title="Fireworks"
      description="Just for fun. Bursts stay small and the blast fades shortly after it explodes — click or tap anywhere to fire one yourself."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Show</h3>
            <Slider
              label="Auto launch"
              value={rate}
              min={0}
              max={8}
              onChange={setRate}
              format={(v) => (v === 0 ? 'Off' : `${v}/s`)}
            />
            <Slider label="Burst size" value={size} min={20} max={100} onChange={setSize} />
            <Slider label="Gravity" value={gravity} min={10} max={100} onChange={setGravity} format={(v) => `${v}%`} />
            <Segmented
              label="Shape"
              options={Object.entries(SHAPES).map(([value, p]) => ({ value, label: p.label }))}
              value={shape}
              onChange={setShape}
              columns={4}
            />
            <Segmented
              label="Colors"
              options={Object.entries(PALETTES).map(([value, p]) => ({ value, label: p.label }))}
              value={palette}
              onChange={setPalette}
              columns={4}
            />
            <Toggle label="Glitter as sparks fade" checked={glitter} onChange={setGlitter} />
            <Hint>Click or tap the picture to launch a burst there, or press F. Press Space to pause. The blast fades within about half a second, and bursts are capped so the screen never fills with flashes.</Hint>
          </Section>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={launchAt}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
      />
    </TestShell>
  );
};

export default FireworksTest;
