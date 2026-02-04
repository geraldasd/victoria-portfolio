// Script to create an About document in Sanity
// Run this script with: node scripts/createAbout.mjs

import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
})

async function createAboutDocument() {
  try {
    const doc = {
      _type: 'about',
      _id: 'about',
      aboutMe: 'Victoria Chen',
      description: 'Architect and Designer based in Melbourne, Australia',
      phone: '+61 XXX XXX XXX',
      email: 'hello@victoriachenarchitect.com',
      instagram: 'https://www.instagram.com/victoriachenarchitect',
      awards: [
        {
          _type: 'object',
          title: 'Example Award 2024',
          link: 'https://example.com',
        },
      ],
      featuredImages: [],
    }

    const result = await client.createOrReplace(doc)
    console.log('About document created successfully!', result)
  } catch (error) {
    console.error('Error creating about document:', error)
  }
}

createAboutDocument()
