import { client } from '@/sanity/lib/client'
import ProjectPage from '@/app/components/ProjectPage'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    _id,
    no,
    name,
    caption,
    dates,
    status,
    types,
    outputs,
    briefs,
    location,
    for,
    with,
    builder,
    team,
    photos,
    consult,
    awards,
    published,
    photographyRenders,
    models,
    drawings
  }`
  
  return client.fetch(query, { slug })
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)
  
  if (!project) {
    notFound()
  }
  
  return <ProjectPage project={project} />
}
