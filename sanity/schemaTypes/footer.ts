import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo Text',
      type: 'string',
      description: 'Large text that spans the full width (e.g., "V I C T O R I A")',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Company or name text',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'Instagram profile link',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'LinkedIn profile link',
    }),
    defineField({
      name: 'telephone',
      title: 'Telephone',
      type: 'string',
      description: 'Phone number',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Email address (will be underlined with mailto link)',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
      }
    },
  },
})
