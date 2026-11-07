import { useEffect, useRef, useState } from 'react';

/**
 * Fullscreen canvas whose backing store matches *device* pixels, so a 1px line in `draw`
 * is exactly one physical pixel. Required for any pixel-exact pattern (line pairs, checkers,
 * dither, chroma, sharpness) — CSS-sized canvases and <img> get resampled under OS scaling.
 *
 * draw(ctx, { width, height, dpr, exact }) is called on mount, resize, DPR change, and whenever
 * `deps` change. width/height are in device pixels and the context is untransformed.
 * `exact` is false when DPR is fractional (e.g. 125% / 150% Windows scaling) and the browser
 * could not report exact device-pixel sizes; show a warning in that case.
 *
 * For animation, pass `animate` = (ctx, info, timestamp) => void; it runs every rAF.
 */
export function usePixelCanvas({ draw, animate, deps = [] }) {
  const canvasRef = useRef(null);
  const [info, setInfo] = useState({ width: 0, height: 0, dpr: 1, exact: true });
  const drawRef = useRef(draw);
  const animateRef = useRef(animate);
  drawRef.current = draw;
  animateRef.current = animate;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const apply = (width, height, exact) => {
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      setInfo((prev) =>
        prev.width === width && prev.height === height && prev.dpr === dpr && prev.exact === exact
          ? prev
          : { width, height, dpr, exact }
      );
    };

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        const dpc = entry.devicePixelContentBoxSize?.[0];
        if (dpc) {
          apply(dpc.inlineSize, dpc.blockSize, true);
        } else {
          const dpr = window.devicePixelRatio || 1;
          const box = entry.contentBoxSize?.[0];
          const w = box ? box.inlineSize : entry.contentRect.width;
          const h = box ? box.blockSize : entry.contentRect.height;
          apply(Math.round(w * dpr), Math.round(h * dpr), Number.isInteger(dpr));
        }
      });
      try {
        ro.observe(canvas, { box: 'device-pixel-content-box' });
      } catch {
        ro.observe(canvas);
      }
    } else {
      const onResize = () => {
        const dpr = window.devicePixelRatio || 1;
        apply(Math.round(canvas.clientWidth * dpr), Math.round(canvas.clientHeight * dpr), Number.isInteger(dpr));
      };
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !info.width || !info.height || !drawRef.current) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    drawRef.current(ctx, info);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, ...deps]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !info.width || !animateRef.current) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    let raf = 0;
    const loop = (t) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      animateRef.current?.(ctx, info, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [info, !!animate]); // eslint-disable-line react-hooks/exhaustive-deps

  return { canvasRef, info };
}

const fullStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  imageRendering: 'pixelated',
};

/** Convenience component: a canvas filling its positioned parent. */
const PixelCanvas = ({ draw, animate, deps, style, onInfo, ...rest }) => {
  const { canvasRef, info } = usePixelCanvas({ draw, animate, deps });
  const onInfoRef = useRef(onInfo);
  onInfoRef.current = onInfo;
  useEffect(() => {
    onInfoRef.current?.(info);
  }, [info]);
  return <canvas ref={canvasRef} style={{ ...fullStyle, ...style }} {...rest} />;
};

/** Standard warning text when patterns can't map 1:1 to device pixels. */
export const SCALING_WARNING =
  'Your OS display scaling is not a whole number, so 1-pixel patterns may show moiré or blur in this browser. For exact results set scaling to 100% (or 200%).';

export default PixelCanvas;
