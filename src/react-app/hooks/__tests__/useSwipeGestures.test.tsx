import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeGestures } from '../useSwipeGestures';
import { RefObject } from 'react';

describe('useSwipeGestures', () => {
  let containerRef: RefObject<HTMLDivElement>;
  let mockContainer: HTMLDivElement;
  let onSwipeLeft: ReturnType<typeof vi.fn>;
  let onSwipeRight: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    containerRef = { current: mockContainer };
    onSwipeLeft = vi.fn();
    onSwipeRight = vi.fn();
  });

  it('returns initial swipe state', () => {
    const { result } = renderHook(() =>
      useSwipeGestures(containerRef, onSwipeLeft, onSwipeRight)
    );

    expect(result.current.isSwiping).toBe(false);
    expect(result.current.swipeOffset).toBe(0);
  });

  it('detects swipe left and calls callback', () => {
    renderHook(() =>
      useSwipeGestures(containerRef, onSwipeLeft, onSwipeRight)
    );

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 200, clientY: 100 } as Touch],
      });
      mockContainer.dispatchEvent(touchStart);
    });

    act(() => {
      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 100, clientY: 100 } as Touch],
      });
      mockContainer.dispatchEvent(touchMove);
    });

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [],
      });
      mockContainer.dispatchEvent(touchEnd);
    });

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('detects swipe right and calls callback', () => {
    renderHook(() =>
      useSwipeGestures(containerRef, onSwipeLeft, onSwipeRight)
    );

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch],
      });
      mockContainer.dispatchEvent(touchStart);
    });

    act(() => {
      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 200, clientY: 100 } as Touch],
      });
      mockContainer.dispatchEvent(touchMove);
    });

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [],
      });
      mockContainer.dispatchEvent(touchEnd);
    });

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('does not trigger callback for insufficient swipe distance', async () => {
    renderHook(() =>
      useSwipeGestures(containerRef, onSwipeLeft, onSwipeRight)
    );

    act(() => {
      mockContainer.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ clientX: 100, clientY: 100 } as Touch],
        })
      );
    });

    // Add delay to ensure low velocity (20px over 100ms = 0.2px/ms < 0.5 threshold)
    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      mockContainer.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [{ clientX: 120, clientY: 100 } as Touch],
        })
      );
    });

    act(() => {
      mockContainer.dispatchEvent(
        new TouchEvent('touchend', { changedTouches: [] })
      );
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('ignores vertical swipes', () => {
    renderHook(() =>
      useSwipeGestures(containerRef, onSwipeLeft, onSwipeRight)
    );

    act(() => {
      mockContainer.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ clientX: 100, clientY: 100 } as Touch],
        })
      );
    });

    act(() => {
      mockContainer.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [{ clientX: 110, clientY: 200 } as Touch],
        })
      );
    });

    act(() => {
      mockContainer.dispatchEvent(
        new TouchEvent('touchend', { changedTouches: [] })
      );
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
