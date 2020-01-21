import icons from '../icons'
import library from './library'

const editContentHandler = ({
  item,
  onOpenContentForm,
  onOpenExternalEditor,
  location,
  structure = 'tree',
}) => {
  const schemaDefinition = library.getItemSchema(item)
  return schemaDefinition.metadata.externalEditor ?
    () => onOpenExternalEditor({
      driver: item.driver,
      id: item.id,
    })
    : () => onOpenContentForm({
      driver: item.driver,
      type: item.type,
      id: item.id,
      location,
      params: schemaDefinition.content && schemaDefinition.content.getQueryParams ?
        schemaDefinition.content.getQueryParams({
          structure,
          location,
        }) : {}
    })
}

const addContentOptions = ({
  filter,
  location,
  structure = 'tree',
  stashQueryParams = false,
  onOpenFinder,
  onOpenContentForm,
}) => {

  return library.list()
    .filter(schemaDefinition => {
      if(!filter) return true
      const parentFilter = schemaDefinition.parentFilter || []
      return filter(parentFilter, schemaDefinition)
    })
    .map(schemaDefinition => {
      return {
        title: schemaDefinition.title,
        icon: icons[schemaDefinition.icon],
        type: schemaDefinition.type,
        handler: () => {
          schemaDefinition.openDialog == 'finder' ?
            onOpenFinder({
              driver: schemaDefinition.driver,
              location,
              params: schemaDefinition.finder && schemaDefinition.finder.getQueryParams ?
                schemaDefinition.finder.getQueryParams({
                  structure,
                  location,
                }) : {}
            }) :
            onOpenContentForm({
              driver: schemaDefinition.driver,
              type: schemaDefinition.type,
              location,
              stashQueryParams,
              params: schemaDefinition.content && schemaDefinition.content.getQueryParams ?
                schemaDefinition.content.getQueryParams({
                  structure,
                  location,
                }) : {}
            })
        }
      }
    })
}

const addContentOptionsWithCallback = ({
  filter,
  handler,
}) => {

  return library.list()
    .filter(schemaDefinition => {
      if(!filter) return true
      const parentFilter = schemaDefinition.parentFilter || []
      return filter(parentFilter, schemaDefinition)
    })
    .map(schemaDefinition => {
      return {
        title: schemaDefinition.title,
        icon: icons[schemaDefinition.icon],
        type: schemaDefinition.type,
        help: schemaDefinition.help,
        handler: () => handler(schemaDefinition.type, schemaDefinition),
      }
    })
}



const addCellOptionsWithCallback = ({
  filter,
  handler,
}) => {

  return library.list()
    .filter(schemaDefinition => {
      if(!filter) return true
      const parentFilter = schemaDefinition.parentFilter || []
      return filter(parentFilter, schemaDefinition)
    })
    .map(schemaDefinition => {
      return {
        title: schemaDefinition.title,
        icon: icons[schemaDefinition.icon],
        type: schemaDefinition.type,
        help: schemaDefinition.help,
        handler: () => handler(schemaDefinition.type, schemaDefinition),
      }
    })
}

const ui = {
  editContentHandler,
  addContentOptions,
  addContentOptionsWithCallback,
  addCellOptionsWithCallback,
}

export default ui