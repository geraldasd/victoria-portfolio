/**
 * Migration script: clears old plain-text `awards` and `published` fields
 * from all project documents so Sanity Studio can use the new array-of-objects schema.
 *
 * Run:  node scripts/migrateAwardsPublished.mjs
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uywgcxdd'
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production'
const token     = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌  SANITY_API_TOKEN env variable is required. Set it before running this script.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-02',
  useCdn: false,
  token,
})

async function migrate() {
  // Fetch all project documents that still have old string-typed awards or published
  const projects = await client.fetch(
    `*[_type == "project" && (defined(awards) || defined(published))]{
      _id,
      _type,
      awards,
      published
    }`
  )

  console.log(`Found ${projects.length} project(s) to migrate.\n`)

  for (const project of projects) {
    const patches = []

    // If awards is a string (old format), unset it
    if (typeof project.awards === 'string') {
      console.log(`  [${project._id}] awards is a plain string → will unset`)
      patches.push({ unset: ['awards'] })
    }

    // If published is a string (old format), unset it
    if (typeof project.published === 'string') {
      console.log(`  [${project._id}] published is a plain string → will unset`)
      patches.push({ unset: ['published'] })
    }

    if (patches.length > 0) {
      let tx = client.transaction()
      for (const p of patches) {
        tx = tx.patch(project._id, p)
        // Also patch the draft version if it exists
        tx = tx.patch(`drafts.${project._id}`, p)
      }
      await tx.commit({ autoGenerateArrayKeys: true })
      console.log(`  ✅  Patched ${project._id}`)
    }
  }

  console.log('\n🎉  Migration complete!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
