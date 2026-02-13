'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import MediaGallery from './MediaGallery'
import type { MediaItem } from './MediaGallery'
import Footer from './Footer'

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
  awardsList?: any[]
  publicationsList?: any[]
  photographyRenders?: MediaItem[]
  models?: MediaItem[]
  drawings?: MediaItem[]
}

interface ProjectPageProps {
  project: Project
  footerData: any
}

export default function ProjectPage({ project, footerData }: ProjectPageProps) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => { router.back() }, 400)
  }

  const renderRow = (label: string, value?: string) => {
    if (!value) return null
    return (
      <div className="project-detail-row">
        <span className="project-detail-label">{label}</span>
        <span className="project-detail-value">{value}</span>
      </div>
    )
  }

  const renderPortableTextRow = (label: string, value?: any[]) => {
    if (!value || value.length === 0) return null
    return (
      <div className="project-detail-row">
        <span className="project-detail-label">{label}</span>
        <span className="project-detail-value">
          <PortableText 
            value={value} 
            components={{
              marks: {
                link: ({value, children}) => {
                  const href = value?.href || (value?.reference ? `/projects/${value.reference}` : '#')
                  const target = value?.blank ? '_blank' : undefined
                  const rel = target === '_blank' ? 'noopener noreferrer' : undefined
                  return <a href={href} target={target} rel={rel}>{children}</a>
                },
              },
            }}
          />
        </span>
      </div>
    )
  }

  const hasPhotography = (project.photographyRenders?.length || 0) > 0
  const hasModels = (project.models?.length || 0) > 0
  const hasDrawings = (project.drawings?.length || 0) > 0
  const hasAnyMedia = hasPhotography || hasModels || hasDrawings

  return (
    <>
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
            {renderPortableTextRow('AWARDS', project.awardsList)}
            {renderPortableTextRow('PUBLISHED', project.publicationsList)}
          </div>
        </div>

        {/* Media Grid — 2-col asymmetric on desktop, 1-col stack on mobile */}
        {hasAnyMedia && (
          <div className="project-media-grid">
            {hasPhotography && (
              <MediaGallery
                items={project.photographyRenders!}
                projectName={project.name || ''}
                label="MEDIA"
                typeLabel="Photography/Renders"
                prioritize
              />
            )}
            {hasModels && (
              <MediaGallery
                items={project.models!}
                projectName={project.name || ''}
                label="MEDIA"
                typeLabel="Models"
              />
            )}
            {hasDrawings && (
              <MediaGallery
                items={project.drawings!}
                projectName={project.name || ''}
                label="MEDIA"
                typeLabel="Drawings"
              />
            )}
          </div>
        )}

        {/* Footer */}
        <Footer data={footerData} />
      </div>
    </>
  )
}
