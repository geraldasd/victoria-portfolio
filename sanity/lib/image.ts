import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from './client'

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

/**
 * Custom loader for next/image — offloads resizing & format negotiation to Sanity CDN.
 * `auto=format` serves WebP to Chrome/Edge, AVIF where supported, and falls back to
 * the original format for older browsers. This bypasses Vercel's Image Optimization
 * quota entirely (the browser fetches directly from cdn.sanity.io).
 */
export function sanityImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  const url = new URL(src)
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  url.searchParams.set('auto', 'format')
  return url.toString()
}

/**
 * Extract width × height from a Sanity image asset _ref.
 * Ref format: image-{id}-{width}x{height}-{format}
 */
export function getImageDimensions(ref: string): { width: number; height: number; aspectRatio: number } {
  const match = ref.match(/-(\d+)x(\d+)/)
  if (!match) return { width: 1200, height: 800, aspectRatio: 1.5 }
  const w = parseInt(match[1], 10)
  const h = parseInt(match[2], 10)
  return { width: w, height: h, aspectRatio: w / h }
}
