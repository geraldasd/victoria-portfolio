import { defineField, defineType } from 'sanity'

/**
 * Singleton document for global site settings.
 * Manages favicon, default SEO fields, and site-wide metadata.
 */
export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'The default title for the site, used as a fallback and in the title template.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Default SEO metadata used when a page does not define its own.',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Site favicon. Upload a square PNG or SVG (e.g., 512×512px). Will be served at /favicon.ico via metadata.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
