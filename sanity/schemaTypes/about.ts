import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'aboutMe',
      title: 'About Me',
      type: 'string',
      description: 'Main title for the about page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Subtitle/description text',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Phone number',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Email address',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      description: 'Instagram profile URL',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      description: 'List of awards with optional links',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Award Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'link',
              title: 'Link',
              type: 'url',
              description: 'Optional link for the award',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featuredImages',
      title: 'Featured Images',
      type: 'array',
      description: 'Gallery of featured images',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
    }),
  ],
})
