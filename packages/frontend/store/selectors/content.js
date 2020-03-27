import { createSelector } from 'reselect'

import library from '../../library'
import childrenUtils from '../../utils/children'
import nocodeSelectors from './nocode'
import routerSelectors from './router'

const DEFAULT_OBJECT = {}
const DEFAULT_ARRAY = []

const formWindow = state => state.content.formWindow

const settings = createSelector(
  nocodeSelectors.nodes,
  nodes => nodes.settings || DEFAULT_OBJECT,
)

const sectionTree = () => createSelector(
  nocodeSelectors.sections,
  nocodeSelectors.nodes,
  nocodeSelectors.annotations,
  nocodeSelectors.locations,
  (_, name) => name,
  (sections, nodes, annotations, locations, name) => {
    const getChildren = ({
      parentId,
      childIds,
    }) => {
      const sortedChildIds = childrenUtils.sortChildren({
        nodes,
        childIds,
        annotation: annotations[parentId],
      })
      return sortedChildIds.map(id => {
        const node = nodes[id]
        return Object.assign({}, node, {
          children: getChildren({
            parentId: id,
            childIds: node.children,
          })
        })
      })
    }

    const childIds = childrenUtils.getSectionChildrenIds({
      section: sections[name],
      nodes,
      locations,
    })

    return getChildren({
      parentId: `section:${name}`,
      childIds,
    })
  }
)

const section = () => createSelector(
  nocodeSelectors.nodes,
  nocodeSelectors.sections,
  nocodeSelectors.annotations,
  nocodeSelectors.locations,
  (_, name) => name,
  (nodes, sections, annotations, locations, name) => {
    const section = sections[name]
    if(!section) return null
    const annotation = annotations[`section:${name}`] || {}
    const ghostId = (section.children || []).find(childId => {
      const childLocation = locations[`section:${name}:${childId}`]
      return childLocation && childLocation.data.ghost ? true : false
    })
    const ghostFolder = ghostId ?
      nodes[ghostId] :
      null
    return {
      node: section,
      annotation,
      ghostFolder,
    }
  },
)

const itemChildren = () => createSelector(
  nocodeSelectors.nodes,
  nocodeSelectors.sections,
  nocodeSelectors.annotations,
  nocodeSelectors.locations,
  (_, id) => id,
  (nodes, sections, annotations, locations, id) => {
    let childIds = []
    if(id.indexOf('section:') == 0) {
      const [ _, sectionId ] = id.split(':')
      childIds = childrenUtils.getSectionChildrenIds({
        section: sections[sectionId],
        nodes,
        locations,
      })
    }
    else {
      const node = nodes[id]
      childIds = node.children
    }
    const sortedChildIds = childrenUtils.sortChildren({
      nodes,
      childIds,
      annotation: annotations[id],
    })
    return sortedChildIds.map(id => nodes[id])
  },
)

// given an item id and it's parent id
// return the route for that item at that location
// this handles the fact the parent id might
// be a ghost folder and resolves into the section
// if that is the case
const itemRoute = () => createSelector(
  routerSelectors.routeMap,
  nocodeSelectors.locations,
  (_, params) => params,
  (routeMap, locations, {parentId, itemId} = {}) => {

    // search the locations for one matching our parent
    // which tells us that the parent is a ghost folder
    // for a section
    const parentLocationId = Object
      .keys(locations)
      .find(locationId => {
        const location = locations[locationId]
        return location.content_id == parentId
      })

    const parentLocation = parentLocationId ?
      locations[parentLocationId] :
      null

    const routeId = parentLocation ?
      `${parentLocation.location}:${itemId}` :
      `node:${parentId}:${itemId}`

    return routeMap[routeId]
  },
)

const form = createSelector(
  formWindow,
  (formWindow) => {
    return formWindow ?
      library.forms[formWindow.form] :
      {
        schema: [],
      }
  }
)

const formValues = createSelector(
  formWindow,
  (formWindow) => {
    if(!formWindow) return DEFAULT_OBJECT
    return formWindow.values || DEFAULT_OBJECT
  }
)

const formSchema = createSelector(
  formWindow,
  (formWindow) => {
    if(!formWindow) return DEFAULT_ARRAY
    const form = library.forms[formWindow.form]
    if(!form) return DEFAULT_ARRAY
    const tabSchema = (form.tabs || []).reduce((all, tab) => {
      return all.concat(tab.schema)
    }, [])
    return (form.schema || []).concat(tabSchema)
  }
)

const selectors = {
  formWindow,
  settings,
  sectionTree,
  section,
  itemRoute,
  itemChildren,
  form,
  formValues,
  formSchema,
}

export default selectors

// const website = state => state.ui.website

// const _createTree = (content, item) => {
//   if(!item) return null
//   const returnItem = Object.assign({}, item)
//   returnItem.children = (item.children || [])
//     .map(id => content[id])
//     .map(childItem => _createTree(content, childItem))
//     .filter(i => i)
//   return returnItem
// }

// const _createList = (content, item) => {
//   if(!item) return []
//   return (item.children || [])
//     .map(id => content[id])
//     .filter(i => i)
// }

// const NETWORK_NAMES = networkProps('content', [
//   'save',
// ])

// const previousQueryParams = state => state.content.previousQueryParams
// const itemOptions = state => state.content.itemOptions

// const contentAll = nocodeSelectors.itemGroup('node')
// const sectionAll = nocodeSelectors.itemGroup('sections')
// const singletonAll = nocodeSelectors.itemGroup('singletons')

// const DEFAULT_ITEM = {
//   children: [],
// }

// const contentItem = (id) => createSelector(
//   contentAll,
//   (content) => content[id] || DEFAULT_ITEM,
// )

// const queryItem = createSelector(
//   contentAll,
//   routerSelectors.queryParams,
//   (content, {id}) => content[id],
// )

// const sectionTree = () => createSelector(
//   sectionAll,
//   contentAll,
//   (_, name) => name,
//   (sections, content, name) => {
//     const section = sections[name]
//     return _createTree(content, section)
//   }
// )

// const websiteSyncFolderId = () => () => createSelector(
//   website,
//   (website) => {
//     return website && website.meta ? website.meta.nocodeFolderId : null
//   }
// )

// // const sectionSyncFolder = () => createSelector(
// //   sectionAll,
// //   contentAll,
// //   (_, name) => name,
// //   (sections, content, name) => {
// //     const section = sections[name]
// //     if(!section) return null
// //     const syncedChild = section.children
// //       .map(id => content[id])
// //       .find(item => item.location.ghostParent)
// //     if(!syncedChild) return null
// //     return content[syncedChild.location.ghostParent]
// //   }
// // )

// const sectionSyncFolder = () => createSelector(
//   website,
//   sectionAll,
//   contentAll,
//   (_, name) => name,
//   (website, sections, content, name) => {
//     // this means we have had folders provisioned for us automatically
//     if(website && website.meta && website.meta.autoFoldersEnsure) {
//       const id = Object.keys(content).find(id => {
//         const item = content[id]
//         return item && item.location && item.location.ghostSection && item.location.ghostSection == name
//       })
//       return content[id]
//     }
//     // this means it's the old mode where any ghost parent is the linked folder
//     else {
//       const section = sections[name]
//       if(!section) return null
//       const syncedChild = section.children
//         .map(id => content[id])
//         .filter(item => item)
//         .find(item => item.location.ghostParent)
//       if(!syncedChild) return null
//       if(!syncedChild.location) return null
//       return content[syncedChild.location.ghostParent]
//     }
    
//   }
// )

// const sectionItem = () => createSelector(
//   sectionAll,
//   (_, name) => name,
//   (sections, name) => sections[name] || DEFAULT_ITEM,
// )

// const sectionList = () => createSelector(
//   sectionAll,
//   contentAll,
//   (_, name) => name,
//   (sections, content, name) => {
//     const section = sections[name]
//     return _createList(content, section)
//   }
// )

// const childrenList = () => createSelector(
//   contentAll,
//   (_, id) => id,
//   (content, id) => {
//     const parent = content[id]
//     return _createList(content, parent)
//   }
// )

// const ghostParent = () => createSelector(
//   contentAll,
//   (_, item) => item,
//   (content, item) => {
//     if(!item) return item
//     return content[item.location.ghostParent]
//   }
// )

// const routeItemPath = createSelector(
//   routerSelectors.route,
//   contentAll,
//   (route, content) => {
//     const id = route.item
//     const parentIds = Object.keys(content).reduce((all, id) => {
//       const item = content[id]
//       const childrenIds = item.children || []
//       childrenIds.forEach(childId => {
//         all[childId] = id
//       })
//       return all
//     }, {})
//     const pathToItem = []
//     let nextParentId = parentIds[id]
//     while(nextParentId != null) {
//       pathToItem.unshift(nextParentId)
//       nextParentId = parentIds[nextParentId]
//     }
//     return pathToItem
//   },
// )

// const routeItems = createSelector(
//   routeItemPath,
//   contentAll,
//   (routeItemPath, content) => {
//     return routeItemPath
//       .map(id => content[id])
//       .filter(item => {
//         return item.location.isGhost ? false : true
//       })
//   },
// )

// const routeSection = createSelector(
//   routeItems,
//   (routeItems) => {
//     const first = routeItems[0]
//     if(!first) return
//     return first.location.id
//   }
// )

// const sectionPageList = () => createSelector(
//   sectionAll,
//   contentAll,
//   nocodeSelectors.routeMap,
//   (_, name) => name,
//   (sections, content, routeMap, name) => {
//     const section = sections[name]
//     const tree = _createTree(content, section)
//     const list = []
//     const addChildrenToList = (children) => {
//       children
//         .filter(item => {
//           const route = routeMap[item.id]
//           return route ? true : false
//         })
//         .forEach(item => {
//           const route = routeMap[item.id]
//           if(route.isFolder) {
//             addChildrenToList(item.children)
//           }
//           else {
//             list.push(item.id)
//           }
//         })
//     }
//     if(tree) addChildrenToList(tree.children)
//     return list
//   }
// )

//const selectors = {
  // errors: props(networkErrors, NETWORK_NAMES),
  // loading: props(networkLoading, NETWORK_NAMES),
  // previousQueryParams,
  // itemOptions,
  // contentAll,
  // contentItem,
  // sectionItem,
  // sectionAll,
  // sectionItem,
  // singletonAll,
  // queryItem,
  // sectionTree,
  // sectionList,
  // websiteSyncFolderId,
  // sectionSyncFolder,
  // childrenList,
  // ghostParent,
  // routeItemPath,
  // routeItems,
  // routeSection,
  // sectionPageList,
//}

//export default selectors