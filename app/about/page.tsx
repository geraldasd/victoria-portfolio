import { client } from '@/sanity/lib/client'
import AboutPage from '@/app/components/AboutPage'

export const dynamic = 'force-dynamic'

async function getAboutData() {
  const query = `*[_type == "about"][0]{
    aboutMe,
    description,
    phone,
    email,
    instagram,
    awards[]{
      title,
      link
    },
    featuredImages[]{
      _key,
      image,
      caption
    }
  }`
  
  return client.fetch(query)
}

async function getFooterData() {
  const data = await client.fetch(`*[_type == "footer" && _id == "footer"][0]`)
  return data
}

export default async function Page() {
  const aboutData = await getAboutData()
  const footerData = await getFooterData()
  
  return (
    <>
      <AboutPage data={aboutData} footerData={footerData} />
    </>
  )
}
