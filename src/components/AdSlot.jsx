import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export const AD_SLOTS = {
  banner: '3936769799',
  belowContent: '7385060214',
  sidebar: '6371361443',
};

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
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;
    try {
      if (adRef.current.getAttribute('data-adsbygoogle-status') !== 'done') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ads may be blocked.
    }
  }, []);

  return (
    <Wrap aria-label="Advertisement" $minHeight={minHeight} $margin={margin} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight }}
        data-ad-client="ca-pub-1728229586138721"
        data-ad-slot={AD_SLOTS[slot] || slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </Wrap>
  );
};

export default AdSlot;
