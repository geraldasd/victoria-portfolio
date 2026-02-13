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
      description: 'Project number (e.g., 0001)',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Project name',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for the project',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Project Caption',
      type: 'text',
      description: 'Project description/caption text',
    }),
    defineField({
      name: 'dates',
      title: 'Date/s',
      type: 'string',
      description: 'Project date (e.g. 2022)',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Project status (e.g., Completed, In Progress)',
    }),
    defineField({
      name: 'types',
      title: 'Type/s',
      type: 'string',
      description: 'Project types (e.g., Living Environment)',
    }),
    defineField({
      name: 'outputs',
      title: 'Output/s',
      type: 'string',
      description: 'Project outputs (e.g., Research)',
    }),
    defineField({
      name: 'briefs',
      title: 'Brief/s',
      type: 'string',
      description: 'Project brief (e.g., House, Apartment)',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Project location (e.g., Address, City, Country)',
    }),
    defineField({
      name: 'for',
      title: 'For',
      type: 'string',
      description: 'Client name or Studio name',
    }),
    defineField({
      name: 'with',
      title: 'With',
      type: 'string',
      description: 'Collaborators, n/a if not applicable',
    }),
    defineField({
      name: 'builder',
      title: 'Builder',
      type: 'string',
      description: 'Builder name, n/a if not applicable',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'text',
      description: 'Team members, n/a if not applicable',
    }),
    defineField({
      name: 'photos',
      title: 'Photo/s',
      type: 'string',
      description: 'Photographer credit, n/a if not applicable',
    }),
    defineField({
      name: 'consult',
      title: 'Consult',
      type: 'string',
      description: 'Consultants or Tutor name/s, n/a if not applicable',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Internal reference',
                    to: [{ type: 'project' }]
                  },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true }
                ]
              }
            ]
          }
        }
      ],
      description: 'Awards received, with optional links',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Internal reference',
                    to: [{ type: 'project' }]
                  },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true }
                ]
              }
            ]
          }
        }
      ],
      description: 'Publications featuring this project, with optional links',
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
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Optional featured image to display below the project row',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageCaption',
      title: 'Image Caption',
      type: 'text',
      description: 'Caption text displayed below the featured image',
      hidden: ({ parent }) => !parent?.featuredImage,
    }),
    defineField({
      name: 'photographyRenders',
      title: 'Photography/Renders',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'text',
              description: 'Optional caption for this image',
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: caption || 'Untitled',
                media,
              }
            },
          },
        },
      ],
      description: 'Photography or render images',
    }),
    defineField({
      name: 'models',
      title: 'Models',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'text',
              description: 'Optional caption for this image',
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: caption || 'Untitled',
                media,
              }
            },
          },
        },
      ],
      description: 'Model images',
    }),
    defineField({
      name: 'drawings',
      title: 'Drawings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'text',
              description: 'Optional caption for this image',
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: caption || 'Untitled',
                media,
              }
            },
          },
        },
      ],
      description: 'Drawing images',
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
