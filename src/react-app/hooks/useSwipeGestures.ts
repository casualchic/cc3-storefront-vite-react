import { useState, useEffect, useRef, RefObject } from 'react';

export interface SwipeState {
  isSwiping: boolean;
  swipeOffset: number;
}

const SWIPE_THRESHOLD = 50; // Minimum distance in pixels
const VELOCITY_THRESHOLD = 0.5; // Minimum velocity in pixels/ms
const VERTICAL_THRESHOLD = 30; // Maximum vertical angle in degrees

/**
 * Custom hook for mobile swipe gesture detection
 * Supports horizontal swipe left/right with visual feedback
 */
export function useSwipeGestures(
  containerRef: RefObject<HTMLElement>,
  onSwipeLeft: () => void,
  onSwipeRight: () => void
): SwipeState {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    swipeOffset: 0,
  });

  const callbacksRef = useRef({ onSwipeLeft, onSwipeRight });
  callbacksRef.current = { onSwipeLeft, onSwipeRight };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let startTime = 0;
    let isTracking = false;
    let isVertical = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      startTime = Date.now();
      isTracking = true;
      isVertical = false;

      setSwipeState({
        isSwiping: true,
        swipeOffset: 0,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTracking) return;

      currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Calculate angle to determine if this is a horizontal swipe
      const angle = Math.abs(Math.atan2(deltaY, deltaX) * (180 / Math.PI));

      // If swipe is too vertical, mark and ignore
      if (angle > VERTICAL_THRESHOLD && angle < (180 - VERTICAL_THRESHOLD)) {
        isVertical = true;
        return;
      }

      // Prevent page scroll during horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }

      setSwipeState({
        isSwiping: true,
        swipeOffset: deltaX,
      });
    };

    const handleTouchEnd = () => {
      if (!isTracking) return;

      const deltaX = currentX - startX;
      const deltaTime = Date.now() - startTime;
      const velocity = deltaTime > 0 ? Math.abs(deltaX) / deltaTime : 0;

      // Determine if swipe was sufficient (and not vertical)
      const isSignificantSwipe =
        !isVertical &&
        (Math.abs(deltaX) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD);

      if (isSignificantSwipe) {
        if (deltaX < 0) {
          callbacksRef.current.onSwipeLeft();
        } else {
          callbacksRef.current.onSwipeRight();
        }
      }

      // Reset state
      setSwipeState({
        isSwiping: false,
        swipeOffset: 0,
      });

      startX = 0;
      startY = 0;
      currentX = 0;
      startTime = 0;
      isTracking = false;
      isVertical = false;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerRef]);

  return swipeState;
}
