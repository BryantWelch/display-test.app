import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

export const AD_SLOTS = {
  banner: '3936769799', // home_top_banner; top unit on guides, test pages, and gear
  belowContent: '7385060214', // home_below_grid; unit at the end of a page
  sidebar: '6371361443', // sidebar on test pages, about, and gear
};

const CLIENT = 'ca-pub-1728229586138721';
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
const MIN_CREATIVE_PX = 24;
// Give up if the unit never paints a creative, so a blocked or unfilled request
// cannot leave a blank box behind.
const UNFILLED_TIMEOUT_MS = 8000;

// Pages with no AdSlot never call this, so fullscreen tests and ad-free routes
// don't download AdSense at all. One request is shared by every slot.
let scriptReady = null;

function requestAdSense() {
  if (scriptReady) return scriptReady;
  if (typeof document === 'undefined') return Promise.resolve(false);
  scriptReady = new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_SRC;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return scriptReady;
}

function pushWhenSized(ad, attempt = 0) {
  if (!ad.isConnected) return;
  if (ad.offsetWidth < 1 && attempt < 12) {
    requestAnimationFrame(() => pushWhenSized(ad, attempt + 1));
    return;
  }
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // Ads may be blocked, or this unit was already filled.
    delete ad.dataset.adPushed;
  }
}

function isPainted(el) {
  const rect = el.getBoundingClientRect();
  if (rect.width < MIN_CREATIVE_PX || rect.height < MIN_CREATIVE_PX) return false;
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const computed = getComputedStyle(node);
    if (computed.display === 'none' || computed.visibility === 'hidden' || Number(computed.opacity) === 0) {
      return false;
    }
    if (node === document.body) break;
  }
  return true;
}

// A creative counts only when its frame is on screen and the unit itself has
// grown to fit it. Collapsed or invisible frames must not open a labeled gap.
function creativeIsVisible(ad) {
  if (!ad?.isConnected) return false;
  if (ad.getAttribute('data-ad-status') === 'unfilled') return false;
  const box = ad.getBoundingClientRect();
  if (box.width < MIN_CREATIVE_PX || box.height < MIN_CREATIVE_PX) return false;
  const frame = ad.querySelector('iframe');
  return !!frame && isPainted(frame);
}

const Wrap = styled.aside`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: ${({ $status, $margin }) => ($status === 'shown' ? $margin || '2rem 0' : '0')};

  ${({ $status }) =>
    $status === 'shown'
      ? css`
          contain: layout;

          &::before {
            content: 'Advertisement';
            display: block;
            font-size: 0.7rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text-subtle);
            margin-bottom: 0.35rem;
          }
        `
      : $status === 'empty'
        ? css`
            display: none;
          `
        : css`
            min-height: 0;
          `}

  ins.adsbygoogle[data-ad-status='unfilled'] {
    display: none !important;
  }
`;

/** The label and any gap appear only after a creative is actually visible. */
const AdSlot = ({ slot = 'banner', margin, className }) => {
  const wrapRef = useRef(null);
  const adRef = useRef(null);
  const [near, setNear] = useState(false);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || near) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }

    // Start slightly before the slot enters the viewport so the unit can fill
    // as it arrives. A slot the reader never reaches never requests the script.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

  useEffect(() => {
    const ad = adRef.current;
    if (!near || !ad || ad.dataset.adPushed === '1') return undefined;
    // The unit is inserted only once it is near the viewport. push() fills the
    // next unfilled <ins>, so earlier off-screen slots must not be in the DOM yet.
    // Wait until the library has loaded and this element is still on the page,
    // so a quick navigation cannot hand this request to a different unit.
    let cancelled = false;
    ad.dataset.adPushed = '1';
    requestAdSense().then((ok) => {
      if (cancelled || !ad.isConnected) return;
      if (!ok) {
        delete ad.dataset.adPushed;
        setStatus('empty');
        return;
      }
      pushWhenSized(ad);
    });
    return () => {
      cancelled = true;
      // Strict Mode cleans up before the script promise settles. Clearing the
      // flag lets that second run push; a cancelled run will not.
      delete ad.dataset.adPushed;
    };
  }, [near]);

  useEffect(() => {
    const ad = adRef.current;
    if (!near || !ad) return undefined;

    const evaluate = () => {
      if (creativeIsVisible(ad)) {
        setStatus('shown');
        return;
      }
      if (ad.getAttribute('data-ad-status') === 'unfilled') {
        setStatus('empty');
        return;
      }
      // A creative that was visible and then collapsed should take the label
      // and its gap with it.
      setStatus((current) => (current === 'shown' ? 'empty' : current));
    };

    const observer = new MutationObserver(evaluate);
    observer.observe(ad, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['data-ad-status', 'data-adsbygoogle-status', 'style', 'height', 'width'],
    });

    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(evaluate) : null;
    resize?.observe(ad);

    const timeout = window.setTimeout(() => {
      if (!creativeIsVisible(ad)) setStatus((current) => (current === 'shown' ? current : 'empty'));
    }, UNFILLED_TIMEOUT_MS);

    evaluate();

    return () => {
      observer.disconnect();
      resize?.disconnect();
      window.clearTimeout(timeout);
    };
  }, [near]);

  return (
    <Wrap
      ref={wrapRef}
      aria-label={status === 'shown' ? 'Advertisement' : undefined}
      aria-hidden={status === 'empty' ? true : undefined}
      $status={status}
      $margin={margin}
      data-slot={slot}
      data-ad-state={status}
      className={className}
    >
      {near ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={CLIENT}
          data-ad-slot={AD_SLOTS[slot] || slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          ref={adRef}
        />
      ) : null}
    </Wrap>
  );
};

export default AdSlot;
