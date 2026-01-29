export interface OptimizeImageOptions {
  width?: number;
  format?: string;
  quality?: number;
}

const DEFAULT_WIDTHS = [320, 640, 960, 1280, 1920];

export function optimizeImageUrl(url: string, options?: OptimizeImageOptions): string {
  if (!url) return url;
  if (!options) return url;

  const params = new URLSearchParams();
  if (options.width != null) params.set('w', String(options.width));
  if (options.format != null) params.set('fm', options.format);
  if (options.quality != null) params.set('q', String(options.quality));

  if (params.size === 0) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

export function generateSrcSet(url: string, format?: string): string {
  if (!url) return '';

  return DEFAULT_WIDTHS.map((w) => {
    const optimized = optimizeImageUrl(url, { width: w, format });
    return `${optimized} ${w}w`;
  }).join(', ');
}

export function formatDurationToISO8601(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  if (s === 0) return 'PT0S';

  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (hours > 0 || minutes > 0) result += `${minutes}M`;
  result += `${secs}S`;

  return result;
}

export function formatDurationDisplay(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  const paddedSecs = String(secs).padStart(2, '0');

  if (hours > 0) {
    const paddedMins = String(minutes).padStart(2, '0');
    return `${hours}:${paddedMins}:${paddedSecs}`;
  }

  return `${minutes}:${paddedSecs}`;
}
