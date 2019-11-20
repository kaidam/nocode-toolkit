import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/src/selectors'
import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const contentAll = state => core.nocode.itemGroup(state, 'content')
const sectionAll = state => core.nocode.itemGroup(state, 'sections')
const singletonAll = state => core.nocode.itemGroup(state, 'singletons')

const contentItem = (state, id) => contentAll(state)[id]
const sectionItem = (state, name) => sectionAll(state)[name]
const singletonItem = (state, name) => singletonAll(state)[name]

const itemTree = (state, item) => {
  if(!item) return null
  const returnItem = Object.assign({}, item)
  returnItem.children = (item.children || [])
    .map(id => contentItem(state, id))
    .map(childItem => itemTree(state, childItem))
    .filter(i => i)
  return returnItem
}

const itemList = (state, item) => {
  if(!item) return []
  return (item.children || [])
    .map(id => contentItem(state, id))
    .filter(i => i)
}

const contentTree = (state, id) => itemTree(state, contentItem(state, id))
const sectionTree = (state, name) => itemTree(state, sectionItem(state, name))
const singletonTree = (state, name) => itemTree(state, contentItem(state, singletonItem(state, name)))

const sectionList = (state, name) => itemList(state, sectionItem(state, name))

const parentIds = createSelector(
  contentAll,
  (allItems) => Object.keys(allItems).reduce((all, id) => {
    const item = allItems[id]
    const childrenIds = item.children || []
    childrenIds.forEach(childId => {
      all[childId] = id
    })
    return all
  }, {})
)

const routeItemId = createSelector(
  core.router.route,
  route => route.item,
)

const routeItem = createSelector(
  routeItemId,
  contentAll,
  (id, items) => items[id],
)

const routeItemPath = createSelector(
  routeItemId,
  parentIds,
  (id, parentIds) => {
    const pathToItem = []
    let nextParentId = parentIds[id]
    while(nextParentId != null) {
      pathToItem.unshift(nextParentId)
      nextParentId = parentIds[nextParentId]
    }
    return pathToItem
  },
)

const previousQueryParams = state => state.content.previousQueryParams

const NETWORK_NAMES = networkProps('content', [
  'save',
])

const selectors = {
  contentAll,
  sectionAll,
  singletonAll,
  contentItem,
  sectionItem,
  singletonItem,
  itemTree,
  itemList,
  contentTree,
  sectionTree,
  singletonTree,
  sectionList,
  parentIds,
  routeItemId,
  routeItem,
  routeItemPath,
  previousQueryParams,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors