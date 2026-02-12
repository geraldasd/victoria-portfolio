'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { urlFor, sanityImageLoader } from '@/sanity/lib/image'

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface MediaItem {
  _key: string
  image: { asset: { _ref: string } }
  imageLqip?: string
  imageDimensions?: { width: number; height: number; aspectRatio: number }
  caption?: string
}

interface MediaGalleryProps {
  items: MediaItem[]
  projectName: string
  label: string
  typeLabel: string
  /** Give the first visible gallery `prioritize={true}` for LCP. */
  prioritize?: boolean
}

// ────────────────────────────────────────────────────────────
// Adaptive prefetch depth (navigator.connection API)
// ────────────────────────────────────────────────────────────

interface NetworkInformation extends EventTarget {
  effectiveType?: string
  saveData?: boolean
}

function getPrefetchDepth(): number {
  if (typeof navigator === 'undefined') return 1
  const conn = (navigator as unknown as { connection?: NetworkInformation }).connection
  if (!conn) return 2 // API absent → assume good connection
  if (conn.saveData) return 1 // respect data-saver
  switch (conn.effectiveType) {
    case '4g': return 3 // i-1, i+1, i+2
    case '3g': return 2 // i-1, i+1
    default:   return 1 // i+1 only (forward bias)
  }
}

/** Return de-duped neighbor indices to prefetch around `current`. */
function getNeighborIndices(current: number, total: number, depth: number): number[] {
  if (total <= 1) return []
  const out: number[] = []
  out.push((current + 1) % total)                       // always forward
  if (depth >= 2) out.push((current - 1 + total) % total) // also backward
  if (depth >= 3) out.push((current + 2) % total)         // look-ahead +2
  return [...new Set(out)].filter(i => i !== current)
}

// ────────────────────────────────────────────────────────────
// PrefetchImage — invisible next/image that warms browser cache
// ────────────────────────────────────────────────────────────

function PrefetchImage({
  src,
  width,
  height,
  quality,
  sizes,
  onReady,
}: {
  src: string
  width: number
  height: number
  quality: number
  sizes: string
  onReady: () => void
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Image
        loader={sanityImageLoader}
        src={src}
        width={width}
        height={height}
        quality={quality}
        sizes={sizes}
        alt=""
        loading="lazy"
        onLoad={onReady}
      />
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// MediaGallery — self-contained slider with neighbor preloading
// ────────────────────────────────────────────────────────────

// Keep in sync with .media-gallery-layer { transition } in globals.css
const TRANSITION_MS = 300
const SIZES = '(min-width: 1024px) 50vw, 100vw'
const MIN_SWIPE_PX = 30
const MIN_SWIPE_VEL = 0.3 // px/ms

export default function MediaGallery({
  items,
  projectName,
  label,
  typeLabel,
  prioritize = false,
}: MediaGalleryProps) {
  // ── State ──────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [readySet, setReadySet] = useState<Set<number>>(() => new Set())
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const [prefetchDepth, setPrefetchDepth] = useState(2)

  // ── Crossfade state ────────────────────────────────────────
  // displayedIndex: last fully-loaded & visible image (-1 = none yet)
  // incomingReady:  whether the target image has decoded
  const [displayedIndex, setDisplayedIndex] = useState(-1)
  const [incomingReady, setIncomingReady] = useState(false)

  // Refs for async-safe callbacks
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex
  const promotionTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Touch tracking (local to this gallery, avoids cross-gallery bleed)
  const touchRef = useRef({ x0: 0, x1: 0, t0: 0 })

  // ── Adaptive depth on mount + connection changes ───────────
  useEffect(() => {
    setPrefetchDepth(getPrefetchDepth())
    const conn = (navigator as unknown as { connection?: NetworkInformation }).connection
    if (conn) {
      const update = () => setPrefetchDepth(getPrefetchDepth())
      conn.addEventListener('change', update)
      return () => conn.removeEventListener('change', update)
    }
  }, [])

  // ── Crossfade: when target changes, check if already cached ─
  useEffect(() => {
    clearTimeout(promotionTimer.current)

    if (readySet.has(currentIndex)) {
      // Prefetched → mark ready and schedule promotion
      setIncomingReady(true)
      promotionTimer.current = setTimeout(() => {
        setDisplayedIndex(currentIndex)
      }, TRANSITION_MS + 16)
    } else {
      setIncomingReady(false)
    }

    return () => clearTimeout(promotionTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Cleanup promotion timer on unmount
  useEffect(() => () => clearTimeout(promotionTimer.current), [])

  // ── Navigation ─────────────────────────────────────────────
  const goNext = useCallback(() => {
    setSwipeDir('left')
    setTimeout(() => setSwipeDir(null), 300)
    setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : 0))
  }, [items.length])

  const goPrev = useCallback(() => {
    setSwipeDir('right')
    setTimeout(() => setSwipeDir(null), 300)
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : items.length - 1))
  }, [items.length])

  // ── Touch / swipe handlers ─────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x0: e.targetTouches[0].clientX, x1: 0, t0: Date.now() }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchRef.current.x1 = e.targetTouches[0].clientX
  }, [])

  const onTouchEnd = useCallback(() => {
    const { x0, x1, t0 } = touchRef.current
    if (!x0 || !x1 || items.length <= 1) return
    const dist = x0 - x1
    const vel = Math.abs(dist) / (Date.now() - t0)
    if (dist > MIN_SWIPE_PX || (dist > 0 && vel > MIN_SWIPE_VEL)) goNext()
    else if (dist < -MIN_SWIPE_PX || (dist < 0 && vel > MIN_SWIPE_VEL)) goPrev()
    touchRef.current = { x0: 0, x1: 0, t0: 0 }
  }, [items.length, goNext, goPrev])

  // ── Load callbacks ─────────────────────────────────────────
  // Fires when the incoming (foreground) <Image> fully decodes.
  const handleIncomingLoad = useCallback(() => {
    const idx = currentIndexRef.current
    setIncomingReady(true)
    setReadySet(prev => new Set(prev).add(idx))
    clearTimeout(promotionTimer.current)
    promotionTimer.current = setTimeout(() => {
      setDisplayedIndex(idx)
    }, TRANSITION_MS + 16)
  }, [])

  const handlePrefetchReady = useCallback((idx: number) => {
    setReadySet(prev => new Set(prev).add(idx))
  }, [])

  // ── Guard ──────────────────────────────────────────────────
  if (!items?.length) return null

  // ── Derived crossfade values ───────────────────────────────
  const activeItem = items[currentIndex]
  const displayedItem = displayedIndex >= 0 ? items[displayedIndex] : null
  const isTransitioning = displayedIndex !== currentIndex
  const showIncoming = !isTransitioning || incomingReady
  const neighbors = getNeighborIndices(currentIndex, items.length, prefetchDepth)
  const hasNav = items.length > 1

  return (
    <div className="project-media-section">
      {/* Header bar: label · type · counter */}
      <div className="project-media-header">
        <span className="project-media-label">
          {label}
          <span className="mobile-swipe-hint"> (swipe)</span>
        </span>
        <span className="project-media-type-label">{typeLabel}</span>
        <span className="project-media-counter">
          {currentIndex + 1}/{items.length}
        </span>
      </div>

      {/* Viewer: prev-nav · image-container · next-nav */}
      <div className="project-media-viewer">
        {hasNav && (
          <button
            onClick={goPrev}
            className="project-media-nav project-media-nav--prev"
            aria-label="Previous image"
            style={{ cursor: 'url(/arrow-left.svg?v=2) 200 200, pointer' }}
          />
        )}

        <div
          className="project-media-image-container"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={swipeDir === 'left' ? 'slide-in-right' : swipeDir === 'right' ? 'slide-in-left' : ''}>
            {activeItem.image && (
              <div
                className="media-gallery-frame"
                style={{
                  aspectRatio: `${activeItem.imageDimensions?.width || 1600} / ${activeItem.imageDimensions?.height || 1200}`,
                }}
              >
                {/* LQIP blur layer — only on first load before any image is ready */}
                {activeItem.imageLqip && displayedIndex < 0 && !incomingReady && (
                  <div
                    className="media-gallery-lqip"
                    style={{ backgroundImage: `url(${activeItem.imageLqip})` }}
                  />
                )}

                {/* Background layer: last loaded image (crossfade safety net) */}
                {isTransitioning && displayedItem?.image && (
                  <Image
                    key={`displayed-${displayedIndex}`}
                    loader={sanityImageLoader}
                    src={urlFor(displayedItem.image).url()}
                    alt=""
                    width={displayedItem.imageDimensions?.width || 1600}
                    height={displayedItem.imageDimensions?.height || 1200}
                    sizes={SIZES}
                    quality={90}
                    className="media-gallery-layer media-gallery-layer--visible"
                    aria-hidden="true"
                    draggable={false}
                  />
                )}

                {/* Foreground layer: target image (fades in once decoded) */}
                <Image
                  key={`incoming-${currentIndex}`}
                  loader={sanityImageLoader}
                  src={urlFor(activeItem.image).url()}
                  alt={`${projectName} - ${typeLabel} ${currentIndex + 1}`}
                  width={activeItem.imageDimensions?.width || 1600}
                  height={activeItem.imageDimensions?.height || 1200}
                  sizes={SIZES}
                  placeholder="empty"
                  quality={90}
                  priority={prioritize && currentIndex === 0}
                  loading="eager"
                  onLoad={handleIncomingLoad}
                  className={`media-gallery-layer ${showIncoming ? 'media-gallery-layer--visible' : ''}`}
                  draggable={false}
                />
              </div>
            )}

            {activeItem.caption && (
              <p className="header-text" style={{ marginTop: '1rem' }}>
                {activeItem.caption}
              </p>
            )}
          </div>
        </div>

        {hasNav && (
          <button
            onClick={goNext}
            className="project-media-nav project-media-nav--next"
            aria-label="Next image"
            style={{ cursor: 'url(/arrow.svg?v=2) 200 200, pointer' }}
          />
        )}
      </div>

      {/* ── Invisible prefetch layer ──────────────────────────── */}
      {neighbors.map(idx => {
        const item = items[idx]
        if (!item?.image || readySet.has(idx)) return null
        return (
          <PrefetchImage
            key={`pf-${idx}-${item._key}`}
            src={urlFor(item.image).url()}
            width={item.imageDimensions?.width || 1600}
            height={item.imageDimensions?.height || 1200}
            quality={90}
            sizes={SIZES}
            onReady={() => handlePrefetchReady(idx)}
          />
        )
      })}
    </div>
  )
}
