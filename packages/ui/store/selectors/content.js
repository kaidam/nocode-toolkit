import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const _createTree = (content, item) => {
  if(!item) return null
  const returnItem = Object.assign({}, item)
  returnItem.children = (item.children || [])
    .map(id => content[id])
    .map(childItem => _createTree(content, childItem))
    .filter(i => i)
  return returnItem
}

const _createList = (content, item) => {
  if(!item) return []
  return (item.children || [])
    .map(id => content[id])
    .filter(i => i)
}

const NETWORK_NAMES = networkProps('content', [
  'save',
])

const previousQueryParams = state => state.content.previousQueryParams
const itemOptions = state => state.content.itemOptions

const contentAll = core.nocode.itemGroup('content')
const sectionAll = core.nocode.itemGroup('sections')
const singletonAll = core.nocode.itemGroup('singletons')

const DEFAULT_ITEM = {
  data: {},
  children: [],
}

const contentItem = (id) => createSelector(
  contentAll,
  (content) => content[id] || DEFAULT_ITEM,
)

const queryItem = createSelector(
  contentAll,
  core.router.queryParams,
  (content, {id}) => content[id],
)

const sectionTree = () => createSelector(
  sectionAll,
  contentAll,
  (_, name) => name,
  (sections, content, name) => {
    const section = sections[name]
    return _createTree(content, section)
  }
)

const sectionItem = () => createSelector(
  sectionAll,
  (_, name) => name,
  (sections, name) => sections[name] || DEFAULT_ITEM,
)

const sectionList = () => createSelector(
  sectionAll,
  contentAll,
  (_, name) => name,
  (sections, content, name) => {
    const section = sections[name]
    return _createList(content, section)
  }
)

const childrenList = () => createSelector(
  contentAll,
  (_, id) => id,
  (content, id) => {
    const parent = content[id]
    return _createList(content, parent)
  }
)

const ghostParent = () => createSelector(
  contentAll,
  (_, item) => item,
  (content, item) => {
    if(!item) return item
    return content[item.location.ghostParent]
  }
)

const routeItemPath = createSelector(
  core.router.route,
  contentAll,
  (route, content) => {
    const id = route.item
    const parentIds = Object.keys(content).reduce((all, id) => {
      const item = content[id]
      const childrenIds = item.children || []
      childrenIds.forEach(childId => {
        all[childId] = id
      })
      return all
    }, {})
    const pathToItem = []
    let nextParentId = parentIds[id]
    while(nextParentId != null) {
      pathToItem.unshift(nextParentId)
      nextParentId = parentIds[nextParentId]
    }
    return pathToItem
  },
)

const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  previousQueryParams,
  itemOptions,
  contentAll,
  contentItem,
  sectionItem,
  sectionAll,
  sectionItem,
  singletonAll,
  queryItem,
  sectionTree,
  sectionList,
  childrenList,
  ghostParent,
  routeItemPath,
}

export default selectors