# ProductImageGallery Enhancement Design

**Date:** 2026-01-29
**Issue:** CCB-1088
**Status:** Approved

## Overview

Enhance the existing ProductImageGallery component with advanced zoom capabilities, touch gestures, video support, and image optimization. This design follows Baymard Institute e-commerce UX best practices and prioritizes Core Web Vitals performance.

## Current State

The ProductImageGallery component (implemented in CCB-1087) provides:
- Thumbnail navigation with click selection
- Fullscreen lightbox modal
- Basic image counter and navigation arrows
- Support for multiple images

## Missing Features

1. Desktop hover zoom (magnifier lens)
2. Mobile pinch-to-zoom
3. Mobile swipe navigation
4. Video support in gallery
5. Image optimization (WebP, srcset, lazy loading)
6. Interactive pan/zoom in lightbox

## Design Approach

### 1. Component Architecture

**Enhancement Strategy:** Progressive enhancement of existing component to minimize breaking changes.

**New Dependencies:**
- `react-zoom-pan-pinch` (~15KB) - For lightbox pan/zoom functionality

**Props Interface Extension:**
```typescript
interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  poster?: string; // Video poster image
  duration?: number; // Video duration in seconds
  videoConfig?: {
    autoplay?: boolean; // Default false
    muted?: boolean; // Default true
    loop?: boolean; // Default false
    controls?: boolean; // Default true
  };
  schema?: VideoObjectSchema; // SEO metadata
}

interface ProductImageGalleryProps {
  media: MediaItem[]; // Replaces images: string[]
  productName: string;
  enableHoverZoom?: boolean; // Default true
  enableSwipe?: boolean; // Default true
  zoomScale?: number; // Default 2
}
```

**Backward Compatibility:**
- Accept legacy `images: string[]` prop, convert to MediaItem[] internally
- All new features are opt-in or gracefully degrade

**Code Organization:**
- `useHoverZoom` - Custom hook for desktop magnifier
- `useSwipeGestures` - Custom hook for mobile touch gestures
- `MediaItem` - Sub-component handling image vs video rendering
- `ZoomLightbox` - Enhanced lightbox with pan/zoom controls

### 2. Desktop Hover Zoom

**Behavior:**
- Activates on mouse enter (desktop only, detected via `(hover: hover)` media query)
- Shows 2x magnified view centered on cursor
- Smooth cursor tracking using RequestAnimationFrame
- Cursor changes to zoom-in icon
- Hidden on mouse leave or click (which opens lightbox)

**Implementation:**

```typescript
function useHoverZoom(
  imageRef: RefObject<HTMLImageElement>,
  isEnabled: boolean,
  scale: number = 2
) {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    if (!isEnabled || !imageRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomStyle({
        transform: `scale(${scale})`,
        transformOrigin: `${x}% ${y}%`,
      });
    };

    // Event listeners with RAF throttling
    // Mouse enter/leave handlers
  }, [isEnabled, scale]);

  return { isZooming, zoomStyle };
}
```

**Visual Design:**
- Overlay hint: "Click to open fullscreen" (fades after 1s)
- Smooth CSS transitions (150ms)
- GPU acceleration via `will-change: transform`

**Performance:**
- Debounce mouse events to 16ms (60fps)
- Load high-res image separately for zoom (progressive enhancement)
- Disable on touch devices (no hover capability)

**Accessibility:**
- Screen reader: "Image zoom available, click to view fullscreen"
- Keyboard users bypass hover, use Enter to open lightbox
- Respects `prefers-reduced-motion`

### 3. Mobile Swipe Navigation

**Behavior:**
- Horizontal swipe left/right changes images
- Minimum 50px distance OR velocity > 0.5px/ms triggers navigation
- Visual feedback: image follows finger during swipe
- Bounces back if swipe canceled
- Edge resistance at first/last image

**Implementation:**

```typescript
function useSwipeGestures(
  containerRef: RefObject<HTMLDivElement>,
  onSwipeLeft: () => void,
  onSwipeRight: () => void
) {
  const [swipeState, setSwipeState] = useState({
    startX: 0,
    currentX: 0,
    isSwiping: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      setSwipeState({
        startX: e.touches[0].clientX,
        currentX: e.touches[0].clientX,
        isSwiping: true,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipeState.isSwiping) return;
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - swipeState.startX;

      // Calculate angle to filter vertical scrolls
      // Apply transform for visual feedback
      // Prevent page scroll if horizontal intent
    };

    const handleTouchEnd = () => {
      // Calculate final delta and velocity
      // Trigger navigation if threshold met
      // Reset state
    };

    // Add event listeners with proper cleanup
  }, [onSwipeLeft, onSwipeRight]);

  return swipeState;
}
```

**Visual Feedback:**
- Image translates with finger: `transform: translateX(${offset}px)`
- Edge fade indicators showing more images available
- Spring animation on release (300ms ease-out)
- Dampened movement at boundaries

**Edge Cases:**
- Disable vertical scroll during horizontal swipe
- Ignore swipes with vertical component >30°
- Single image: disable swipe
- Use `touch-action: pan-y` to allow page scroll

**Performance:**
- Passive event listeners where possible
- Cancel animation frames on unmount
- Smooth 60fps tracking

### 4. Enhanced Lightbox with Pan/Zoom

**Upgrade existing lightbox with react-zoom-pan-pinch library.**

**Behavior:**
- Desktop: Mouse wheel to zoom, click-drag to pan
- Mobile: Pinch to zoom, drag to pan
- Double-tap/click toggles 2x zoom
- Reset button returns to fit-view
- Zoom state resets when changing images

**Implementation:**

```typescript
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

function ZoomLightbox({ media, currentIndex, onClose, onNavigate }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        doubleClick={{ mode: 'toggle', step: 2 }}
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, state }) => (
          <>
            <TransformComponent>
              {media[currentIndex].type === 'image' ? (
                <img src={media[currentIndex].url} alt={alt} />
              ) : (
                <video src={media[currentIndex].url} controls />
              )}
            </TransformComponent>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button onClick={zoomIn}>+</button>
              <button onClick={zoomOut}>-</button>
              {state.scale > 1 && (
                <button onClick={resetTransform}>Reset</button>
              )}
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
```

**Controls:**
- Zoom in/out buttons (bottom right)
- Reset zoom button (when zoomed)
- Image counter (bottom center)
- Close button (top right)
- Navigation arrows (disabled while zoomed)
- Keyboard: Escape (close), Arrows (navigate), +/- (zoom)

**UX Details:**
- Disable navigation while zoomed (prevents confusion)
- Reset zoom on image change
- Loading spinner during image load
- Smooth zoom transitions (200ms)

**Video in Lightbox:**
- Opens at fit-to-screen size
- No zoom controls (just video controls)
- Standard HTML5 video with custom styling

### 5. Video Support

**Data Structure:**
```typescript
interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; // Required for videos
  poster?: string;
  duration?: number;
  videoConfig?: {
    autoplay?: boolean; // Default false
    muted?: boolean; // Default true
    loop?: boolean; // Default false
    controls?: boolean; // Default true
  };
  schema?: {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": string,
    "description": string,
    "thumbnailUrl": string,
    "uploadDate": string,
    "duration": string, // ISO 8601 format
    "contentUrl": string
  };
}
```

**Thumbnail Display:**
- Show poster/thumbnail in gallery grid
- Play icon overlay (▶ in semi-transparent circle)
- Duration badge (bottom-right, e.g., "1:24")
- Hover: play icon scales up

**Video Playback:**
- Click thumbnail opens lightbox with video player
- Use `preload="metadata"` (gets duration without full download)
- Lazy load: only fetch video when clicked
- Mobile: native video controls
- Desktop: custom styled controls

**Performance Strategy:**
```html
<video
  preload="metadata"
  poster={posterUrl}
  controls={config.controls}
  muted={config.muted}
  onLoadStart={() => trackMetric('video_load')}
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

**SEO Implementation:**
```typescript
// Render VideoObject schema for each video
function VideoSchema({ media }: { media: MediaItem }) {
  if (media.type !== 'video' || !media.schema) return null;

  return (
    <script type="application/ld+json">
      {JSON.stringify(media.schema)}
    </script>
  );
}
```

**Accessibility:**
- Button aria-label: "Play video: {description}"
- Duration announced to screen readers
- Keyboard accessible controls
- Caption support (when available)

**Future Iterations:**
- YouTube/Vimeo embed support
- Social media video integration
- Video download/caching from social sources

### 6. Image Optimization

**WebP with Fallback:**
```typescript
function OptimizedImage({ src, alt, sizes, loading, ...props }) {
  return (
    <picture>
      <source
        srcSet={generateSrcSet(src, 'webp')}
        type="image/webp"
        sizes={sizes}
      />
      <source
        srcSet={generateSrcSet(src, 'jpg')}
        type="image/jpeg"
        sizes={sizes}
      />
      <img src={src} alt={alt} loading={loading} {...props} />
    </picture>
  );
}
```

**Responsive srcset:**
```typescript
function generateSrcSet(url: string, format: 'webp' | 'jpg' | 'png') {
  const sizes = [400, 600, 800, 1200, 1600];
  return sizes
    .map(w => `${optimizeImageUrl(url, { width: w, format })} ${w}w`)
    .join(', ');
}

function optimizeImageUrl(url: string, options: {
  width?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
}) {
  // Support Cloudflare Images, Imgix, Cloudinary
  // Add query params: ?w={width}&fm={format}&q={quality}
  // Fallback for custom CDNs
}
```

**Loading Strategy:**
- Main image: `loading="eager"` (LCP candidate)
- Thumbnails: `loading="lazy"`
- High-res zoom images: Load on hover/zoom activation
- Videos: `preload="metadata"` only

**Lazy Loading Implementation:**
```typescript
function useLazyLoad(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadMedia(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' } // Preload 50px before visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);
}
```

**Core Web Vitals Protection:**
- **LCP:** First image loads immediately with `fetchpriority="high"`
- **CLS:** Reserve space with `aspect-ratio: 4/5` CSS
- **FID:** Defer zoom library loading until interaction
- Size hints: Always specify width/height attributes

**Image Sizes Attribute:**
```typescript
// Main gallery image
sizes="(min-width: 1024px) 600px, 100vw"

// Thumbnails
sizes="80px"

// Lightbox
sizes="100vw"
```

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Hover Zoom:**
- ✓ Activates on mouse enter (desktop only)
- ✓ Updates position on mouse move
- ✓ Deactivates on mouse leave
- ✓ Respects enableHoverZoom prop
- ✓ No zoom on touch devices

**Swipe Gestures:**
- ✓ Swipe left navigates next
- ✓ Swipe right navigates previous
- ✓ Insufficient distance cancels
- ✓ Vertical swipes ignored
- ✓ Boundary wrapping works

**Video Support:**
- ✓ Play icon renders on video thumbnails
- ✓ Click opens video in lightbox
- ✓ Duration displays correctly
- ✓ VideoObject schema renders
- ✓ Mixed image/video galleries work

**Image Optimization:**
- ✓ WebP sources with fallback
- ✓ srcset generates correctly
- ✓ Lazy loading on thumbnails
- ✓ Eager loading on main image
- ✓ Picture element structure

**Lightbox Pan/Zoom:**
- ✓ TransformWrapper initializes
- ✓ Zoom controls work
- ✓ Reset appears when zoomed
- ✓ Navigation disabled while zoomed
- ✓ Zoom resets on image change

### Integration Tests

- Full desktop flow: hover zoom → lightbox → pan/zoom → navigate
- Full mobile flow: swipe → tap zoom → pinch zoom
- Mixed media: navigate between images and videos
- Keyboard navigation throughout

### Accessibility Tests

- ✓ Keyboard navigation works
- ✓ Screen reader announcements
- ✓ ARIA labels present
- ✓ Focus management
- ✓ Reduced motion support

### Performance Tests

- ✓ No layout shift (CLS = 0)
- ✓ Images don't block main thread
- ✓ 60fps animations
- ✓ Video doesn't impact page load

## Migration Strategy

**Backward Compatibility:**
```typescript
// Support legacy images prop
function ProductImageGallery(props: ProductImageGalleryProps) {
  const media = useMemo(() => {
    if ('media' in props) return props.media;
    if ('images' in props) {
      return props.images.map(url => ({
        type: 'image' as const,
        url,
      }));
    }
    return [];
  }, [props]);

  // Rest of component...
}
```

**Gradual Rollout:**
1. Deploy with feature flags
2. A/B test hover zoom vs click-only
3. Monitor Core Web Vitals
4. Collect user feedback
5. Enable for all users

## Future Enhancements (Follow-on Issues)

1. **Hero Video Support** - Autoplay videos for above-fold hero sections with LCP optimization
2. **Shoppable Video Carousels** - Interactive product tagging in videos
3. **AI Agent/Live Shopping Feeds** - Real-time video streaming integration
4. **Social Media Video Integration** - YouTube/Vimeo/Instagram embed support
5. **360° Product View** - Interactive spin viewer for products
6. **AR Try-On** - Augmented reality preview integration

## Performance Expectations

**Before Enhancement:**
- LCP: ~2.5s (single image, no optimization)
- CLS: 0.05 (minor shift on thumbnail load)
- FID: <100ms

**After Enhancement:**
- LCP: ~1.8s (WebP + srcset + eager loading)
- CLS: 0 (reserved space + dimensions)
- FID: <100ms (deferred zoom library)

**Bundle Size Impact:**
- react-zoom-pan-pinch: +15KB gzipped
- Custom hooks: +3KB gzipped
- Total increase: ~18KB (acceptable for feature set)

## Implementation Plan

See `IMPLEMENTATION_PLAN.md` for detailed step-by-step execution plan.
