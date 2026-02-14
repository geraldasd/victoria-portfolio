import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'

// ─── TypeScript interfaces ───────────────────────────────────────────

export interface SeoData {
  metaTitle?: string
  metaDescription?: string
  ogImageUrl?: string
}

export interface SettingsData {
  siteTitle?: string
  seo?: SeoData
  faviconUrl?: string
}

export interface PageSeoData {
  name?: string       // used by project pages
  aboutMe?: string    // used by about page
  caption?: string
  description?: string
  seo?: SeoData
}

// ─── Fetch global settings (cached across pages) ─────────────────────

let _settingsCache: SettingsData | null = null

export async function getSettings(): Promise<SettingsData> {
  if (_settingsCache) return _settingsCache
  const data = await client.fetch<SettingsData | null>(settingsQuery)
  const result: SettingsData = data ?? {}
  _settingsCache = result
  return result
}

// ─── Build Metadata helper ───────────────────────────────────────────

/**
 * Merges page-level SEO with global defaults from the settings singleton.
 *
 * Priority: page seo fields  →  global seo fields  →  hardcoded fallback.
 *
 * @param pageSeo  – SEO data from the specific page/document (optional)
 * @param fallbackTitle – A plain-text fallback title (e.g. project name)
 */
export async function buildMetadata(
  pageSeo?: SeoData | null,
  fallbackTitle?: string,
): Promise<Metadata> {
  const settings = await getSettings()

  const siteTitle = settings.siteTitle || 'Victoria'
  const title = pageSeo?.metaTitle || fallbackTitle || settings.seo?.metaTitle || siteTitle
  const description = pageSeo?.metaDescription || settings.seo?.metaDescription || ''
  const ogImage = pageSeo?.ogImageUrl || settings.seo?.ogImageUrl

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }

  // Favicon from Sanity settings
  if (settings.faviconUrl) {
    metadata.icons = {
      icon: settings.faviconUrl,
      apple: settings.faviconUrl,
    }
  }

  return metadata
}
