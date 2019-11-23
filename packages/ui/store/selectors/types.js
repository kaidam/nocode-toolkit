import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import library from '../../types/library'
import finder from './finder'
import content from './content'

const SORT_FIELD_IDS = [
  'name',
  'date',
]

/*

  get the item data from the state
  this can be for an item, section or finder item

*/
const item = createSelector(
  core.router.queryParams,
  finder.list,
  content.sectionAll,
  content.contentAll,
  (queryParams, finderList, sections, content) => {
    const {
      controller,
      driver,
      type,
      id,
    } = queryParams

    if(id == 'new') return null
  
    // if mode is 'finder' - then we find the exiting data from the finder list
    // otherwise, we find it from the content store

    // special case for sections where the data comes from a different part of the store
    if(driver == 'local' && type == 'section') {
      return sections[id]
    }
    else if(controller == 'finder') {
      return finderList.find(item => item.id == id)
    }
    else {
      return content[id]
    }
  }
)

/*

  when an item is edited - what do we save in the itemOptions store
  so the form can mutate without affecting the item itself

*/

const itemEditOptions = createSelector(
  core.router.queryParams,
  item,
  (queryParams, existingItem) => {
    const {
      driver,
      type,
    } = queryParams
  
    const schemaName = [driver, type].join('.')
    const schemaDefinition = library.get(schemaName)

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
)

/*

  get the fields we will insert into the item annotation
  on behalf of the options form

  these values will be merged into the existing item annotation by the api server

*/
const itemSaveAnnotation = createSelector(
  content.itemOptions,
  (itemOptions) => {
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
)

/*

  return these properties for the given type / id

   * typeTitle
   * initialValues
   * schema
  
  if type or id are undefiend they will be plucked from
  the query params

*/

const form = createSelector(
  core.router.queryParams,
  item,
  (queryParams, existingItem) => {
    const {
      driver,
      type,
    } = queryParams

    const schemaName = [driver, type].join('.')
    const schemaDefinition = library.get(schemaName)

    let typeTitle = 'Content'

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
)

const selectors = {
  item,
  form,
  itemEditOptions,
  itemSaveAnnotation,
}

export default selectors
