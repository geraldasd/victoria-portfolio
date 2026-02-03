import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'no',
      title: 'No.',
      type: 'string',
      description: 'Project number (e.g., 2541)',
    }),
    defineField({
      name: 'dates',
      title: 'Date/s',
      type: 'string',
      description: 'Project date range (e.g., 2025-29)',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Project name',
    }),
    defineField({
      name: 'types',
      title: 'Type/s',
      type: 'string',
      description: 'Project types (e.g., Living Environments)',
    }),
    defineField({
      name: 'for',
      title: 'For',
      type: 'string',
      description: 'Client name',
    }),
    defineField({
      name: 'with',
      title: 'With',
      type: 'string',
      description: 'Collaborators',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'No Link', value: 'none' },
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link (Slug)',
      type: 'string',
      description: 'Internal page path (e.g., /projects/my-project)',
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalLink',
      title: 'External URL',
      type: 'url',
      description: 'Full external URL (e.g., https://example.com)',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'no',
    },
  },
})
