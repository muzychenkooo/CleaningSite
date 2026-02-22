/**
 * Prepends NEXT_PUBLIC_BASE_PATH to a public asset path.
 *
 * Next.js <Image> handles basePath automatically.
 * Plain <video src>, <audio src>, CSS url(), and poster attributes do NOT —
 * they need this helper to work correctly on GitHub Pages (/CleaningSite/…).
 *
 * Usage:
 *   <video src={assetUrl('/assets/videos/video1.mp4')} />
 *   poster={assetUrl('/assets/gallery/poster.jpg')}
 */
export function assetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return `${base}${path}`;
}
