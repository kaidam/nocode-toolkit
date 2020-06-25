import { createSelector } from 'reselect'
import deepmerge from 'deepmerge'
import childrenUtils from '../../utils/children'
import documentUtils from '../../utils/document'
import nocodeSelectors from './nocode'
import routerSelectors from './router'
import systemSelectors from './system'
import settingsSelectors from './settings'

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
  routerSelectors.routeMap,
  routerSelectors.route,
  (_, name) => name,
  (sections, nodes, annotations, locations, routeMap, currentRoute, name) => {
    const getChildren = ({
      parentId,
      location,
      childIds,
    }) => {
      const sortedChildIds = childrenUtils.sortChildren({
        nodes,
        childIds,
        annotation: annotations[parentId],
      })
      return sortedChildIds
        .filter(id => {
          const annotation = annotations[id]
          return !annotation || !annotation.hidden
        })
        .map(id => {
          let route = routeMap[`${location}:${id}`]
          const node = nodes[id]
          return Object.assign({}, node, {
            route,
            currentPage: currentRoute.item == node.id,
            annotation: annotations[id],
            children: getChildren({
              parentId: id,
              location: `node:${id}`,
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
      location: `section:${name}`,
      childIds,
    })
  }
)

const section = () => createSelector(
  nocodeSelectors.nodes,
  nocodeSelectors.sections,
  nocodeSelectors.annotations,
  nocodeSelectors.locations,
  systemSelectors.website,
  (_, name) => name,
  (nodes, sections, annotations, locations, website, name) => {
    const section = sections[name]
    if(!section) return null
    const annotation = annotations[`section:${name}`] || {}

    const defaultFolderId = website && website.meta ?
      website.meta[`nocode_default_resource_id_${name}`] :
      null

    const sourceFolders = (section.children || [])
      .filter(childId => {
        const childLocation = locations[`section:${name}:${childId}`]
        return childLocation && childLocation.data && childLocation.data.ghost ? true : false
      })
      .map(sourceFolderId => nodes[sourceFolderId])

    let addTargetFolderId = defaultFolderId
    if(annotation.addTargetFolderId && sourceFolders.find(f => f.id == annotation.addTargetFolderId)) addTargetFolderId = annotation.addTargetFolderId

    if(!addTargetFolderId && sourceFolders && sourceFolders.length > 0) addTargetFolderId = sourceFolders[0].id

    return {
      node: section,
      annotation,
      defaultFolderId,
      addTargetFolderId,
      sourceFolders,
    }
  },
)

// this returns the singleton item
// if there is one
const homeSingletonItem = createSelector(
  nocodeSelectors.nodes,
  nocodeSelectors.singletons,
  systemSelectors.website,
  routerSelectors.routeNameMap,
  routerSelectors.route,
  (nodes, singletons, website, routeMap, currentRoute) => {
    const route = routeMap['root']
    const singleton = singletons['home']
    if(!route || !singleton) return null
    const node = nodes[singleton.item]
    if(!node) return null
    return Object.assign({}, node, {
      isSingletonHome: true,
      name: 'Home',
      route,
      currentPage: currentRoute.item == node.id,
      children: [],
    })
  },
)

const sectionHiddenItems = () => createSelector(
  nocodeSelectors.nodes,
  nocodeSelectors.sections,
  nocodeSelectors.annotations,
  nocodeSelectors.locations,
  (_, name) => name,
  (nodes, sections, annotations, locations, name) => {
    const hiddenItems = []
    const processChildren = ({
      childIds,
    }) => {
      childIds
        .filter(id => {
          const annotation = annotations[id]
          return annotation && annotation.hidden
        })
        .forEach(id => {
          hiddenItems.push(nodes[id])
        })
      childIds
        .forEach(id => processChildren({
          childIds: nodes[id].children || [],
        }))
    }

    processChildren({
      childIds: childrenUtils.getSectionChildrenIds({
        section: sections[name],
        nodes,
        locations,
      })
    })

    return hiddenItems
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
    return sortedChildIds
      .filter(id => {
        const annotation = annotations[id]
        return !annotation || !annotation.hidden
      })
      .map(id => nodes[id])
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
  settingsSelectors.forms,
  formWindow,
  (storeForms, formWindow) => {
    const formNames = formWindow.forms || []
   
    const initialValues = deepmerge.all(
      formNames.map(name => {
        const formConfig = storeForms[name]
        return formConfig.initialValues
      }).concat([formWindow.values])  
    )

    // if we want tabs - reduce the form names into their respective schema tabs
    const tabs = formWindow.singlePage ? null : formNames.reduce((all, name) => {
      const formConfig = storeForms[name]
      if(formConfig.tabs) {
        return all.concat(formConfig.tabs)
      }
      else if(formConfig.schema) {
        return all.concat([{
          id: formConfig.id,
          title: formConfig.title,
          schema: formConfig.schema,
          handers: formConfig.handers,
        }])
      }
      else {
        return all
      }
    }, [])

    // if we want single page - reduce the form names into a long list
    const schema = formWindow.singlePage ? formNames.reduce((all, name) => {
      const formConfig = storeForms[name]
      if(formConfig.tabs) {
        return all
          .concat(formConfig.tabs.reduce((all, tab) => {
            return all
              .concat(tab.noTitle ? [] : [tab.title])
              .concat(tab.schema)
          }, []))
      }
      else if(formConfig.schema) {
        return all
          .concat([
            formConfig.title
          ])
          .concat(formConfig.schema)
      }
      else {
        return all
      }
    }, []) : null

    const otherProps = formNames.reduce((all, name) => {
      const formConfig = storeForms[name]
      const ret = Object.assign({}, all, formConfig)
      delete(ret.tabs)
      delete(ret.schema)
      delete(ret.initialValues)
      return ret
    }, {})

    return {
      tabs,
      schema,
      initialValues,
      ...otherProps
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

// flatten the current (potentially tabbed) schema into a single list
// this is used for the validation
const flatFormSchema = createSelector(
  form,
  (form) => {
    if(!form) return DEFAULT_ARRAY
    const tabSchema = (form.tabs || []).reduce((all, tab) => {
      return all.concat(tab.schema)
    }, [])
    return (form.schema || []).concat(tabSchema)
  }
)

const document = createSelector(
  routerSelectors.route,
  nocodeSelectors.nodes,
  nocodeSelectors.annotations,
  nocodeSelectors.externals,
  (route, nodes, annotations, externalMap) => {
    const node = nodes[route.item]
    if(!node) return {
      node: {},
      route,
      html: '',
    }
    const externals = (route.externals || []).map(id => externalMap[id])
    const annotation = annotations[node.id] || {}

    const {
      html,
      cssImports,
    } = documentUtils.extractImports(externals[0])

    return {
      node: Object.assign({}, node, {route}),
      route,
      annotation,
      html,
      cssImports,
    }
  },
)

const getAncestors = ({
  route,
  nodes,
  routePathMap,
  baseUrl,
}) => {
  let currentRoute = route
  const pathToItem = []
  while(currentRoute) {
    pathToItem.unshift({
      route: currentRoute,
      node: nodes[currentRoute.item],
    })
    const routePath = currentRoute.path.replace(baseUrl, '/')
    const parts = routePath.split('/')
    parts.pop()
    const parentRoutePath = parts.join('/')
    currentRoute = routePathMap[parentRoutePath]
  }
  return pathToItem
}

const routeAncestors = createSelector(
  routerSelectors.route,
  nocodeSelectors.nodes,
  routerSelectors.routePathMap,
  nocodeSelectors.config,
  (route, nodes, routePathMap, config) => getAncestors({
    route,
    nodes,
    routePathMap,
    baseUrl: config.baseUrl,
  })
)

// include the home item in the ancestors
const fullRouteAncestors = createSelector(
  routerSelectors.route,
  nocodeSelectors.nodes,
  routerSelectors.routePathMap,
  nocodeSelectors.config,
  (route, nodes, routePathMap, config) => {
    const ancestors = getAncestors({
      route,
      nodes,
      routePathMap,
      baseUrl: config.baseUrl,
    })
    const first = ancestors[0]
    const homeRoute = routePathMap[config.baseUrl]
    const homeItem = homeRoute ? nodes[homeRoute.item] : null
    if(!homeItem) return ancestors
    if(!homeItem.children) return ancestors

    if(homeItem.children.find(id => first && first.node && id == first.node.id)) {
      return [{
        node: homeItem,
        route: homeRoute,
      }].concat(ancestors)
    }
    else {
      return ancestors
    }
  },
)

// tells you the section (or singleton)
// that is the ultimate parent of the current route
const routeBaseLocation = createSelector(
  routeAncestors,
  (routeAncestors) => {
    const baseRoute = routeAncestors[0]
    if(!baseRoute) return null
    return baseRoute.route.location
  }
)

const routeChildren = createSelector(
  routerSelectors.route,
  nocodeSelectors.nodes,
  nocodeSelectors.annotations,
  routerSelectors.routeMap,
  (route, nodes, annotations, routeMap) => {
    const item = nodes[route.item]
    const sortedChildIds = childrenUtils.sortChildren({
      nodes,
      childIds: item.children,
      annotation: annotations[item.id],
    })
    return sortedChildIds.map(id => {
      const node = nodes[id]
      const route = routeMap[`node:${item.id}:${id}`]
      return Object.assign({}, node, {
        route,
        annotation: annotations[id],
      })
    })
  },
)

const selectors = {
  formWindow,
  settings,
  sectionTree,
  homeSingletonItem,
  sectionHiddenItems,
  section,
  itemRoute,
  itemChildren,
  form,
  formValues,
  flatFormSchema,
  document,
  routeAncestors,
  fullRouteAncestors,
  routeBaseLocation,
  routeChildren,
}

export default selectors
