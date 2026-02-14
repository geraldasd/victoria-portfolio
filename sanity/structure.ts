import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings')
            .title('Site Settings')
        ),
      S.divider(),
      S.listItem()
        .title('Home Page')
        .child(
          S.document()
            .schemaType('header')
            .documentId('header')
            .title('Header')
        ),
      S.listItem()
        .title('About')
        .child(
          S.document()
            .schemaType('about')
            .documentId('about')
            .title('About')
        ),
      S.listItem()
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('Projects')
        ),
      S.listItem()
        .title('Footer')
        .child(
          S.document()
            .schemaType('footer')
            .documentId('footer')
            .title('Footer')
        ),
    ])
