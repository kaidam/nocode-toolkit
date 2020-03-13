import { createSelector } from 'reselect'
import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

import nocodeSelectors from './nocode'
import routerSelectors from './router'

const website = state => state.ui.website

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

const contentAll = nocodeSelectors.itemGroup('node')
const sectionAll = nocodeSelectors.itemGroup('sections')
const singletonAll = nocodeSelectors.itemGroup('singletons')

const DEFAULT_ITEM = {
  children: [],
}

const contentItem = (id) => createSelector(
  contentAll,
  (content) => content[id] || DEFAULT_ITEM,
)

const queryItem = createSelector(
  contentAll,
  routerSelectors.queryParams,
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

const websiteSyncFolderId = () => () => createSelector(
  website,
  (website) => {
    return website && website.meta ? website.meta.nocodeFolderId : null
  }
)

// const sectionSyncFolder = () => createSelector(
//   sectionAll,
//   contentAll,
//   (_, name) => name,
//   (sections, content, name) => {
//     const section = sections[name]
//     if(!section) return null
//     const syncedChild = section.children
//       .map(id => content[id])
//       .find(item => item.location.ghostParent)
//     if(!syncedChild) return null
//     return content[syncedChild.location.ghostParent]
//   }
// )

const sectionSyncFolder = () => createSelector(
  website,
  sectionAll,
  contentAll,
  (_, name) => name,
  (website, sections, content, name) => {
    // this means we have had folders provisioned for us automatically
    if(website && website.meta && website.meta.autoFoldersEnsure) {
      const id = Object.keys(content).find(id => {
        const item = content[id]
        return item && item.location && item.location.ghostSection && item.location.ghostSection == name
      })
      return content[id]
    }
    // this means it's the old mode where any ghost parent is the linked folder
    else {
      const section = sections[name]
      if(!section) return null
      const syncedChild = section.children
        .map(id => content[id])
        .filter(item => item)
        .find(item => item.location.ghostParent)
      if(!syncedChild) return null
      if(!syncedChild.location) return null
      return content[syncedChild.location.ghostParent]
    }
    
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
  routerSelectors.route,
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

const routeItems = createSelector(
  routeItemPath,
  contentAll,
  (routeItemPath, content) => {
    return routeItemPath
      .map(id => content[id])
      .filter(item => {
        return item.location.isGhost ? false : true
      })
  },
)

const routeSection = createSelector(
  routeItems,
  (routeItems) => {
    const first = routeItems[0]
    if(!first) return
    return first.location.id
  }
)

const sectionPageList = () => createSelector(
  sectionAll,
  contentAll,
  nocodeSelectors.routeMap,
  (_, name) => name,
  (sections, content, routeMap, name) => {
    const section = sections[name]
    const tree = _createTree(content, section)
    const list = []
    const addChildrenToList = (children) => {
      children
        .filter(item => {
          const route = routeMap[item.id]
          return route ? true : false
        })
        .forEach(item => {
          const route = routeMap[item.id]
          if(route.isFolder) {
            addChildrenToList(item.children)
          }
          else {
            list.push(item.id)
          }
        })
    }
    if(tree) addChildrenToList(tree.children)
    return list
  }
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
  websiteSyncFolderId,
  sectionSyncFolder,
  childrenList,
  ghostParent,
  routeItemPath,
  routeItems,
  routeSection,
  sectionPageList,
}

export default selectors