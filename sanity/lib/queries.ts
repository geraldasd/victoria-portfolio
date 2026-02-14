/**
 * GROQ queries for fetching SEO-related data from Sanity.
 */

// ─── Shared fragments ────────────────────────────────────────────────
const seoFragment = `
  seo {
    metaTitle,
    metaDescription,
    "ogImageUrl": ogImage.asset->url
  }
`

// ─── Settings (global defaults) ──────────────────────────────────────
export const settingsQuery = `
  *[_type == "settings" && _id == "settings"][0]{
    siteTitle,
    ${seoFragment},
    "faviconUrl": favicon.asset->url
  }
`

// ─── Project SEO (for a single project by slug) ──────────────────────
export const projectSeoQuery = `
  *[_type == "project" && slug.current == $slug][0]{
    name,
    caption,
    ${seoFragment}
  }
`

// ─── About page SEO ─────────────────────────────────────────────────
export const aboutSeoQuery = `
  *[_type == "about"][0]{
    aboutMe,
    description,
    ${seoFragment}
  }
`
