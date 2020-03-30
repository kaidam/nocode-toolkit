import { createSelector } from 'reselect'

import library from '../../library'
import childrenUtils from '../../utils/children'
import nocodeSelectors from './nocode'
import routerSelectors from './router'
import systemSelectors from './system'

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
          const route = routeMap[`${location}:${id}`]
          const node = nodes[id]
          return Object.assign({}, node, {
            route,
            currentPage: currentRoute.item == node.id,
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
    const ghostId = (section.children || []).find(childId => {
      const childLocation = locations[`section:${name}:${childId}`]
      return childLocation && childLocation.data.ghost ? true : false
    })
    const ghostFolder = ghostId ?
      nodes[ghostId] :
      null
    const defaultFolderId = website && website.meta ?
      website.meta[`nocode_default_resource_id_${name}`] :
      null
    return {
      node: section,
      annotation,
      ghostFolder,
      defaultFolderId,
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
  sectionHiddenItems,
  section,
  itemRoute,
  itemChildren,
  form,
  formValues,
  formSchema,
}

export default selectors
