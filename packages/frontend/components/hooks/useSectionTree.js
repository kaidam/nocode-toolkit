import { useMemo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import contentSelectors from '../../store/selectors/content'
import routerSelectors from '../../store/selectors/router'

const useSectionTree = ({
  section,
}) => {

  const [ openFolders, setOpenFolders ] = useState({})

  const onToggleFolder = (id) => {
    setOpenFolders(Object.assign({}, openFolders, {
      [id]: openFolders[id] ? false : true,
    }))
  }

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const routeMap = useSelector(routerSelectors.routeMap)
  const ancestors = useSelector(routerSelectors.ancestorsWithRoute)
  const currentRoute = useSelector(routerSelectors.route)

  const list = useMemo(() => {
    const items = []
    const addItem = ({
      node,
      location,
      depth = 0,
    }) => {

      // get the route and configure the tree item
      // as to what happens when the item is clicked
      // the tree options are:
      //   * open an internal route (if it's a page or folderPages == true)
      //   * open an external route (if it's a link)
      //   * toggle the folder (if foldersPages == false)
      const route = routeMap[`${location}:${node.id}`]

      items.push({
        node,
        depth,
        route,
        currentPage: currentRoute.item == node.id,
      })

      // if the folder is open, include it's children
      // adding one to the depth so we can render nested items
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

    // add the top level section items to the tree
    tree.forEach(node => addItem({
      node,
      location: `section:${section}`,
    }))
    return items
  }, [
    tree,
    openFolders,
    routeMap,
    currentRoute,
  ])

  // when the route changes - open the ancestor folders
  useEffect(() => {
    setOpenFolders(ancestors.reduce((all, id) => {
      all[id] = true
      return all
    }, {}))
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