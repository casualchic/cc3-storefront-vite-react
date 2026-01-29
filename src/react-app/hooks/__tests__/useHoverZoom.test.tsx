import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHoverZoom } from '../useHoverZoom';
import { RefObject } from 'react';

describe('useHoverZoom', () => {
  let imageRef: RefObject<HTMLImageElement>;
  let mockImage: HTMLImageElement;

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(hover: hover)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    mockImage = document.createElement('img');
    mockImage.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      width: 400,
      height: 500,
      right: 500,
      bottom: 600,
      x: 100,
      y: 100,
      toJSON: () => {},
    }));
    document.body.appendChild(mockImage);
    imageRef = { current: mockImage };
  });

  it('returns initial state when not hovering', () => {
    const { result } = renderHook(() => useHoverZoom(imageRef, true, 2));
    expect(result.current.isZooming).toBe(false);
    expect(result.current.zoomStyle).toEqual({});
  });

  it('does not activate when disabled', () => {
    const { result } = renderHook(() => useHoverZoom(imageRef, false, 2));

    act(() => {
      const event = new MouseEvent('mouseenter');
      mockImage.dispatchEvent(event);
    });

    expect(result.current.isZooming).toBe(false);
  });

  it('activates on mouse enter', () => {
    const { result } = renderHook(() => useHoverZoom(imageRef, true, 2));

    act(() => {
      const event = new MouseEvent('mouseenter');
      mockImage.dispatchEvent(event);
    });

    expect(result.current.isZooming).toBe(true);
  });

  it('deactivates on mouse leave', () => {
    const { result } = renderHook(() => useHoverZoom(imageRef, true, 2));

    act(() => {
      mockImage.dispatchEvent(new MouseEvent('mouseenter'));
    });

    act(() => {
      mockImage.dispatchEvent(new MouseEvent('mouseleave'));
    });

    expect(result.current.isZooming).toBe(false);
  });

  it('calculates zoom position on mouse move', () => {
    const { result } = renderHook(() => useHoverZoom(imageRef, true, 2));

    act(() => {
      mockImage.dispatchEvent(new MouseEvent('mouseenter'));
    });

    act(() => {
      const event = new MouseEvent('mousemove', {
        clientX: 300, // Center of image (100 + 400/2)
        clientY: 350, // Center of image (100 + 500/2)
      });
      mockImage.dispatchEvent(event);
    });

    expect(result.current.zoomStyle).toHaveProperty('transform');
    expect(result.current.zoomStyle).toHaveProperty('transformOrigin');
    expect(result.current.zoomStyle.transform).toBe('scale(2)');
  });

  it('respects custom zoom scale', () => {
    const { result } = renderHook(() => useHoverZoom(imageRef, true, 3));

    act(() => {
      mockImage.dispatchEvent(new MouseEvent('mouseenter'));
      const event = new MouseEvent('mousemove', { clientX: 300, clientY: 350 });
      mockImage.dispatchEvent(event);
    });

    expect(result.current.zoomStyle.transform).toBe('scale(3)');
  });
});
