'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { urlFor, sanityImageLoader } from '@/sanity/lib/image';

interface Project {
  _id: string;
  no: string;
  dates: string;
  name: string;
  types: string;
  for: string;
  with: string;
  slug?: { current: string };
  linkType?: 'none' | 'internal' | 'external';
  internalLink?: string;
  externalLink?: string;
  featuredImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  featuredImageLqip?: string;
  featuredImageDimensions?: { width: number; height: number; aspectRatio: number };
  imageCaption?: string;
}

function ProjectCell({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  const valueStyle = {
    textDecoration: isHovered ? 'underline' : 'none',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.15em',
  };

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const fields = [
    { label: 'No.', value: project.no },
    { label: 'DATE/S', value: project.dates },
    { label: 'NAME', value: project.name },
    { label: 'TYPE/S', value: project.types },
    { label: 'FOR', value: project.for },
    { label: 'WITH', value: project.with },
  ];

  const detailRows = (
    <>
      {fields.map((field) => (
        <div key={field.label} className="project-detail-row">
          <span className="project-detail-label">{field.label}</span>
          <span className="project-detail-value" style={valueStyle}>{field.value || ''}</span>
        </div>
      ))}
    </>
  );

  // Featured image component (unchanged)
  const featuredImageContent = project.featuredImage?.asset ? (
    <div className="project-featured-image">
      <Image
        loader={sanityImageLoader}
        src={urlFor(project.featuredImage).url()}
        alt={project.name || 'Project image'}
        width={project.featuredImageDimensions?.width || 1200}
        height={project.featuredImageDimensions?.height || 800}
        sizes="(min-width: 768px) 50vw, 100vw"
        placeholder={project.featuredImageLqip ? 'blur' : 'empty'}
        blurDataURL={project.featuredImageLqip || undefined}
        quality={80}
        style={{
          width: 'auto',
          height: 'auto',
          maxHeight: '600px',
          objectFit: 'contain',
        }}
      />
      {project.imageCaption && (
        <p className="header-text" style={{ marginTop: '1rem' }}>
          {project.imageCaption}
        </p>
      )}
    </div>
  ) : null;

  // No link - render as a div (no hover effect)
  if (!project.linkType || project.linkType === 'none') {
    return (
      <div className="project-cell">
        <div className="project-cell-data">
          {detailRows}
        </div>
        {featuredImageContent}
      </div>
    );
  }

  // External link
  if (project.linkType === 'external' && project.externalLink) {
    return (
      <div className="project-cell">
        <a
          href={project.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="project-cell-data project-cell--link"
          {...hoverHandlers}
        >
          {detailRows}
        </a>
        {featuredImageContent && (
          <a
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', cursor: 'pointer' }}
          >
            {featuredImageContent}
          </a>
        )}
      </div>
    );
  }

  // Internal link - use slug if available, otherwise fall back to internalLink
  if (project.linkType === 'internal') {
    const href = project.slug?.current
      ? `/projects/${project.slug.current}`
      : project.internalLink || '#';
    return (
      <div className="project-cell">
        <Link href={href} className="project-cell-data project-cell--link" {...hoverHandlers}>
          {detailRows}
        </Link>
        {featuredImageContent && (
          <Link href={href} style={{ display: 'block', cursor: 'pointer' }}>
            {featuredImageContent}
          </Link>
        )}
      </div>
    );
  }

  // Fallback - no link (no hover effect)
  return (
    <div className="project-cell">
      <div className="project-cell-data">
        {detailRows}
      </div>
      {featuredImageContent}
    </div>
  );
}

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="projects-table">
      {projects.map((project) => (
        <ProjectCell key={project._id} project={project} />
      ))}
    </div>
  );
}
