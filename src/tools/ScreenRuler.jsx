import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, ButtonRow, Hint, Segmented, Slider } from '../components/testControls';

const STORAGE_KEY = 'displaytest.screenRuler.v1';
const CARD_W_MM = 85.6;
const CARD_H_MM = 53.98;
const CARD_RADIUS_MM = 3.18;
const CSS_DEFAULT_PX_PER_MM = 96 / 25.4;
const MIN_PX_PER_MM = 2;
const MAX_PX_PER_MM = 12;

function loadCalibration() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data && data.pxPerMm > 0 ? data : null;
  } catch {
    return null;
  }
}

function saveCalibration(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage can be unavailable (private mode); the calibration still works for this visit.
  }
}

const clamp = (v) => Math.min(MAX_PX_PER_MM, Math.max(MIN_PX_PER_MM, v));
const currentDpr = () => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

const Panel = styled.section`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-2);

  h3 {
    margin: 0 0 0.6rem;
    font-size: 0.75rem;
    font-weight: 650;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  > p {
    color: var(--text-muted);
    font-size: 0.92rem;
    line-height: 1.55;
    margin: 0 0 0.75rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardArea = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0.75rem 0;
  margin-bottom: 0.75rem;
`;

const Card = styled.div`
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 45%, var(--surface-3)), var(--surface-3));
  border: 1px solid var(--accent);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  color: var(--text);
  font-size: 0.85rem;
  text-align: center;
  padding: 0.5rem;
`;

const Status = styled.p`
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
  color: ${({ $tone }) => ($tone === 'warning' ? 'var(--warning)' : 'var(--success)')};
`;

const Inline = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: end;

  label {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--text-muted);
    font-size: 0.88rem;
  }

  input {
    width: 9rem;
    min-height: 44px;
    padding: 0.5rem 0.7rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--surface);
    color: var(--text);
    font-size: 1rem;
  }

  button {
    min-height: 44px;
  }
`;

const RulerWrap = styled.div`
  margin: 0 -1rem;
  overflow: hidden;
`;

const Results = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin: 0;

  > div {
    padding: 0.7rem 0.85rem;
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--border);
  }

  dt {
    color: var(--text-subtle);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.25rem;
  }

  dd {
    margin: 0;
    color: var(--text);
    font-size: 1.05rem;
    font-variant-numeric: tabular-nums;
  }

  dd small {
    display: block;
    color: var(--text-muted);
    font-size: 0.8rem;
  }
`;

function Ruler({ width, pxPerMm, unit }) {
  const height = 72;
  const ticks = [];
  const labels = [];
  if (unit === 'cm') {
    const count = Math.floor(width / pxPerMm);
    for (let mm = 0; mm <= count; mm += 1) {
      const x = mm * pxPerMm + 0.5;
      const len = mm % 10 === 0 ? 30 : mm % 5 === 0 ? 20 : 11;
      ticks.push(<line key={mm} x1={x} x2={x} y1={0} y2={len} />);
      if (mm % 10 === 0 && mm > 0) {
        labels.push(
          <text key={mm} x={x} y={48} textAnchor="middle">
            {mm / 10}
          </text>
        );
      }
    }
  } else {
    const pxPerIn = pxPerMm * 25.4;
    const div = pxPerIn / 16 >= 4 ? 16 : 8;
    const count = Math.floor((width / pxPerIn) * div);
    for (let i = 0; i <= count; i += 1) {
      const x = (i / div) * pxPerIn + 0.5;
      const len = i % div === 0 ? 30 : i % (div / 2) === 0 ? 22 : i % (div / 4) === 0 ? 16 : i % (div / 8) === 0 ? 11 : 7;
      ticks.push(<line key={i} x1={x} x2={x} y1={0} y2={len} />);
      if (i % div === 0 && i > 0) {
        labels.push(
          <text key={i} x={x} y={48} textAnchor="middle">
            {i / div}
          </text>
        );
      }
    }
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`On-screen ruler in ${unit === 'cm' ? 'centimeters' : 'inches'}`}
      style={{ display: 'block', background: '#f8fafc' }}
    >
      <g stroke="#0f172a" strokeWidth="1">{ticks}</g>
      <g fill="#0f172a" fontSize="13" fontFamily="var(--font-mono)" fontWeight="600">
        {labels}
      </g>
      <text x={6} y={66} fill="#475569" fontSize="11" fontFamily="var(--font-sans)">
        {unit === 'cm' ? 'cm' : 'in'}
      </text>
    </svg>
  );
}

const ScreenRuler = () => {
  const [saved, setSaved] = useState(loadCalibration);
  const [pxPerMm, setPxPerMm] = useState(() => saved?.pxPerMm ?? CSS_DEFAULT_PX_PER_MM);
  const [unit, setUnit] = useState('cm');
  const [diagInput, setDiagInput] = useState('');
  const [width, setWidth] = useState(0);
  const [dpr, setDpr] = useState(currentDpr);
  const areaRef = useRef(null);
  const diagId = useId();

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      setWidth(Math.floor(el.getBoundingClientRect().width));
      setDpr(currentDpr());
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardW = CARD_W_MM * pxPerMm;
  const cardH = CARD_H_MM * pxPerMm;
  const portrait = width > 0 && cardW > width;
  const boxW = portrait ? cardH : cardW;
  const boxH = portrait ? cardW : cardH;

  const isSaved = saved && Math.abs(saved.pxPerMm - pxPerMm) < 1e-6;
  const stale = saved && Math.abs(saved.dpr - dpr) > 0.01;

  const save = (value = pxPerMm, method = 'card') => {
    const data = { pxPerMm: value, dpr, method, savedAt: new Date().toISOString() };
    saveCalibration(data);
    setSaved(data);
  };

  const fromDiagonal = () => {
    const d = Number(diagInput);
    if (!(d > 0)) return;
    const value = clamp(Math.hypot(window.screen.width, window.screen.height) / (d * 25.4));
    setPxPerMm(value);
    save(value, 'diagonal');
  };

  const reset = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSaved(null);
    setPxPerMm(CSS_DEFAULT_PX_PER_MM);
  };

  const screenWmm = window.screen.width / pxPerMm;
  const screenHmm = window.screen.height / pxPerMm;
  const diagIn = Math.hypot(screenWmm, screenHmm) / 25.4;
  const physicalW = Math.round(window.screen.width * dpr);
  const ppi = physicalW / (screenWmm / 25.4);
  const rulerLen = width / pxPerMm;

  return (
    <div>
      <Panel aria-labelledby={`${diagId}-cal`}>
        <h3 id={`${diagId}-cal`}>1 · Calibrate with a bank card</h3>
        <p>
          Hold any credit, debit, or ID card (85.60 × 53.98 mm) flat against the screen with its corner on the top-left
          corner of the box. Adjust the slider until the box matches the card exactly{portrait ? ' — on this narrow screen, turn the card upright' : ''}.
          Browser zoom must be <strong>100%</strong>.
        </p>
        <CardArea ref={areaRef}>
          <Card
            style={{
              width: boxW,
              height: boxH,
              borderRadius: CARD_RADIUS_MM * pxPerMm,
            }}
            aria-hidden="true"
          >
            Match your card to this box
          </Card>
        </CardArea>
        <Slider
          label="Card size"
          value={Number(pxPerMm.toFixed(3))}
          min={MIN_PX_PER_MM}
          max={MAX_PX_PER_MM}
          step={0.005}
          onChange={setPxPerMm}
          format={(v) => `${(v * 25.4).toFixed(1)} px per inch`}
        />
        <ButtonRow>
          <Button type="button" onClick={() => setPxPerMm((v) => clamp(v - 0.01))} aria-label="Make box slightly smaller" style={{ minHeight: 44 }}>
            − Smaller
          </Button>
          <Button type="button" onClick={() => setPxPerMm((v) => clamp(v + 0.01))} aria-label="Make box slightly larger" style={{ minHeight: 44 }}>
            Larger +
          </Button>
          <Button type="button" $variant="primary" onClick={() => save()} style={{ minHeight: 44 }}>
            Save calibration
          </Button>
        </ButtonRow>
        {isSaved && !stale ? <Status role="status">Calibration saved on this device.</Status> : null}
        {stale ? (
          <Status role="status" $tone="warning">
            Your browser zoom or display scaling changed since you calibrated. Reset zoom to 100%, or recalibrate.
          </Status>
        ) : null}
        {!saved ? (
          <Status role="status" $tone="warning">
            Not calibrated yet — sizes below assume the CSS standard of 96 px per inch, which is rarely exact.
          </Status>
        ) : null}

        <div style={{ marginTop: '1.1rem' }}>
          <Inline>
            <div>
              <label htmlFor={diagId}>Or enter your screen’s diagonal (inches)</label>
              <input
                id={diagId}
                type="number"
                inputMode="decimal"
                min="1"
                step="0.1"
                placeholder="e.g. 27"
                value={diagInput}
                onChange={(e) => setDiagInput(e.target.value)}
              />
            </div>
            <Button type="button" onClick={fromDiagonal} disabled={!(Number(diagInput) > 0)}>
              Calibrate from size
            </Button>
            {saved ? (
              <Button type="button" onClick={reset}>
                Clear calibration
              </Button>
            ) : null}
          </Inline>
          <Hint>Only works when this browser window is on the screen you’re measuring.</Hint>
        </div>
      </Panel>

      <Panel aria-label="Ruler">
        <h3>2 · Measure</h3>
        <Segmented
          options={[
            { value: 'cm', label: 'Centimeters' },
            { value: 'in', label: 'Inches' },
          ]}
          value={unit}
          onChange={setUnit}
        />
        <RulerWrap>{width > 0 ? <Ruler width={width + 32} pxPerMm={pxPerMm} unit={unit} /> : null}</RulerWrap>
        <Hint>
          This ruler is {unit === 'cm' ? `${(rulerLen / 10).toFixed(1)} cm` : `${(rulerLen / 25.4).toFixed(2)} in`} long
          in this window. Place small objects against the screen at the left edge.
        </Hint>
      </Panel>

      <Panel aria-label="Physical screen size">
        <h3>3 · Your screen’s physical size</h3>
        <Results>
          <div>
            <dt>Diagonal</dt>
            <dd>
              {diagIn.toFixed(1)}″<small>{(diagIn * 2.54).toFixed(1)} cm</small>
            </dd>
          </div>
          <div>
            <dt>Width</dt>
            <dd>
              {(screenWmm / 10).toFixed(1)} cm<small>{(screenWmm / 25.4).toFixed(2)}″</small>
            </dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>
              {(screenHmm / 10).toFixed(1)} cm<small>{(screenHmm / 25.4).toFixed(2)}″</small>
            </dd>
          </div>
          <div>
            <dt>Pixel density</dt>
            <dd>
              {ppi.toFixed(0)} PPI<small>{physicalW} physical px wide</small>
            </dd>
          </div>
        </Results>
        <Hint>
          Calculated from the screen size your browser reports ({window.screen.width} × {window.screen.height} CSS px).
          Accuracy depends on your calibration — within a few percent is typical.
        </Hint>
      </Panel>
    </div>
  );
};

export default ScreenRuler;
