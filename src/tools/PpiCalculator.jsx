import { useId, useState } from 'react';
import styled from 'styled-components';
import { Button, Select } from '../components/testControls';
import { aspectLabel, getDisplayInfo } from '../utils/displayInfo';

const PRESETS = [
  { id: '24-1080', label: '24″ monitor · 1920 × 1080', w: 1920, h: 1080, d: 24 },
  { id: '24-1440', label: '24″ monitor · 2560 × 1440', w: 2560, h: 1440, d: 24 },
  { id: '27-1080', label: '27″ monitor · 1920 × 1080', w: 1920, h: 1080, d: 27 },
  { id: '27-1440', label: '27″ monitor · 2560 × 1440', w: 2560, h: 1440, d: 27 },
  { id: '27-4k', label: '27″ monitor · 3840 × 2160 (4K)', w: 3840, h: 2160, d: 27 },
  { id: '27-5k', label: '27″ monitor · 5120 × 2880 (5K)', w: 5120, h: 2880, d: 27 },
  { id: '32-1440', label: '32″ monitor · 2560 × 1440', w: 2560, h: 1440, d: 32 },
  { id: '32-4k', label: '32″ monitor · 3840 × 2160 (4K)', w: 3840, h: 2160, d: 32 },
  { id: '34-uw', label: '34″ ultrawide · 3440 × 1440', w: 3440, h: 1440, d: 34 },
  { id: '49-suw', label: '49″ super ultrawide · 5120 × 1440', w: 5120, h: 1440, d: 49 },
  { id: '13-1080', label: '13.3″ laptop · 1920 × 1080', w: 1920, h: 1080, d: 13.3 },
  { id: '15-1080', label: '15.6″ laptop · 1920 × 1080', w: 1920, h: 1080, d: 15.6 },
  { id: '14-1600', label: '14″ laptop · 2560 × 1600', w: 2560, h: 1600, d: 14 },
  { id: 'mba13', label: 'MacBook Air 13.6″ · 2560 × 1664', w: 2560, h: 1664, d: 13.6 },
  { id: 'mbp14', label: 'MacBook Pro 14.2″ · 3024 × 1964', w: 3024, h: 1964, d: 14.2 },
  { id: 'mbp16', label: 'MacBook Pro 16.2″ · 3456 × 2234', w: 3456, h: 2234, d: 16.2 },
  { id: 'iphone-pro', label: 'iPhone 16 Pro 6.3″ · 2622 × 1206', w: 2622, h: 1206, d: 6.3 },
  { id: 'galaxy-s', label: 'Galaxy S25 6.2″ · 2340 × 1080', w: 2340, h: 1080, d: 6.2 },
  { id: 'tv55', label: '55″ TV · 3840 × 2160 (4K)', w: 3840, h: 2160, d: 55 },
  { id: 'tv65', label: '65″ TV · 3840 × 2160 (4K)', w: 3840, h: 2160, d: 65 },
];

// Distance (in) at which one pixel subtends one arcminute: pitch / tan(1/60°).
const ARCMIN = Math.tan(Math.PI / 10800);

function guessDiagonal(w, h) {
  const match = PRESETS.find((p) => (p.w === w && p.h === h) || (p.w === h && p.h === w));
  return match ? match.d : 24;
}

function detected() {
  const info = getDisplayInfo();
  if (!info?.physicalWidth) return null;
  return { w: info.physicalWidth, h: info.physicalHeight };
}

/** Windows-style scaling suggestion for desktop viewing distance, targeting ~108 effective PPI. */
function suggestScaling(ppi) {
  if (ppi > 250) return null;
  return Math.min(300, Math.max(100, Math.round((ppi / 108) * 4) * 25));
}

const fmt = (n, d = 1) => (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d }) : '—');

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr;

    > :last-child {
      grid-column: 1 / -1;
    }
  }
`;

const Field = styled.div`
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
    background: var(--surface-2);
    color: var(--text);
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
  }

  input:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: end;

  > div {
    margin-bottom: 0 !important;
  }

  select {
    min-height: 44px;
  }

  button {
    min-height: 44px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Note = styled.p`
  color: var(--text-subtle);
  font-size: 0.85rem;
  margin: 0.5rem 0 1.25rem;
`;

const Hero = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1.25rem;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
  border: 1px solid var(--accent);

  strong {
    font-size: clamp(2rem, 6vw, 2.75rem);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: var(--text);
  }

  span {
    color: var(--text-muted);
  }
`;

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.75rem;
  margin: 0;

  > div {
    padding: 0.75rem 0.9rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--border);
  }

  dt {
    color: var(--text-subtle);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.3rem;
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
    margin-top: 0.15rem;
  }
`;

function NumberField({ label, value, onChange, step = 1, suffix }) {
  const id = useId();
  return (
    <Field>
      <label htmlFor={id}>
        {label}
        {suffix ? ` (${suffix})` : ''}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

const PpiCalculator = () => {
  const [screen] = useState(detected);
  const [w, setW] = useState(() => String(screen?.w ?? 2560));
  const [h, setH] = useState(() => String(screen?.h ?? 1440));
  const [d, setD] = useState(() => String(screen ? guessDiagonal(screen.w, screen.h) : 27));
  const [preset, setPreset] = useState('');

  const width = Number(w);
  const height = Number(h);
  const diag = Number(d);
  const valid = width > 0 && height > 0 && diag > 0;

  const diagPx = Math.hypot(width, height);
  const ppi = valid ? diagPx / diag : NaN;
  const pitchMm = 25.4 / ppi;
  const widthIn = (diag * width) / diagPx;
  const heightIn = (diag * height) / diagPx;
  const retinaIn = 1 / ppi / ARCMIN;
  const scaling = valid ? suggestScaling(ppi) : null;
  const megapixels = (width * height) / 1e6;

  const applyPreset = (id) => {
    setPreset(id);
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setW(String(p.w));
    setH(String(p.h));
    setD(String(p.d));
  };

  const edit = (setter) => (v) => {
    setter(v);
    setPreset('');
  };

  const fillFromScreen = () => {
    if (!screen) return;
    setW(String(screen.w));
    setH(String(screen.h));
    setD(String(guessDiagonal(screen.w, screen.h)));
    setPreset('');
  };

  return (
    <div>
      <Top>
        <Select
          label="Preset"
          value={preset}
          onChange={applyPreset}
          options={[{ value: '', label: 'Choose a common screen…' }, ...PRESETS.map((p) => ({ value: p.id, label: p.label }))]}
        />
        {screen ? (
          <Button type="button" onClick={fillFromScreen}>
            Use this screen ({screen.w} × {screen.h})
          </Button>
        ) : null}
      </Top>
      <div style={{ height: '0.85rem' }} />
      <Fields>
        <NumberField label="Width" suffix="px" value={w} onChange={edit(setW)} />
        <NumberField label="Height" suffix="px" value={h} onChange={edit(setH)} />
        <NumberField label="Diagonal" suffix="inches" value={d} step={0.1} onChange={edit(setD)} />
      </Fields>
      <Note>
        {screen
          ? `Resolution pre-filled from this screen (${screen.w} × ${screen.h} physical pixels). The browser can’t report the diagonal, so check it’s right.`
          : 'Enter a resolution and diagonal, or pick a preset.'}
      </Note>

      {valid ? (
        <>
          <Hero aria-live="polite">
            <strong>{fmt(ppi, 1)} PPI</strong>
            <span>
              {width} × {height} at {diag}″ · {aspectLabel(Math.round(width), Math.round(height))}
            </span>
          </Hero>
          <Stats>
            <div>
              <dt>Dot pitch</dt>
              <dd>{fmt(pitchMm, 3)} mm</dd>
            </div>
            <div>
              <dt>Screen width</dt>
              <dd>
                {fmt(widthIn, 2)} in
                <small>{fmt(widthIn * 2.54, 1)} cm</small>
              </dd>
            </div>
            <div>
              <dt>Screen height</dt>
              <dd>
                {fmt(heightIn, 2)} in
                <small>{fmt(heightIn * 2.54, 1)} cm</small>
              </dd>
            </div>
            <div>
              <dt>Diagonal</dt>
              <dd>
                {fmt(diag, 1)} in
                <small>{fmt(diag * 2.54, 1)} cm</small>
              </dd>
            </div>
            <div>
              <dt>Retina distance</dt>
              <dd>
                {fmt(retinaIn, 1)} in
                <small>{fmt(retinaIn * 2.54, 0)} cm — pixels blend beyond this</small>
              </dd>
            </div>
            <div>
              <dt>Total pixels</dt>
              <dd>
                {fmt(megapixels, 2)} MP
                <small>{fmt(width * height, 0)} pixels</small>
              </dd>
            </div>
            <div>
              <dt>Suggested scaling</dt>
              <dd>
                {scaling ? `${scaling}%` : 'OS default'}
                <small>
                  {scaling
                    ? `Desktop distance · ~${fmt(width / (scaling / 100), 0)} × ${fmt(height / (scaling / 100), 0)} workspace`
                    : 'Phone, tablet, or high-end laptop density — use the OS default'}
                </small>
              </dd>
            </div>
          </Stats>
        </>
      ) : (
        <Note role="status">Enter a width, height, and diagonal greater than zero.</Note>
      )}
    </div>
  );
};

export default PpiCalculator;
