import React, { useEffect, useRef } from 'react';

const AdSlot = ({ slot, style, className }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      if (window.adsbygoogle && adRef.current.getAttribute('data-adsbygoogle-status') !== 'done') {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // Fail silently; ads may be blocked
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ''}`.trim()}
      style={style || { display: 'block' }}
      data-ad-client="ca-pub-1728229586138721"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={adRef}
    />
  );
};

export default AdSlot;
