import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const AD_SLOTS = {
  banner: '3936769799',
  belowContent: '7385060214',
  sidebar: '6371361443',
};

const CLIENT = 'ca-pub-1728229586138721';
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;

// Pages with no AdSlot never call this, so fullscreen tests and ad-free routes
// don't download AdSense at all. One request is shared by every slot.
let scriptRequested = false;

function requestAdSense() {
  if (scriptRequested || typeof document === 'undefined') return;
  scriptRequested = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = SCRIPT_SRC;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

const Wrap = styled.aside`
  margin: ${({ $margin }) => $margin || '2rem 0'};
  min-height: ${({ $minHeight }) => $minHeight}px;
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
    if (!near || !ad || ad.dataset.adPushed === '1') return;
    // The unit is inserted only once it is near the viewport. push() fills the
    // next unfilled <ins>, so earlier off-screen slots must not be in the DOM yet.
    ad.dataset.adPushed = '1';
    requestAdSense();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ads may be blocked.
      delete ad.dataset.adPushed;
    }
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
