import { createSelector } from 'reselect'
import { v4 as uuid } from 'uuid'
import childrenUtils from '../../utils/children'
import documentUtils from '../../utils/document'
import nocodeSelectors from './nocode'
import routerSelectors from './router'
import settingsSelectors from './settings'
import websiteSelectors from './website'

import {
  DEFAULT_LAYOUT,
  DEFAULT_CELL_SETTINGS,
} from '../../config'

const sectionTree = () => createSelector(
  nocodeSelectors.sections,
  nocodeSelectors.nodes,
  nocodeSelectors.annotations,
  nocodeSelectors.locations,
  nocodeSelectors.routeMap,
  nocodeSelectors.route,
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
  websiteSelectors.websiteData,
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
  nocodeSelectors.routeMap,
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

const document = createSelector(
  nocodeSelectors.route,
  routerSelectors.params,
  nocodeSelectors.nodes,
  nocodeSelectors.annotations,
  nocodeSelectors.externals,
  settingsSelectors.settings,
  websiteSelectors.websiteMeta,
  websiteSelectors.websiteLayouts,
  (route, routeParams, nodes, annotations, externalMap, settings, websiteMeta, templateLayouts) => {
    let externalIds = []
    let node = null

    if(route.name == '_external_loader') {
      node = {
        id: routeParams.id,
        type: 'document',
        externallyLoaded: true,
      }
      externalIds = [`drive:${routeParams.id}.html`]
    }
    else {
      node = nodes[route.item]
      externalIds = route.externals || []
    }

    if(!node) return {
      node: {},
      route,
      html: '',
    }

    const externals = externalIds.map(id => externalMap[id])
    const annotation = annotations[node.id] || {}

    const {
      html,
      cssImports,
    } = documentUtils.extractImports(externals[0])

    let layoutInfo = {
      type: 'default',
      websiteLayoutId: websiteMeta.layout,
      annotationLayoutId: annotation.layout_id,
      selectedLayoutId: null,
    }

    let layoutData = DEFAULT_LAYOUT

    const documentTemplateLayout = annotation.layout_id && templateLayouts[annotation.layout_id] ?
      templateLayouts[annotation.layout_id].layout :
      null

    const websiteTemplateLayout = websiteMeta.layout && templateLayouts[websiteMeta.layout] ?
      templateLayouts[websiteMeta.layout].layout :
      null

    // this page has an overriden layout
    if(annotation.layout && annotation.layout.filter(row => row).length > 0) {
      layoutData = annotation.layout
      layoutInfo.type = 'custom'
    }
    else if(documentTemplateLayout) {
      layoutData = documentTemplateLayout
      layoutInfo.type = 'document'
      layoutInfo.selectedLayoutId = layoutInfo.annotationLayoutId
    }
    // otherwise pick the layout from the settings
    else if(websiteTemplateLayout) {
      layoutData = websiteTemplateLayout
      layoutInfo.type = 'website'
      layoutInfo.selectedLayoutId = layoutInfo.websiteLayoutId
    }

    if(!layoutData) {
      layoutData = DEFAULT_LAYOUT
      layoutInfo.type = 'default'
      layoutInfo.selectedLayoutId = null
    }

    const layout = layoutData
      .map(row => {
        return row.map(cell => {
          const data = Object.assign({}, {
            settings: DEFAULT_CELL_SETTINGS,
          }, cell.data)
          const processedCell = Object.assign({}, cell)
          if(!processedCell.id) processedCell.id = uuid()
          processedCell.data = data
          return processedCell
        })
      })

    return {
      node: Object.assign({}, node, {route}),
      route,
      annotation,
      layout,
      layoutInfo,
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
  nocodeSelectors.route,
  nocodeSelectors.nodes,
  nocodeSelectors.routePathMap,
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
  nocodeSelectors.route,
  nocodeSelectors.nodes,
  nocodeSelectors.routePathMap,
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
  nocodeSelectors.route,
  nocodeSelectors.nodes,
  nocodeSelectors.annotations,
  nocodeSelectors.routeMap,
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

const breadcrumbs = createSelector(
  nocodeSelectors.route,
  routeAncestors,
  (route, ancestors) => {

    // remove the home link and current page
    const useItems = ancestors
      .filter(item => item.route.location == 'singleton:home' ? false : true)
      .filter(item => item.route.path != '/')
      .filter(item => item.route.name != route.name)
      .filter(item => item.node)

    if(useItems.length <= 0) return []

    return [{
      title: 'Home',
      path: '/',
      name: 'root',
      isLink: true,
    }].concat(
      useItems.map(item => ({
        title: item.node.name.replace(/^\w/, st => st.toUpperCase()),
        path: item.route.path,
        name: item.route.name,
        isLink: true,
      }))
    )
  },
)

const selectors = {
  sectionTree,
  sectionHiddenItems,
  section,
  itemRoute,
  itemChildren,
  document,
  routeAncestors,
  fullRouteAncestors,
  routeBaseLocation,
  routeChildren,
  breadcrumbs,
}

export default selectors
