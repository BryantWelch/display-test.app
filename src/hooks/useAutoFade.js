import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to handle auto-fade functionality for UI elements
 * @param {number} normalTimeout - Timeout in ms when control panel is not minimized (default: 5000)
 * @param {number} minimizedTimeout - Timeout in ms when control panel is minimized (default: 2000)
 * @param {boolean} isMinimized - Whether the control panel is minimized
 * @returns {object} - { isVisible, resetTimer, handleMouseMove, handleKeyPress, handleClick }
 */
export const useAutoFade = (normalTimeout = 5000, minimizedTimeout = 2000, isMinimized = false) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Get the appropriate timeout based on minimized state
  const getTimeout = useCallback(() => {
    return isMinimized ? minimizedTimeout : normalTimeout;
  }, [isMinimized, minimizedTimeout, normalTimeout]);

  // Reset the fade timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show the elements immediately
    setIsVisible(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, getTimeout());
  }, [getTimeout]);

  // Handle mouse movement
  const handleMouseMove = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Handle key press
  const handleKeyPress = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Handle click events
  const handleClick = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Handle touch events for mobile
  const handleTouch = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Initialize timer and event listeners
  useEffect(() => {
    resetTimer();

    // Add event listeners for user activity
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchmove', handleTouch);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('touchmove', handleTouch);
    };
  }, [handleMouseMove, handleKeyPress, handleClick, handleScroll, handleTouch, resetTimer]);

  // Reset timer when minimized state changes
  useEffect(() => {
    resetTimer();
  }, [isMinimized, resetTimer]);

  return {
    isVisible,
    resetTimer,
    handleMouseMove,
    handleKeyPress,
    handleClick,
    handleScroll,
    handleTouch
  };
};

export default useAutoFade;