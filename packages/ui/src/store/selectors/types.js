import core from '@nocode-toolkit/website/src/selectors'
import library from '../../types/library'
import finder from './finder'

const SORT_FIELD_IDS = [
  'name',
  'date',
]

/*

  get the item data from the state
  this can be for an item, section or finder item

*/
const item = (state, {
  mode,
  driver,
  type,
  id,
}) => {
  // if mode is 'finder' - then we find the exiting data from the finder list
  // otherwise, we find it from the content store
  let existingItem = null

  // special case for sections where the data comes from a different part of the store
  if(driver == 'local' && type == 'section') {
    existingItem = core.nocode.item(state, 'sections', id)
  }
  else {
    existingItem = mode == 'finder' ?
      finder.item(state, id) :
      core.nocode.item(state, 'content', id)
  }

  return existingItem
}

/*

  when an item is edited - what do we save in the itemOptions store
  so the form can mutate without affecting the item itself

*/
const itemEditOptions = (state, {
  mode,
  driver,
  type,
  id,
}) => {

  const schemaName = [driver, type].join('.')
  const schemaDefinition = library.get(schemaName)

  const existingItem = id == 'new' ? 
    null :
    item(state, {
      mode,
      driver,
      type,
      id,
    })

  const options = {}

  // add sorting options
  if(schemaDefinition && schemaDefinition.metadata.hasChildren) {
    
    let sortType = 'name'
    let sortOrder = 'asc'
    let sortIds = existingItem ? (existingItem.children || []) : []

    const annotation = existingItem ? existingItem.annotation : null
    const sortConfig = annotation ? annotation.sort : null
    
    if(sortConfig) {

      if(SORT_FIELD_IDS.indexOf(sortConfig.field) >= 0) {
        sortType = sortConfig.field
        sortOrder = sortConfig.direction || sortOrder
      }
      else if(sortConfig.ids) {
        sortType = 'manual'

        const missingChildrenIds = sortIds.filter(id => {
          return sortConfig.ids.indexOf(id) < 0
        })

        // make sure to add any children we find to account for things added
        // since the last time the sort ids were edited
        sortIds = sortConfig.ids.concat(missingChildrenIds)
      }
    }

    options.sortType = sortType
    options.sortOrder = sortOrder
    options.sortIds = sortIds
  }

  return options
}

/*

  get the fields we will insert into the item annotation
  on behalf of the options form

  these values will be merged into the existing item annotation by the api server

*/
const itemSaveAnnotation = (state) => {
  const itemOptions = state.content.itemOptions || {}

  const annotation = {}

  if(itemOptions.sortType == 'manual') {
    annotation.sort = {
      ids: itemOptions.sortIds,
    }
  }
  else if(SORT_FIELD_IDS.indexOf(itemOptions.sortType) >= 0) {
    annotation.sort = {
      field: itemOptions.sortType,
      direction: itemOptions.sortOrder,
    }
  }

  return Object.keys(annotation).length > 0 ? annotation : null
}

/*

  return these properties for the given type / id

   * typeTitle
   * initialValues
   * schema
  
  if type or id are undefiend they will be plucked from
  the query params

*/
const form = (state, {
  driver,
  type,
  id,
  controller,
} = {}) => {
  const queryParams = core.router.queryParams(state)
  
  controller = controller || queryParams.controller || ''
  driver = driver || queryParams.driver
  type = type || queryParams.type
  id = id || queryParams.id

  const mode = controller == 'finder' ?
    'finder' :
    'content'
  
  const schemaName = [driver, type].join('.')
  const schemaDefinition = library.get(schemaName)

  let typeTitle = 'Content'

  // if mode is 'finder' - then we find the exiting data
  // from the finder list - otherwise, we find it from the content store
  const existingItem = item(state, {
    mode,
    driver,
    type,
    id,
  })

  let schema = []
  let initialValues = null

  if(existingItem) {
    initialValues = existingItem.data
  }

  // configure the form with extra sections
  // for example - if has children - show the sorting tab
  const tabs = []

  if(schemaDefinition) {
    schema = schemaDefinition.schema
    initialValues = initialValues || schemaDefinition.initialValues
    typeTitle = schemaDefinition.title

    if(schema.length > 0) {
      tabs.push({
        id: 'details',
        title: 'Details',
      })
    }

    if(mode != 'finder') {
      // we don't want sorting in the finder
      if(schemaDefinition.metadata.hasChildren) {
        tabs.push({
          id: 'sorting',
          title: 'Sorting',
        })
      }
    }    
  }

  return {
    typeTitle,
    schema,
    initialValues,
    tabs,
  }
}

const itemOptions = state => state.content.itemOptions

const selectors = {
  item,
  itemEditOptions,
  itemSaveAnnotation,
  form,
  itemOptions,
}

export default selectors
