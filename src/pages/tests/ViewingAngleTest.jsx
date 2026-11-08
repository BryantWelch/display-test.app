import { useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Segmented, Toggle, Hint } from '../../components/TestShell';
import PixelCanvas, { SCALING_WARNING } from '../../components/PixelCanvas';

const PALETTE = [
  { name: 'White', value: '#ffffff' },
  { name: '50% gray', value: '#808080' },
  { name: '25% gray', value: '#404040' },
  { name: 'Skin tone', value: '#d8a585' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Black', value: '#000000' },
];

const LAYOUTS = {
  8: [4, 2],
  24: [6, 4],
  48: [8, 6],
  96: [12, 8],
};

const MODES = [
  { value: 'patches', label: 'Patches' },
  { value: 'bars', label: 'Gray bars' },
  { value: 'near-black', label: 'Near-black' },
  { value: 'gamma', label: 'Gamma match' },
];

/** Horizontal 1px line masks averaging the given share of full light. */
const LINE_MASKS = {
  0.25: (y) => y % 4 === 0,
  0.5: (y) => y % 2 === 0,
  0.75: (y) => y % 4 !== 3,
};
const GAMMA_BANDS = [0.25, 0.5, 0.75];
const GAMMA_PATCHES = 5;
const matchLevel = (mix) => Math.round(255 * mix ** (1 / 2.2));

const DEFAULTS = { mode: 'patches', patches: 24, bars: 16, labels: true };

const Grid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  grid-template-rows: repeat(${({ $rows }) => $rows}, 1fr);
  gap: ${({ $gap }) => $gap}px;
  padding: ${({ $gap }) => $gap}px;
  background: #000;
`;

const Cell = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.5rem;
  font: 600 0.75rem/1 var(--font-mono);
  user-select: none;
`;

const textOn = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const y = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return y > 100 ? '#000000' : '#9a9a9a';
};

const levelHex = (v) => {
  const h = v.toString(16).padStart(2, '0');
  return `#${h}${h}${h}`;
};

const barLevels = (mode, count) =>
  Array.from({ length: count }, (_, i) =>
    mode === 'bars' ? Math.round((i * 255) / (count - 1)) : Math.round((i * 40) / (count - 1))
  );

const drawGammaMatch = (ctx, { width, height, dpr }, labels) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  const bandH = Math.floor(height / GAMMA_BANDS.length);
  const patchW = Math.round(width / (GAMMA_PATCHES * 2));
  ctx.font = `600 ${Math.round(12 * dpr)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  GAMMA_BANDS.forEach((mix, b) => {
    const y0 = b * bandH;
    const h = b === GAMMA_BANDS.length - 1 ? height - y0 : bandH;
    const on = LINE_MASKS[mix];
    ctx.fillStyle = '#fff';
    for (let y = y0; y < y0 + h; y += 1) {
      if (on(y)) ctx.fillRect(0, y, width, 1);
    }

    const hex = levelHex(matchLevel(mix));
    const patchH = Math.round(h * 0.5);
    const py = y0 + Math.round((h - patchH) / 2);
    for (let i = 0; i < GAMMA_PATCHES; i += 1) {
      const x = Math.round(((i + 0.5) * width) / GAMMA_PATCHES - patchW / 2);
      ctx.fillStyle = hex;
      ctx.fillRect(x, py, patchW, patchH);
      if (labels) {
        ctx.fillStyle = textOn(hex);
        ctx.fillText(`${mix * 100}%`, x + patchW / 2, py + patchH - Math.round(6 * dpr));
      }
    }
  });
};

const ViewingAngleTest = () => {
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [patches, setPatches] = useState(DEFAULTS.patches);
  const [bars, setBars] = useState(DEFAULTS.bars);
  const [labels, setLabels] = useState(DEFAULTS.labels);
  const [exact, setExact] = useState(true);

  const handleReset = () => {
    setMode(DEFAULTS.mode);
    setPatches(DEFAULTS.patches);
    setBars(DEFAULTS.bars);
    setLabels(DEFAULTS.labels);
  };

  const cycle = (list, value, dir) => list[(list.indexOf(value) + dir + list.length) % list.length];
  const patchOptions = Object.keys(LAYOUTS).map(Number);
  const barOptions = [8, 16, 32];

  const shortcuts = [
    {
      key: ['ArrowRight', ' '],
      label: 'Next pattern',
      action: () => setMode((m) => cycle(MODES.map((o) => o.value), m, 1)),
    },
    {
      key: 'ArrowLeft',
      label: 'Previous pattern',
      action: () => setMode((m) => cycle(MODES.map((o) => o.value), m, -1)),
    },
    {
      key: 'ArrowUp',
      label: 'More patches / bars',
      action: () => {
        if (mode === 'patches') {
          setPatches((p) => patchOptions[Math.min(patchOptions.indexOf(p) + 1, patchOptions.length - 1)]);
        } else if (mode !== 'gamma') {
          setBars((b) => barOptions[Math.min(barOptions.indexOf(b) + 1, barOptions.length - 1)]);
        }
      },
    },
    {
      key: 'ArrowDown',
      label: 'Fewer patches / bars',
      action: () => {
        if (mode === 'patches') {
          setPatches((p) => patchOptions[Math.max(patchOptions.indexOf(p) - 1, 0)]);
        } else if (mode !== 'gamma') {
          setBars((b) => barOptions[Math.max(barOptions.indexOf(b) - 1, 0)]);
        }
      },
    },
    { key: 'l', label: 'Toggle labels', action: () => setLabels((v) => !v) },
  ];

  let content;
  if (mode === 'patches') {
    const [cols, rows] = LAYOUTS[patches];
    // Offset each row so identical colors don't stack into columns.
    const rowShift = patches > 8 && cols % 4 === 0 ? 3 : 0;
    content = (
      <Grid $cols={cols} $rows={rows} $gap={patches > 48 ? 3 : 6}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const r = Math.floor(i / cols);
          const c = PALETTE[(i + r * rowShift) % PALETTE.length];
          return (
            <Cell key={i} style={{ background: c.value, color: textOn(c.value) }}>
              {labels && patches <= 48 ? c.name : null}
            </Cell>
          );
        })}
      </Grid>
    );
  } else if (mode === 'gamma') {
    content = (
      <PixelCanvas
        draw={(ctx, info) => drawGammaMatch(ctx, info, labels)}
        deps={[labels]}
        onInfo={(info) => setExact(info.exact)}
        aria-label="Line patterns with matching solid gray patches"
      />
    );
  } else {
    const levels = barLevels(mode, bars);
    content = (
      <Grid $cols={bars} $rows={1} $gap={0}>
        {levels.map((v, i) => (
          <Cell key={i} style={{ background: levelHex(v), color: textOn(levelHex(v)) }}>
            {labels && bars <= 16 ? v : null}
          </Cell>
        ))}
      </Grid>
    );
  }

  const descriptions = {
    patches:
      'Note how the patches look head-on, then move your head left/right and up/down. Watch whites tint, grays brighten or darken, skin tone shift, and black lift.',
    bars: 'Full-height steps from black to white. Moving up and down shows gamma shift; on TN panels the steps can invert near the top or bottom.',
    'near-black':
      'Steps from 0 to 40 (of 255). VA panels often crush the lowest steps head-on and lift them off-axis; IPS glow washes them out from an angle.',
    gamma:
      'Bands of 1-pixel black and white lines averaging 25%, 50%, and 75% light, each with solid gray patches that match at gamma 2.2. Note how well the patches blend head-on (step back if the lines are visible), then move your head: where gamma shifts, the patches turn lighter or darker than the lines around them.',
  };

  return (
    <TestShell
      title="Viewing Angle Test"
      description={descriptions[mode]}
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Pattern</h3>
            <Segmented options={MODES} value={mode} onChange={setMode} columns={2} />
          </Section>

          {mode === 'gamma' && !exact ? (
            <Hint role="alert" style={{ color: 'var(--warning)', marginTop: 0, marginBottom: '1rem' }}>
              {SCALING_WARNING}
            </Hint>
          ) : null}

          <Section>
            {mode === 'gamma' ? null : mode === 'patches' ? (
              <Segmented
                label="Patch count"
                options={patchOptions.map((n) => ({ value: n, label: String(n) }))}
                value={patches}
                onChange={setPatches}
                columns={4}
              />
            ) : (
              <Segmented
                label="Number of bars"
                options={barOptions.map((n) => ({ value: n, label: String(n) }))}
                value={bars}
                onChange={setBars}
                columns={3}
              />
            )}
            <Toggle label="Show labels (L)" checked={labels} onChange={setLabels} />
            <Hint>
              Labels hide automatically at the highest densities. Keep your eyes level with the screen center
              as your reference, then move only your head.
            </Hint>
          </Section>
        </>
      }
    >
      {content}
    </TestShell>
  );
};

export default ViewingAngleTest;
