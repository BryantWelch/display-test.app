import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInfoRouteFromTestPath } from '../utils/testRoutes';

/**
 * Exit fullscreen tests back to the matching info/guide page.
 * @param {() => void} [onBeforeExit] - optional cleanup (animation, timers)
 */
export function useExitTest(onBeforeExit) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const exitPath = getInfoRouteFromTestPath(pathname);

  const handleExit = useCallback(async () => {
    onBeforeExit?.();

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        requestAnimationFrame(() => {
          navigate(exitPath);
        });
      } catch (err) {
        console.log(`Error exiting fullscreen: ${err.message}`);
        navigate(exitPath);
      }
    } else {
      navigate(exitPath);
    }
  }, [navigate, exitPath, onBeforeExit]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        onBeforeExit?.();
        navigate(exitPath);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [navigate, exitPath, onBeforeExit]);

  return handleExit;
}
