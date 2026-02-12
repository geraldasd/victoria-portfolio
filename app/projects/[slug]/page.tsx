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
    photographyRenders[]{
      _key,
      image,
      "imageLqip": image.asset->metadata.lqip,
      "imageDimensions": image.asset->metadata.dimensions,
      caption
    },
    models[]{
      _key,
      image,
      "imageLqip": image.asset->metadata.lqip,
      "imageDimensions": image.asset->metadata.dimensions,
      caption
    },
    drawings[]{
      _key,
      image,
      "imageLqip": image.asset->metadata.lqip,
      "imageDimensions": image.asset->metadata.dimensions,
      caption
    }
  }`
  
  return client.fetch(query, { slug })
}

async function getFooterData() {
  const data = await client.fetch(`*[_type == "footer" && _id == "footer"][0]`)
  return data
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)
  const footerData = await getFooterData()
  
  if (!project) {
    notFound()
  }
  
  return (
    <>
      <ProjectPage project={project} footerData={footerData} />
    </>
  )
}
