import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .child(
          S.list()
            .title('Home Page')
            .items([
              S.listItem()
                .title('Header')
                .child(
                  S.documentTypeList('header')
                    .title('Header')
                ),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'header'
      ),
    ])
