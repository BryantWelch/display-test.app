import { useId, useState } from 'react';
import styled from 'styled-components';
import { Segmented, Select, Slider } from '../components/testControls';

const ASPECTS = [
  { value: '16:9', label: '16:9 (standard)', r: 16 / 9 },
  { value: '16:10', label: '16:10', r: 16 / 10 },
  { value: '21:9', label: '21:9 ultrawide (3440 × 1440)', r: 43 / 18 },
  { value: '32:9', label: '32:9 super ultrawide', r: 32 / 9 },
  { value: '4:3', label: '4:3', r: 4 / 3 },
  { value: '3:2', label: '3:2 (laptops, tablets)', r: 3 / 2 },
  { value: '5:4', label: '5:4', r: 5 / 4 },
];

const ratioOf = (aspect) => ASPECTS.find((a) => a.value === aspect)?.r ?? 16 / 9;
const IN_TO_CM = 2.54;
const deg = (rad) => (rad * 180) / Math.PI;

function dims(diag, aspect) {
  const r = ratioOf(aspect);
  const h = diag / Math.sqrt(r * r + 1);
  const w = h * r;
  return { w, h, area: w * h, r };
}

const COLORS = { a: 'var(--accent)', b: 'var(--warning)' };

const Screens = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ScreenBox = styled.fieldset`
  margin: 0;
  padding: 0.9rem 1rem 0.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  border-top: 3px solid ${({ $color }) => $color};
  background: var(--surface-2);

  legend {
    padding: 0 0.35rem;
    font-weight: 650;
    color: var(--text);
  }

  select {
    min-height: 44px;
  }
`;

const Field = styled.div`
  margin-bottom: 0.85rem;

  label {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--text-muted);
    font-size: 0.88rem;
  }

  input {
    width: 100%;
    min-height: 44px;
    padding: 0.5rem 0.7rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--surface);
    color: var(--text);
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
  }

  input:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }
`;

const Dims = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.3rem 1rem;
  margin: 0 0 0.6rem;
  font-size: 0.9rem;

  dt {
    color: var(--text-subtle);
  }

  dd {
    margin: 0;
    text-align: right;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
`;

const Panel = styled.section`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-2);

  h3 {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 650;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  p {
    color: var(--text-muted);
    font-size: 0.92rem;
    line-height: 1.55;
    margin: 0.5rem 0 0;
  }

  strong {
    color: var(--text);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem 1rem;

  > div {
    margin-bottom: 0 !important;
  }
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  max-height: 320px;
  margin-top: 0.75rem;
`;

const Ranges = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;

  li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0.8rem;
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 0.92rem;
  }

  li span {
    color: var(--text-muted);
  }

  li small {
    display: block;
    color: var(--text-subtle);
    font-size: 0.8rem;
  }

  li strong {
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
  }
`;

function ScreenInputs({ name, color, screen, onChange, unit }) {
  const id = useId();
  const d = dims(Number(screen.diag) || 0, screen.aspect);
  const len = (inches) => (unit === 'cm' ? `${(inches * IN_TO_CM).toFixed(1)} cm` : `${inches.toFixed(1)}″`);
  const area = unit === 'cm' ? `${(d.area * IN_TO_CM * IN_TO_CM).toFixed(0)} cm²` : `${d.area.toFixed(0)} sq in`;
  return (
    <ScreenBox $color={color}>
      <legend>{name}</legend>
      <Field>
        <label htmlFor={id}>Diagonal (inches)</label>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="1"
          step="0.1"
          value={screen.diag}
          onChange={(e) => onChange({ ...screen, diag: e.target.value })}
        />
      </Field>
      <Select
        label="Aspect ratio"
        value={screen.aspect}
        onChange={(aspect) => onChange({ ...screen, aspect })}
        options={ASPECTS.map((a) => ({ value: a.value, label: a.label }))}
      />
      {d.w > 0 ? (
        <Dims>
          <dt>Width</dt>
          <dd>{len(d.w)}</dd>
          <dt>Height</dt>
          <dd>{len(d.h)}</dd>
          <dt>Area</dt>
          <dd>{area}</dd>
        </Dims>
      ) : null}
    </ScreenBox>
  );
}

function Comparison({ a, b, layout, unit }) {
  const gap = Math.max(a.w, b.w) * 0.08;
  const totalW = layout === 'side' ? a.w + b.w + gap : Math.max(a.w, b.w);
  const totalH = Math.max(a.h, b.h);
  const pad = totalW * 0.03;
  const vbW = totalW + pad * 2;
  const vbH = totalH + pad * 2;
  const pos = (s, i) => {
    const y = pad + totalH - s.h;
    if (layout === 'side') return { x: pad + (i === 0 ? 0 : a.w + gap), y };
    return { x: pad + (totalW - s.w) / 2, y };
  };
  const pa = pos(a, 0);
  const pb = pos(b, 1);
  const font = vbW * 0.028;
  const label = (s) => (unit === 'cm' ? `${(s.diag * IN_TO_CM).toFixed(0)} cm` : `${s.diag}″`);
  return (
    <Svg viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label="Scaled comparison of screen A and screen B">
      <rect
        x={pa.x}
        y={pa.y}
        width={a.w}
        height={a.h}
        fill="color-mix(in srgb, var(--accent) 18%, transparent)"
        stroke={COLORS.a}
        strokeWidth={vbW * 0.004}
      />
      <rect
        x={pb.x}
        y={pb.y}
        width={b.w}
        height={b.h}
        fill={layout === 'side' ? 'color-mix(in srgb, var(--warning) 18%, transparent)' : 'none'}
        stroke={COLORS.b}
        strokeWidth={vbW * 0.004}
        strokeDasharray={layout === 'side' ? undefined : `${vbW * 0.012} ${vbW * 0.008}`}
      />
      <text x={pa.x + font * 0.6} y={pa.y + font * 1.4} fill={COLORS.a} fontSize={font} fontWeight="700">
        A · {label(a)} {a.aspect}
      </text>
      <text
        x={pb.x + b.w - font * 0.6}
        y={layout === 'side' ? pb.y + font * 1.4 : pb.y + b.h - font * 0.6}
        fill={COLORS.b}
        fontSize={font}
        fontWeight="700"
        textAnchor="end"
      >
        B · {label(b)} {b.aspect}
      </text>
    </Svg>
  );
}

const DEFAULT_A = { diag: '34', aspect: '21:9' };
const DEFAULT_B = { diag: '27', aspect: '16:9' };

const ScreenSizeCalculator = () => {
  const [screenA, setScreenA] = useState(DEFAULT_A);
  const [screenB, setScreenB] = useState(DEFAULT_B);
  const [unit, setUnit] = useState('cm');
  const [layout, setLayout] = useState('overlap');
  const [target, setTarget] = useState('a');
  const [distanceCm, setDistanceCm] = useState(70);

  const a = { ...dims(Number(screenA.diag) || 0, screenA.aspect), diag: Number(screenA.diag) || 0, aspect: screenA.aspect };
  const b = { ...dims(Number(screenB.diag) || 0, screenB.aspect), diag: Number(screenB.diag) || 0, aspect: screenB.aspect };
  const valid = a.w > 0 && b.w > 0;

  const len = (inches) => (unit === 'cm' ? `${(inches * IN_TO_CM).toFixed(0)} cm` : `${inches.toFixed(0)}″`);
  const lenRange = (lo, hi) =>
    unit === 'cm'
      ? `${(lo * IN_TO_CM).toFixed(0)}–${(hi * IN_TO_CM).toFixed(0)} cm`
      : `${lo.toFixed(0)}–${hi.toFixed(0)}″`;

  const areaRatio = valid ? b.area / a.area : 1;
  const areaText =
    Math.abs(areaRatio - 1) < 0.01
      ? 'Both screens have the same area.'
      : areaRatio > 1
        ? `B has ${((areaRatio - 1) * 100).toFixed(0)}% more screen area than A.`
        : `A has ${((1 / areaRatio - 1) * 100).toFixed(0)}% more screen area than B.`;

  // Diagonal of a screen with B's aspect that matches A's height, and vice versa.
  const bAtAHeight = a.h * Math.sqrt(b.r * b.r + 1);
  const aAtBHeight = b.h * Math.sqrt(a.r * a.r + 1);
  const sameAspect = screenA.aspect === screenB.aspect;

  const s = target === 'a' ? a : b;
  const thx = s.w / 2 / Math.tan((20 * Math.PI) / 180);
  const smpte = s.w / 2 / Math.tan((15 * Math.PI) / 180);
  const monitorNear = Math.max(50 / IN_TO_CM, s.h * 1.6);
  const monitorFar = Math.max(70 / IN_TO_CM, s.h * 2.5);
  const distanceIn = distanceCm / IN_TO_CM;
  const fov = deg(2 * Math.atan(s.w / 2 / distanceIn));
  const fovNote =
    fov > 40
      ? 'Wider than THX — normal for a desk monitor, very immersive for a TV.'
      : fov >= 30
        ? 'Between SMPTE (30°) and THX (40°) — the cinema sweet spot.'
        : 'Narrower than SMPTE’s 30° — the screen will feel small from here.';

  return (
    <div>
      <Bar style={{ marginBottom: '0.9rem' }}>
        <Segmented
          label="Units"
          options={[
            { value: 'cm', label: 'cm' },
            { value: 'in', label: 'inches' },
          ]}
          value={unit}
          onChange={setUnit}
        />
      </Bar>

      <Screens>
        <ScreenInputs name="Screen A" color={COLORS.a} screen={screenA} onChange={setScreenA} unit={unit} />
        <ScreenInputs name="Screen B" color={COLORS.b} screen={screenB} onChange={setScreenB} unit={unit} />
      </Screens>

      {valid ? (
        <>
          <Panel aria-label="Visual comparison">
            <Bar>
              <h3 style={{ margin: 0 }}>Side-by-side, to scale</h3>
              <Segmented
                options={[
                  { value: 'overlap', label: 'Overlap' },
                  { value: 'side', label: 'Side by side' },
                ]}
                value={layout}
                onChange={setLayout}
              />
            </Bar>
            <Comparison a={a} b={b} layout={layout} unit={unit} />
            <p aria-live="polite">{areaText}</p>
          </Panel>

          <Panel aria-label="Same height comparison">
            <h3>Same height</h3>
            {sameAspect ? (
              <p>Both screens have the same aspect ratio, so height scales directly with the diagonal.</p>
            ) : (
              <>
                <p>
                  A {a.diag}″ {screenA.aspect} screen is as tall as a{' '}
                  <strong>
                    {bAtAHeight.toFixed(1)}″ {screenB.aspect}
                  </strong>{' '}
                  screen ({len(a.h)} tall).
                </p>
                <p>
                  A {b.diag}″ {screenB.aspect} screen is as tall as a{' '}
                  <strong>
                    {aAtBHeight.toFixed(1)}″ {screenA.aspect}
                  </strong>{' '}
                  screen ({len(b.h)} tall).
                </p>
              </>
            )}
          </Panel>

          <Panel aria-label="Viewing distance">
            <Bar>
              <h3 style={{ margin: 0 }}>Viewing distance</h3>
              <Segmented
                options={[
                  { value: 'a', label: `A · ${a.diag}″` },
                  { value: 'b', label: `B · ${b.diag}″` },
                ]}
                value={target}
                onChange={setTarget}
              />
            </Bar>
            <Ranges style={{ marginTop: '0.75rem' }}>
              <li>
                <span>
                  THX (40° field of view)
                  <small>Immersive home theater</small>
                </span>
                <strong>{len(thx)}</strong>
              </li>
              <li>
                <span>
                  SMPTE (30° field of view)
                  <small>Minimum recommended for TV and film</small>
                </span>
                <strong>{len(smpte)}</strong>
              </li>
              <li>
                <span>
                  Desk monitor
                  <small>About arm’s length; text-heavy work at the far end</small>
                </span>
                <strong>{lenRange(monitorNear, monitorFar)}</strong>
              </li>
            </Ranges>
            <div style={{ marginTop: '1rem' }}>
              <Slider
                label="Your distance"
                value={unit === 'cm' ? distanceCm : Math.round(distanceIn)}
                min={unit === 'cm' ? 30 : 12}
                max={unit === 'cm' ? 500 : 200}
                step={unit === 'cm' ? 5 : 1}
                onChange={(v) => setDistanceCm(unit === 'cm' ? v : Math.round(v * IN_TO_CM))}
                format={(v) => (unit === 'cm' ? `${v} cm` : `${v}″`)}
              />
            </div>
            <p aria-live="polite">
              From there the screen fills <strong>{fov.toFixed(0)}°</strong> of your horizontal view. {fovNote}
            </p>
          </Panel>
        </>
      ) : (
        <Panel role="status">
          <p>Enter a diagonal greater than zero for both screens.</p>
        </Panel>
      )}
    </div>
  );
};

export default ScreenSizeCalculator;
