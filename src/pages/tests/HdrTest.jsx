import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Segmented, Readout, Hint, Toggle } from '../../components/TestShell';
import { getColorGamut, getDynamicRange, onDisplayChange } from '../../utils/displayInfo';

const COLORS = [
  { name: 'Red', rgb: [1, 0, 0] },
  { name: 'Green', rgb: [0, 1, 0] },
  { name: 'Blue', rgb: [0, 0, 1] },
  { name: 'Cyan', rgb: [0, 1, 1] },
  { name: 'Magenta', rgb: [1, 0, 1] },
  { name: 'Yellow', rgb: [1, 1, 0] },
];

const toHex = ([r, g, b]) => `#${[r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`;
const p3 = ([r, g, b]) => `color(display-p3 ${r} ${g} ${b})`;
const rec2020 = ([r, g, b]) => `color(rec2020 ${r} ${g} ${b})`;

const SPACES = [
  { id: 'srgb', label: 'sRGB', css: toHex },
  { id: 'p3', label: 'Display P3', css: p3 },
  { id: 'rec2020', label: 'Rec. 2020', css: rec2020 },
];

const COMPARE = {
  p3: { inner: p3, outer: toHex, innerLabel: 'Display P3', outerLabel: 'sRGB' },
  rec2020: { inner: rec2020, outer: p3, innerLabel: 'Rec. 2020', outerLabel: 'Display P3' },
};

const MODES = [
  { value: 'grid', label: 'Swatches' },
  { value: 'inset', label: 'Gamut-only' },
  { value: 'white', label: 'White' },
];

const DEFAULTS = { mode: 'grid', color: 0, compare: 'p3', labels: true };

const cssSupports = (value) => typeof CSS !== 'undefined' && CSS.supports('color', value);

const readDisplay = () => ({
  gamut: getColorGamut(),
  dynamicRange: getDynamicRange(),
  p3: cssSupports('color(display-p3 1 0 0)'),
  rec2020: cssSupports('color(rec2020 1 0 0)'),
});

const Grid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: ${({ $labels }) => ($labels ? '6rem' : '0')} repeat(3, 1fr);
  grid-template-rows: ${({ $labels }) => ($labels ? '2.5rem' : '0')} repeat(6, 1fr);
  gap: 4px;
  padding: 4px;
  background: #000;
  color: #9ca3af;
  font: 600 0.85rem var(--font-sans);

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
`;

const Inset = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: ${({ $outer }) => $outer};

  > div {
    width: min(50vw, 50vh);
    aspect-ratio: 1;
    background: ${({ $inner }) => $inner};
  }
`;

const Caption = styled.p`
  position: absolute;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  max-width: min(640px, calc(100vw - 2rem));
  margin: 0;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.6);
  color: #e5e7eb;
  font: 0.85rem/1.5 var(--font-sans);
  text-align: center;
  pointer-events: none;
`;

const WhiteSplit = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #000;

  > div {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 4.5rem;
    color: #374151;
    font: 600 0.9rem var(--font-sans);
  }
`;

const HdrTest = () => {
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [color, setColor] = useState(DEFAULTS.color);
  const [compare, setCompare] = useState(DEFAULTS.compare);
  const [labels, setLabels] = useState(DEFAULTS.labels);
  const [display, setDisplay] = useState(readDisplay);

  useEffect(() => onDisplayChange(() => setDisplay(readDisplay())), []);

  const handleReset = () => {
    setMode(DEFAULTS.mode);
    setColor(DEFAULTS.color);
    setCompare(DEFAULTS.compare);
    setLabels(DEFAULTS.labels);
  };

  const step = (dir) => {
    if (mode === 'inset') setColor((c) => (c + dir + COLORS.length) % COLORS.length);
  };
  const cycleMode = () => setMode((m) => MODES[(MODES.findIndex((x) => x.value === m) + 1) % MODES.length].value);

  const shortcuts = [
    { key: 'm', label: 'Next view', action: cycleMode },
    { key: ['ArrowRight', ' '], label: 'Next color (gamut-only view)', action: () => step(1) },
    { key: 'ArrowLeft', label: 'Previous color (gamut-only view)', action: () => step(-1) },
    { key: 'l', label: 'Toggle labels', action: () => setLabels((v) => !v) },
  ];

  const cmp = COMPARE[compare];
  const rgb = COLORS[color].rgb;
  const unsupported = (compare === 'p3' && !display.p3) || (compare === 'rec2020' && !display.rec2020);

  let view;
  if (mode === 'grid') {
    view = (
      <Grid $labels={labels} role="img" aria-label="Primary and secondary colors in sRGB, Display P3, and Rec. 2020">
        <span />
        {SPACES.map((s) => (
          <span key={s.id}>{labels ? s.label : null}</span>
        ))}
        {COLORS.map((c) => (
          <div key={c.name} style={{ display: 'contents' }}>
            <span>{labels ? c.name : null}</span>
            {SPACES.map((s) => (
              <span key={s.id} style={{ background: s.css(c.rgb) }} title={`${c.name} — ${s.label}`} />
            ))}
          </div>
        ))}
      </Grid>
    );
  } else if (mode === 'inset') {
    view = (
      <Inset $outer={cmp.outer(rgb)} $inner={cmp.inner(rgb)} onClick={() => step(1)}>
        <div role="img" aria-label={`${cmp.innerLabel} ${COLORS[color].name} square on ${cmp.outerLabel} background`} />
        {labels ? (
          <Caption>
            {COLORS[color].name}: {cmp.innerLabel} square inside {cmp.outerLabel}. Visible square = your screen and
            browser show {cmp.innerLabel} colors. No square = the display or browser is limited to {cmp.outerLabel}.
          </Caption>
        ) : null}
      </Inset>
    );
  } else {
    view = (
      <WhiteSplit>
        <div style={{ background: '#ffffff' }}>{labels ? 'sRGB white' : null}</div>
        <div style={{ background: 'color(display-p3 1 1 1)' }}>{labels ? 'P3 white' : null}</div>
        <div style={{ background: 'color(rec2020 1 1 1)' }}>{labels ? 'Rec. 2020 white' : null}</div>
        {labels ? (
          <Caption>
            All three should look identical: web pages draw white at your SDR / “SDR content brightness” level, even in
            HDR mode. Only HDR video and HDR images can go brighter.
          </Caption>
        ) : null}
      </WhiteSplit>
    );
  }

  return (
    <TestShell
      title="HDR & Wide Gamut Test"
      description="Compare the same colors defined in sRGB, Display P3, and Rec. 2020. On a wide-gamut screen with a color-managed browser, the P3 and Rec. 2020 columns look more saturated than sRGB."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>View</h3>
            <Segmented options={MODES} value={mode} onChange={setMode} columns={3} />
            <Toggle label="Show labels" checked={labels} onChange={setLabels} />
          </Section>

          {mode === 'inset' ? (
            <Section>
              <h3>Gamut-only square</h3>
              <Segmented
                label="Compare"
                options={[
                  { value: 'p3', label: 'P3 vs sRGB' },
                  { value: 'rec2020', label: '2020 vs P3' },
                ]}
                value={compare}
                onChange={setCompare}
                columns={2}
              />
              <Segmented
                label="Color"
                options={COLORS.map((c, i) => ({ value: i, label: c.name }))}
                value={color}
                onChange={setColor}
                columns={3}
              />
              <Hint>
                Click the screen or press → to change color. Red and green show the biggest difference; blue is often
                nearly invisible even on good wide-gamut panels.
              </Hint>
              {unsupported ? (
                <Hint style={{ color: 'var(--warning)' }}>
                  This browser doesn’t support {cmp.innerLabel} CSS colors, so the square can’t appear here.
                </Hint>
              ) : null}
            </Section>
          ) : null}

          {mode === 'white' ? (
            <Section>
              <h3>About brightness</h3>
              <Hint>
                Browsers render CSS, canvas, and most images at SDR white. To check HDR peak brightness, use HDR video
                or the Windows HDR Calibration app. On Windows, the SDR content brightness slider sets how bright this
                white looks while HDR is on.
              </Hint>
            </Section>
          ) : null}

          <Section>
            <h3>Reported by the browser</h3>
            <Readout
              items={[
                ['Color gamut', display.gamut || 'Not reported'],
                ['Dynamic range', display.dynamicRange || 'Not reported'],
                ['CSS Display P3', display.p3 ? 'Supported' : 'Not supported'],
                ['CSS Rec. 2020', display.rec2020 ? 'Supported' : 'Not supported'],
              ]}
            />
          </Section>
        </>
      }
    >
      {view}
    </TestShell>
  );
};

export default HdrTest;
