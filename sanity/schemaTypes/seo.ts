import { defineField, defineType } from 'sanity'

/**
 * Reusable SEO object schema.
 * Embed this in any document with: { name: 'seo', title: 'SEO', type: 'seo' }
 */
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title used for search engines and browser tabs. Ideal length: 50–60 characters.',
      validation: (Rule) => Rule.max(70).warning('Keep under 60 characters for best results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engine results. Ideal length: 150–160 characters.',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best results.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image displayed when sharing on social media. Recommended: 1200×630px.',
      options: {
        hotspot: true,
      },
    }),
  ],
})
