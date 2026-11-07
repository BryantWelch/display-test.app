import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import TestShell, {
  Section,
  Slider,
  ColorSwatches,
  ColorInput,
  Readout,
  Button,
  ButtonRow,
  Hint,
} from '../../components/TestShell';
import { enterTestFullscreen } from '../../utils/fullscreen';

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: '50% gray', value: '#808080' },
  { name: 'Warm white (light box)', value: '#ffd9b0' },
];

const KEY_HOLD_MS = 2000;
const CORNER_HOLD_MS = 3000;
const NOTICE_MS = 5000;

/** Scale an sRGB hex color by level (0–100). */
function applyLevel(hex, level) {
  if (level >= 100) return hex;
  const n = parseInt(hex.slice(1), 16);
  const scale = (c) => Math.round(c * (level / 100));
  const r = scale((n >> 16) & 255);
  const g = scale((n >> 8) & 255);
  const b = scale(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function cornerSize() {
  return Math.max(72, Math.min(window.innerWidth, window.innerHeight) * 0.12);
}

function inCorner(x, y) {
  const s = cornerSize();
  const nearX = x <= s || x >= window.innerWidth - s;
  const nearY = y <= s || y >= window.innerHeight - s;
  return nearX && nearY;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

const LockLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  cursor: none;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

const Notice = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(440px, calc(100vw - 2rem));
  padding: 1.25rem 1.4rem;
  border-radius: var(--radius);
  background: rgba(11, 17, 32, 0.92);
  border: 1px solid var(--border-strong);
  color: var(--text);
  font-family: var(--font-sans);
  text-align: center;
  line-height: 1.55;
  pointer-events: none;
  animation: ${fadeIn} 0.2s ease-out;

  strong {
    display: block;
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.92rem;
    margin: 0;
  }

  kbd {
    padding: 0.05rem 0.35rem;
    border-radius: 4px;
    border: 1px solid var(--border-strong);
    background: var(--surface-2);
    font-family: var(--font-mono);
    font-size: 0.82rem;
  }
`;

const Progress = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  background: rgba(11, 17, 32, 0.9);
  border: 1px solid var(--border-strong);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  pointer-events: none;
`;

const Bar = styled.div`
  width: 200px;
  height: 6px;
  border-radius: 999px;
  background: var(--surface-3);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: var(--accent);
  }
`;

const SolidScreenTest = () => {
  const { pathname } = useLocation();
  const defaultColor = pathname.includes('black-screen') ? '#000000' : '#ffffff';
  const title = defaultColor === '#000000' ? 'Black Screen' : 'White Screen';

  const [color, setColor] = useState(defaultColor);
  const [isCustom, setIsCustom] = useState(false);
  const [custom, setCustom] = useState('#ffe4c4');
  const [level, setLevel] = useState(100);
  const [locked, setLocked] = useState(false);
  const [notice, setNotice] = useState(false);
  const [progress, setProgress] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && !!document.fullscreenElement
  );
  const canFullscreen =
    typeof document !== 'undefined' && typeof document.documentElement.requestFullscreen === 'function';

  const lockedRef = useRef(false);
  const swallowEscape = useRef(false);
  const hold = useRef(null);
  const noticeTimer = useRef(null);
  const rafRef = useRef(0);

  const base = isCustom ? custom : color;
  const shown = applyLevel(base, level);
  const colorName = isCustom ? 'Custom' : COLORS.find((c) => c.value === color)?.name || 'Custom';

  const showNotice = useCallback(() => {
    setNotice(true);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(false), NOTICE_MS);
  }, []);

  const cancelHold = useCallback(() => {
    hold.current = null;
    cancelAnimationFrame(rafRef.current);
    setProgress(null);
  }, []);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    hold.current = null;
    cancelAnimationFrame(rafRef.current);
    clearTimeout(noticeTimer.current);
    setProgress(null);
    setNotice(false);
    setLocked(false);
  }, []);

  const startHold = useCallback(
    (kind, duration, pointerId) => {
      if (hold.current) return;
      hold.current = { kind, duration, pointerId, start: performance.now() };
      setNotice(false);
      const tick = () => {
        const h = hold.current;
        if (!h) return;
        const p = Math.min(1, (performance.now() - h.start) / h.duration);
        setProgress({ value: p, kind: h.kind });
        if (p >= 1) {
          if (h.kind === 'key') swallowEscape.current = true;
          unlock();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [unlock]
  );

  const lock = useCallback(() => {
    document.activeElement?.blur?.();
    lockedRef.current = true;
    setLocked(true);
    showNotice();
  }, [showNotice]);

  // Capture phase on window runs before TestShell's own key handler, so locked keys never reach it.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (swallowEscape.current && e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (!lockedRef.current) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === 'Escape') startHold('key', KEY_HOLD_MS);
      else if (!hold.current) showNotice();
    };
    const onKeyUp = (e) => {
      if (e.key === 'Escape') {
        if (swallowEscape.current) {
          swallowEscape.current = false;
          e.stopImmediatePropagation();
        }
        if (hold.current?.kind === 'key') cancelHold();
      }
      if (lockedRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    // Esc can drop browser fullscreen, which normally exits the test; keep the page while locked.
    const onFullscreen = (e) => {
      setIsFullscreen(!!document.fullscreenElement);
      if (lockedRef.current) e.stopImmediatePropagation();
    };
    const onBlur = () => {
      if (hold.current?.kind === 'key') cancelHold();
    };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('fullscreenchange', onFullscreen, true);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('fullscreenchange', onFullscreen, true);
      window.removeEventListener('blur', onBlur);
    };
  }, [startHold, cancelHold, showNotice]);

  useEffect(
    () => () => {
      clearTimeout(noticeTimer.current);
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const step = useCallback((dir) => {
    setIsCustom(false);
    setColor((c) => {
      const i = COLORS.findIndex((x) => x.value === c);
      return COLORS[(i + dir + COLORS.length) % COLORS.length].value;
    });
  }, []);

  const handleReset = () => {
    setColor(defaultColor);
    setIsCustom(false);
    setCustom('#ffe4c4');
    setLevel(100);
  };

  const shortcuts = [
    { key: ['ArrowRight', ' '], label: 'Next color', action: () => step(1) },
    { key: 'ArrowLeft', label: 'Previous color', action: () => step(-1) },
    { key: 'ArrowUp', label: 'Level +10%', action: () => setLevel((l) => Math.min(100, l + 10)) },
    { key: 'ArrowDown', label: 'Level −10%', action: () => setLevel((l) => Math.max(10, l - 10)) },
    { key: 'l', label: 'Cleaning lock', action: lock },
  ];

  const lockPointer = {
    onPointerDown: (e) => {
      e.preventDefault();
      if (inCorner(e.clientX, e.clientY)) startHold('corner', CORNER_HOLD_MS, e.pointerId);
    },
    onPointerMove: (e) => {
      const h = hold.current;
      if (h?.kind === 'corner' && h.pointerId === e.pointerId && !inCorner(e.clientX, e.clientY)) cancelHold();
    },
    onPointerUp: (e) => {
      if (hold.current?.pointerId === e.pointerId) cancelHold();
    },
    onPointerCancel: (e) => {
      if (hold.current?.pointerId === e.pointerId) cancelHold();
    },
    onContextMenu: (e) => e.preventDefault(),
    onClick: (e) => e.preventDefault(),
  };

  return (
    <TestShell
      title={title}
      description="A clean full-screen color for cleaning, spotting dust, lighting, or checking the panel. Turn on the cleaning lock before you wipe so touches and keys do nothing."
      onReset={handleReset}
      shortcuts={shortcuts}
      hideCursor
      controls={
        <>
          <Section>
            <h3>Cleaning lock</h3>
            <Button type="button" $variant="primary" onClick={lock} style={{ width: '100%', minHeight: 44 }}>
              Lock screen for cleaning
            </Button>
            <Hint>
              Ignores clicks, taps, and keys and hides these controls. Unlock by holding Esc for 2 seconds, or
              pressing and holding any screen corner for 3 seconds.
            </Hint>
            {canFullscreen && !isFullscreen ? (
              <Button
                type="button"
                onClick={() => enterTestFullscreen().catch(() => {})}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Go fullscreen
              </Button>
            ) : null}
          </Section>

          <Section>
            <h3>Color</h3>
            <ColorSwatches
              colors={COLORS}
              value={isCustom ? null : color}
              onChange={(v) => {
                setColor(v);
                setIsCustom(false);
              }}
              columns={7}
            />
            <ButtonRow style={{ marginTop: '0.6rem' }}>
              <Button type="button" onClick={() => step(-1)}>
                ← Previous
              </Button>
              <Button type="button" onClick={() => step(1)}>
                Next →
              </Button>
            </ButtonRow>
          </Section>

          <Section>
            <h3>Custom color</h3>
            <ColorInput
              label="Hex"
              value={custom}
              onChange={(v) => {
                setCustom(v);
                setIsCustom(true);
              }}
            />
            {!isCustom ? (
              <Button type="button" onClick={() => setIsCustom(true)} style={{ width: '100%' }}>
                Show custom color
              </Button>
            ) : null}
          </Section>

          <Section>
            <h3>Level</h3>
            <Slider
              label="Signal level"
              value={level}
              min={10}
              max={100}
              step={5}
              onChange={setLevel}
              format={(v) => `${v}%`}
              hint="Dims the color in software — easier on the eyes in a dark room. For real brightness changes, use the monitor's own brightness setting."
            />
          </Section>

          <Section>
            <h3>Now showing</h3>
            <Readout
              items={[
                ['Color', colorName],
                ['Value', shown.toUpperCase()],
              ]}
            />
          </Section>
        </>
      }
    >
      <div
        style={{ position: 'absolute', inset: 0, background: shown, transition: 'background-color 0.15s ease' }}
        aria-hidden="true"
      />

      {locked ? (
        <LockLayer style={{ background: shown }} {...lockPointer} role="presentation">
          {notice ? (
            <Notice role="status" aria-live="polite">
              <strong>Cleaning lock is on</strong>
              <p>
                Touches, clicks, and keys are ignored. To unlock, hold <kbd>Esc</kbd> for 2 seconds — or press
                and hold any corner of the screen for 3 seconds.
              </p>
            </Notice>
          ) : null}
          {progress ? (
            <Progress role="status" aria-live="polite">
              <span>Keep holding to unlock…</span>
              <Bar>
                <span style={{ width: `${Math.round(progress.value * 100)}%` }} />
              </Bar>
            </Progress>
          ) : null}
        </LockLayer>
      ) : null}
    </TestShell>
  );
};

export default SolidScreenTest;
