'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { urlFor } from '@/sanity/lib/image';

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
  imageCaption?: string;
}

type SortKey = 'no' | 'dates' | 'name' | 'types' | 'for' | 'with';
type SortDirection = 'asc' | 'desc';

function ProjectRow({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const valueStyle = {
    textDecoration: isHovered ? 'underline' : 'none',
    textDecorationThickness: '1px',
    textUnderlineOffset: '0.15em',
  };

  const content = (
    <>
      <span className="projects-cell">
        <span className="cell-label">No.</span>
        <span style={valueStyle}>{project.no || ''}</span>
      </span>
      <span className="projects-cell">
        <span className="cell-label">DATE/S</span>
        <span style={valueStyle}>{project.dates || ''}</span>
      </span>
      <span className="projects-cell">
        <span className="cell-label">NAME</span>
        <span style={valueStyle}>{project.name || ''}</span>
      </span>
      <span className="projects-cell">
        <span className="cell-label">TYPE/S</span>
        <span style={valueStyle}>{project.types || ''}</span>
      </span>
      <span className="projects-cell">
        <span className="cell-label">FOR</span>
        <span style={valueStyle}>{project.for || ''}</span>
      </span>
      <span className="projects-cell">
        <span className="cell-label">WITH</span>
        <span style={valueStyle}>{project.with || ''}</span>
      </span>
    </>
  );

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  // Featured image component
  const featuredImageContent = project.featuredImage?.asset ? (
    <div className="project-featured-image">
      <Image
        src={urlFor(project.featuredImage).url()}
        alt={project.name || 'Project image'}
        width={1200}
        height={600}
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
      <>
        <div className="projects-row projects-row--no-link">
          {content}
        </div>
        {featuredImageContent}
      </>
    );
  }

  // External link
  if (project.linkType === 'external' && project.externalLink) {
    return (
      <>
        <a 
          href={project.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="projects-row"
          {...hoverHandlers}
        >
          {content}
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
      </>
    );
  }

  // Internal link - use slug if available, otherwise fall back to internalLink
  if (project.linkType === 'internal') {
    const href = project.slug?.current 
      ? `/projects/${project.slug.current}` 
      : project.internalLink || '#';
    return (
      <>
        <Link href={href} className="projects-row" {...hoverHandlers}>
          {content}
        </Link>
        {featuredImageContent && (
          <Link href={href} style={{ display: 'block', cursor: 'pointer' }}>
            {featuredImageContent}
          </Link>
        )}
      </>
    );
  }

  // Fallback - no link (no hover effect)
  return (
    <>
      <div className="projects-row projects-row--no-link">
        {content}
      </div>
      {featuredImageContent}
    </>
  );
}

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  currentSortKey: SortKey | null;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

function SortableHeader({ label, sortKey, currentSortKey, sortDirection, onSort }: SortableHeaderProps) {
  const isActive = currentSortKey === sortKey;
  const [isHovered, setIsHovered] = useState(false);
  
  // Only show underline on hover for non-active headers
  const showUnderline = !isActive && isHovered;
  
  return (
    <span 
      onClick={() => onSort(sortKey)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        textTransform: 'uppercase', 
        cursor: 'pointer',
        textDecoration: showUnderline ? 'underline' : 'none',
        textDecorationThickness: '1px',
        textUnderlineOffset: '0.15em',
      }}
    >
      {label}
    </span>
  );
}

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, start with ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedProjects = useMemo(() => {
    if (!sortKey) return projects;

    return [...projects].sort((a, b) => {
      const aValue = (a[sortKey] || '').toLowerCase();
      const bValue = (b[sortKey] || '').toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projects, sortKey, sortDirection]);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="projects-table">
      {/* Header Row - Sortable Labels */}
      <div className="projects-row projects-row--header">
        <SortableHeader label="No." sortKey="no" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
        <SortableHeader label="DATE/S" sortKey="dates" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
        <SortableHeader label="NAME" sortKey="name" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
        <SortableHeader label="TYPE/S" sortKey="types" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
        <SortableHeader label="FOR" sortKey="for" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
        <SortableHeader label="WITH" sortKey="with" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
      </div>

      {/* Project Rows */}
      {sortedProjects.map((project) => (
        <ProjectRow key={project._id} project={project} />
      ))}
    </div>
  );
}
