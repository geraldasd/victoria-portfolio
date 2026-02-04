'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import Footer from './Footer'

interface MediaItem {
  _key: string
  image: { asset: { _ref: string } }
  caption?: string
}

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
  photographyRenders?: MediaItem[]
  models?: MediaItem[]
  drawings?: MediaItem[]
}

interface ProjectPageProps {
  project: Project
  footerData: any
}

type MediaType = 'photography' | 'models' | 'drawings'

export default function ProjectPage({ project, footerData }: ProjectPageProps) {
  const router = useRouter()
  const [photographyIndex, setPhotographyIndex] = useState(0)
  const [modelsIndex, setModelsIndex] = useState(0)
  const [drawingsIndex, setDrawingsIndex] = useState(0)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    // Wait for animation to complete before navigating
    setTimeout(() => {
      router.back()
    }, 400) // Match animation duration
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
    <>
      {/* Sticky Close Button - outside project-page for proper fixed positioning */}
      <button onClick={handleClose} className="project-close-sticky">
        Close
      </button>
      
      <div className={`project-page ${isClosing ? 'project-page--closing' : ''}`}>
        {/* Header */}
        <div className="project-header">
          <h1 className="project-name">{project.name}</h1>
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

      {/* Photography Section */}
      {hasPhotography && (
        <div className="project-media-section">
          <div className="project-media-header">
            <span className="project-media-label">MEDIA</span>
            <span className="project-media-type-label">Photography</span>
            <span className="project-media-counter">
              {photographyIndex + 1}/{project.photographyRenders!.length}
            </span>
          </div>
          <div className="project-media-viewer">
            <button 
              onClick={() => setPhotographyIndex(prev => prev > 0 ? prev - 1 : project.photographyRenders!.length - 1)}
              className={`project-media-nav project-media-nav--prev ${project.photographyRenders!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Previous image"
              style={{ cursor: project.photographyRenders!.length > 1 ? 'url(/arrow-left.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
            <div className="project-media-image-container">
              <div>
                {project.photographyRenders![photographyIndex].image && (
                  <img
                    src={urlFor(project.photographyRenders![photographyIndex].image).width(1600).quality(90).url()}
                    alt={`${project.name} - Photography ${photographyIndex + 1}`}
                    className="project-media-image"
                  />
                )}
                {project.photographyRenders![photographyIndex].caption && (
                  <p className="header-text" style={{ marginTop: '1rem' }}>
                    {project.photographyRenders![photographyIndex].caption}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setPhotographyIndex(prev => prev < project.photographyRenders!.length - 1 ? prev + 1 : 0)}
              className={`project-media-nav project-media-nav--next ${project.photographyRenders!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Next image"
              style={{ cursor: project.photographyRenders!.length > 1 ? 'url(/arrow.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
          </div>
        </div>
      )}

      {/* Models Section */}
      {hasModels && (
        <div className="project-media-section">
          <div className="project-media-header">
            <span className="project-media-label">MEDIA</span>
            <span className="project-media-type-label">Models</span>
            <span className="project-media-counter">
              {modelsIndex + 1}/{project.models!.length}
            </span>
          </div>
          <div className="project-media-viewer">
            <button 
              onClick={() => setModelsIndex(prev => prev > 0 ? prev - 1 : project.models!.length - 1)}
              className={`project-media-nav project-media-nav--prev ${project.models!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Previous image"
              style={{ cursor: project.models!.length > 1 ? 'url(/arrow-left.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
            <div className="project-media-image-container">
              <div>
                {project.models![modelsIndex].image && (
                  <img
                    src={urlFor(project.models![modelsIndex].image).width(1600).quality(90).url()}
                    alt={`${project.name} - Models ${modelsIndex + 1}`}
                    className="project-media-image"
                  />
                )}
                {project.models![modelsIndex].caption && (
                  <p className="header-text" style={{ marginTop: '1rem' }}>
                    {project.models![modelsIndex].caption}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setModelsIndex(prev => prev < project.models!.length - 1 ? prev + 1 : 0)}
              className={`project-media-nav project-media-nav--next ${project.models!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Next image"
              style={{ cursor: project.models!.length > 1 ? 'url(/arrow.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
          </div>
        </div>
      )}

      {/* Drawings Section */}
      {hasDrawings && (
        <div className="project-media-section">
          <div className="project-media-header">
            <span className="project-media-label">MEDIA</span>
            <span className="project-media-type-label">Drawings</span>
            <span className="project-media-counter">
              {drawingsIndex + 1}/{project.drawings!.length}
            </span>
          </div>
          <div className="project-media-viewer">
            <button 
              onClick={() => setDrawingsIndex(prev => prev > 0 ? prev - 1 : project.drawings!.length - 1)}
              className={`project-media-nav project-media-nav--prev ${project.drawings!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Previous image"
              style={{ cursor: project.drawings!.length > 1 ? 'url(/arrow-left.svg?v=2) 200 200, pointer' : 'default' }}
            >
            </button>
            <div className="project-media-image-container">
              <div>
                {project.drawings![drawingsIndex].image && (
                  <img
                    src={urlFor(project.drawings![drawingsIndex].image).width(1600).quality(90).url()}
                    alt={`${project.name} - Drawings ${drawingsIndex + 1}`}
                    className="project-media-image"
                  />
                )}
                {project.drawings![drawingsIndex].caption && (
                  <p className="header-text" style={{ marginTop: '1rem' }}>
                    {project.drawings![drawingsIndex].caption}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setDrawingsIndex(prev => prev < project.drawings!.length - 1 ? prev + 1 : 0)}
              className={`project-media-nav project-media-nav--next ${project.drawings!.length > 1 ? 'has-navigation' : ''}`}
              aria-label="Next image"
              style={{ cursor: project.drawings!.length > 1 ? 'url(/arrow.svg?v=2) 200 200, pointer' : 'default' }}
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
