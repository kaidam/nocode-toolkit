import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'
import contentSelectors from '../../store/selectors/content'
import routerSelectors from '../../store/selectors/router'

const useSectionTree = ({
  section,
}) => {

  const dispatch = useDispatch()

  const [ openFolders, setOpenFolders ] = useState({})

  const onToggleFolder = useCallback((id) => {
    setOpenFolders(Object.assign({}, openFolders, {
      [id]: openFolders[id] ? false : true,
    }))
  }, [
    openFolders,
  ])

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const routeMap = useSelector(routerSelectors.routeMap)
  const ancestors = useSelector(routerSelectors.ancestorsWithRoute)
  const currentRoute = useSelector(routerSelectors.route)
  const scrollToCurrentPage = useSelector(uiSelectors.scrollToCurrentPage)

  // this is used when a tree item is actually clicked
  // because they clicked it - we assume that they can see
  // that tree item and don't want to scroll to it
  // wait for a render and then re-enable it
  const onDisableScrollToCurrentPage = useCallback(() => {
    dispatch(uiActions.setScrollToCurrentPage(false))
    setTimeout(() => {
      dispatch(uiActions.setScrollToCurrentPage(true))
    }, 10)
  }, [])

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
      const open = openFolders[node.id]

      items.push({
        id: node.id,
        node,
        depth,
        open,
        route,
        currentPage: currentRoute.item == node.id,
      })

      // if the folder is open, include it's children
      // adding one to the depth so we can render nested items
      if(open) {
        node.children.forEach(child => {
          addItem({
            node: child,
            location: `node:${node.id}`,
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
    scrollToCurrentPage,
    onToggleFolder,
    onDisableScrollToCurrentPage,
  }
}

export default useSectionTree