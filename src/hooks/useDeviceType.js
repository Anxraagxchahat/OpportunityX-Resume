import { useState, useEffect } from 'react';

/**
 * useDeviceType — Single source of truth for responsive presentation layer selection.
 * Breakpoint contract:
 *   mobile: < 768px
 *   tablet: 768px – 1023px
 *   desktop: >= 1024px
 */
export const useDeviceType = () => {
  const getDeviceState = () => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        orientation: 'landscape',
        width: 1280
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = height > width ? 'portrait' : 'landscape';

    if (width < 768) {
      return {
        deviceType: 'mobile',
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        orientation,
        width
      };
    }

    if (width >= 768 && width < 1024) {
      return {
        deviceType: 'tablet',
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        orientation,
        width
      };
    }

    return {
      deviceType: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      orientation,
      width
    };
  };

  const [deviceState, setDeviceState] = useState(getDeviceState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newState = getDeviceState();
      setDeviceState((prev) => {
        if (
          prev.deviceType === newState.deviceType &&
          prev.orientation === newState.orientation &&
          prev.width === newState.width
        ) {
          return prev;
        }
        return newState;
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceState;
};

export default useDeviceType;
