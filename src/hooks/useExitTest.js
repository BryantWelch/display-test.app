import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInfoRouteFromTestPath } from '../registry';

/**
 * Exit a fullscreen test back to its info page (or to the checkup when launched from it).
 * Leaving browser fullscreen (Esc / F11) also exits.
 */
export function useExitTest(onBeforeExit) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const fromCheckup = new URLSearchParams(search).has('checkup');
  const exitPath = fromCheckup ? '/checkup' : getInfoRouteFromTestPath(pathname);
  const exiting = useRef(false);
  const beforeExit = useRef(onBeforeExit);
  beforeExit.current = onBeforeExit;

  const goBack = useCallback(
    (to = exitPath) => {
      if (exiting.current) return;
      exiting.current = true;
      beforeExit.current?.();
      navigate(to);
    },
    [navigate, exitPath]
  );

  const handleExit = useCallback(
    async (to) => {
      const target = typeof to === 'string' ? to : exitPath;
      if (document.fullscreenElement) {
        try {
          exiting.current = true;
          await document.exitFullscreen();
        } catch {
          // ignore
        }
        exiting.current = false;
      }
      goBack(target);
    },
    [goBack, exitPath]
  );

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && !exiting.current) goBack();
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [goBack]);

  return handleExit;
}
