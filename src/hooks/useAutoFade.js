import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hide test chrome after a period of inactivity. Activity (mouse, touch, keys) shows it again.
 * `paused` keeps it visible (e.g. while the panel has focus or the pointer is over it).
 */
export const useAutoFade = (timeout = 4000, paused = false) => {
  const [isVisible, setIsVisible] = useState(true);
  const timer = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const show = useCallback(() => {
    setIsVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!pausedRef.current) setIsVisible(false);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    show();
    const events = ['mousemove', 'pointerdown', 'keydown', 'touchstart', 'wheel'];
    events.forEach((e) => document.addEventListener(e, show, { passive: true }));
    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => document.removeEventListener(e, show));
    };
  }, [show]);

  useEffect(() => {
    if (paused) {
      clearTimeout(timer.current);
      setIsVisible(true);
    } else {
      show();
    }
  }, [paused, show]);

  return { isVisible, show };
};

export default useAutoFade;
