import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, ButtonRow } from '../components/testControls';
import { monitorFrames } from '../utils/frameTiming';

const WINDOW = 240;
const MIN_SAMPLES = 30;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(0, 1.4fr);
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Big = styled.div`
  text-align: center;

  strong {
    display: block;
    font-size: clamp(3.5rem, 9vw, 5.5rem);
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${({ $tone }) => ($tone === 'warn' ? 'var(--warning)' : 'var(--text)')};
    font-variant-numeric: tabular-nums;
  }

  span {
    display: block;
    margin-top: 0.35rem;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  small {
    display: block;
    margin-top: 0.2rem;
    color: var(--text-subtle);
    font-size: 0.82rem;
    font-variant-numeric: tabular-nums;
  }
`;

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  div {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm, 8px);
    padding: 0.55rem 0.7rem;
  }

  dt {
    color: var(--text-subtle);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  dd {
    margin: 0.15rem 0 0;
    color: var(--text);
    font-size: 1.05rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
`;

const GraphWrap = styled.figure`
  margin: 1.25rem 0 0.75rem;

  canvas {
    display: block;
    width: 100%;
    height: 140px;
    border-radius: var(--radius-sm, 8px);
    background: var(--surface-2);
    border: 1px solid var(--border);
  }

  figcaption {
    margin-top: 0.4rem;
    color: var(--text-subtle);
    font-size: 0.8rem;
  }
`;

const Callout = styled.div`
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid color-mix(in srgb, var(--warning) 50%, transparent);
  background: color-mix(in srgb, var(--warning) 10%, transparent);
  color: var(--text);
  font-size: 0.92rem;
  line-height: 1.55;

  ul {
    margin: 0.4rem 0 0;
    padding-left: 1.1rem;
    color: var(--text-muted);
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

const isAppleWebKit = () => {
  const ua = navigator.userAgent || '';
  const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const safari = /Safari\//.test(ua) && !/Chrome|Chromium|Edg|OPR|Android/.test(ua);
  return ios || safari;
};

function drawGraph(canvas, intervals, frameMs) {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(canvas.clientHeight * dpr);
  if (!w || !h) return;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(canvas);
  const color = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  const accent = color('--accent', '#38bdf8');
  const danger = color('--danger', '#ef4444');
  const subtle = color('--text-subtle', '#64748b');

  ctx.clearRect(0, 0, w, h);
  if (!intervals.length || !frameMs) return;

  const maxMs = Math.max(frameMs * 2.5, Math.min(Math.max(...intervals), frameMs * 6));
  const y = (ms) => h - (Math.min(ms, maxMs) / maxMs) * (h - 6 * dpr);
  const barW = w / WINDOW;
  const start = WINDOW - intervals.length;

  intervals.forEach((ms, i) => {
    const drop = ms > frameMs * 1.5;
    ctx.fillStyle = drop ? danger : accent;
    ctx.globalAlpha = drop ? 1 : 0.75;
    const top = y(ms);
    ctx.fillRect((start + i) * barW, top, Math.max(1, barW - dpr * 0.5), h - top);
  });
  ctx.globalAlpha = 1;

  ctx.strokeStyle = subtle;
  ctx.setLineDash([4 * dpr, 4 * dpr]);
  ctx.lineWidth = dpr;
  ctx.beginPath();
  ctx.moveTo(0, y(frameMs));
  ctx.lineTo(w, y(frameMs));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = subtle;
  ctx.font = `${11 * dpr}px system-ui, sans-serif`;
  ctx.fillText(`${frameMs.toFixed(2)} ms`, 6 * dpr, y(frameMs) - 4 * dpr);
}

const RefreshRateTool = () => {
  const [run, setRun] = useState(0);
  const [summary, setSummary] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setSummary(null);
    const stop = monitorFrames({
      windowSize: WINDOW,
      updateMs: 100,
      onUpdate: (sum, intervals) => {
        if (!sum || sum.samples < MIN_SAMPLES) {
          setSummary(null);
          return;
        }
        setSummary(sum);
        if (canvasRef.current) drawGraph(canvasRef.current, intervals, sum.frameMs);
      },
    });
    return stop;
  }, [run]);

  const ready = !!summary;
  const low = ready && summary.samples >= 120 && summary.snappedHz <= 61;
  const safari = ready && isAppleWebKit();

  return (
    <div>
      <Top>
        <Big $tone={low ? 'warn' : undefined}>
          <div aria-live="polite" aria-atomic="true">
            <strong>{ready ? summary.snappedHz : '—'}</strong>
            <span>{ready ? 'Hz refresh rate' : 'Measuring…'}</span>
          </div>
          <small>{ready ? `${summary.hz.toFixed(2)} Hz measured` : 'Keep this tab in front'}</small>
        </Big>
        <Stats>
          <div>
            <dt>Frame time</dt>
            <dd>{ready ? `${summary.frameMs.toFixed(2)} ms` : '—'}</dd>
          </div>
          <div>
            <dt>Jitter</dt>
            <dd>{ready ? `±${summary.jitterMs.toFixed(2)} ms` : '—'}</dd>
          </div>
          <div>
            <dt>Dropped</dt>
            <dd>{ready ? summary.dropped : '—'}</dd>
          </div>
          <div>
            <dt>Min</dt>
            <dd>{ready ? `${summary.minMs.toFixed(2)} ms` : '—'}</dd>
          </div>
          <div>
            <dt>Max</dt>
            <dd>{ready ? `${summary.maxMs.toFixed(2)} ms` : '—'}</dd>
          </div>
          <div>
            <dt>Samples</dt>
            <dd>{ready ? summary.samples : '—'}</dd>
          </div>
        </Stats>
      </Top>

      <GraphWrap>
        <canvas ref={canvasRef} role="img" aria-label="Frame time graph for the last 240 frames" />
        <figcaption>
          Frame time for the last {WINDOW} frames. The dashed line is the measured refresh interval; red bars are
          frames that took more than 1.5× longer (dropped or late frames). Dropped, min, and max cover this window.
        </figcaption>
      </GraphWrap>

      <ButtonRow>
        <Button type="button" onClick={() => setRun((r) => r + 1)}>
          Restart measurement
        </Button>
      </ButtonRow>

      {low ? (
        <Callout role="note">
          <strong>Seeing 60 Hz (or less) on a high-refresh monitor?</strong> The browser runs at whatever the display
          is actually set to, so this usually means the monitor isn’t running at its rated refresh rate:
          <ul>
            <li>
              <strong>Windows:</strong> Settings → System → Display → Advanced display → Choose a refresh rate. Pick
              the highest fixed rate, not “Dynamic”.
            </li>
            <li>
              <strong>Cable / port:</strong> use DisplayPort or HDMI 2.1 with a certified cable. HDMI 2.0 tops out
              around 144 Hz at 1440p and 60 Hz at 4K, and some monitors only reach their top rate over DisplayPort.
            </li>
            <li>
              <strong>Desktop PC:</strong> plug into the graphics card, not the motherboard’s video output.
            </li>
            <li>
              <strong>Laptop:</strong> plug in the charger and turn off battery saver — many laptops drop to 60 Hz on
              battery.
            </li>
            <li>
              <strong>Multiple monitors:</strong> this measures the screen the browser window is on. Move it to the fast
              monitor and press Restart.
            </li>
            {safari ? (
              <li>
                <strong>Safari</strong>, and every browser on iPhone and iPad, limits web pages to 60 fps by default,
                even on 120 Hz ProMotion screens. On a Mac, try Chrome or Firefox.
              </li>
            ) : null}
          </ul>
        </Callout>
      ) : null}
    </div>
  );
};

export default RefreshRateTool;
