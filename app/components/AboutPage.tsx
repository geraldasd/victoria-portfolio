'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import Footer from './Footer'

interface Award {
  title: string
  link?: string
}

interface FeaturedImage {
  _key: string
  image: { asset: { _ref: string } }
  caption?: string
}

interface AboutData {
  aboutMe?: string
  description?: string
  phone?: string
  email?: string
  instagram?: string
  awards?: Award[]
  featuredImages?: FeaturedImage[]
}

interface AboutPageProps {
  data: AboutData | null
  footerData: any
}

export default function AboutPage({ data, footerData }: AboutPageProps) {
  if (!data) {
    return (
      <div className="project-page">
        <p>No about data found. Please add content in Sanity Studio.</p>
      </div>
    )
  }
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [featuredSwipe, setFeaturedSwipe] = useState<'left' | 'right' | null>(null)

  const handleClose = () => {
    setIsClosing(true)
    // Wait for animation to complete before navigating
    setTimeout(() => {
      router.back()
    }, 400) // Match animation duration
  }

  // Swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    // Don't allow swiping if there's only one image
    if (!data?.featuredImages || data.featuredImages.length <= 1) {
      setTouchStart(0)
      setTouchEnd(0)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      // Swipe left - next image (slide in from right)
      setFeaturedSwipe('left')
      setTimeout(() => setFeaturedSwipe(null), 300)
      setCurrentImageIndex(prev => prev < data.featuredImages!.length - 1 ? prev + 1 : 0)
    }
    else if (isRightSwipe) {
      // Swipe right - previous image (slide in from left)
      setFeaturedSwipe('right')
      setTimeout(() => setFeaturedSwipe(null), 300)
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : data.featuredImages!.length - 1)
    }
    
    // Reset
    setTouchStart(0)
    setTouchEnd(0)
  }

  const hasFeaturedImages = (data?.featuredImages?.length || 0) > 0

  return (
    <>
      {/* Sticky Close Button - outside project-page for proper fixed positioning */}
      <button onClick={handleClose} className="project-close-sticky">
        Close
      </button>
      
      <div className={`project-page ${isClosing ? 'project-page--closing' : ''}`}>

      {/* Header */}
      <div className="project-header">
        <h1 className="project-name">{data.aboutMe}</h1>
      </div>

      {/* Description */}
      {data.description && (
        <p className="project-caption">{data.description}</p>
      )}

      {/* Details Table */}
      <div className="project-details">
        <div className="project-details-column">
          {data.phone && (
            <div className="project-detail-row">
              <span className="project-detail-label">PHONE</span>
              <span className="project-detail-value">{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div className="project-detail-row">
              <span className="project-detail-label">EMAIL</span>
              <span className="project-detail-value">
                <a href={`mailto:${data.email}`} className="clickable">
                  {data.email}
                </a>
              </span>
            </div>
          )}
        </div>
        <div className="project-details-column">
          {data.instagram && (
            <div className="project-detail-row">
              <span className="project-detail-label">INSTAGRAM</span>
              <span className="project-detail-value">
                <a 
                  href={data.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="clickable"
                >
                  {data.instagram.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@')}
                </a>
              </span>
            </div>
          )}
          {data.awards && data.awards.length > 0 && (
            <>
              <div className="project-detail-row">
                <span className="project-detail-label">AWARDS</span>
              
              {data.awards.map((award, index) => (
                <div key={index} className="project-detail-row">
                  <span className="project-detail-value">
                    {award.link ? (
                      <a 
                        href={award.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="clickable"
                      >
                        {award.title}
                      </a>
                    ) : (
                      award.title
                    )}
                  </span>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
        <div className="project-details-column">
        </div>
      </div>

      {/* Featured Images Section */}
      {hasFeaturedImages && (
        <div className="project-media-section">
          <div className="project-media-header">
            <span className="project-media-label">MEDIA<span className="mobile-swipe-hint"> (swipe)</span></span>
            <span className="project-media-type-label">Featured Images</span>
            <span className="project-media-counter">
              {currentImageIndex + 1}/{data.featuredImages!.length}
            </span>
          </div>
          <div className="project-media-viewer">
            <button 
              onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : data.featuredImages!.length - 1)}
              className={`project-media-nav project-media-nav--prev ${data.featuredImages!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Previous image"
              style={{ cursor: data.featuredImages!.length > 1 ? 'url(/arrow-left.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
            <div 
              className="project-media-image-container"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className={featuredSwipe === 'left' ? 'slide-in-right' : featuredSwipe === 'right' ? 'slide-in-left' : ''}>
                {data.featuredImages![currentImageIndex].image && (
                  <img
                    src={urlFor(data.featuredImages![currentImageIndex].image).width(1600).quality(90).url()}
                    alt={`Featured image ${currentImageIndex + 1}`}
                    className="project-media-image"
                  />
                )}
                {data.featuredImages![currentImageIndex].caption && (
                  <p className="header-text" style={{ marginTop: '1rem' }}>
                    {data.featuredImages![currentImageIndex].caption}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setCurrentImageIndex(prev => prev < data.featuredImages!.length - 1 ? prev + 1 : 0)}
              className={`project-media-nav project-media-nav--next ${data.featuredImages!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Next image"
              style={{ cursor: data.featuredImages!.length > 1 ? 'url(/arrow.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer data={footerData} />
      </div>
    </>
  )
}
