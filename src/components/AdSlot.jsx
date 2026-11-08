import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const AD_SLOTS = {
  banner: '3936769799', // home_top_banner; top unit on guides, test pages, and gear
  belowContent: '7385060214', // home_below_grid; unit at the end of a page
  sidebar: '6371361443', // sidebar on test pages, about, and gear
};

const CLIENT = 'ca-pub-1728229586138721';
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;

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

const Wrap = styled.aside`
  margin: ${({ $margin }) => $margin || '2rem 0'};
  min-height: ${({ $minHeight }) => $minHeight}px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
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
`;

/** Space is reserved up front so ads (or ad blockers) don't shift the page. */
const AdSlot = ({ slot = 'banner', minHeight = 100, margin, className }) => {
  const wrapRef = useRef(null);
  const adRef = useRef(null);
  const [near, setNear] = useState(false);

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
        return;
      }
      pushWhenSized(ad);
    });
    return () => {
      cancelled = true;
    };
  }, [near]);

  return (
    <Wrap ref={wrapRef} aria-label="Advertisement" $minHeight={minHeight} $margin={margin} className={className}>
      {near ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight }}
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
