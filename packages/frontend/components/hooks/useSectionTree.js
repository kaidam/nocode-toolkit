import { useMemo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import contentSelectors from '../../store/selectors/content'
import routerSelectors from '../../store/selectors/router'

const useSectionTree = ({
  section,
}) => {

  const [ openFolders, setOpenFolders ] = useState({})

  const onToggleFolder = (id) => {
    setOpenFolders(Object.assign(openFolders, {
      [id]: openFolders[id] ? false : true,
    }))
  }

  const onOpenFolders = (ids) => {
    if(!ids || ids.length <= 0) return
    setOpenFolders(ids.reduce((all, id) => {
      all[id] = true
      return all
    }), Object.assign({}, openFolders))
  }

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const routeMap = useSelector(routerSelectors.routeMap)
  const ancestors = useSelector(routerSelectors.ancestors)
  const currentRoute = useSelector(routerSelectors.route)

  console.dir(routeMap)
  const list = useMemo(() => {
    const items = []
    const addItem = ({
      node,
      location,
      depth = 0,
    }) => {
      const route = routeMap[`${location}:${node.id}`]
      items.push({
        node,
        depth,
        route,
        currentPage: currentRoute.item == node.id,
      })
      if(openFolders[node.id]) {
        node.children.forEach(child => {
          addItem({
            node: child,
            location: `item:${node.id}`,
            depth: depth + 1,
          })
        })
      }
    }
    tree.forEach(node => addItem({
      node,
      location: `section:${section}`,
    }))
    return items
  }, [
    tree,
    openFolders,
    routeMap,
  ])

  // when the route changes - open the ancestor folders
  useEffect(() => {
    onOpenFolders(ancestors)
  }, [
    ancestors,
  ])

  return {
    tree,
    list,
    onToggleFolder,
  }
}

export default useSectionTree