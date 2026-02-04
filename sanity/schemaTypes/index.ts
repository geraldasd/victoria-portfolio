import { type SchemaTypeDefinition } from 'sanity'
import header from './header'
import project from './project'
import footer from './footer'
import about from './about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [header, project, footer, about],
}
