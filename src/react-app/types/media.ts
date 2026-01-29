export interface VideoConfig {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export interface VideoObjectSchema {
  '@context': 'https://schema.org';
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 format (e.g., "PT1M30S")
  contentUrl: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  poster?: string;
  duration?: number; // Duration in seconds
  videoConfig?: VideoConfig;
  schema?: VideoObjectSchema;
}

export interface ProductImageGalleryProps {
  media: MediaItem[];
  productName: string;
  enableHoverZoom?: boolean;
  enableSwipe?: boolean;
  zoomScale?: number;
}

// Legacy support
export interface LegacyProductImageGalleryProps {
  images: string[];
  productName: string;
  enableHoverZoom?: boolean;
  enableSwipe?: boolean;
  zoomScale?: number;
}

export type ProductImageGalleryAllProps =
  | ProductImageGalleryProps
  | LegacyProductImageGalleryProps;
