import { useState, useEffect } from 'react';

/**
 * useMobileKeyboard — Detects soft keyboard visibility and height adjustments
 * using visualViewport API for iOS Safari and Android Chrome.
 */
export const useMobileKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const viewportHeight = viewport.height;
      const diff = windowHeight - viewportHeight;

      // If viewport shrunk by more than 150px, keyboard is open
      if (diff > 150) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(diff);
      } else {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};

export default useMobileKeyboard;
