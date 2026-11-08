import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, ButtonRow } from '../components/testControls';

const RATES = [125, 250, 500, 1000, 2000, 4000, 8000];
const WINDOW_MS = 400;
const GAP_MS = 50;
const SOURCES = [
  { id: 'move', label: 'pointermove events' },
  { id: 'coalesced', label: 'Coalesced samples' },
  { id: 'raw', label: 'pointerrawupdate' },
];

const Area = styled.div`
  position: relative;
  height: 260px;
  border-radius: var(--radius-sm, 8px);
  border: 1px dashed var(--border);
  background: var(--surface-2);
  touch-action: none;
  user-select: none;
  cursor: crosshair;
  overflow: hidden;

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  p {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    margin: 0;
    padding: 1rem;
    text-align: center;
    color: var(--text-subtle);
    font-size: 0.95rem;
    pointer-events: none;
  }
`;

const Results = styled.div`
  display: grid;
  grid-template-columns: minmax(170px, 1fr) minmax(0, 1.5fr);
  gap: 1.25rem;
  margin-top: 1.1rem;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Big = styled.div`
  strong {
    display: block;
    font-size: clamp(2.6rem, 7vw, 3.8rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  span {
    display: block;
    margin-top: 0.3rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 0.35rem 0.4rem;
    border-bottom: 1px solid var(--border);
    text-align: right;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  th {
    color: var(--text-subtle);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    color: var(--text);
  }

  td.na {
    color: var(--text-subtle);
  }
`;

const Histogram = styled.div`
  margin-top: 1.1rem;

  h3 {
    margin: 0 0 0.5rem;
    font-size: 0.8rem;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.3rem;
  }

  li {
    display: grid;
    grid-template-columns: 5.5rem 1fr 3rem;
    gap: 0.6rem;
    align-items: center;
    font-size: 0.82rem;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }

  li span:last-child {
    text-align: right;
  }
`;

const Bar = styled.span`
  height: 10px;
  border-radius: 999px;
  background: var(--surface-2);
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: var(--accent);
  }
`;

const Note = styled.p`
  margin: 0.9rem 0 0;
  color: var(--text-subtle);
  font-size: 0.82rem;
  line-height: 1.5;
`;

function emptyStats() {
  return { current: 0, avg: 0, max: 0, count: 0, activeMs: 0 };
}

function freshState() {
  return {
    times: { move: [], coalesced: [], raw: [] },
    last: { move: null, coalesced: null, raw: null },
    stats: { move: emptyStats(), coalesced: emptyStats(), raw: emptyStats() },
    bins: RATES.map(() => 0),
    dupes: 0,
    pointerType: null,
  };
}

/** Events per second while moving: counts intervals shorter than GAP_MS so pauses don't drag the rate down. */
function rateFrom(times) {
  let n = 0;
  let sum = 0;
  for (let i = 1; i < times.length; i += 1) {
    const dt = times[i] - times[i - 1];
    if (dt < GAP_MS) {
      n += 1;
      sum += dt;
    }
  }
  return { hz: n >= 5 && sum > 0 ? (n / sum) * 1000 : 0, span: sum };
}

function nearestRateIndex(dt) {
  const hz = 1000 / dt;
  let best = 0;
  for (let i = 1; i < RATES.length; i += 1) {
    if (Math.abs(Math.log(RATES[i] / hz)) < Math.abs(Math.log(RATES[best] / hz))) best = i;
  }
  return best;
}

const fmtHz = (v) => (v ? Math.round(v).toLocaleString() : '—');

const MousePollingTool = () => {
  const areaRef = useRef(null);
  const canvasRef = useRef(null);
  const data = useRef(freshState());
  const [view, setView] = useState(() => ({
    stats: freshState().stats,
    bins: RATES.map(() => 0),
    dupes: 0,
    pointerType: null,
    active: false,
  }));
  const [support] = useState(() => ({
    coalesced: typeof PointerEvent !== 'undefined' && 'getCoalescedEvents' in PointerEvent.prototype,
    raw: typeof window !== 'undefined' && 'onpointerrawupdate' in window,
  }));

  useEffect(() => {
    const area = areaRef.current;
    const canvas = canvasRef.current;
    if (!area || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let lastInput = 0;

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(canvas);

    const record = (source, t) => {
      const d = data.current;
      const last = d.last[source];
      const st = d.stats[source];
      if (last !== null) {
        const dt = t - last;
        if (dt >= 0 && dt < GAP_MS) {
          st.count += 1;
          st.activeMs += dt;
          if (source === best()) {
            if (dt > 0) d.bins[nearestRateIndex(dt)] += 1;
            else d.dupes += 1;
          }
        }
      }
      d.last[source] = t;
      const arr = d.times[source];
      arr.push(t);
      while (arr.length && t - arr[0] > WINDOW_MS) arr.shift();
    };

    const best = () => {
      if (support.raw && data.current.stats.raw.count > 0) return 'raw';
      return support.coalesced ? 'coalesced' : 'move';
    };

    const dot = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.fillRect((e.clientX - rect.left) * dpr - dpr, (e.clientY - rect.top) * dpr - dpr, 2 * dpr, 2 * dpr);
    };

    const onMove = (e) => {
      lastInput = performance.now();
      data.current.pointerType = e.pointerType;
      record('move', e.timeStamp);
      const list = support.coalesced ? e.getCoalescedEvents() : [];
      const samples = list.length ? list : [e];
      for (const c of samples) {
        if (support.coalesced) record('coalesced', c.timeStamp);
        dot(c);
      }
    };
    const onRaw = (e) => {
      lastInput = performance.now();
      const list = support.coalesced ? e.getCoalescedEvents() : [];
      if (list.length) for (const c of list) record('raw', c.timeStamp);
      else record('raw', e.timeStamp);
    };

    area.addEventListener('pointermove', onMove);
    if (support.raw) area.addEventListener('pointerrawupdate', onRaw);

    let raf = 0;
    let lastUi = 0;
    let wasActive = false;
    const tick = (t) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      const active = performance.now() - lastInput < 300;
      if (t - lastUi > 150 && (active || wasActive)) {
        lastUi = t;
        wasActive = active;
        const d = data.current;
        for (const src of ['move', 'coalesced', 'raw']) {
          const st = d.stats[src];
          const win = active ? rateFrom(d.times[src]) : { hz: 0, span: 0 };
          st.current = win.hz;
          if (win.span >= WINDOW_MS / 2 && st.current > st.max) st.max = st.current;
          st.avg = st.count >= 20 && st.activeMs > 0 ? (st.count / st.activeMs) * 1000 : 0;
        }
        setView({
          stats: JSON.parse(JSON.stringify(d.stats)),
          bins: d.bins.slice(),
          dupes: d.dupes,
          pointerType: d.pointerType,
          active,
          best: best(),
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      area.removeEventListener('pointermove', onMove);
      if (support.raw) area.removeEventListener('pointerrawupdate', onRaw);
    };
  }, [support]);

  const reset = () => {
    data.current = freshState();
    const canvas = canvasRef.current;
    canvas?.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setView({ stats: freshState().stats, bins: RATES.map(() => 0), dupes: 0, pointerType: null, active: false });
  };

  const bestId = view.best || (support.coalesced ? 'coalesced' : 'move');
  const best = view.stats[bestId];
  const binTotal = view.bins.reduce((a, b) => a + b, 0);
  const binMax = Math.max(1, ...view.bins);
  const coarse = view.dupes > 20 && view.dupes > (binTotal + view.dupes) * 0.1;
  const started = view.stats.move.count > 0;

  return (
    <div>
      <Area ref={areaRef} role="group" aria-label="Mouse polling capture area">
        <canvas ref={canvasRef} aria-hidden="true" />
        {!started ? <p>Move your mouse in fast, steady circles inside this box.</p> : null}
      </Area>

      <Results>
        <Big>
          <strong>{fmtHz(best.current || best.avg)}</strong>
          <span>
            {best.current ? 'Hz right now' : best.avg ? 'Hz average (keep moving for live)' : 'Hz — start moving'}
            {view.pointerType && view.pointerType !== 'mouse' ? ` · ${view.pointerType} input` : ''}
          </span>
        </Big>
        <Table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Now</th>
              <th>Avg</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(({ id, label }) => {
              const available = id === 'move' || support[id];
              const st = view.stats[id];
              return (
                <tr key={id}>
                  <td>
                    {label}
                    {id === bestId ? ' ★' : ''}
                  </td>
                  {available ? (
                    <>
                      <td>{fmtHz(st.current)}</td>
                      <td>{fmtHz(st.avg)}</td>
                      <td>{fmtHz(st.max)}</td>
                    </>
                  ) : (
                    <td className="na" colSpan={3}>
                      Not supported in this browser
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Results>

      <Histogram>
        <h3>Sample intervals (nearest polling rate)</h3>
        <ol>
          {RATES.map((rate, i) => (
            <li key={rate}>
              <span>{rate.toLocaleString()} Hz</span>
              <Bar $pct={(view.bins[i] / binMax) * 100} />
              <span>{binTotal ? `${Math.round((view.bins[i] / binTotal) * 100)}%` : '—'}</span>
            </li>
          ))}
        </ol>
        {coarse ? (
          <Note>
            This browser rounds event timestamps, so many reports share the same time and the histogram can’t
            separate them at this rate. The Avg and Max readings still count every report.
          </Note>
        ) : null}
      </Histogram>

      <ButtonRow style={{ marginTop: '1rem' }}>
        <Button type="button" onClick={reset}>
          Reset
        </Button>
      </ButtonRow>

      <Note>
        ★ marks the most detailed source this browser offers. Plain pointermove events are usually batched to your
        display’s refresh rate, so they top out near that rate; coalesced samples and pointerrawupdate expose the
        individual reports in between. Expect the estimate to read a little under the mouse’s setting.
      </Note>
    </div>
  );
};

export default MousePollingTool;
