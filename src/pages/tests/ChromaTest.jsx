import { useState } from 'react';
import TestShell, { Section, Slider, Toggle, Readout, Hint } from '../../components/TestShell';
import PixelCanvas, { SCALING_WARNING } from '../../components/PixelCanvas';

const TEXT_ROWS = [
  ['White on black', '#ffffff', '#000000'],
  ['Black on white', '#000000', '#ffffff'],
  ['Red on blue', '#ff0000', '#0000ff'],
  ['Blue on red', '#0000ff', '#ff0000'],
  ['Magenta on green', '#ff00ff', '#00ff00'],
  ['Green on magenta', '#00ff00', '#ff00ff'],
  ['Red on green', '#ff0000', '#00ff00'],
  ['Yellow on blue', '#ffff00', '#0000ff'],
  ['Blue on yellow', '#0000ff', '#ffff00'],
  ['Cyan on red', '#00ffff', '#ff0000'],
  ['Red on black', '#ff0000', '#000000'],
  ['Blue on black', '#0000ff', '#000000'],
  ['Magenta on black', '#ff00ff', '#000000'],
];

const LINE_PAIRS = [
  ['White / black', '#ffffff', '#000000'],
  ['Red / blue', '#ff0000', '#0000ff'],
  ['Red / green', '#ff0000', '#00ff00'],
  ['Green / blue', '#00ff00', '#0000ff'],
  ['Magenta / green', '#ff00ff', '#00ff00'],
  ['Yellow / blue', '#ffff00', '#0000ff'],
  ['Cyan / red', '#00ffff', '#ff0000'],
];

const SAMPLE = 'The quick brown fox jumps over the lazy dog. 0123456789 ilI1| ';
const FONT = 'Arial, Helvetica, sans-serif';
const DEFAULTS = { fontPx: 14, lines: true };

function drawText(ctx, x, y, width, rowH, fontPx) {
  ctx.textBaseline = 'middle';
  ctx.font = `${fontPx}px ${FONT}`;
  const sample = SAMPLE.repeat(Math.ceil(width / Math.max(1, ctx.measureText(SAMPLE).width)) + 1);
  for (const [name, fg, bg] of TEXT_ROWS) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, y, ctx.canvas.width, rowH);
    ctx.fillStyle = fg;
    ctx.fillText(`${name}:  ${sample}`, x, y + Math.round(rowH / 2));
    y += rowH;
  }
  return y;
}

function drawLinePairs(ctx, { pad, y, width, height, fontPx }) {
  const labelH = Math.round(fontPx * 1.8);
  const gap = Math.max(4, Math.round(fontPx * 0.6));
  const cols = LINE_PAIRS.length;
  const cellW = Math.floor((width - pad * 2 - gap * (cols - 1)) / cols);
  const blockH = Math.min(Math.floor((height - y - pad - labelH * 3) / 2), cellW * 2);
  if (cellW < 8 || blockH < 8) return;

  ctx.font = `${fontPx}px ${FONT}`;
  ctx.textBaseline = 'middle';

  const rows = [
    { title: 'Vertical 1-px lines — blur here means 4:2:2 or 4:2:0', vertical: true },
    { title: 'Horizontal 1-px lines — blur here (but not above) means 4:2:0', vertical: false },
  ];

  y += labelH / 2;
  ctx.fillStyle = '#d1d5db';
  LINE_PAIRS.forEach(([name], i) => {
    ctx.fillText(name, pad + i * (cellW + gap), Math.round(y + labelH / 2));
  });
  y += labelH;

  for (const row of rows) {
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(row.title, pad, Math.round(y + labelH / 2));
    y += labelH;
    LINE_PAIRS.forEach(([, a, b], i) => {
      const x0 = pad + i * (cellW + gap);
      ctx.fillStyle = b;
      ctx.fillRect(x0, y, cellW, blockH);
      ctx.fillStyle = a;
      if (row.vertical) {
        for (let x = 0; x < cellW; x += 2) ctx.fillRect(x0 + x, y, 1, blockH);
      } else {
        for (let dy = 0; dy < blockH; dy += 2) ctx.fillRect(x0, y + dy, cellW, 1);
      }
    });
    y += blockH;
  }
}

const ChromaTest = () => {
  const [fontPx, setFontPx] = useState(DEFAULTS.fontPx);
  const [lines, setLines] = useState(DEFAULTS.lines);
  const [info, setInfo] = useState({ width: 0, height: 0, dpr: 1, exact: true });

  const draw = (ctx, { width, height }) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    const pad = Math.max(8, Math.round(fontPx * 0.9));
    const rowH = Math.round(fontPx * 1.75);
    const y = drawText(ctx, pad, pad, width, rowH, fontPx);
    if (lines) drawLinePairs(ctx, { pad, y, width, height, fontPx });
  };

  const handleReset = () => {
    setFontPx(DEFAULTS.fontPx);
    setLines(DEFAULTS.lines);
  };

  const shortcuts = [
    { key: ['+', '='], label: 'Larger text', action: () => setFontPx((v) => Math.min(32, v + 1)) },
    { key: ['-', '_'], label: 'Smaller text', action: () => setFontPx((v) => Math.max(8, v - 1)) },
    { key: 'l', label: 'Show / hide line pairs', action: () => setLines((v) => !v) },
  ];

  return (
    <TestShell
      title="Chroma Subsampling Test"
      description="Every row should be as sharp as the white-on-black and black-on-white rows. If colored text (especially red on blue, blue on red, or magenta on green) looks smeared, fringed, or blurry while the gray rows are crisp, the signal is being sent as 4:2:2 or 4:2:0 instead of full 4:4:4."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          {!info.exact ? (
            <Section>
              <Hint style={{ color: 'var(--warning)', marginTop: 0 }}>{SCALING_WARNING}</Hint>
            </Section>
          ) : null}
          <Section>
            <h3>Pattern</h3>
            <Slider
              label="Text size"
              value={fontPx}
              min={8}
              max={32}
              onChange={setFontPx}
              format={(v) => `${v} device px`}
              hint="Small sizes (10–14 px) make subsampling easiest to see."
            />
            <Toggle label="Show 1-pixel line pairs" checked={lines} onChange={setLines} />
          </Section>
          <Section>
            <h3>How to read it</h3>
            <Hint style={{ marginTop: 0 }}>
              Vertical colored lines merge into one flat color under 4:2:2 and 4:2:0. Horizontal colored lines only
              merge under 4:2:0. White/black lines carry no color and should stay sharp in every mode — if they blur
              too, the problem is scaling or sharpness, not chroma.
            </Hint>
          </Section>
          <Section>
            <h3>Canvas</h3>
            <Readout
              items={[
                ['Size', `${info.width} × ${info.height} device px`],
                ['Device pixel ratio', String(Math.round(info.dpr * 1000) / 1000)],
                ['Pixel-exact', info.exact ? 'Yes' : 'Not guaranteed'],
              ]}
            />
          </Section>
        </>
      }
    >
      <PixelCanvas draw={draw} deps={[fontPx, lines]} onInfo={setInfo} aria-label="Chroma subsampling test chart" role="img" />
    </TestShell>
  );
};

export default ChromaTest;
