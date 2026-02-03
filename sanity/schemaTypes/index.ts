import { type SchemaTypeDefinition } from 'sanity'
import header from './header'
import project from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [header, project],
}
