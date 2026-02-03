'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'

interface Project {
  _id: string
  no?: string
  name?: string
  caption?: string
  dates?: string
  status?: string
  types?: string
  outputs?: string
  briefs?: string
  location?: string
  for?: string
  with?: string
  builder?: string
  team?: string
  photos?: string
  consult?: string
  awards?: string
  published?: string
  photographyRenders?: Array<{ _key: string; asset: { _ref: string } }>
  models?: Array<{ _key: string; asset: { _ref: string } }>
  drawings?: Array<{ _key: string; asset: { _ref: string } }>
}

interface ProjectPageProps {
  project: Project
}

type MediaType = 'photography' | 'models' | 'drawings'

export default function ProjectPage({ project }: ProjectPageProps) {
  const router = useRouter()
  const [activeMedia, setActiveMedia] = useState<MediaType>('photography')
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClose = () => {
    router.back()
  }

  // Get current media array based on active type
  const getMediaArray = () => {
    switch (activeMedia) {
      case 'photography':
        return project.photographyRenders || []
      case 'models':
        return project.models || []
      case 'drawings':
        return project.drawings || []
      default:
        return []
    }
  }

  const mediaArray = getMediaArray()
  const totalImages = mediaArray.length
  const currentImage = mediaArray[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0))
  }

  const handleMediaTypeChange = (type: MediaType) => {
    setActiveMedia(type)
    setCurrentIndex(0)
  }

  // Helper to render a table row
  const renderRow = (label: string, value?: string) => {
    if (!value) return null
    return (
      <div className="project-detail-row">
        <span className="project-detail-label">{label}</span>
        <span className="project-detail-value">{value}</span>
      </div>
    )
  }

  // Check which media types have content
  const hasPhotography = (project.photographyRenders?.length || 0) > 0
  const hasModels = (project.models?.length || 0) > 0
  const hasDrawings = (project.drawings?.length || 0) > 0
  const hasAnyMedia = hasPhotography || hasModels || hasDrawings

  return (
    <div className="project-page">
      {/* Header */}
      <div className="project-header">
        <h1 className="project-name">{project.name}</h1>
        <button onClick={handleClose} className="project-close">
          Close
        </button>
      </div>

      {/* Caption */}
      {project.caption && (
        <p className="project-caption">{project.caption}</p>
      )}

      {/* Details Table */}
      <div className="project-details">
        <div className="project-details-column">
          {renderRow('No.', project.no)}
          {renderRow('NAME', project.name)}
          {renderRow('DATE/S', project.dates)}
          {renderRow('STATUS', project.status)}
          {renderRow('TYPE/S', project.types)}
          {renderRow('OUTPUT/S', project.outputs)}
          {renderRow('BRIEF/S', project.briefs)}
          {renderRow('LOCATION', project.location)}
        </div>
        <div className="project-details-column">
          {renderRow('FOR', project.for)}
          {renderRow('WITH', project.with)}
          {renderRow('BUILDER', project.builder)}
          {renderRow('TEAM', project.team)}
          {renderRow('PHOTO/S', project.photos)}
          {renderRow('CONSULT', project.consult)}
        </div>
        <div className="project-details-column">
          {renderRow('AWARDS', project.awards)}
          {renderRow('PUBLISHED', project.published)}
        </div>
      </div>

      {/* Media Section */}
      {hasAnyMedia && (
        <div className="project-media">
          <div className="project-media-header">
            <div className="project-media-types">
              <span className="project-media-label">MEDIA</span>
              {hasPhotography && (
                <button
                  onClick={() => handleMediaTypeChange('photography')}
                  className={`project-media-type ${activeMedia === 'photography' ? 'active' : ''}`}
                >
                  Photography
                </button>
              )}
              {hasModels && (
                <button
                  onClick={() => handleMediaTypeChange('models')}
                  className={`project-media-type ${activeMedia === 'models' ? 'active' : ''}`}
                >
                  Models
                </button>
              )}
              {hasDrawings && (
                <button
                  onClick={() => handleMediaTypeChange('drawings')}
                  className={`project-media-type ${activeMedia === 'drawings' ? 'active' : ''}`}
                >
                  Drawings
                </button>
              )}
            </div>
            {totalImages > 0 && (
              <span className="project-media-counter">
                {currentIndex + 1}/{totalImages}
              </span>
            )}
          </div>

          {/* Image Display */}
          {currentImage && (
            <div className="project-media-viewer">
              <button 
                onClick={handlePrevious} 
                className="project-media-nav project-media-nav--prev"
                aria-label="Previous image"
              >
                <span>←</span>
              </button>
              <div className="project-media-image-container">
                <img
                  src={urlFor(currentImage).width(1600).quality(90).url()}
                  alt={`${project.name} - ${activeMedia} ${currentIndex + 1}`}
                  className="project-media-image"
                />
              </div>
              <button 
                onClick={handleNext} 
                className="project-media-nav project-media-nav--next"
                aria-label="Next image"
              >
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
