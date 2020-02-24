import icons from '../icons'
import library from './library'

const CellGroups = [{
  id: 'document',
  title: 'Document Widgets',
  icon: 'text',
}, {
  id: 'text',
  title: 'Text Widgets',
  icon: 'title',
}, {
  id: 'media',
  title: 'Media Widgets',
  icon: 'image',
}, {
  id: 'navigation',
  title: 'Navigation Widgets',
  icon: 'backnext',
}, {
  id: 'plugin',
  title: 'Plugins',
  icon: 'plugin',
}, {
  id: 'snippet',
  title: 'Snippets',
  icon: 'code',
}]

const editContentHandler = ({
  item,
  onOpenContentForm,
  onOpenExternalEditor,
  location,
  structure = 'tree',
  sectionType = 'sidebar',
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
          sectionType,
          location,
        }) : {}
    })
}

const addContentItem = ({
  location,
  structure,
  sectionType,
  schemaDefinition,
  stashQueryParams,
  onOpenFinder,
  onOpenContentForm,
}) => {
  const handler = () => {
    schemaDefinition.openDialog == 'finder' ?
      onOpenFinder({
        driver: schemaDefinition.driver,
        location,
        params: schemaDefinition.finder && schemaDefinition.finder.getQueryParams ?
          schemaDefinition.finder.getQueryParams({
            structure,
            sectionType,
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
            sectionType,
            location,
          }) : {}
      })
  }

  return {
    title: schemaDefinition.title,
    icon: icons[schemaDefinition.icon],
    secondaryIcon: icons[schemaDefinition.secondaryIcon],
    type: schemaDefinition.type,
    handler,
  }
}

const addCellWidgetOptions = ({
  location = 'document',
  settings,
  insertHandler,
  addHandler,
}) => {

  const activePlugins = settings && settings.data && settings.data.activePlugins ?
    settings.data.activePlugins :
    {}
    
  const baseHandler = (type, schema) => {

    const cellConfig = schema.cellConfig || {}

    // if the schema definition gives us a cell
    // it means to be inserted immediately
    if(cellConfig.cell) {
      insertHandler(cellConfig.cell)
    }
    // otherwise we open the editor for the cell
    else {
      addHandler({
        type,
      })
    }      
  }

  const snippetHandler = (id) => {
    insertHandler({
      component: 'snippet',
      source: 'cell',
      editor: 'local',
      data: {
        id,
      },
    })
  }

  const groups = library.list()
    .filter(schemaDefinition => {
      const parentFilter = schemaDefinition.parentFilter || []
      if(schemaDefinition.plugin && !activePlugins[schemaDefinition.plugin]) return false
      const hasCellParent = parentFilter.indexOf('cell') >= 0
      if(!hasCellParent) return false
      if(schemaDefinition.addCellFilter) {
        return schemaDefinition.addCellFilter(settings, {
          location,
        })
      }
      else {
        return true
      }
    })
    .reduce((all, schemaDefinition) => {
      const cellConfig = schemaDefinition.cellConfig || {}
      const cellGroup = schemaDefinition.plugin ?
        'plugin' :
        cellConfig.group
      if(!cellGroup) return all
      const group = all[cellGroup] || []
      group.push({
        title: schemaDefinition.title,
        icon: icons[schemaDefinition.icon],
        secondaryIcon: icons[schemaDefinition.secondaryIcon],
        type: schemaDefinition.type,
        help: schemaDefinition.help,
        handler: () => baseHandler(schemaDefinition.type, schemaDefinition),
      })
      all[cellGroup] = group
      return all
    }, {})

  groups.snippet = settings && settings.data && settings.data.snippets ?
    settings.data.snippets
      .filter(snippet => snippet.global ? false : true)
      .map(snippet => ({
        title: snippet.name,
        icon: icons.code,
        type: 'snippet',
        handler: () => snippetHandler(snippet.id),
      })) : 
      []

  return CellGroups
    .filter(group => {
      return groups[group.id] && groups[group.id].length > 0
    })
    .map(group => {
      return {
        title: group.title,
        icon: icons[group.icon],
        items: groups[group.id],
      }
    })
}

const addContentOptions = ({
  filter,
  location,
  driver,
  type,
  structure = 'tree',
  sectionType = 'sidebar',
  stashQueryParams = false,
  onOpenFinder,
  onOpenContentForm,
  groupFilter,
  withGroups = true,
}) => {

  const groups = {}
  const groupItems = []
  const items = []

  library.list()
    .filter(schemaDefinition => {
      if(!filter) return true
      const parentFilter = schemaDefinition.parentFilter || []
      return filter(parentFilter, schemaDefinition)
    })
    .forEach(schemaDefinition => {
      const item = {
        title: schemaDefinition.title,
        icon: icons[schemaDefinition.icon],
        secondaryIcon: icons[schemaDefinition.secondaryIcon],
        type: schemaDefinition.type,
        handler: () => {
          schemaDefinition.openDialog == 'finder' ?
            onOpenFinder({
              driver: schemaDefinition.driver,
              location,
              params: schemaDefinition.finder && schemaDefinition.finder.getQueryParams ?
                schemaDefinition.finder.getQueryParams({
                  structure,
                  sectionType,
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
                  sectionType,
                  location,
                }) : {}
            })
        }
      }

      const groupName = (schemaDefinition.metadata || {}).group

      if(groupName && withGroups) {
        if(!groups[groupName]) {
          const groupSchema = library.get([schemaDefinition.driver, groupName].join('.'))
          const group = {
            title: groupSchema.title,
            icon: icons[groupSchema.icon],
            type: groupSchema.type,
            items: [],
            isGroup: true,
          }
          groups[groupName] = group
          groupItems.push(group)
        }
        groups[groupName].items.push(item)
      }
      else {
        items.push(item)
      }
    })

  let useGroupFilter = groupFilter

  // for drive items - filter down to only drive things we can add
  if(driver == 'drive') useGroupFilter = 'driveGroup'

  if(useGroupFilter) {
    const group = groups[useGroupFilter]
    if(!group) return []
    return group.items
  }
  else {
    return groupItems.concat(items)
  }
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
        secondaryIcon: icons[schemaDefinition.secondaryIcon],
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
        secondaryIcon: icons[schemaDefinition.secondaryIcon],
        type: schemaDefinition.type,
        help: schemaDefinition.help,
        handler: () => handler(schemaDefinition.type, schemaDefinition),
      }
    })
}

const ui = {
  editContentHandler,
  addContentOptions,
  addCellWidgetOptions,
  addContentOptionsWithCallback,
  addCellOptionsWithCallback,
}

export default ui