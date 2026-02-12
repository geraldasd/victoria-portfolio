'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import MediaGallery from './MediaGallery'
import type { MediaItem } from './MediaGallery'
import Footer from './Footer'

interface Award {
  title: string
  link?: string
}

interface AboutData {
  aboutMe?: string
  description?: string
  phone?: string
  email?: string
  instagram?: string
  awards?: Award[]
  featuredImages?: MediaItem[]
}

interface AboutPageProps {
  data: AboutData | null
  footerData: any
}

export default function AboutPage({ data, footerData }: AboutPageProps) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => { router.back() }, 400)
  }

  if (!data) {
    return (
      <div className="project-page">
        <p>No about data found. Please add content in Sanity Studio.</p>
      </div>
    )
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
        <div className="project-media-grid">
          <MediaGallery
            items={data.featuredImages!}
            projectName={data.aboutMe || 'About'}
            label="MEDIA"
            typeLabel="Featured Images"
            prioritize
          />
        </div>
      )}
      
      {/* Footer */}
      <Footer data={footerData} />
      </div>
    </>
  )
}
