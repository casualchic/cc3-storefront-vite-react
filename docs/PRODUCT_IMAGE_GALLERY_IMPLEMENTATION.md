# ProductImageGallery Implementation Documentation

**Component:** ProductImageGallery
**Issue:** CCB-1088
**Implementation Date:** 2026-01-29

## Overview

The ProductImageGallery component provides a best-in-class image and video viewing experience for e-commerce product pages. It combines desktop hover zoom, mobile touch gestures, interactive lightbox zoom, video support, and performance optimization.

## Features Implemented

### 1. Desktop Hover Zoom
- Magnifier lens follows mouse cursor
- 2x zoom by default (configurable)
- GPU-accelerated with RequestAnimationFrame
- Desktop-only (detected via hover media query)
- Hint overlay guides users to fullscreen

### 2. Mobile Swipe Navigation
- Horizontal swipe to navigate images
- Visual feedback (image follows finger)
- Velocity-based detection
- Edge resistance at boundaries
- Prevents vertical scroll conflicts

### 3. Enhanced Lightbox
- Pan and pinch zoom with react-zoom-pan-pinch
- Desktop: wheel zoom, drag pan
- Mobile: pinch zoom, drag pan
- Double-tap/click toggles 2x zoom
- Reset button when zoomed
- Navigation locked during zoom

### 4. Video Support
- Mixed image/video galleries
- Play icon overlay on video thumbnails
- Duration badges
- HTML5 video player in lightbox
- VideoObject schema for SEO
- Lazy loading with preload="metadata"

### 5. Image Optimization
- WebP format with JPEG fallback
- Responsive srcset (400w to 1600w)
- Eager loading for main image (LCP)
- Lazy loading for thumbnails
- CDN query parameter optimization

## Architecture

### Component Structure
```
ProductImageGallery/
├── ProductImageGallery.tsx (main component)
├── hooks/
│   ├── useHoverZoom.ts
│   └── useSwipeGestures.ts
├── components/
│   ├── OptimizedImage.tsx
│   └── VideoSchema.tsx
├── types/
│   └── media.ts
└── utils/
    └── imageOptimization.ts
```text

### Data Flow
1. Props accepted (legacy `images[]` or new `media[]`)
2. Internal conversion to MediaItem[]
3. Hooks manage interaction state
4. Components render optimized media
5. Lightbox handles zoom interactions

## Usage Examples

### Basic Usage (Legacy)
```typescript
<ProductImageGallery
  images={[
    'https://example.com/product1.jpg',
    'https://example.com/product2.jpg',
  ]}
  productName="Amazing Product"
/>
```

### Advanced Usage (Mixed Media)
```typescript
const media: MediaItem[] = [
  {
    type: 'image',
    url: 'https://example.com/product1.jpg',
    alt: 'Product front view',
  },
  {
    type: 'video',
    url: 'https://example.com/demo.mp4',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    duration: 90,
    poster: 'https://example.com/poster.jpg',
    videoConfig: {
      autoplay: false,
      muted: true,
      controls: true,
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'Product Demo',
      description: 'Amazing Product demonstration',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      uploadDate: '2026-01-29',
      duration: 'PT1M30S',
      contentUrl: 'https://example.com/demo.mp4',
    },
  },
];

<ProductImageGallery
  media={media}
  productName="Amazing Product"
  enableHoverZoom={true}
  enableSwipe={true}
  zoomScale={2}
/>
```

## Props API

```typescript
interface ProductImageGalleryProps {
  // Media items (new)
  media: MediaItem[];

  // Product info
  productName: string;

  // Feature toggles
  enableHoverZoom?: boolean; // Default: false
  enableSwipe?: boolean; // Default: false
  zoomScale?: number; // Default: 2
}

// Legacy support
interface LegacyProductImageGalleryProps {
  images: string[];
  productName: string;
  enableHoverZoom?: boolean;
  enableSwipe?: boolean;
  zoomScale?: number;
}
```

## Performance

### Metrics
- **LCP:** Optimized with eager loading for main image
- **CLS:** 0 (reserved space with aspect-ratio)
- **Bundle Size:** +18KB gzipped (react-zoom-pan-pinch)

### Optimizations Applied
- WebP format with fallback
- Responsive srcset
- Eager loading for LCP
- Lazy loading for below-fold
- GPU acceleration for transforms
- RequestAnimationFrame for smooth tracking
- Passive event listeners
- Debounced mouse events

### Core Web Vitals Protection
- Main image: `loading="eager"` + `fetchpriority="high"`
- Reserved space: `aspect-ratio: 4/5`
- Deferred zoom library loading
- Size hints on all images

## Accessibility

### Features
- Keyboard navigation (arrows, escape, enter)
- Screen reader announcements
- ARIA labels on all controls
- Focus management in lightbox
- Reduced motion support

### Testing
- Keyboard-only navigation verified
- Screen reader compatibility (VoiceOver, NVDA)
- WCAG 2.1 AA compliant

## Browser Support

### Minimum Requirements
- ES6+ support
- Touch Events API (mobile)
- Intersection Observer API
- Picture element
- CSS Grid

### Tested Browsers
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

## Known Limitations

1. **Video Formats:** MP4 only (no YouTube/Vimeo yet)
2. **CDN Support:** Generic query params (may need customization)
3. **Hover Zoom:** Requires high-res images for best quality
4. **Bundle Size:** +18KB for zoom library

## Future Enhancements

See follow-on Linear issues:
- Hero video support with LCP optimization
- Shoppable video carousels
- AI agent/live shopping video feeds
- YouTube/Vimeo embed support
- 360° product view
- AR try-on integration

## Testing

### Unit Tests
- Located in: `__tests__/ProductImageGallery.test.tsx`, `__tests__/useHoverZoom.test.tsx`, `__tests__/useSwipeGestures.test.tsx`, `__tests__/OptimizedImage.test.tsx`
- Total Tests: 34 tests across all components and hooks
- Coverage: Component (17 tests), Hooks (11 tests), Components (6 tests)
- All tests passing

### Manual Testing Checklist
- [x] Desktop hover zoom works smoothly
- [x] Mobile swipe navigation responsive
- [x] Lightbox zoom/pan works on all devices
- [x] Videos play correctly
- [x] Mixed media galleries work
- [x] Keyboard navigation complete
- [x] Screen reader announces correctly
- [x] No layout shifts on load
- [x] WebP loads with fallback
- [x] Thumbnails lazy load

## Troubleshooting

### Issue: Hover zoom not working
**Solution:** Check device supports hover: `window.matchMedia('(hover: hover)').matches`

### Issue: Swipe conflicts with page scroll
**Solution:** Verify `touch-action: pan-y` on container

### Issue: Images not optimizing
**Solution:** Check CDN supports query params: `?w=800&fm=webp&q=85`

### Issue: Videos not loading
**Solution:** Verify video URLs accessible and CORS configured

## Dependencies

```json
{
  "react-zoom-pan-pinch": "^3.6.1"
}
```

## References

- Design Document: `docs/plans/2026-01-29-product-image-gallery-enhancements-design.md`
- Implementation Plan: `docs/plans/2026-01-29-product-image-gallery-implementation.md`
- Component Requirements: `COMPONENT_REQUIREMENTS.md` (PROD-040 to PROD-045)
- Baymard Institute: E-commerce UX research
- Linear Issue: CCB-1088
