import { useState } from 'react';
import TestShell, {
  Section,
  Segmented,
  Slider,
  Toggle,
  ColorInput,
  Readout,
  Hint,
} from '../../components/TestShell';
import PixelCanvas from '../../components/PixelCanvas';

const toHex = (r, g, b) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
const gray = (pct) => {
  const v = Math.round((pct / 100) * 255);
  return toHex(v, v, v);
};

const PRESETS = [
  { id: 'g0', label: '0%', name: 'Black (0%)', value: gray(0) },
  { id: 'g5', label: '5%', name: '5% gray', value: gray(5) },
  { id: 'g10', label: '10%', name: '10% gray', value: gray(10) },
  { id: 'g15', label: '15%', name: '15% gray', value: gray(15) },
  { id: 'g20', label: '20%', name: '20% gray', value: gray(20) },
  { id: 'g25', label: '25%', name: '25% gray', value: gray(25) },
  { id: 'g50', label: '50%', name: '50% gray', value: gray(50) },
  { id: 'g75', label: '75%', name: '75% gray', value: gray(75) },
  { id: 'g100', label: '100%', name: 'White (100%)', value: gray(100) },
  { id: 'red', label: 'Red', name: 'Red', value: '#ff0000' },
  { id: 'green', label: 'Green', name: 'Green', value: '#00ff00' },
  { id: 'blue', label: 'Blue', name: 'Blue', value: '#0000ff' },
];

const isGray = (p) => /^g\d+$/.test(p.id);
const GRAY_OPTIONS = PRESETS.filter(isGray).map((p) => ({ value: p.id, label: p.label, title: `${p.name} (${p.value})` }));
const COLOR_OPTIONS = PRESETS.filter((p) => !isGray(p)).map((p) => ({ value: p.id, label: p.label }));

const DEFAULTS = {
  preset: 'g0',
  custom: '#202020',
  pan: false,
  grid: 0,
  markers: false,
  checker: false,
  checkerSize: 64,
};

const parseHex = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Relative luminance (sRGB), 0–1. */
const luminance = (hex) => {
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const UniformityTest = () => {
  const [preset, setPreset] = useState(DEFAULTS.preset);
  const [custom, setCustom] = useState(DEFAULTS.custom);
  const [pan, setPan] = useState(DEFAULTS.pan);
  const [grid, setGrid] = useState(DEFAULTS.grid);
  const [markers, setMarkers] = useState(DEFAULTS.markers);
  const [checker, setChecker] = useState(DEFAULTS.checker);
  const [checkerSize, setCheckerSize] = useState(DEFAULTS.checkerSize);

  const current = PRESETS.find((p) => p.id === preset);
  const color = current ? current.value : custom;
  const colorName = current ? current.name : 'Custom';
  const dark = luminance(color) < 0.2;
  // Opaque overlay color that stays visible without flooding a dark field with light.
  const lineColor = dark ? '#808080' : '#000000';
  const checkerColor = color === '#000000' ? '#ffffff' : '#000000';
  const rgb = parseHex(color);
  const level =
    rgb[0] === rgb[1] && rgb[1] === rgb[2]
      ? `${rgb[0]} / 255 (${Math.round((rgb[0] / 255) * 100)}% signal)`
      : rgb.join(', ');

  const step = (dir) => {
    const i = PRESETS.findIndex((p) => p.id === preset);
    const next = i < 0 ? (dir > 0 ? 0 : PRESETS.length - 1) : (i + dir + PRESETS.length) % PRESETS.length;
    setPreset(PRESETS[next].id);
  };

  const handleReset = () => {
    setPreset(DEFAULTS.preset);
    setCustom(DEFAULTS.custom);
    setPan(DEFAULTS.pan);
    setGrid(DEFAULTS.grid);
    setMarkers(DEFAULTS.markers);
    setChecker(DEFAULTS.checker);
    setCheckerSize(DEFAULTS.checkerSize);
  };

  const drawScene = (ctx, { width, height, dpr }, t) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    if (t != null) {
      const period = Math.max(2, Math.round(width / 6));
      const offset = ((t / 1000) * (width / 8)) % period;
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = dark ? '#ffffff' : '#000000';
      for (let x = offset - period; x < width; x += period) {
        ctx.fillRect(Math.round(x), 0, Math.round(period / 2), height);
      }
      ctx.globalAlpha = 1;
    }

    if (checker) {
      const size = Math.max(1, Math.round(checkerSize * dpr));
      ctx.fillStyle = checkerColor;
      for (let y = 0, row = 0; y < height; y += size, row++) {
        for (let x = (row % 2) * size; x < width; x += size * 2) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }

    const lw = Math.max(1, Math.round(dpr));

    if (grid) {
      ctx.fillStyle = lineColor;
      for (let i = 1; i < grid; i++) {
        ctx.fillRect(Math.round((width * i) / grid) - Math.floor(lw / 2), 0, lw, height);
        ctx.fillRect(0, Math.round((height * i) / grid) - Math.floor(lw / 2), width, lw);
      }
    }

    if (markers) {
      ctx.fillStyle = lineColor;
      const arm = Math.round(12 * dpr);
      const points = [
        [0.5, 0.5],
        [1 / 6, 1 / 6],
        [5 / 6, 1 / 6],
        [1 / 6, 5 / 6],
        [5 / 6, 5 / 6],
      ];
      points.forEach(([fx, fy]) => {
        const cx = Math.round(width * fx);
        const cy = Math.round(height * fy);
        ctx.fillRect(cx - arm, cy - Math.floor(lw / 2), arm * 2 + 1, lw);
        ctx.fillRect(cx - Math.floor(lw / 2), cy - arm, lw, arm * 2 + 1);
      });
    }
  };

  const draw = (ctx, info) => drawScene(ctx, info, null);
  const animate = pan ? (ctx, info, t) => drawScene(ctx, info, t) : undefined;

  const shortcuts = [
    { key: ['ArrowRight', ' '], label: 'Next preset', action: () => step(1) },
    { key: 'ArrowLeft', label: 'Previous preset', action: () => step(-1) },
    { key: 'p', label: 'Toggle moving pattern (DSE)', action: () => setPan((v) => !v) },
    {
      key: 'g',
      label: 'Cycle grid (off / 3×3 / 5×5)',
      action: () => setGrid((g) => (g === 0 ? 3 : g === 3 ? 5 : 0)),
    },
    { key: 'm', label: 'Toggle markers', action: () => setMarkers((v) => !v) },
    { key: 'c', label: 'Toggle checkerboard', action: () => setChecker((v) => !v) },
  ];

  return (
    <TestShell
      title="Uniformity Test"
      description="Compare each zone to the center. Dark fields (0–10%) show backlight bleed, IPS glow and clouding; 5–20% gray with the moving pattern on shows dirty-screen effect; 50–100% shows vignetting and tint. Levels are % of full signal, not luminance."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Gray level</h3>
            <Segmented options={GRAY_OPTIONS} value={preset} onChange={setPreset} columns={5} />
            <h3>Primaries</h3>
            <Segmented options={COLOR_OPTIONS} value={preset} onChange={setPreset} columns={3} />
            <ColorInput
              label="Custom color"
              value={color}
              onChange={(v) => {
                setCustom(v);
                setPreset('custom');
              }}
            />
          </Section>

          <Section>
            <h3>Overlays</h3>
            <Toggle label="Moving pattern (DSE)" checked={pan} onChange={setPan} />
            <Segmented
              label="Zone grid"
              options={[
                { value: 0, label: 'Off' },
                { value: 3, label: '3×3' },
                { value: 5, label: '5×5' },
              ]}
              value={grid}
              onChange={setGrid}
              columns={3}
            />
            <Toggle label="Center and corner markers" checked={markers} onChange={setMarkers} />
            <Toggle label="Checkerboard" checked={checker} onChange={setChecker} />
            {checker ? (
              <Slider
                label="Square size"
                value={checkerSize}
                min={16}
                max={256}
                step={8}
                onChange={setCheckerSize}
                format={(v) => `${v} px`}
              />
            ) : null}
            <Hint>
              The moving pattern scrolls faint bars across the field: smudges that stay put while it moves
              are DSE. Overlays add light to the screen. Turn them off for the final dark-room check — and turn
              off local dimming, which can hide or fake non-uniformity.
            </Hint>
          </Section>

          <Section>
            <h3>Now showing</h3>
            <Readout
              items={[
                ['Field', colorName],
                ['Value', color.toUpperCase()],
                ['Level', level],
                ['Luminance', `${(luminance(color) * 100).toFixed(1)}%`],
              ]}
            />
          </Section>
        </>
      }
    >
      <PixelCanvas
        draw={draw}
        animate={animate}
        deps={[color, pan, grid, markers, checker, checkerSize, lineColor, checkerColor]}
      />
    </TestShell>
  );
};

export default UniformityTest;
