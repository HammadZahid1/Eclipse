import { useCallback, useEffect, useState } from 'react';

/** Wraps the browser Fullscreen API with a small, safe hook. */
export function useFullscreen(target?: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supported =
    typeof document !== 'undefined' &&
    Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enter = useCallback(async () => {
    if (!supported) return;
    const element = target?.current ?? document.documentElement;
    try {
      await element.requestFullscreen();
    } catch {
      // Browsers may reject fullscreen without a user gesture; fail silently.
    }
  }, [supported, target]);

  const exit = useCallback(async () => {
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      // Ignore unsupported or rejected exits.
    }
  }, []);

  const toggle = useCallback(() => {
    if (isFullscreen) void exit();
    else void enter();
  }, [enter, exit, isFullscreen]);

  return { isFullscreen, supported, enter, exit, toggle };
}
