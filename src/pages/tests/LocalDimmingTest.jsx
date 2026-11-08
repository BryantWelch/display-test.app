import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Readout, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const SHAPES = [
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
  { value: 'stars', label: 'Star field' },
  { value: 'text', label: 'Subtitles' },
];

const MOTIONS = [
  { value: 'off', label: 'Still' },
  { value: 'sweep', label: 'Sweep' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'pointer', label: 'Follow', title: 'Follow the mouse or your finger' },
];

const SUBTITLE = ['Subtitles on black are the classic blooming test.', 'Look for a gray box glowing around the words.'];

// Deterministic so the star field doesn't reshuffle on every resize.
const STARS = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 140 }, () => ({ x: rand(), y: rand(), r: 0.4 + rand() * 0.9 }));
})();

const DEFAULTS = { shape: 'square', size: 80, level: 255, motion: 'off', speed: 300 };

const cycle = (list, value, dir = 1) => {
  const i = list.findIndex((o) => o.value === value);
  return list[(i + dir + list.length) % list.length].value;
};

const LocalDimmingTest = () => {
  const [shape, setShape] = useState(DEFAULTS.shape);
  const [size, setSize] = useState(DEFAULTS.size);
  const [level, setLevel] = useState(DEFAULTS.level);
  const [motion, setMotion] = useState(DEFAULTS.motion);
  const [speed, setSpeed] = useState(DEFAULTS.speed);

  const settings = useRef(null);
  settings.current = { shape, size, level, motion, speed };
  const state = useRef({ x: null, y: null, vx: 0.8, vy: 0.6, dir: 1, offset: 0, last: 0, w: 0, h: 0 });
  const pointer = useRef(null);

  const animate = (ctx, { width: W, height: H, dpr }, t) => {
    const s = settings.current;
    const p = state.current;
    const dt = p.last ? Math.min(0.05, (t - p.last) / 1000) : 0;
    p.last = t;

    if (p.w !== W || p.h !== H || p.x === null) {
      p.x = W / 2;
      p.y = H / 2;
      p.w = W;
      p.h = H;
    }

    const color = `rgb(${s.level}, ${s.level}, ${s.level})`;
    const px = s.size * dpr;
    const move = s.speed * dpr * dt;
    const fontPx = Math.max(12, s.size * 0.35) * dpr;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color;

    // Half extents of the moving object, used for edge bounces.
    let hw = px / 2;
    let hh = px / 2;
    if (s.shape === 'text') {
      ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
      hw = Math.max(...SUBTITLE.map((line) => ctx.measureText(line).width)) / 2;
      hh = fontPx * 1.3;
    }
    const restY = s.shape === 'text' ? H * 0.8 : H / 2;

    if (s.shape === 'stars') {
      if (s.motion === 'sweep' || s.motion === 'bounce') p.offset = (p.offset + move) % W;
      const ox = s.motion === 'pointer' && pointer.current ? pointer.current.x - W / 2 : p.offset;
      const oy = s.motion === 'pointer' && pointer.current ? pointer.current.y - H / 2 : 0;
      const base = Math.max(1, (s.size / 20) * dpr);
      for (const star of STARS) {
        const x = (((star.x * W + ox) % W) + W) % W;
        const y = (((star.y * H + oy) % H) + H) % H;
        const r = Math.max(0.5, base * star.r);
        ctx.fillRect(Math.round(x - r), Math.round(y - r), Math.max(1, Math.round(r * 2)), Math.max(1, Math.round(r * 2)));
      }
      return;
    }

    if (s.motion === 'off') {
      p.x = W / 2;
      p.y = restY;
    } else if (s.motion === 'sweep') {
      p.y = restY;
      p.x += p.dir * move;
      if (W <= hw * 2) {
        p.x = W / 2;
      } else if (p.x > W - hw) {
        p.x = W - hw;
        p.dir = -1;
      } else if (p.x < hw) {
        p.x = hw;
        p.dir = 1;
      }
    } else if (s.motion === 'bounce') {
      p.x += p.vx * move;
      p.y += p.vy * move;
      if (W <= hw * 2) {
        p.x = W / 2;
      } else if (p.x > W - hw || p.x < hw) {
        p.vx = -p.vx;
        p.x = Math.min(W - hw, Math.max(hw, p.x));
      }
      if (H <= hh * 2) {
        p.y = H / 2;
      } else if (p.y > H - hh || p.y < hh) {
        p.vy = -p.vy;
        p.y = Math.min(H - hh, Math.max(hh, p.y));
      }
    } else if (s.motion === 'pointer' && pointer.current) {
      p.x = pointer.current.x;
      p.y = pointer.current.y;
    }

    if (s.shape === 'square') {
      ctx.fillRect(Math.round(p.x - px / 2), Math.round(p.y - px / 2), Math.round(px), Math.round(px));
    } else if (s.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, px / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(SUBTITLE[0], p.x, p.y - fontPx * 0.65);
      ctx.fillText(SUBTITLE[1], p.x, p.y + fontPx * 0.65);
    }
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const trackPointer = (e) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.current = {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const handleReset = () => {
    setShape(DEFAULTS.shape);
    setSize(DEFAULTS.size);
    setLevel(DEFAULTS.level);
    setMotion(DEFAULTS.motion);
    setSpeed(DEFAULTS.speed);
  };

  const shortcuts = [
    { key: 's', label: 'Next shape', action: () => setShape((v) => cycle(SHAPES, v)) },
    { key: 'm', label: 'Next motion mode', action: () => setMotion((v) => cycle(MOTIONS, v)) },
    { key: ['+', '='], label: 'Bigger object', action: () => setSize((v) => Math.min(600, v + 10)) },
    { key: ['-', '_'], label: 'Smaller object', action: () => setSize((v) => Math.max(4, v - 10)) },
    { key: 'ArrowUp', label: 'Faster', action: () => setSpeed((v) => Math.min(2000, v + 50)) },
    { key: 'ArrowDown', label: 'Slower', action: () => setSpeed((v) => Math.max(50, v - 50)) },
  ];

  return (
    <TestShell
      title="Local Dimming Test"
      description="A small bright object on pure black. On full-array local dimming (FALD) and Mini-LED displays, look for a glow (bloom) around it and for the glow lagging behind as it moves."
      onReset={handleReset}
      shortcuts={shortcuts}
      revealOnMove={motion !== 'pointer'}
      controls={
        <>
          <Section>
            <h3>Object</h3>
            <Segmented options={SHAPES} value={shape} onChange={setShape} columns={2} />
            <Slider label="Size" value={size} min={4} max={600} onChange={setSize} format={(v) => `${v} px`} />
            <Slider label="Brightness" value={level} min={32} max={255} onChange={setLevel} format={(v) => `${v} / 255`} />
          </Section>

          <Section>
            <h3>Motion</h3>
            <Segmented options={MOTIONS} value={motion} onChange={setMotion} columns={4} />
            <Slider
              label="Speed"
              value={speed}
              min={50}
              max={2000}
              step={50}
              onChange={setSpeed}
              format={(v) => `${v} px/s`}
            />
            {motion === 'pointer' ? (
              <Hint>
                Move the mouse, or drag a finger across the screen. The panel and cursor stay hidden while you move;
                click or press any key to bring them back.
              </Hint>
            ) : null}
          </Section>

          <Section>
            <h3>Compare</h3>
            <Readout
              items={[
                ['Shape', SHAPES.find((o) => o.value === shape).label],
                ['Motion', MOTIONS.find((o) => o.value === motion).label],
              ]}
            />
            <Hint>
              Run this once per local dimming setting (Off / Low / Medium / High) and note which gives the least halo without
              dimming small highlights. Hide the panel with H — it lights zones too.
            </Hint>
          </Section>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        onPointerMove={trackPointer}
        onPointerDown={trackPointer}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
        aria-hidden="true"
      />
    </TestShell>
  );
};

export default LocalDimmingTest;
