import { useEffect, useState } from 'react';

/** m:ss countdown text; negative values clamp to 0:00. */
export const formatTime = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

/**
 * Holds a screen wake lock while `active`; re-acquires after the tab becomes visible again.
 * Returns 'off' | 'on' | 'released' | 'denied' | 'unsupported'.
 */
export function useWakeLock(active) {
  const [status, setStatus] = useState('off');
  useEffect(() => {
    if (!active) return undefined;
    if (!('wakeLock' in navigator)) {
      setStatus('unsupported');
      return undefined;
    }
    let lock = null;
    let cancelled = false;
    const request = () => {
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          if (cancelled) {
            l.release().catch(() => {});
            return;
          }
          lock = l;
          setStatus('on');
          l.addEventListener('release', () => {
            if (!cancelled) setStatus('released');
          });
        })
        .catch(() => setStatus('denied'));
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && (!lock || lock.released)) request();
    };
    request();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      lock?.release().catch(() => {});
      setStatus('off');
    };
  }, [active]);
  return status;
}
