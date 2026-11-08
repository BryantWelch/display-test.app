import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TestShell, {
  Section,
  Segmented,
  Toggle,
  Readout,
  Button,
  ButtonRow,
  Hint,
} from '../../components/TestShell';
import { useWakeLock } from '../../hooks/useWakeLock';

const PALETTE = [
  '#38bdf8',
  '#f472b6',
  '#facc15',
  '#4ade80',
  '#a78bfa',
  '#fb923c',
  '#f87171',
  '#2dd4bf',
  '#e879f9',
  '#a3e635',
];

const MODES = [
  { value: 'draw', label: 'Draw' },
  { value: 'coverage', label: 'Coverage' },
  { value: 'grid', label: 'Tap grid' },
];

const CELL_SIZES = [
  { value: 16, label: 'Fine' },
  { value: 28, label: 'Medium' },
  { value: 48, label: 'Coarse' },
];

const GRIDS = [
  { value: '6x4', label: '6 × 4' },
  { value: '10x6', label: '10 × 6' },
  { value: '16x9', label: '16 × 9' },
];

const COVERAGE_FILL = 'rgba(34, 197, 94, 0.7)';
const DEFAULTS = { mode: 'draw', cellSize: 28, grid: '10x6', showHud: true };

const Surface = styled.div`
  position: absolute;
  inset: 0;
  background: #0b0f17;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

const GridLayer = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  pointer-events: none;
`;

const Cell = styled.div`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: ${({ $hit }) => ($hit ? 'rgba(34, 197, 94, 0.75)' : 'transparent')};
  transition: background 0.12s ease;
`;

const Hud = styled.div`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(11, 17, 32, 0.8);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  pointer-events: none;

  @media (max-width: 560px) {
    top: auto;
    bottom: 5.5rem;
    font-size: 0.82rem;
  }

  strong {
    font-size: 1.05rem;
  }

  button {
    pointer-events: auto;
    min-height: 36px;
  }
`;

const Empty = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(420px, calc(100vw - 2rem));
  text-align: center;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.5;
  pointer-events: none;
`;

const parseGrid = (key, portrait) => {
  const [a, b] = key.split('x').map(Number);
  return portrait ? { cols: b, rows: a } : { cols: a, rows: b };
};

const fillCell = (ctx, cov, c, r) => {
  const x0 = Math.round(c * cov.cw);
  const y0 = Math.round(r * cov.ch);
  ctx.fillRect(x0 + 1, y0 + 1, Math.round((c + 1) * cov.cw) - x0 - 1, Math.round((r + 1) * cov.ch) - y0 - 1);
};

// Browsers report 0.5 while a contact is active on hardware without pressure sensing.
const formatPressure = ({ type, pressure }) =>
  !pressure || (type !== 'pen' && pressure === 0.5) ? '—' : pressure.toFixed(2);

const lowestFreeSlot = (map) => {
  const used = new Set([...map.values()].map((p) => p.slot));
  let s = 0;
  while (used.has(s)) s += 1;
  return s;
};

const TouchscreenTest = () => {
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [cellSize, setCellSize] = useState(DEFAULTS.cellSize);
  const [gridKey, setGridKey] = useState(DEFAULTS.grid);
  const [showHud, setShowHud] = useState(DEFAULTS.showHud);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hits, setHits] = useState({ key: '', set: new Set() });
  const [stats, setStats] = useState({ active: 0, max: 0, total: 0, coverage: 0, last: null });

  const surfaceRef = useRef(null);
  const paintRef = useRef(null);
  const overlayRef = useRef(null);
  const pointers = useRef(new Map());
  const coverage = useRef(null);
  const counters = useRef({ max: 0, total: 0, last: null });
  const dirty = useRef(true);
  const lastStatsAt = useRef(0);
  const lastActive = useRef(0);

  useWakeLock(true);

  const { cols, rows } = parseGrid(gridKey, size.h > size.w);
  const layoutKey = `${cols}x${rows}`;
  const hitSet = hits.key === layoutKey ? hits.set : new Set();

  const live = useRef({});
  live.current = { mode, cols, rows, layoutKey, size };

  const redrawPaint = useCallback(() => {
    const canvas = paintRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const { w, h } = live.current.size;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cov = coverage.current;
    if (live.current.mode !== 'coverage' || !cov) return;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 1; c < cov.cols; c += 1) {
      ctx.moveTo(Math.round(c * cov.cw) + 0.5, 0);
      ctx.lineTo(Math.round(c * cov.cw) + 0.5, h);
    }
    for (let r = 1; r < cov.rows; r += 1) {
      ctx.moveTo(0, Math.round(r * cov.ch) + 0.5);
      ctx.lineTo(w, Math.round(r * cov.ch) + 0.5);
    }
    ctx.stroke();
    ctx.fillStyle = COVERAGE_FILL;
    for (let i = 0; i < cov.data.length; i += 1) {
      if (cov.data[i]) fillCell(ctx, cov, i % cov.cols, Math.floor(i / cov.cols));
    }
  }, []);

  const resetCoverage = useCallback(() => {
    const { w, h } = live.current.size;
    if (!w || !h) {
      coverage.current = null;
      return;
    }
    const cellCols = Math.max(1, Math.round(w / cellSize));
    const cellRows = Math.max(1, Math.round(h / cellSize));
    coverage.current = {
      cw: w / cellCols,
      ch: h / cellRows,
      cols: cellCols,
      rows: cellRows,
      data: new Uint8Array(cellCols * cellRows),
      count: 0,
    };
  }, [cellSize]);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    [paintRef.current, overlayRef.current].forEach((c) => {
      if (!c) return;
      c.width = Math.round(size.w * dpr);
      c.height = Math.round(size.h * dpr);
    });
    resetCoverage();
    redrawPaint();
    dirty.current = true;
  }, [size, mode, resetCoverage, redrawPaint]);

  const markCell = (x, y) => {
    const cov = coverage.current;
    if (!cov) return;
    const c = Math.floor(x / cov.cw);
    const r = Math.floor(y / cov.ch);
    if (c < 0 || r < 0 || c >= cov.cols || r >= cov.rows) return;
    const i = r * cov.cols + c;
    if (cov.data[i]) return;
    cov.data[i] = 1;
    cov.count += 1;
    const ctx = paintRef.current.getContext('2d');
    ctx.fillStyle = COVERAGE_FILL;
    fillCell(ctx, cov, c, r);
  };

  // Only bridge small gaps: a large jump between events can mean a dead strip, which must stay unpainted.
  const markSegment = (x0, y0, x1, y1) => {
    const cov = coverage.current;
    if (!cov) return;
    const cell = Math.min(cov.cw, cov.ch);
    const dist = Math.hypot(x1 - x0, y1 - y0);
    if (dist > cell * 3) {
      markCell(x1, y1);
      return;
    }
    const steps = Math.max(1, Math.ceil(dist / (cell / 2)));
    for (let s = 1; s <= steps; s += 1) {
      markCell(x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps);
    }
  };

  const handlers = useRef({});
  handlers.current = { markCell, markSegment };

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return undefined;
    const map = pointers.current;

    const point = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const describe = (e, slot) => ({
      slot,
      type: e.pointerType || 'mouse',
      pressure: e.pressure,
      w: e.width || 1,
      h: e.height || 1,
    });

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Capture can fail for synthetic or already-released pointers.
      }
      const { x, y } = point(e);
      const slot = lowestFreeSlot(map);
      const p = { ...describe(e, slot), x, y };
      map.set(e.pointerId, p);
      const c = counters.current;
      c.total += 1;
      c.max = Math.max(c.max, map.size);
      c.last = p;

      const { mode: m, cols: gc, rows: gr, layoutKey: key, size: s } = live.current;
      if (m === 'draw') {
        const ctx = paintRef.current.getContext('2d');
        ctx.fillStyle = PALETTE[slot % PALETTE.length];
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (m === 'coverage') {
        handlers.current.markCell(x, y);
      } else if (m === 'grid' && s.w && s.h) {
        const col = Math.min(gc - 1, Math.floor(x / (s.w / gc)));
        const row = Math.min(gr - 1, Math.floor(y / (s.h / gr)));
        const idx = row * gc + col;
        setHits((prev) => {
          const base = prev.key === key ? prev.set : new Set();
          if (base.has(idx)) return prev;
          const next = new Set(base);
          next.add(idx);
          return { key, set: next };
        });
      }
      dirty.current = true;
    };

    const onMove = (e) => {
      const p = map.get(e.pointerId);
      if (!p) return;
      const list = e.getCoalescedEvents?.() || [];
      const events = list.length ? list : [e];
      const m = live.current.mode;
      const ctx = m === 'draw' ? paintRef.current.getContext('2d') : null;
      if (ctx) {
        ctx.strokeStyle = PALETTE[p.slot % PALETTE.length];
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      }
      for (const ev of events) {
        const { x, y } = point(ev);
        if (ctx) ctx.lineTo(x, y);
        else if (m === 'coverage') handlers.current.markSegment(p.x, p.y, x, y);
        p.x = x;
        p.y = y;
      }
      if (ctx) ctx.stroke();
      Object.assign(p, describe(e, p.slot));
      counters.current.last = p;
      dirty.current = true;
    };

    const onUp = (e) => {
      if (map.delete(e.pointerId)) dirty.current = true;
    };

    const clearAll = () => {
      map.clear();
      dirty.current = true;
    };

    const noMenu = (e) => e.preventDefault();
    const noScroll = (e) => e.preventDefault();

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('contextmenu', noMenu);
    el.addEventListener('touchmove', noScroll, { passive: false });
    window.addEventListener('blur', clearAll);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('contextmenu', noMenu);
      el.removeEventListener('touchmove', noScroll);
      window.removeEventListener('blur', clearAll);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const drawOverlay = () => {
      const canvas = overlayRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const { w, h } = live.current.size;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      for (const p of pointers.current.values()) {
        const color = PALETTE[p.slot % PALETTE.length];
        const radius = Math.max(28, Math.max(p.w, p.h) / 2 + 8);
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, p.y + 0.5);
        ctx.lineTo(w, p.y + 0.5);
        ctx.moveTo(p.x + 0.5, 0);
        ctx.lineTo(p.x + 0.5, h);
        ctx.stroke();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '700 16px system-ui, sans-serif';
        ctx.fillText(String(p.slot + 1), p.x, p.y + 6);
        ctx.font = '600 13px system-ui, sans-serif';
        ctx.fillStyle = color;
        ctx.fillText(`${Math.round(p.x)}, ${Math.round(p.y)}`, p.x, p.y - radius - 8);
      }
    };

    const loop = (now) => {
      if (dirty.current) {
        dirty.current = false;
        drawOverlay();
        const active = pointers.current.size;
        if (now - lastStatsAt.current > 100 || active !== lastActive.current) {
          lastStatsAt.current = now;
          lastActive.current = active;
          const cov = coverage.current;
          const c = counters.current;
          setStats({
            active,
            max: c.max,
            total: c.total,
            coverage: cov ? cov.count / cov.data.length : 0,
            last: c.last ? { ...c.last } : null,
          });
        } else {
          dirty.current = true;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Track TestShell's H toggle so the restore button matches its state.
  useEffect(() => {
    const onKey = (e) => {
      const key = e.key?.toLowerCase();
      if (e.ctrlKey || e.metaKey || e.altKey || (key !== 'h' && key !== '?' && key !== '/')) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        return;
      }
      if (key === 'h') setChromeHidden((v) => !v);
      else setChromeHidden(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleChrome = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' }));

  const clear = useCallback(() => {
    resetCoverage();
    redrawPaint();
    setHits({ key: '', set: new Set() });
    dirty.current = true;
  }, [resetCoverage, redrawPaint]);

  const handleReset = () => {
    counters.current = { max: pointers.current.size, total: 0, last: null };
    setMode(DEFAULTS.mode);
    setCellSize(DEFAULTS.cellSize);
    setGridKey(DEFAULTS.grid);
    setShowHud(DEFAULTS.showHud);
    clear();
  };

  const shortcuts = [
    { key: 'c', label: 'Clear', action: clear },
    { key: '1', label: 'Draw mode', action: () => setMode('draw') },
    { key: '2', label: 'Coverage mode', action: () => setMode('coverage') },
    { key: '3', label: 'Tap grid mode', action: () => setMode('grid') },
  ];

  const gridTotal = cols * rows;
  const gridDone = hitSet.size;
  const pct = `${Math.round(stats.coverage * 100)}%`;
  const last = stats.last;
  const maxPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;

  const modeStatus =
    mode === 'coverage'
      ? `Covered ${pct}`
      : mode === 'grid'
        ? gridDone === gridTotal
          ? 'All cells responded ✓'
          : `Cells ${gridDone} / ${gridTotal}`
        : null;

  return (
    <TestShell
      title="Touchscreen Test"
      description="Touch with one or more fingers. Each contact gets its own numbered color. Use Coverage to paint the whole screen and expose dead zones, or Tap grid to check every area responds."
      onReset={handleReset}
      shortcuts={shortcuts}
      hideCursor={false}
      controls={
        <>
          <Section>
            <h3>Mode</h3>
            <Segmented options={MODES} value={mode} onChange={setMode} columns={3} />
            {mode === 'coverage' ? (
              <>
                <Segmented label="Cell size" options={CELL_SIZES} value={cellSize} onChange={setCellSize} columns={3} />
                <Hint>
                  Tap Hide controls first so the panel doesn’t cover part of the screen, then drag slowly over every
                  part. Cells that never turn green are dead zones.
                </Hint>
              </>
            ) : null}
            {mode === 'grid' ? (
              <>
                <Segmented label="Grid" options={GRIDS} value={gridKey} onChange={setGridKey} columns={3} />
                <Hint>Tap each cell once. Any cell that won’t turn green after a few taps is unresponsive.</Hint>
              </>
            ) : null}
            {mode === 'draw' ? (
              <Hint>Trails stay on screen. Breaks in a slow straight line, or lines you didn’t draw, point to dead spots or ghost touches.</Hint>
            ) : null}
          </Section>

          <Section>
            <ButtonRow>
              <Button type="button" onClick={clear} style={{ minHeight: 44 }}>
                Clear screen
              </Button>
              <Button type="button" onClick={toggleChrome} style={{ minHeight: 44 }}>
                Hide controls
              </Button>
            </ButtonRow>
            <Toggle label="Show touch counter on screen" checked={showHud} onChange={setShowHud} />
          </Section>

          <Section>
            <h3>Touches</h3>
            <Readout
              items={[
                ['Active now', String(stats.active)],
                ['Max simultaneous', String(stats.max)],
                ['Total touches', String(stats.total)],
                ['Device reports', maxPoints ? `${maxPoints} touch points` : 'None reported'],
                ...(mode === 'coverage' ? [['Coverage', pct]] : []),
                ...(mode === 'grid' ? [['Grid cells', `${gridDone} / ${gridTotal}`]] : []),
              ]}
            />
          </Section>

          {last ? (
            <Section>
              <h3>Last contact</h3>
              <Readout
                items={[
                  ['Input', last.type],
                  ['Position', `${Math.round(last.x)}, ${Math.round(last.y)}`],
                  ['Contact size', `${Math.round(last.w)} × ${Math.round(last.h)} px`],
                  ['Pressure', formatPressure(last)],
                ]}
              />
            </Section>
          ) : null}
        </>
      }
    >
      <Surface ref={surfaceRef} aria-label="Touch test area" role="application">
        <canvas ref={paintRef} />
        {mode === 'grid' ? (
          <GridLayer
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
          >
            {Array.from({ length: gridTotal }, (_, i) => (
              <Cell key={i} $hit={hitSet.has(i)} />
            ))}
          </GridLayer>
        ) : null}
        <canvas ref={overlayRef} />
        {stats.total === 0 && mode === 'draw' ? (
          <Empty>Touch the screen with one finger, then add more. Each contact gets its own color and number.</Empty>
        ) : null}
      </Surface>

      {showHud || chromeHidden ? (
        <Hud>
          {showHud ? (
            <>
              <span>
                Touches <strong>{stats.active}</strong>
              </span>
              <span>
                Max <strong>{stats.max}</strong>
              </span>
              {modeStatus ? <span>{modeStatus}</span> : null}
            </>
          ) : null}
          {chromeHidden ? (
            <Button type="button" onClick={toggleChrome}>
              Show controls
            </Button>
          ) : null}
        </Hud>
      ) : null}
    </TestShell>
  );
};

export default TouchscreenTest;
