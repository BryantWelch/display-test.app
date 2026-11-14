import { useEffect, useId, useState } from 'react';
import styled, { css } from 'styled-components';

/**
 * Control primitives for the TestShell panel. Use these instead of per-test styled inputs so
 * every test has the same dark panel look, 44px touch targets, labels, and focus rings.
 */

export const Section = styled.section`
  margin-bottom: 1.25rem;

  h3 {
    margin: 0 0 0.6rem;
    font-size: 0.75rem;
    font-weight: 650;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Description = styled.p`
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.55;
  margin: 0 0 1rem;
`;

export const Hint = styled.p`
  color: var(--text-subtle);
  font-size: 0.8rem;
  line-height: 1.5;
  margin-top: 0.4rem;
`;

export const Label = styled.label`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
  color: var(--text-muted);
  font-size: 0.88rem;

  output {
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
`;

export const Button = styled.button`
  min-height: 44px;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 550;
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text);
  transition: background 0.12s ease, border-color 0.12s ease;

  &:hover:not(:disabled) {
    background: var(--surface-3);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $active }) =>
    $active &&
    css`
      background: var(--accent-soft);
      border-color: var(--accent);
      color: var(--accent);
    `}

  ${({ $variant }) =>
    $variant === 'primary' &&
    css`
      background: var(--accent);
      border-color: var(--accent);
      color: var(--accent-contrast);
      &:hover:not(:disabled) {
        background: #7dd3fc;
      }
    `}
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  > ${Button} {
    flex: 1 1 auto;
  }
`;

export const ResetButton = styled(Button)`
  width: 100%;
  min-height: 44px;
`;

/** Mutually exclusive options rendered as buttons. */
export function Segmented({ label, options, value, onChange, columns }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={label ? id : undefined} style={{ marginBottom: '0.75rem' }}>
      {label ? (
        <Label as="div" id={id}>
          {label}
        </Label>
      ) : null}
      <ButtonRow style={columns ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}>
        {options.map((opt) => {
          const o = typeof opt === 'object' ? opt : { value: opt, label: String(opt) };
          return (
            <Button
              key={String(o.value)}
              type="button"
              $active={o.value === value}
              aria-pressed={o.value === value}
              title={o.title}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </Button>
          );
        })}
      </ButtonRow>
    </div>
  );
}

const Range = styled.input`
  width: 100%;
  accent-color: var(--accent);
  height: 28px;
`;

export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => v, hint }) {
  const id = useId();
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <Label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id}>{format(value)}</output>
      </Label>
      <Range
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
}

const NativeSelect = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text);
`;

export function Select({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <NativeSelect id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => {
          const o = typeof opt === 'object' ? opt : { value: opt, label: String(opt) };
          return (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </NativeSelect>
    </div>
  );
}

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 36px;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;

  input {
    width: 1.1rem;
    height: 1.1rem;
    accent-color: var(--accent);
  }

  @media (max-width: 768px) {
    min-height: 44px;
  }
`;

export function Toggle({ label, checked, onChange }) {
  return (
    <ToggleLabel>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </ToggleLabel>
  );
}

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 0.4rem;
`;

const Swatch = styled.button`
  aspect-ratio: 1;
  min-height: 44px;
  border-radius: var(--radius-sm);
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active }) => ($active ? 'var(--accent)' : 'rgba(148, 163, 184, 0.35)')};
  box-shadow: ${({ $active }) => ($active ? '0 0 0 2px var(--bg) inset' : 'none')};
`;

export function ColorSwatches({ colors, value, onChange, columns = 5 }) {
  return (
    <SwatchGrid $columns={columns} role="group" aria-label="Colors">
      {colors.map((c) => (
        <Swatch
          key={c.value + c.name}
          type="button"
          $color={c.value}
          $active={value === c.value}
          aria-pressed={value === c.value}
          aria-label={c.name}
          title={c.name}
          onClick={() => onChange(c.value)}
        />
      ))}
    </SwatchGrid>
  );
}

const ColorRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input[type='color'] {
    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: none;
  }

  input[type='text'] {
    flex: 1;
    min-height: 44px;
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--surface-2);
    color: var(--text);
    font-family: var(--font-mono);
    text-transform: uppercase;
  }
`;

export function ColorInput({ label, value, onChange }) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <Label htmlFor={id}>{label}</Label>
      <ColorRow>
        <input type="color" aria-label={`${label} picker`} value={value} onChange={(e) => onChange(e.target.value)} />
        <input
          id={id}
          type="text"
          value={draft}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => {
            setDraft(e.target.value);
            const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v.toLowerCase());
          }}
          onBlur={() => setDraft(value)}
        />
      </ColorRow>
    </div>
  );
}

const ReadoutList = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.3rem 1rem;
  font-size: 0.88rem;

  dt {
    color: var(--text-subtle);
  }

  dd {
    color: var(--text);
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

/** Key/value readouts, e.g. measured Hz, px/frame. `items` = [[label, value], ...]. */
export function Readout({ items }) {
  return (
    <ReadoutList>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </ReadoutList>
  );
}
