// sanity/schemaTypes/header.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'array', 
      of: [{ type: 'block' }], 
    }),
  ],
})