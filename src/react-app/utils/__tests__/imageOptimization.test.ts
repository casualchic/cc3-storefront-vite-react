import { describe, it, expect } from 'vitest';
import {
  optimizeImageUrl,
  generateSrcSet,
  formatDurationToISO8601,
  formatDurationDisplay,
} from '../imageOptimization';

describe('optimizeImageUrl', () => {
  it('returns the original URL when no options are provided', () => {
    const url = 'https://cdn.example.com/image.jpg';
    expect(optimizeImageUrl(url)).toBe(url);
  });

  it('adds width parameter', () => {
    const result = optimizeImageUrl('https://cdn.example.com/image.jpg', { width: 800 });
    expect(result).toBe('https://cdn.example.com/image.jpg?w=800');
  });

  it('adds format parameter', () => {
    const result = optimizeImageUrl('https://cdn.example.com/image.jpg', { format: 'webp' });
    expect(result).toBe('https://cdn.example.com/image.jpg?fm=webp');
  });

  it('adds quality parameter', () => {
    const result = optimizeImageUrl('https://cdn.example.com/image.jpg', { quality: 75 });
    expect(result).toBe('https://cdn.example.com/image.jpg?q=75');
  });

  it('combines multiple options', () => {
    const result = optimizeImageUrl('https://cdn.example.com/image.jpg', {
      width: 800,
      format: 'webp',
      quality: 75,
    });
    expect(result).toBe('https://cdn.example.com/image.jpg?w=800&fm=webp&q=75');
  });

  it('preserves existing query parameters', () => {
    const result = optimizeImageUrl('https://cdn.example.com/image.jpg?v=123', { width: 800 });
    expect(result).toBe('https://cdn.example.com/image.jpg?v=123&w=800');
  });

  it('returns the original string for non-URL strings', () => {
    expect(optimizeImageUrl('')).toBe('');
  });
});

describe('generateSrcSet', () => {
  it('generates srcset with default widths', () => {
    const result = generateSrcSet('https://cdn.example.com/image.jpg');
    expect(result).toContain('https://cdn.example.com/image.jpg?w=320 320w');
    expect(result).toContain('https://cdn.example.com/image.jpg?w=640 640w');
    expect(result).toContain('https://cdn.example.com/image.jpg?w=960 960w');
    expect(result).toContain('https://cdn.example.com/image.jpg?w=1280 1280w');
    expect(result).toContain('https://cdn.example.com/image.jpg?w=1920 1920w');
  });

  it('includes format when specified', () => {
    const result = generateSrcSet('https://cdn.example.com/image.jpg', 'webp');
    expect(result).toContain('w=320&fm=webp 320w');
    expect(result).toContain('w=1920&fm=webp 1920w');
  });

  it('returns an empty string for an empty URL', () => {
    expect(generateSrcSet('')).toBe('');
  });
});

describe('formatDurationToISO8601', () => {
  it('formats seconds only', () => {
    expect(formatDurationToISO8601(45)).toBe('PT45S');
  });

  it('formats minutes and seconds', () => {
    expect(formatDurationToISO8601(90)).toBe('PT1M30S');
  });

  it('formats hours, minutes and seconds', () => {
    expect(formatDurationToISO8601(3661)).toBe('PT1H1M1S');
  });

  it('formats exact minutes with no seconds', () => {
    expect(formatDurationToISO8601(120)).toBe('PT2M0S');
  });

  it('returns PT0S for zero', () => {
    expect(formatDurationToISO8601(0)).toBe('PT0S');
  });

  it('handles negative values as zero', () => {
    expect(formatDurationToISO8601(-5)).toBe('PT0S');
  });
});

describe('formatDurationDisplay', () => {
  it('formats seconds only', () => {
    expect(formatDurationDisplay(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatDurationDisplay(90)).toBe('1:30');
  });

  it('pads seconds with leading zero', () => {
    expect(formatDurationDisplay(61)).toBe('1:01');
  });

  it('formats hours', () => {
    expect(formatDurationDisplay(3661)).toBe('1:01:01');
  });

  it('returns 0:00 for zero', () => {
    expect(formatDurationDisplay(0)).toBe('0:00');
  });

  it('handles negative values as zero', () => {
    expect(formatDurationDisplay(-5)).toBe('0:00');
  });
});
