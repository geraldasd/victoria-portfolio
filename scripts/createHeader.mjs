import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

async function createHeader() {
  try {
    const result = await client.createOrReplace({
      _id: 'header',
      _type: 'header',
      introductionText: [
        {
          _type: 'block',
          _key: 'intro1',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Welcome to my portfolio.',
              marks: []
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ]
    })
    console.log('Header document created:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

createHeader()
